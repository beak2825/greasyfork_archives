// ==UserScript==
// @name         runnan
// @namespace    http://tampermonkey.net/
// @version      1.0.21
// @description  personal sbc 
// @license      MIT
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.easports.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.ea.com/*/ea-sports-fc/ultimate-team/web-app/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544768/runnan.user.js
// @updateURL https://update.greasyfork.org/scripts/544768/runnan.meta.js
// ==/UserScript==

/*
 * 脚本使用免责声明（Script Usage Disclaimer）
 *
 * 本脚本仅供个人学习和研究使用，不得用于任何商业或非法用途。
 * 作者对因使用本脚本造成的任何直接或间接损失、损害或法律责任不承担任何责任。
 * 使用者须自行评估风险并对其行为负责。请务必遵守目标网站的用户协议和相关法律法规。
 *
 * This script is provided “as is,” without warranty of any kind, express or implied.
 * The author shall not be liable for any damages arising out of the use of this script.
 * Use at your own risk and in compliance with the target site’s terms of service and applicable laws.
 */
(function () {
    'use strict';
    let page = unsafeWindow;
    const DEFAULT_TIMEOUT = 15000;
    let running = false;
    let minRating = 85;
    let btn;
    let btn3;
    let btn4;
    let abortCtrl = null;
    let continuousPackRunning = false;
    let storageCounter89 = 0; // Global counter for 89+ rated cards sent to storage
    let massPackRunning = false;
    let massPackRounds = 10; // Number of rounds to execute
    let totwRunsPerRound = 2; // Number of TOTW SBC runs per round
    let slowMode = false; // Slow mode flag - doubles all wait times
    let skip89SBC = false; // Skip 89 SBC and store 89+ cards instead
    let customStorageRating = 89; // Custom rating threshold for storage when skip89 is enabled
    let skip89Interval = 0; // Execute 89 SBC every X rounds when skip89SBC is enabled (0 = never)
    let skip89RoundCounter = 0; // Counter for tracking rounds in skip89 mode
    function makeAbortable(fn) {
        return function (...args) {
            const p = fn.apply(this, args);
            if (!abortCtrl) return p;
            const abortP = new Promise((_, rej) => {
                abortCtrl.signal.addEventListener('abort', () => rej(new Error('Aborted')), { once: true });
            });
            return Promise.race([p, abortP]);
        };
    }
    const _sleep = ms => {
        const adjustedMs = slowMode ? ms * 2 : ms;
        return new Promise(res => setTimeout(res, adjustedMs));
    };
    function simulateClick(el) {
        if (!el) {
            return new Error('no element');
        };
        const r = el.getBoundingClientRect();
        ['mousedown', 'mouseup', 'click'].forEach(t =>
            el.dispatchEvent(new MouseEvent(t, {
                bubbles: true, cancelable: true,
                clientX: r.left + r.width / 2,
                clientY: r.top + r.height / 2,
                button: 0
            }))
        );
    }
    function _waitForElement(fnOrSelector, timeout = DEFAULT_TIMEOUT) {
        const adjustedTimeout = slowMode ? timeout * 2 : timeout;
        return new Promise(resolve => {
            const start = Date.now();
            (function poll() {
                let el = typeof fnOrSelector === 'string'
                    ? document.querySelector(fnOrSelector)
                    : fnOrSelector();
                if (el) return resolve(el);
                if (Date.now() - start > adjustedTimeout) return resolve(false);
                setTimeout(poll, 200);
            })();
        });
    }

    page._xhrQueue = [];
    (function () {
        if (page._xhrHooked) return;
        page._xhrHooked = true;
        page._xhrPromiseList = [];

        const originOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (_method, url, ...args) {
            this._xhrFlag = { method: _method.toUpperCase(), url: String(url) };
            return originOpen.apply(this, [_method, url, ...args]);
        };

        const originSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (body) {
            this.addEventListener('load', () => {
                for (const item of page._xhrPromiseList) {
                    if (
                        this._xhrFlag &&
                        this._xhrFlag.url.includes(item.apiPath) &&
                        (!item.method || this._xhrFlag.method === item.method.toUpperCase())
                    ) {
                        try {
                            item.resolve(JSON.parse(this.responseText));
                        } catch {
                            item.resolve(null);
                        }
                        clearTimeout(item._timer);
                    }
                }
                page._xhrPromiseList = page._xhrPromiseList.filter(
                    item => !(this._xhrFlag && this._xhrFlag.url.includes(item.apiPath)
                        && (!item.method || this._xhrFlag.method === item.method.toUpperCase()))
                );
            });
            return originSend.apply(this, arguments);
        };
    })();
    function overrideEventsPopup() {
        if (!page.events || typeof page.events.popup !== 'function') return;
        const interceptMap = {
            '珍贵球员': 44408,
            '快速任务': 2,
        };
        const _orig = page.events.popup;

        page.events.popup = function (
            title, message, callback, buttonOptions,
            inputPlaceholder, inputValue, inputEnabled, extraNode
        ) {
            if (typeof title === 'string') {
                for (let key in interceptMap) {
                    if (title.includes(key)) {
                        const code = interceptMap[key];
                        return callback(code);
                    }
                }
            }
            return _orig.call(this,
                title, message, callback, buttonOptions,
                inputPlaceholder, inputValue, inputEnabled, extraNode
            );
        };

    }
    function hookLoading() {
        if (!EAClickShieldView.__hookedForLoadingEnd) {
            const oldHideShield = EAClickShieldView.prototype.hideShield;
            EAClickShieldView.prototype.hideShield = function (e) {
                oldHideShield.apply(this, arguments);
                if (!this.isShowing()) {
                    if (Array.isArray(EAClickShieldView._onLoadingEndQueue)) {
                        for (const fn of EAClickShieldView._onLoadingEndQueue) {
                            try { fn(); } catch (e) { }
                        }
                        EAClickShieldView._onLoadingEndQueue = [];
                    }
                }
            };
            EAClickShieldView._onLoadingEndQueue = [];
            EAClickShieldView.__hookedForLoadingEnd = true;
        }
    }

    function _waitForRequest(apiPath, method, timeout = 15000) {
        const adjustedTimeout = slowMode ? timeout * 2 : timeout;
        return new Promise((resolve) => {
            const item = { apiPath, method, resolve };
            item._timer = setTimeout(() => {
                resolve(null);
                page._xhrPromiseList = page._xhrPromiseList.filter(x => x !== item);
            }, adjustedTimeout);
            page._xhrPromiseList.push(item);
        });
    }

    function _waitEALoadingEnd() {
        return new Promise(res => {
            const shield = typeof gClickShield === 'object' ? gClickShield : null;
            if (shield && !shield.isShowing()) return res();
            EAClickShieldView._onLoadingEndQueue.push(res);
        });
    }

    function _waitForController(name, timeout = DEFAULT_TIMEOUT) {
        const adjustedTimeout = slowMode ? timeout * 2 : timeout;
        const pollInterval = slowMode ? 1600 : 800;
        return new Promise((resolve, reject) => {
            const start = Date.now();
            (function poll() {
                try {
                    const ctrl = getAppMain()
                        .getRootViewController()
                        .getPresentedViewController()
                        .getCurrentViewController()
                        .getCurrentController();
                    if (ctrl.constructor.name === name) return resolve(ctrl);
                } catch { }
                if (Date.now() - start > adjustedTimeout) return reject(new Error(`等待${name}超时`));
                setTimeout(poll, pollInterval);
            })();
        });
    }

    function _clickFsuRefreshIfExist(text) {
        return new Promise(async resolve => {
            const btn = document.querySelector('.ut-image-button-control.filter-btn.fsu-refresh');
            if (!btn) return resolve(0);
            const adjustedTimeout = slowMode ? 20000 : 10000;
            const req = waitForRequest('/purchased/items', 'GET', adjustedTimeout);
            simulateClick(btn);
            await waitEALoadingEnd();
            const res = await req;
            const len = res?.itemData?.length || 0;
            console.log(`[刷新] ${text} 刷新得到 ${len}`);
            resolve(len);
        });
    }
    function _findEllipsisBtnOfUntradeableDupSection() {
        // Try multiple selectors to find the ellipsis button
        // First try the specific selector for storage duplicates section
        let btn = document.querySelector('section.sectioned-item-list.storage-duplicates header button.ut-image-button-control.ellipsis-btn');
        if (btn) return btn;
        
        // Fallback to the original selector
        btn = document
            .querySelector('.sectioned-item-list:last-of-type header.ut-section-header-view.relist-section')
            ?.querySelector('.ut-image-button-control.ellipsis-btn');
        if (btn) return btn;
        
        // Try a more general selector
        const sections = document.querySelectorAll('.sectioned-item-list');
        for (let section of sections) {
            if (section.classList.contains('storage-duplicates') || 
                section.querySelector('.ut-section-header-view.relist-section')) {
                const ellipsisBtn = section.querySelector('.ut-image-button-control.ellipsis-btn');
                if (ellipsisBtn) return ellipsisBtn;
            }
        }
        
        return null;
    }
    function _waitAndClickQuickSellUntradeableBtn(timeout = 8000) {
        return new Promise(async resolve => {
            const adjustedTimeout = slowMode ? timeout * 2 : timeout;
            const modal = await waitForElement('.view-modal-container.form-modal .ut-bulk-action-popup-view', adjustedTimeout).catch(() => null);
            if (!modal) return resolve();
            const btn = [...modal.querySelectorAll('button')].find(b => b.textContent.includes('快速出售'));
            if (btn) {
                console.log('[QuickSell] 点击快速出售按钮');
                simulateClick(btn);
                await sleep(500);
                
                // Wait for and click confirmation button
                const confirmBtn = await waitForElement(() => {
                    const buttons = document.querySelectorAll('button');
                    return Array.from(buttons).find(b => 
                        b.textContent.includes('确定') || 
                        b.textContent.includes('OK') ||
                        b.textContent.includes('Confirm')
                    );
                }, 3000);
                
                if (confirmBtn) {
                    console.log('[QuickSell] 确认快速出售');
                    simulateClick(confirmBtn);
                    await sleep(1000);
                }
            }
            await waitEALoadingEnd();
            resolve();
        });
    }
    const DEFAULT_WAIT_TIMEOUT = 10000;
    function _waitForLoadingStart(timeout = DEFAULT_WAIT_TIMEOUT) {
        const adjustedTimeout = slowMode ? timeout * 2 : timeout;
        return waitForElement(
            '.ut-click-shield.showing.fsu-loading',
            adjustedTimeout
        );
    }

    function _waitForLoadingEnd(timeout = DEFAULT_WAIT_TIMEOUT) {
        const adjustedTimeout = slowMode ? timeout * 2 : timeout;
        const checkInterval = slowMode ? 160 : 80;
        return new Promise((resolve, reject) => {
            const start = Date.now();
            function check() {
                const el = document.querySelector('.ut-click-shield.showing.fsu-loading');
                if (!el) {
                    return resolve();
                }
                if (Date.now() - start > adjustedTimeout) {
                    return reject(new Error('等待 loading 隐藏超时'));
                }
                setTimeout(check, checkInterval);
            }
            check();
        });
    }
    async function _waitFSULoading(timeout = DEFAULT_WAIT_TIMEOUT) {
        const adjustedTimeout = slowMode ? timeout * 2 : timeout;
        const startTimeout = slowMode ? 4000 : 2000;
        try {
            await waitForLoadingStart(startTimeout);
        } catch (e) {
            return;
        }
        await waitForLoadingEnd(adjustedTimeout);
    }

    async function _clickIfExists(selector, timeout = 2000, clickDelay = 500) {
        const adjustedTimeout = slowMode ? timeout * 2 : timeout;
        const adjustedDelay = slowMode ? clickDelay * 2 : clickDelay;
        const el = await waitForElement(selector, adjustedTimeout);
        if (!el) {
            throw new Error(`clickIfExists: 元素 "${selector}" ${adjustedTimeout}ms 内未找到`);
        }
        if (adjustedDelay > 0) {
            await sleep(adjustedDelay);
        }
        simulateClick(el);
        return true;
    }
    function _waitForElementGone(selector, timeout = DEFAULT_TIMEOUT) {
        const adjustedTimeout = slowMode ? timeout * 2 : timeout;
        return new Promise(resolve => {
            const start = Date.now();
            (function check() {
                const el = document.querySelector(selector);
                if (!el) return resolve(true);
                if (Date.now() - start > adjustedTimeout) return resolve(false);
                setTimeout(check, 200);
            })();
        });
    }
    async function _execute89SBC() {
        console.log('[execute89SBC] 开始执行89评分SBC');
        try {
            // Click the 89 SBC button (data-sbcid="1068")
            const sbcBtn = await waitForElement('button[data-sbcid="1068"]', 5000);
            if (!sbcBtn) {
                console.log('[execute89SBC] 未找到89评分SBC按钮');
                return false;
            }
            
            simulateClick(sbcBtn);
            await waitForController('UTSBCSquadSplitViewController', 10000);
            await waitEALoadingEnd();
            
            // Click "一键填充(优先重复)" button
            const fillBtn = await waitForElement(() => 
                Array.from(document.querySelectorAll('button.btn-standard.mini.call-to-action'))
                    .find(b => b.textContent.includes('一键填充(优先重复)')),
                5000
            );
            
            if (fillBtn) {
                console.log('[execute89SBC] 点击一键填充按钮');
                simulateClick(fillBtn);
                await waitFSULoading(10000);
                await sleep(1000);
            }
            
            // Submit SBC
            const req = waitForRequest('?skipUserSquadValidation=', 'PUT');
            await clickIfExists('button.ut-squad-tab-button-control.actionTab.right.call-to-action:not(.disabled)', 5000, 500);
            const data = await req;
            
            if (!data?.grantedSetAwards?.length) {
                console.log('[execute89SBC] SBC提交失败');
                return false;
            }
            
            await waitEALoadingEnd();
            
            // Claim rewards
            const claimBtn = await waitForElement(() => {
                const buttons = document.querySelectorAll('button');
                return Array.from(buttons).find(b => 
                    b.textContent.includes('领取奖励') || 
                    b.textContent.includes('Claim')
                );
            }, 3000);
            
            if (claimBtn) {
                console.log('[execute89SBC] 点击领取奖励');
                simulateClick(claimBtn);
                await sleep(1000);
            }
            
            // Decrement storage counter (89+ cards used for this SBC)
            storageCounter89 -= 4;
            console.log(`[execute89SBC] 89+存储计数器: ${storageCounter89}`);
            
            return true;
        } catch (error) {
            console.error('[execute89SBC] 错误:', error);
            return false;
        }
    }
    
    async function _execute10x84SBC() {
        console.log('[execute10x84SBC] 开始执行10x84 SBC');
        try {
            // Click the 10x84 SBC button (data-sbcid="1185")
            const sbcBtn = await waitForElement('button[data-sbcid="1203"]', 5000);
            if (!sbcBtn) {
                console.log('[execute10x84SBC] 未找到10x84 SBC按钮');
                return false;
            }
            
            simulateClick(sbcBtn);
            
            // Try to wait for SBC view
            try {
                await waitForController('UTSBCSquadSplitViewController', 10000);
            } catch (err) {
                console.log('[execute10x84SBC] 无法进入SBC视图，可能SBC不可用或已完成');
                return false;
            }
            await waitEALoadingEnd();
            
            // Click duplicate fill button
            const dupBtn = await waitForElement(() =>
                Array.from(document.querySelectorAll('button.btn-standard.mini.call-to-action'))
                    .find(b => b.textContent.trim() === '重复球员填充阵容'),
                5000
            );
            if (dupBtn) {
                console.log('[execute10x84SBC] 点击重复球员填充阵容');
                simulateClick(dupBtn);
                await waitFSULoading(10000);
                await sleep(1000);
            }
            
            // Find and click empty slot
            const emptySlot = await waitForElement('.ut-squad-slot-view .player.item.empty', 3000);
            if (emptySlot) {
                console.log('[execute10x84SBC] 点击空位');
                const slotView = emptySlot.closest('.ut-squad-slot-view');
                if (slotView) {
                    simulateClick(slotView);
                    await sleep(800);
                    
                    // Look for eligibility search button
                    const eligibilityBtn = await waitForElement(() => {
                        const buttons = document.querySelectorAll('button[data-r="eligibilitysearch"]');
                        if (buttons.length > 0) return buttons[0];
                        
                        return Array.from(document.querySelectorAll('button')).find(b => {
                            const text = b.textContent;
                            return text && (
                                text.includes('添加 任意') || 
                                text.includes('Add Any')
                            );
                        });
                    }, 5000);
                    
                    if (eligibilityBtn) {
                        console.log('[execute10x84SBC] 执行资格搜索');
                        simulateClick(eligibilityBtn);
                        await sleep(800);
                        
                        // Wait for player list to load
                        await waitForElement('.ut-pinned-list', 3000);
                        await sleep(300);
                        
                        // Click the "范围" (Range) filter button to show all players
                        const rangeBtn = await waitForElement(() => {
                            const containers = document.querySelectorAll('.pagingContainer');
                            for (let container of containers) {
                                const divs = container.querySelectorAll('div');
                                for (let div of divs) {
                                    // Find the div with "范围" text
                                    if (div.textContent === '范围') {
                                        // Find the button that's a sibling of this div
                                        const btn = div.parentElement.querySelector('button.btn-standard.call-to-action.listfilter-btn');
                                        if (btn) return btn;
                                    }
                                }
                            }
                            return null;
                        }, 3000);
                        
                        if (rangeBtn) {
                            console.log('[execute10x84SBC] 点击范围按钮，当前状态: ' + rangeBtn.textContent);
                            simulateClick(rangeBtn);
                            await sleep(500);
                        }
                        
                        // Try to add the first player
                        let firstAddBtn = await waitForElement('.ut-image-button-control.btnAction.add', 2000);
                        
                        // If no player found and range button exists, click it again (will change to "仅仓库")
                        if (!firstAddBtn && rangeBtn) {
                            console.log('[execute10x84SBC] 没有找到可添加的球员，切换到仅仓库模式');
                            simulateClick(rangeBtn);
                            await sleep(500);
                            
                            // Try again to find the first player
                            firstAddBtn = await waitForElement('.ut-image-button-control.btnAction.add', 2000);
                        }
                        
                        if (firstAddBtn) {
                            console.log('[execute10x84SBC] 添加第一个球员');
                            simulateClick(firstAddBtn);
                            await sleep(500);
                        }
                        
                        // Click canvas once to fill remaining slots
                        const canvasSel = '.ut-squad-pitch-view--canvas';
                        await clickIfExists(canvasSel, 5000, 500);
                    }
                }
            }
            
            // Click squad completion and confirm
            await clickIfExists(() =>
                Array.from(document.querySelectorAll('button.btn-standard.mini.call-to-action'))
                    .find(b => b.textContent.includes('阵容补全')),
                5000, 500);

            await clickIfExists(() =>
                Array.from(document.querySelectorAll('button'))
                    .find(b => b.textContent.trim() === '确定'),
                5000, 500);
            await waitFSULoading();
            
            // Submit SBC
            const req = waitForRequest('?skipUserSquadValidation=', 'PUT');
            await clickIfExists('button.ut-squad-tab-button-control.actionTab.right.call-to-action:not(.disabled)', 5000, 500);
            const data = await req;
            
            if (!data?.grantedSetAwards?.length) {
                console.log('[execute10x84SBC] SBC提交失败');
                return false;
            }
            
            await waitEALoadingEnd();
            
            // Claim rewards
            const claimBtn = await waitForElement(() => {
                const buttons = document.querySelectorAll('button');
                return Array.from(buttons).find(b => 
                    b.textContent.includes('领取奖励') || 
                    b.textContent.includes('Claim')
                );
            }, 3000);
            
            if (claimBtn) {
                console.log('[execute10x84SBC] 点击领取奖励');
                simulateClick(claimBtn);
                await sleep(1000);
            }
            
            return true;
        } catch (error) {
            console.error('[execute10x84SBC] 错误:', error);
            return false;
        }
    }
    
    async function _handleUnassignedSimple(minRating = 89) {
        // Simplified version without quick sell
        let controller = await getUnassignedController();
        let times = 0;
        let items = [];
        while (items.length === 0 && times < 3) {
            items = repositories.Item.getUnassignedItems();
            times++;
            await sleep(1500)
        }
        if(items.length === 0) {
            await navigateBackToPackView();
            return;
        }
        
        // Use custom rating when skip89SBC is enabled
        const storageRating = skip89SBC ? customStorageRating : minRating;
        
        const tradablePlayers = items.filter(p => p.type === 'player' && p.loans === -1 && !p.untradeable);
        const toStorage = items.filter(p => p.type === 'player' && p.loans === -1 && p.untradeable && p.isDuplicate() && p.rating >= storageRating);
        const clubPlayers = items.filter(p => p.type === 'player' && p.loans === -1 && p.untradeable && !p.isDuplicate());
        
        // Count cards by rating for storage
        const storageCount = toStorage.filter(p => p.rating >= storageRating).length;
        
        console.log('[handleUnassignedSimple] tradablePlayers', tradablePlayers.length, 'clubPlayers', clubPlayers.length, 
                    'toStorage', toStorage.length, `(${storageRating}+:`, storageCount, ')');
        
        // Update global storage counter
        if (toStorage.length > 0) {
            storageCounter89 += toStorage.length;
            console.log(`[handleUnassignedSimple] 存储计数器: ${storageCounter89}`);
        }
        
        if (tradablePlayers.length) {
            await moveItems(tradablePlayers, ItemPile.TRANSFER, controller);
            await sleep(1000);
        }
        if (clubPlayers.length) {
            await moveItems(clubPlayers, ItemPile.CLUB, controller);
            await sleep(1000);
        }
        if (toStorage.length) {
            await moveItems(toStorage, ItemPile.STORAGE, controller);
            await sleep(2000);
        }
        
        // Navigate back to pack view after handling
        await navigateBackToPackView();
        return true;
    }
    
    async function _continuousPackOpen() {
        const minRating = skip89SBC ? customStorageRating : 89;
        console.log(`[continuousPackOpen] 开始连续开包 - 存储${minRating}+卡片`);
        let packCount = 0;
        
        try {
            while (true) {
                packCount++;
                console.log(`[continuousPackOpen] 开第 ${packCount} 个包`);
                
                // Open pack
                await waitForController('UTStorePackViewController', 20000);
                
                await clickIfExists(() => {
                    const btns = document.querySelectorAll('button.currency.call-to-action');
                    return Array.from(btns).reverse().find(b => {
                        const txt = b.querySelector('span.text')?.textContent.trim();
                        return txt === '打开' &&
                            b.closest('.ut-store-pack-details-view')?.style.display !== 'none';
                    });
                }, 5000, 500);
                
                const hasUnassigned = await checkAndHandleUnassignedDialog();
                if (hasUnassigned) {
                    await handleUnassigned();
                    // handleUnassigned already navigates back to pack view

                    // Open pack
                    await waitForController('UTStorePackViewController', 20000);
                    
                    await clickIfExists(() => {
                        const btns = document.querySelectorAll('button.currency.call-to-action');
                        return Array.from(btns).reverse().find(b => {
                            const txt = b.querySelector('span.text')?.textContent.trim();
                            return txt === '打开' &&
                                b.closest('.ut-store-pack-details-view')?.style.display !== 'none';
                        });
                    }, 5000, 500);
                }

                // Wait for unassigned items
                await waitForController('UTUnassignedItemsSplitViewController', 20000);
                await sleep(1000);
                
                // Handle unassigned with quick sell
                await handleUnassigned();
                // Now we should be back on pack view
                
                // Small delay before next pack
                await sleep(500);
            }
        } catch (error) {
            console.log(`[continuousPackOpen] 停止 - 共开了 ${packCount} 个包`);
            console.error('[continuousPackOpen] 错误:', error);
            stopContinuousPackOpen();
        }
    }
    
    
    async function _executeTOTWSBC() {
        console.log('[executeTOTWSBC] 开始执行TOTW SBC');
        try {
            // Click the TOTW SBC button (data-sbcid="918")
            const sbcBtn = await waitForElement('button[data-sbcid="918"]', 5000);
            if (!sbcBtn) {
                console.log('[executeTOTWSBC] 未找到TOTW SBC按钮');
                return false;
            }
            
            simulateClick(sbcBtn);
            
            // Try to wait for SBC view, but handle case where SBC might not be available
            try {
                await waitForController('UTSBCSquadSplitViewController', 5000);
            } catch (err) {
                console.log('[executeTOTWSBC] 无法进入SBC视图，可能SBC不可用或已完成');
                return false;
            }
            await waitEALoadingEnd();

            // Click 阵容补全
            const completeBtn = await waitForElement(() =>
                Array.from(document.querySelectorAll('button.btn-standard.mini.call-to-action'))
                    .find(b => b.textContent.includes('阵容补全')),
                5000
            );
            if (completeBtn) {
                console.log('[executeTOTWSBC] 点击阵容补全');
                simulateClick(completeBtn);
                await sleep(500);
            }
            
            // Click 确定
            await clickIfExists(() =>
                Array.from(document.querySelectorAll('button'))
                    .find(b => b.textContent.trim() === '确定'),
                5000, 500);
            await waitFSULoading();
            
            // Submit SBC
            const req = waitForRequest('?skipUserSquadValidation=', 'PUT');
            await clickIfExists('button.ut-squad-tab-button-control.actionTab.right.call-to-action:not(.disabled)', 5000, 500);
            const data = await req;
            
            if (!data?.grantedSetAwards?.length) {
                console.log('[executeTOTWSBC] SBC提交失败');
                return false;
            }
            
            await waitEALoadingEnd();
            
            // Claim rewards
            const claimBtn = await waitForElement(() => {
                const buttons = document.querySelectorAll('button');
                return Array.from(buttons).find(b => 
                    b.textContent.includes('领取奖励') || 
                    b.textContent.includes('Claim')
                );
            }, 3000);
            
            if (claimBtn) {
                console.log('[executeTOTWSBC] 点击领取奖励');
                simulateClick(claimBtn);
                await sleep(500);
            }
            
            return true;
        } catch (error) {
            console.error('[executeTOTWSBC] 错误:', error);
            return false;
        }
    }
    
    async function _massPackOpen() {
        const minStorageRating = skip89SBC ? customStorageRating : 89;
        console.log(`[massPackOpen] 开始批量开包流程 - 存储${minStorageRating}+卡片`);
        storageCounter89 = 0; // Reset counter
        skip89RoundCounter = 0; // Reset round counter at start
        skip89RoundCounter = 0; // Reset round counter at start
        let round = 0;
        
        try {
            // Continue indefinitely
            while (true) {
                round++;
                console.log(`[massPackOpen] 第 ${round} 轮，当前存储计数: ${storageCounter89}`);
                
                // Open pack
                await waitForController('UTStorePackViewController', 20000);
                
                await clickIfExists(() => {
                    const btns = document.querySelectorAll('button.currency.call-to-action');
                    return Array.from(btns).reverse().find(b => {
                        const txt = b.querySelector('span.text')?.textContent.trim();
                        return txt === '打开' &&
                            b.closest('.ut-store-pack-details-view')?.style.display !== 'none';
                    });
                }, 5000, 500);
                
                // Check for unassigned items dialog before opening pack
                const hasUnassigned = await checkAndHandleUnassignedDialog();
                if (hasUnassigned) {
                    await handleUnassigned();
                    // handleUnassigned already navigates back to pack view

                    // Open pack
                    await waitForController('UTStorePackViewController', 20000);
                    
                    await clickIfExists(() => {
                        const btns = document.querySelectorAll('button.currency.call-to-action');
                        return Array.from(btns).reverse().find(b => {
                            const txt = b.querySelector('span.text')?.textContent.trim();
                            return txt === '打开' &&
                                b.closest('.ut-store-pack-details-view')?.style.display !== 'none';
                        });
                    }, 5000, 500);
                }

                // Wait for unassigned items
                await waitForController('UTUnassignedItemsSplitViewController', 20000);
                await sleep(1000);
                
                // Handle unassigned with appropriate minimum rating
                await handleUnassigned();
                // Now we should be back on pack view
                
                // Handle 89 SBC execution based on skip89SBC mode
                if (!skip89SBC) {
                    // Normal mode - execute 89 SBC while we have enough cards
                    while (storageCounter89 >= 4) {
                        console.log(`[massPackOpen] 89+存储中有 ${storageCounter89} 张卡，执行89 SBC`);
                        const sbcSuccess = await execute89SBC();
                        
                        if (!sbcSuccess) {
                            await navigateBackToPackView();
                        }
                    }
                } else {
                    // Skip89 mode - check if we should execute periodically
                    if (skip89Interval > 0 && storageCounter89 >= 4) {
                        skip89RoundCounter++;
                        
                        if (skip89RoundCounter >= skip89Interval) {
                            console.log(`[massPackOpen] Skip89模式 - 第 ${skip89Interval} 轮，执行一次89 SBC`);
                            const sbcSuccess = await execute89SBC();
                            
                            if (!sbcSuccess) {
                                await navigateBackToPackView();
                            }
                            
                            skip89RoundCounter = 0; // Reset counter after execution
                        } else {
                            console.log(`[massPackOpen] 跳过89 SBC - ${minStorageRating}+卡片存储数: ${storageCounter89}, 轮次: ${skip89RoundCounter}/${skip89Interval}`);
                        }
                    } else if (storageCounter89 >= 4) {
                        console.log(`[massPackOpen] 跳过89 SBC - ${minStorageRating}+卡片存储数: ${storageCounter89}`);
                    }
                }
                
                // Execute TOTW SBC configurable times
                for (let totwRun = 1; totwRun <= totwRunsPerRound; totwRun++) {
                    await sleep(1000);
                    console.log(`[massPackOpen] 执行第 ${totwRun}/${totwRunsPerRound} 次 TOTW SBC`);
                    const totwSuccess = await executeTOTWSBC();
                    
                    if (!totwSuccess) {                        
                        await navigateBackToPackView();
                    }
                }
                
                // Small delay before next round
                await sleep(1000);
            }
            
            console.log(`[massPackOpen] 完成！共执行 ${round} 轮，最终存储计数器: ${storageCounter89}`);
        } catch (error) {
            console.error('[massPackOpen] 错误:', error);
            stopMassPackOpen();
        }
    }
    
    async function forceLoop() {
        const storageRating = skip89SBC ? customStorageRating : 89;
        console.log(`[forceLoop] start - 存储${storageRating}+卡片`);
        try {
            // Open pack
            await waitForController('UTStorePackViewController', 20000);
            
            await clickIfExists(() => {
                const btns = document.querySelectorAll('button.currency.call-to-action');
                return Array.from(btns).reverse().find(b => {
                    const txt = b.querySelector('span.text')?.textContent.trim();
                    return txt === '打开' &&
                        b.closest('.ut-store-pack-details-view')?.style.display !== 'none';
                });
            }, 5000, 500);
            
            const hasUnassigned = await checkAndHandleUnassignedDialog();
            if (hasUnassigned) {
                await handleUnassigned();
                // handleUnassigned already navigates back to pack view

                // Open pack
                await waitForController('UTStorePackViewController', 20000);
                
                await clickIfExists(() => {
                    const btns = document.querySelectorAll('button.currency.call-to-action');
                    return Array.from(btns).reverse().find(b => {
                        const txt = b.querySelector('span.text')?.textContent.trim();
                        return txt === '打开' &&
                            b.closest('.ut-store-pack-details-view')?.style.display !== 'none';
                    });
                }, 5000, 500);
            }

            // Wait for unassigned items
            await waitForController('UTUnassignedItemsSplitViewController', 20000);
            await sleep(1000);

            // Handle unassigned - move cards to storage based on chosen mode, no quick sell
            await handleUnassignedSimple();
            // Now we should be back on pack view

            // Handle 89 SBC execution based on skip89SBC mode
            if (!skip89SBC && storageCounter89 >= 4) {
                console.log(`[forceLoop] 89+存储中有 ${storageCounter89} 张卡，执行89 SBC`);
                const sbcSuccess = await execute89SBC();
                
                if (!sbcSuccess) {
                    await navigateBackToPackView();
                }
            } else if (skip89SBC && storageCounter89 >= 4) {
                // Skip89 mode - check if we should execute periodically
                if (skip89Interval > 0) {
                    skip89RoundCounter++;
                    
                    if (skip89RoundCounter >= skip89Interval) {
                        console.log(`[forceLoop] Skip89模式 - 第 ${skip89Interval} 轮，执行一次89 SBC`);
                        const sbcSuccess = await execute89SBC();
                        
                        if (!sbcSuccess) {
                            await navigateBackToPackView();
                        }
                        
                        skip89RoundCounter = 0; // Reset counter after execution
                    } else {
                        console.log(`[forceLoop] 跳过89 SBC - ${storageRating}+卡片存储数: ${storageCounter89}, 轮次: ${skip89RoundCounter}/${skip89Interval}`);
                    }
                } else {
                    console.log(`[forceLoop] 跳过89 SBC - ${storageRating}+卡片存储数: ${storageCounter89}`);
                }
            }

            // Execute 10x84 SBC
            console.log('[forceLoop] 执行10x84 SBC');
            const sbc84Success = await execute10x84SBC();
            
            if (!sbc84Success) {
                await navigateBackToPackView();
            }
            
            // Check for and click "直接发送X个至俱乐部" button
            const sendToClubBtn = await waitForElement(() => {
                const buttons = document.querySelectorAll('button.btn-standard.call-to-action.mini');
                return Array.from(buttons).find(b => 
                    b.textContent.includes('直接发送') && b.textContent.includes('至俱乐部')
                );
            }, 3000);
            
            if (sendToClubBtn) {
                console.log(`[forceLoop] 找到按钮: ${sendToClubBtn.textContent}`);
                simulateClick(sendToClubBtn);
                await sleep(1000);
            }

            console.log('[forceLoop] done');
        } catch (error) {
            console.error('[forceLoop] error:', error);
            stopLoop();
        }
    }

    function _moveItems(items, pile, controller) {
        return new Promise(resolve => {
            if (!items || !items.length) return resolve({ success: true });
            services.Item.move(items, pile, true).observe(controller, (e, t) => {
                e.unobserve(controller);
                resolve(t);
            });
        });
    }

    function getUnassignedController() {
        const ctl = getAppMain()
            .getRootViewController()
            .getPresentedViewController()
            .getCurrentViewController()
            .getCurrentController();
        if (!ctl || !ctl.childViewControllers) return null;

        return Array.from(ctl.childViewControllers).find(c =>
            c.className &&
            c.className.includes('UTUnassigned') &&
            c.className.includes('Controller')
        );
    }

    async function _handleUnassigned() {
        let controller = await getUnassignedController();
        let times = 0;
        let items = [];
        while (items.length === 0 && times < 3) {
            items = repositories.Item.getUnassignedItems();
            times++;
            await sleep(1500)
        }
        if(items.length === 0) {
            // Go back to pack view if no items
            await navigateBackToPackView();
            return;
        }
        
        // Use custom rating when skip89SBC is enabled
        const storageMinRating = skip89SBC ? customStorageRating : 89;
        
        const tradablePlayers = items.filter(p => p.type === 'player' && p.loans === -1 && !p.untradeable);
        const toStorage = items.filter(p => p.type === 'player' && p.loans === -1 && p.untradeable && p.isDuplicate() && p.rating >= storageMinRating);
        const toQuickSell = items.filter(p => p.type === 'player' && p.loans === -1 && p.untradeable && p.isDuplicate() && p.rating < storageMinRating);
        const clubPlayers = items.filter(p => p.type === 'player' && p.loans === -1 && p.untradeable && !p.isDuplicate());
        
        console.log('[handleUnassigned] tradablePlayers', tradablePlayers.length, 'clubPlayers', clubPlayers.length, 
                    `toStorage (${storageMinRating}+):`, toStorage.length,
                    'toQuickSell', toQuickSell.length);
        
        // Update global storage counter
        if (toStorage.length > 0) {
            storageCounter89 += toStorage.length;
            console.log(`[handleUnassigned] 存储计数器: ${storageCounter89}`);
        }
        if (tradablePlayers.length) {
            await moveItems(tradablePlayers, ItemPile.TRANSFER, controller);
            await sleep(1000);
        }
        if (clubPlayers.length) {
            await moveItems(clubPlayers, ItemPile.CLUB, controller);
            await sleep(1000);
        }
        if (toStorage.length) {
            await moveItems(toStorage, ItemPile.STORAGE, controller);
            await sleep(2000); // Give more time for UI to update
        }

        // Refresh unassigned items to make sure UI is updated
        await controller.getUnassignedItems();
        await sleep(1000);

        // Try to click FSU refresh button to ensure duplicates are visible
        await clickFsuRefreshIfExist('第3次');
        await sleep(1000);
        
        // Now try to quick sell remaining untradeable duplicates
        const ellipsisBtn = await waitForElement(
            findEllipsisBtnOfUntradeableDupSection,
            5000
        );
        if (ellipsisBtn) {
            console.log('[handleUnassigned] 找到省略号按钮，准备快速出售');
            simulateClick(ellipsisBtn);
            await sleep(1000);
            await waitAndClickQuickSellUntradeableBtn();
            await waitEALoadingEnd();
            await sleep(1000);
        } else {
            console.log('[handleUnassigned] 未找到省略号按钮，可能没有需要快速出售的物品');
        }

        return true
    }
    
    async function _navigateBackToPackView() {
        try {
            // Click back button to return to pack view
            const backBtn = await waitForElement('.ut-navigation-button-control', 3000);
            if (backBtn) {
                console.log('[navigateBackToPackView] 点击返回按钮');
                simulateClick(backBtn);
                await sleep(1000);
            }
            // Wait for pack view
            await waitForController('UTStorePackViewController', 5000);
        } catch (err) {
            console.log('[navigateBackToPackView] 导航回包视图失败');
        }
    }
    
    async function _checkAndHandleUnassignedDialog() {
        // Check for unassigned items dialog
        const dialog = await waitForElement('section.ea-dialog-view.ea-dialog-view-type--message', 1000);
        
        if (dialog) {
            // Check if it's the unassigned items dialog
            const title = dialog.querySelector('.ea-dialog-view--title');
            if (title && title.textContent.includes('未分配的物品')) {
                console.log('[checkAndHandleUnassignedDialog] 发现未分配物品对话框');
                
                // Click "立即前往" button
                const goNowBtn = await waitForElement(() => {
                    const buttons = dialog.querySelectorAll('button');
                    return Array.from(buttons).find(b => 
                        b.textContent.includes('立即前往') || 
                        b.textContent.includes('Go Now')
                    );
                }, 2000);
                
                if (goNowBtn) {
                    console.log('[checkAndHandleUnassignedDialog] 点击立即前往按钮');
                    simulateClick(goNowBtn);
                    
                    // Wait for unassigned items view
                    await waitForController('UTUnassignedItemsSplitViewController', 10000);
                    await sleep(1000);
                    
                    return true;
                }
            }
        }
        
        return false;
    }




    const sleep = makeAbortable(_sleep);
    const waitForElement = makeAbortable(_waitForElement);
    const waitForRequest = makeAbortable(_waitForRequest);
    const waitEALoadingEnd = makeAbortable(_waitEALoadingEnd);
    const waitForController = makeAbortable(_waitForController);
    const clickFsuRefreshIfExist = makeAbortable(_clickFsuRefreshIfExist);
    const waitAndClickQuickSellUntradeableBtn = makeAbortable(_waitAndClickQuickSellUntradeableBtn);
    const waitForLoadingStart = makeAbortable(_waitForLoadingStart);
    const waitForLoadingEnd = makeAbortable(_waitForLoadingEnd);
    const waitFSULoading = makeAbortable(_waitFSULoading);
    const clickIfExists = makeAbortable(_clickIfExists);
    const waitForElementGone = makeAbortable(_waitForElementGone);
    const moveItems = makeAbortable(_moveItems);
    const findEllipsisBtnOfUntradeableDupSection = makeAbortable(_findEllipsisBtnOfUntradeableDupSection);
    const handleUnassigned = makeAbortable(_handleUnassigned);
    const execute89SBC = makeAbortable(_execute89SBC);
    const executeTOTWSBC = makeAbortable(_executeTOTWSBC);
    const massPackOpen = makeAbortable(_massPackOpen);
    const navigateBackToPackView = makeAbortable(_navigateBackToPackView);
    const execute10x84SBC = makeAbortable(_execute10x84SBC);
    const handleUnassignedSimple = makeAbortable(_handleUnassignedSimple);
    const continuousPackOpen = makeAbortable(_continuousPackOpen);
    const checkAndHandleUnassignedDialog = makeAbortable(_checkAndHandleUnassignedDialog);
    function startLoop() {
        if (running) return;

        // Prompt for number of rounds
        const v = prompt(`执行轮数（当前 ${massPackRounds}）`, massPackRounds);
        if (v === null) {
            return;
        }
        const num = Number(v);
        if (!Number.isFinite(num) || num < 1) {
            alert('请输入有效的数字（至少为1）！');
            return;
        }
        massPackRounds = num;

        // Check if skip89SBC is enabled and prompt for custom rating and interval
        if (skip89SBC) {
            const ratingInput = prompt(`请输入存储评分阈值（当前 ${customStorageRating}）`, customStorageRating);
            if (ratingInput !== null) {
                const rating = Number(ratingInput);
                if (Number.isFinite(rating) && rating >= 80 && rating <= 99) {
                    customStorageRating = rating;
                }
            }
            
            // Prompt for 89 SBC execution interval
            const intervalInput = prompt(`每隔多少轮执行一次89 SBC？（0=从不执行，当前: ${skip89Interval}）`, skip89Interval);
            if (intervalInput !== null) {
                const interval = Number(intervalInput);
                if (Number.isFinite(interval) && interval >= 0) {
                    skip89Interval = interval;
                    skip89RoundCounter = 0; // Reset counter when interval changes
                    console.log(`89 SBC执行间隔设置为: ${skip89Interval === 0 ? '从不' : `每${skip89Interval}轮`}`);
                }
            }
        }

        running = true;
        btn.textContent = '停止循环';
        abortCtrl = new AbortController();
        storageCounter89 = 0; // Reset counter
        skip89RoundCounter = 0; // Reset round counter

        (async () => {
            const signal = abortCtrl.signal;
            for (let round = 1; round <= massPackRounds && running && !signal.aborted; round++) {
                try {
                    const storageRating = skip89SBC ? customStorageRating : 89;
                    console.log(`[forceLoop] 第 ${round}/${massPackRounds} 轮，存储${storageRating}+卡片`);
                    await forceLoop();
                } catch (err) {
                    console.log('循环中断：', err.message);
                    break;
                }
                try {
                    const baseDelay = slowMode ? 1600 : 800;
                    const randomDelay = slowMode ? 2400 : 1200;
                    await sleep(baseDelay + Math.random() * randomDelay);
                } catch (err) {
                    console.log('Sleep 中断：', err.message);
                    break;
                }
            }
            running = false;
            abortCtrl = null;
            btn.textContent = '快速开包';
            console.log(`[forceLoop] 完成！共执行 ${massPackRounds} 轮，最终存储计数器: ${storageCounter89}`);
        })();
    }

    function stopLoop() {
        if (!running) return;
        running = false;
        btn.textContent = '快速开包';
        if (abortCtrl) abortCtrl.abort();
    }
    
    
    function startMassPackOpen() {
        if (massPackRunning) return;
        
        // Check if skip89SBC is enabled and prompt for custom rating and interval
        if (skip89SBC) {
            const ratingInput = prompt(`请输入存储评分阈值（当前 ${customStorageRating}）`, customStorageRating);
            if (ratingInput !== null) {
                const rating = Number(ratingInput);
                if (Number.isFinite(rating) && rating >= 80 && rating <= 99) {
                    customStorageRating = rating;
                }
            }
            
            // Prompt for 89 SBC execution interval
            const intervalInput = prompt(`每隔多少轮执行一次89 SBC？（0=从不执行，当前: ${skip89Interval}）`, skip89Interval);
            if (intervalInput !== null) {
                const interval = Number(intervalInput);
                if (Number.isFinite(interval) && interval >= 0) {
                    skip89Interval = interval;
                    skip89RoundCounter = 0; // Reset counter when interval changes
                    console.log(`89 SBC执行间隔设置为: ${skip89Interval === 0 ? '从不' : `每${skip89Interval}轮`}`);
                }
            }
        }
        
        // Prompt for TOTW runs per round
        const totwPrompt = prompt(`每轮TOTW SBC执行次数（当前 ${totwRunsPerRound}）`, totwRunsPerRound);
        if (totwPrompt === null) {
            return;
        }
        const totwNum = Number(totwPrompt);
        if (!Number.isFinite(totwNum) || totwNum < 1) {
            alert('请输入有效的数字（至少为1）！');
            return;
        }
        totwRunsPerRound = totwNum;
        
        massPackRunning = true;
        btn3.textContent = '停止批量开包';
        abortCtrl = new AbortController();
        
        (async () => {
            const signal = abortCtrl.signal;
            if (!signal.aborted) {
                try {
                    await massPackOpen();
                } catch (err) {
                    console.log('批量开包中断：', err.message);
                }
            }
            massPackRunning = false;
            abortCtrl = null;
            btn3.textContent = '开50包';
        })();
    }
    
    function stopMassPackOpen() {
        if (!massPackRunning) return;
        massPackRunning = false;
        btn3.textContent = '开50包';
        if (abortCtrl) abortCtrl.abort();
    }
    
    function startContinuousPackOpen() {
        if (continuousPackRunning) return;
        
        // Check if skip89SBC is enabled and prompt for custom rating and interval
        if (skip89SBC) {
            const ratingInput = prompt(`请输入存储评分阈值（当前 ${customStorageRating}）`, customStorageRating);
            if (ratingInput !== null) {
                const rating = Number(ratingInput);
                if (Number.isFinite(rating) && rating >= 80 && rating <= 99) {
                    customStorageRating = rating;
                }
            }
            
            // Prompt for 89 SBC execution interval
            const intervalInput = prompt(`每隔多少轮执行一次89 SBC？（0=从不执行，当前: ${skip89Interval}）`, skip89Interval);
            if (intervalInput !== null) {
                const interval = Number(intervalInput);
                if (Number.isFinite(interval) && interval >= 0) {
                    skip89Interval = interval;
                    skip89RoundCounter = 0; // Reset counter when interval changes
                    console.log(`89 SBC执行间隔设置为: ${skip89Interval === 0 ? '从不' : `每${skip89Interval}轮`}`);
                }
            }
        }
        
        continuousPackRunning = true;
        btn4.textContent = '停止连续开包';
        abortCtrl = new AbortController();
        
        (async () => {
            const signal = abortCtrl.signal;
            if (!signal.aborted) {
                try {
                    await continuousPackOpen();
                } catch (err) {
                    console.log('连续开包中断：', err.message);
                }
            }
            continuousPackRunning = false;
            abortCtrl = null;
            btn4.textContent = '连续开包';
        })();
    }
    
    function stopContinuousPackOpen() {
        if (!continuousPackRunning) return;
        continuousPackRunning = false;
        btn4.textContent = '连续开包';
        if (abortCtrl) abortCtrl.abort();
    }
    
    function initButton() {
        if (btn) return;
        btn = document.createElement('button'); 
        btn.textContent = '快速开包';
        Object.assign(btn.style, { 
            position: 'fixed', 
            bottom: '60px', 
            right: '40px', 
            padding: '10px', 
            background: '#ffd700', 
            borderRadius: '6px', 
            zIndex: 9999 
        });
        btn.addEventListener('click', () => running ? stopLoop() : startLoop()); 
        document.body.appendChild(btn);
        
        
        // Add second button for mass pack opening
        btn3 = document.createElement('button');
        btn3.textContent = '开50包';
        Object.assign(btn3.style, {
            position: 'fixed',
            bottom: '60px',
            right: '140px',
            padding: '10px',
            background: '#ff69b4',
            borderRadius: '6px',
            zIndex: 9999
        });
        btn3.addEventListener('click', () => massPackRunning ? stopMassPackOpen() : startMassPackOpen());
        document.body.appendChild(btn3);
        
        // Add third button for continuous pack opening
        btn4 = document.createElement('button');
        btn4.textContent = '连续开包';
        Object.assign(btn4.style, {
            position: 'fixed',
            bottom: '60px',
            right: '240px',
            padding: '10px',
            background: '#90ee90',
            borderRadius: '6px',
            zIndex: 9999
        });
        btn4.addEventListener('click', () => continuousPackRunning ? stopContinuousPackOpen() : startContinuousPackOpen());
        document.body.appendChild(btn4);
        
        // Add slow mode toggle button
        const btnSlowMode = document.createElement('button');
        btnSlowMode.textContent = '慢速模式: 关';
        Object.assign(btnSlowMode.style, {
            position: 'fixed',
            bottom: '110px',
            right: '40px',
            padding: '10px',
            background: slowMode ? '#ff6347' : '#87ceeb',
            borderRadius: '6px',
            zIndex: 9999
        });
        btnSlowMode.addEventListener('click', () => {
            slowMode = !slowMode;
            btnSlowMode.textContent = `慢速模式: ${slowMode ? '开' : '关'}`;
            btnSlowMode.style.background = slowMode ? '#ff6347' : '#87ceeb';
            console.log(`[SlowMode] 慢速模式已${slowMode ? '开启' : '关闭'} - 等待时间${slowMode ? '加倍' : '正常'}`);
        });
        document.body.appendChild(btnSlowMode);
        
        // Add skip 89 SBC toggle button
        const btnSkip89 = document.createElement('button');
        btnSkip89.textContent = '跳过89SBC: 关';
        Object.assign(btnSkip89.style, {
            position: 'fixed',
            bottom: '110px',
            right: '140px',
            padding: '10px',
            background: skip89SBC ? '#ff69b4' : '#98fb98',
            borderRadius: '6px',
            zIndex: 9999
        });
        btnSkip89.addEventListener('click', () => {
            skip89SBC = !skip89SBC;
            btnSkip89.textContent = `跳过89SBC: ${skip89SBC ? '开' : '关'}`;
            btnSkip89.style.background = skip89SBC ? '#ff69b4' : '#98fb98';
            console.log(`[Skip89SBC] 跳过89 SBC已${skip89SBC ? '开启' : '关闭'} - 89+卡片将${skip89SBC ? '存储到SBC仓库' : '用于89 SBC'}`);
        });
        document.body.appendChild(btnSkip89);
    }
    page.addEventListener('load', () => {
        initButton();
        overrideEventsPopup();
        hookLoading()
    });
})();
