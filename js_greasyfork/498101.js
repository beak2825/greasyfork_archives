// ==UserScript==
// @name         cartelempire全新自动脚本
// @namespace    http://tampermonkey.net/
// @version      7.5.3
// @description  【重大优化】重构调度核心，引入事件驱动逻辑，确保在长任务期间优先处理回满的能量，杜绝浪费。增加调度原因日志。+ Drug每次只补一次 + 节流与过量保护
// @author       111 (Optimized by Gemini + ChatGPT)
// @match        https://cartelempire.online/*
// @match        https://example.com/
// @exclude      https://cartelempire.online/Property
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498101/cartelempire%E5%85%A8%E6%96%B0%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/498101/cartelempire%E5%85%A8%E6%96%B0%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //================================================================================
    // 1. 配置中心 (Config Object)
    //================================================================================
    const Config = {
        urls: {
            base: 'https://cartelempire.online',
            jobs: 'https://cartelempire.online/Jobs',
            armory: 'https://cartelempire.online/Cartel/Armory',
            inventory: 'https://cartelempire.online/Inventory',
            rest: 'https://example.com/',
            university: 'https://cartelempire.online/university',
            gymTrain: 'https://cartelempire.online/gym/train/',
            useDrug: (id) => `https://cartelempire.online/Inventory/Use?id=${id}`,
            startExpedition: (e, t) => `https://cartelempire.online/Expedition/startExpedition?e=${e}&t=${t}`,
            refillEnergy: 'https://cartelempire.online/Supporter/Refill/Energy',
            spinWheel: 'https://cartelempire.online/Casino/spinWheel',
            buyPoints: 'https://cartelempire.online/Town/buyPoints/',
        },
        keys: {
            lock: 'autoScriptLock_v3_heartbeat',
            state: 'cartelEmpireState_v2',
            links: 'customLinks_v2',
            restTimestamps: 'restTimestamps_v2',
            expeditionEndTimes: 'expeditionEndTimes_v2',
            jobFinishTime: 'jobFinishTime_v2',
            lastDrugUseAt: 'lastDrugUseAt_v1', // 新增：Drug节流时间戳
        },
        selectors: {
            playerStatusIcons: '.playerstatusIcons',
            hospitalIcon: '.hospitalIcon',
            jailIcon: '.jailIcon',
            drugIcon: '.drugIcon',
            boosterIcon: '.boosterIcon.statusIcon',
            jobStatusIcon: '.jobStatusIcon.statusIcon',
            currentEnergy: '#currentEnergy',
            progressMessage: '#progressMessage',
            quickButtonTargetDesktop: '.row.justify-content-center.mb-1.text-center.gy-2',
            quickLinksTarget: '.col-12.bg-dark.text-white',
            inventoryHeader: '.header-section',
            inventoryItemWrapper: '.inventoryItemWrapper',
            inventoryItemNameParagraph: '.col.align-items-center.d-flex p',
        },
        humanizer: {
            actionDelay: { min: 3000, max: 15000 },
            afkChance: 0.02,
            afkDuration: { min: 5 * 60 * 1000, max: 25 * 60 * 1000 }
        },
        timeouts: {
            forceLockReset: 3600 * 1000,
            lockHeartbeat: 5 * 1000,
            lockStale: 15 * 1000,
            popoverWatch: 5 * 1000,
            popoverContentPoll: 1500,
            fastPoll: { min: 3000, max: 8000 },
            slowPoll: { min: 30000, max: 90000 },
            restThreshold: 30 * 60,
            confirmationCheck: 3000,
        },
        constants: {
            SECONDS_IN_24_HOURS: 86400,
            COOLDOWN_ITEM_REDUCTION_SECONDS: 7200,
            EXPEDITION_SLOTS: 3,
        },
        jobOptions: { "Intimidation": "intimidation", "Arson": "arson", "Grand Theft Auto": "gta", "Transport Drugs": "transportdrugs", "Farm Robbery": "farmrobbery", "Agave Storehouse Robbery": "agavestorage", "Coca Paste Robbery": "cocapaste", "Construction Robbery": "constructionrobbery", "Blackmail": "blackmail", "Hacking": "hacking" },
        dischargeItems: { "大型医疗包": { ariaLabel: "Use Large Medical Kit", timeReduction: 3600 }, "小型医疗包": { ariaLabel: "Use Small Medical Kit", timeReduction: 900 }, "绷带": { ariaLabel: "Use Bandage", timeReduction: 600 }, "Personal Favour": { ariaLabel: "Use Personal Favour", timeReduction: "all" } },
        productionPost: [ { id: "postStreetCrimes", url: 'https://cartelempire.online/Production/Assign/6', name: 'Street Crimes' }, { id: "postDoctorsOffice", url: 'https://cartelempire.online/Production/Assign/5', name: 'Doctors Office' }, { id: "postWeedField", url: 'https://cartelempire.online/Production/Assign/2', name: 'Weed Field' }, { id: "postAlcoholStill", url: 'https://cartelempire.online/Production/Assign/1', name: 'Alcohol Still' }, { id: "postCocaineFactory", url: 'https://cartelempire.online/Production/Assign/3', name: 'Cocaine Factory' } ],
    };

    const State = {
        isInitialized: false, data: {},
        defaults: {
            autoJob: true,
            jobType: 'intimidation',
            autoDischarge: false,
            hasArmoryAccess: false,
            autoExpedition: false,
            autoDrug: false,
            drugId: '',
            autoBooster: false,
            boosterItemId: '',
            autoStudy: false,
            autoGym: false,
            autoOffline: false,
            enableAfkSimulator: true,
            energyThreshold: 100,
            gymEnergy: { accuracy: 0, agility: 0, defence: 0, strength: 0 },
            // 新增：Drug安全参数（可在控制台通过 State.set 覆盖）
            drugMinGapMs: 3 * 60 * 1000,
            drugMinEnergyBeforeUse: 100,
        },
        load() { this.data = { ...this.defaults, ...GM_getValue(Config.keys.state, {}) }; this.isInitialized = true; console.log('[脚本状态] 加载完成:', this.data); },
        save() { if (!this.isInitialized) return; GM_setValue(Config.keys.state, this.data); },
        get(key) { return this.data[key]; },
        set(key, value) { this.data[key] = value; this.save(); }
    };

    const Utils = {
        getRandomDelay: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        request: (options) => new Promise((resolve, reject) => GM_xmlhttpRequest({ ...options, onload: resolve, onerror: reject, ontimeout: reject })),
        parseTimeStringToSeconds(timeString) { if (!timeString || typeof timeString !== 'string') return 0; const u = [1, 60, 3600, 86400]; const p = timeString.split(':').map(pt => parseInt(pt, 10)).reverse(); return p.reduce((t, pt, i) => t + (pt * (u[i] || 0)), 0); },
        getTimeFromPopover(targetElement) {
            return new Promise((resolve, reject) => {
                if (!targetElement) return reject('目标元素未找到，无法获取悬浮框时间。');
                const popover = bootstrap.Popover.getOrCreateInstance(targetElement);
                let popoverEl = null;
                let contentPollInterval = null;
                const cleanup = (rejectionMessage) => {
                    if (contentPollInterval) clearInterval(contentPollInterval);
                    if (observer) observer.disconnect();
                    if (overallTimeout) clearTimeout(overallTimeout);
                    popover.hide();
                    if (rejectionMessage) reject(rejectionMessage);
                };
                const observer = new MutationObserver((mutations, obs) => {
                    for (const mutation of mutations) {
                        if (mutation.attributeName === 'aria-describedby') {
                            const popoverId = targetElement.getAttribute('aria-describedby');
                            if (!popoverId) continue;
                            popoverEl = document.getElementById(popoverId);
                            if (!popoverEl) continue;
                            obs.disconnect();
                            let elapsedTime = 0;
                            contentPollInterval = setInterval(() => {
                                elapsedTime += 100;
                                const popoverBody = popoverEl.querySelector('.popover-body');
                                if (popoverBody && popoverBody.innerText.trim() !== '') {
                                    const text = popoverBody.innerText.replace(/\s+/g, ' ').trim();
                                    const timeMatch = text.match(/(\d{1,2}:\d{2}(?::\d{2})?(?::\d{2})?)/);
                                    if (timeMatch) {
                                        const timeString = timeMatch[0];
                                        cleanup();
                                        resolve(Utils.parseTimeStringToSeconds(timeString));
                                        return;
                                    }
                                }
                                if (elapsedTime >= Config.timeouts.popoverContentPoll) {
                                    cleanup(`读取悬浮框内容超时(轮询${elapsedTime}ms)，内容可能为空或格式不符。`);
                                }
                            }, 100);
                            return;
                        }
                    }
                });
                const overallTimeout = setTimeout(() => {
                    cleanup(`为元素 ${targetElement.className} 读取悬浮框超时(总时长)`);
                }, Config.timeouts.popoverWatch);
                observer.observe(targetElement, { attributes: true });
                popover.show();
            });
        }
    };

    const QuickLinksUI = {
        dragSrcEl: null,
        init() { this.renderLinks(); },
        loadLinks: () => JSON.parse(GM_getValue(Config.keys.links, '[]')),
        saveLinks(links) { GM_setValue(Config.keys.links, JSON.stringify(links)); },
        renderLinks() {
            const container = document.querySelector(Config.selectors.quickLinksTarget); if (!container) return;
            container.querySelector('.navbarCustomLinks')?.remove();
            const ul = document.createElement('ul'); ul.className = 'navbarCustomLinks'; ul.style.cssText = 'display: flex; flex-wrap: wrap; justify-content: center; width: 100%; list-style: none; padding: 5px 0; margin: 0;';
            this.loadLinks().forEach(link => { ul.innerHTML += `<li style="margin: 0 10px;"><a href="${link.url}" style="color: white;">${link.name}</a></li>`; });
            ul.innerHTML += `<li style="margin: 0 10px;"><a id="manageLinksBtn" href="#" title="管理链接">⚙️</a></li>`;
            container.appendChild(ul);
            document.getElementById('manageLinksBtn').addEventListener('click', (e) => { e.preventDefault(); this.openManagementModal(); });
        },
        openManagementModal() {
            document.getElementById('managementModal')?.remove();
            const modal = document.createElement('div');
            modal.id = 'managementModal';
            modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #333; color: white; padding: 20px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.7); z-index: 10001; border: 1px solid #555; border-radius: 8px; width: 500px; max-height: 80vh; overflow-y: auto;';
            let linksHtml = this.loadLinks().map((link, index) => `
                <div class="link-item" data-index="${index}" draggable="true" style="display: flex; align-items: center; margin-bottom: 10px; padding: 5px; border: 1px dashed #666; background: #444;">
                    <span class="drag-handle" style="cursor: grab; margin-right: 10px; font-size: 1.2em;">≡</span>
                    <input type="text" class="link-name" value="${link.name}" placeholder="名称" style="flex-grow: 1; margin-right: 5px; background: #555; color: white; border: 1px solid #777;"/>
                    <input type="text" class="link-url" value="${link.url}" placeholder="URL" style="flex-grow: 2; margin-right: 5px; background: #555; color: white; border: 1px solid #777;"/>
                    <button class="delete-link" style="background: #dc3545; color: white; border: none; padding: 2px 8px; cursor: pointer;">删除</button>
                </div>`).join('');
            modal.innerHTML = `
                <h3 style="margin-top: 0;">管理快速链接</h3>
                <div id="linksContainer" style="margin-bottom: 15px;">${linksHtml}</div>
                <button id="addLink" style="padding: 5px 10px; cursor: pointer;">添加链接</button>
                <button id="saveLinks" style="padding: 5px 10px; cursor: pointer;">保存并关闭</button>
                <button id="closeModal" style="padding: 5px 10px; cursor: pointer;">关闭</button>`;
            document.body.appendChild(modal);
            this.addModalEventListeners();
        },
        addModalEventListeners() {
            const addListener = (selector, event, handler) => document.querySelector(selector)?.addEventListener(event, handler);
            addListener('#addLink', 'click', () => {
                const container = document.getElementById('linksContainer');
                const newItem = document.createElement('div');
                newItem.className = 'link-item'; newItem.draggable = true;
                newItem.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px; padding: 5px; border: 1px dashed #666; background: #444;';
                newItem.innerHTML = `<span class="drag-handle" style="cursor: grab; margin-right: 10px; font-size: 1.2em;">≡</span><input type="text" class="link-name" placeholder="名称" style="flex-grow: 1; margin-right: 5px; background: #555; color: white; border: 1px solid #777;"/><input type="text" class="link-url" placeholder="URL" style="flex-grow: 2; margin-right: 5px; background: #555; color: white; border: 1px solid #777;"/><button class="delete-link" style="background: #dc3545; color: white; border: none; padding: 2px 8px; cursor: pointer;">删除</button>`;
                container.appendChild(newItem);
                this.addDragAndDropListeners(); this.updateDeleteListeners();
            });
            addListener('#saveLinks', 'click', () => {
                const newLinks = Array.from(document.querySelectorAll('#linksContainer .link-item')).map(item => ({ name: item.querySelector('.link-name').value.trim(), url: item.querySelector('.link-url').value.trim() })).filter(link => link.name && link.url);
                this.saveLinks(newLinks); this.renderLinks(); document.getElementById('managementModal').remove();
            });
            addListener('#closeModal', 'click', () => document.getElementById('managementModal').remove());
            this.updateDeleteListeners(); this.addDragAndDropListeners();
        },
        updateDeleteListeners() { document.querySelectorAll('.delete-link').forEach(btn => btn.onclick = () => btn.parentElement.remove()); },
        addDragAndDropListeners() { document.querySelectorAll('.link-item').forEach(item => { item.addEventListener('dragstart', this.handleDragStart); item.addEventListener('dragover', this.handleDragOver); item.addEventListener('drop', this.handleDrop); item.addEventListener('dragend', this.handleDragEnd); }); },
        handleDragStart(e) { QuickLinksUI.dragSrcEl = this; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/html', this.innerHTML); this.style.opacity = '0.4'; },
        handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; return false; },
        handleDrop(e) { e.stopPropagation(); if (QuickLinksUI.dragSrcEl !== this) { QuickLinksUI.dragSrcEl.innerHTML = this.innerHTML; this.innerHTML = e.dataTransfer.getData('text/html'); } return false; },
        handleDragEnd() { this.style.opacity = '1'; document.querySelectorAll('.link-item').forEach(item => { item.style.border = '1px dashed #666'; }); QuickLinksUI.updateDeleteListeners(); }
    };

    const UIManager = {
        init() { if (this.isGamePage()) { this.injectStyles(); this.createDropdownMenu(); this.createQuickButtons(); QuickLinksUI.init(); this.initItemIdButton(); } },
        isGamePage: () => window.location.href.startsWith(Config.urls.base),
        isJobPage: () => window.location.pathname.toLowerCase().includes('/jobs'),
        isInventoryPage: () => window.location.pathname.toLowerCase().includes('/inventory'),
        injectStyles() { const s = document.createElement('style'); s.innerHTML = `.custom-menu-ul a { color: #00bfff; text-decoration: none; display: block; } .custom-menu-ul a:hover { color: #1e90ff; } .custom-menu-ul li { padding: 8px 16px; border-bottom: 1px solid #444; } .custom-menu-ul li:last-child { border-bottom: none; } .post-options-ul { display: none; list-style: none; padding-left: 20px; } .post-options-ul label { color: #fff; }`; document.head.appendChild(s); },
        createMenuAction: (label, action) => { const li = document.createElement('li'); const a = document.createElement('a'); a.href = '#'; a.textContent = label; a.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); action(a); }); li.appendChild(a); return li; },
        createToggleAction: (label, stateKey) => UIManager.createMenuAction(`${State.get(stateKey) ? '禁用' : '启用'}${label}`, (a) => { State.set(stateKey, !State.get(stateKey)); a.textContent = `${State.get(stateKey) ? '禁用' : '启用'}${label}`; console.log(`${label} 已${State.get(stateKey) ? '启用' : '禁用'}`); }),
        createDropdownMenu() {
            const container = document.querySelector(Config.selectors.playerStatusIcons); if (!container) return;
            const menuHTML = `<a class="hovertext" href="#" aria-label="脚本设置"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="green" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0Zm3.32 11.73a5.32 5.32 0 0 1-6.63 0L2 14l1.95-2.7a5.32 5.32 0 0 1 0-6.63L2 2l2.7 1.95a5.32 5.32 0 0 1 6.63 0L14 2l-1.95 2.7a5.32 5.32 0 0 1 0 6.63L14 14ZM8 10.2A2.2 2.2 0 1 1 10.2 8 2.2 2.2 0 0 1 8 10.2Z"></path></svg></a><ul id="customSettingsMenu" class="custom-menu-ul" style="display: none; list-style-type: none; padding: 0; margin: 0; position: absolute; background-color: #343a40; border: 1px solid #ccc; z-index: 1000; box-shadow: 0 8px 16px rgba(0,0,0,0.2); min-width: 180px; top: 30px; left: 0;"></ul>`;
            const li = document.createElement("li"); li.className = "statusIcon"; li.style.position = "relative"; li.innerHTML = menuHTML; container.prepend(li);
            const menu = li.querySelector("#customSettingsMenu"); const add = (item) => menu.appendChild(item);
            add(this.createToggleAction('自动工作', 'autoJob')); add(this.createToggleAction('自动出院/出狱', 'autoDischarge')); add(this.createToggleAction('自动远征', 'autoExpedition')); add(this.createToggleAction('自动学习', 'autoStudy')); add(this.createToggleAction('自动锻炼', 'autoGym')); add(this.createToggleAction('自动离线', 'autoOffline')); add(this.createToggleAction('军械库权限', 'hasArmoryAccess')); add(this.createToggleAction('随机挂机', 'enableAfkSimulator'));
            add(this.createMenuAction('更改工作类型', this.showJobSelectionDialog)); add(this.createMenuAction('设置能量阈值', () => { const t = prompt("请输入能量阈值:", State.get('energyThreshold')); if (t !== null && !isNaN(t)) State.set('energyThreshold', parseInt(t, 10)); })); add(this.createMenuAction('设置Gym能量', this.showGymEnergyDialog));
            add(this.createToggleAction('自动Drug', 'autoDrug'));
            add(this.createMenuAction('设置Drug物品ID', () => { const id = prompt("请输入 Drug ID:", State.get('drugId')); if (id !== null) State.set('drugId', id.trim()); }));
            add(this.createToggleAction('自动Booster', 'autoBooster'));
            add(this.createMenuAction('设置Booster物品ID', () => { const id = prompt("请输入Booster物品ID:", State.get('boosterItemId')); if (id !== null) State.set('boosterItemId', id.trim()); }));
            const postLi = this.createMenuAction('一键POST', (a) => { const subMenu = a.nextElementSibling; subMenu.style.display = subMenu.style.display === 'block' ? 'none' : 'block'; }); const postSubMenu = document.createElement('ul'); postSubMenu.className = 'post-options-ul'; Config.productionPost.forEach(p => { postSubMenu.innerHTML += `<li><label><input type="checkbox" id="${p.id}"> ${p.name}</label></li>`; }); const sendBtn = this.createMenuAction('发送请求', async () => { console.log('开始执行一键POST...'); const selected = Config.productionPost.filter(p => document.getElementById(p.id).checked); for (const { url, name } of selected) await Utils.request({ method: 'POST', url, data: 'toAssign=0' }).catch(e => console.error(`移除 ${name} 工人失败`, e)); await new Promise(r => setTimeout(r, 1000)); for (const { url, name } of selected) await Utils.request({ method: 'POST', url, data: 'toAssign=10000' }).catch(e => console.error(`分配 ${name} 工人失败`, e)); console.log('一键POST执行完毕。'); }); sendBtn.firstElementChild.style.cssText = "background-color: #007bff; color: white; padding: 5px; margin-top: 5px; text-align: center; border-radius: 3px;"; postSubMenu.appendChild(sendBtn); postLi.appendChild(postSubMenu); menu.appendChild(postLi);
            li.querySelector("a").addEventListener('click', (e) => { e.preventDefault(); menu.style.display = menu.style.display === 'none' ? 'block' : 'none'; }); document.addEventListener('click', (e) => { if (!li.contains(e.target)) menu.style.display = 'none'; });
        },
        showJobSelectionDialog() {
            document.getElementById('jobDialog')?.remove();
            let optionsHtml = ''; Object.keys(Config.jobOptions).forEach(key => { const val = Config.jobOptions[key]; optionsHtml += `<option value="${val}" ${val === State.get('jobType') ? 'selected' : ''}>${key}</option>`; });
            const dialog = document.createElement('div'); dialog.id = 'jobDialog'; dialog.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #333; color: white; padding: 20px; z-index: 10001; border-radius: 8px; border: 1px solid #555;';
            dialog.innerHTML = `<p>请选择工作类型:</p><select id="jobTypeSelect" style="margin-bottom: 15px; width: 100%;">${optionsHtml}</select><button id="confirmJob">确认</button> <button id="cancelJob">取消</button>`;
            document.body.appendChild(dialog);
            dialog.querySelector('#confirmJob').onclick = () => { const val = dialog.querySelector('#jobTypeSelect').value; State.set('jobType', val); dialog.remove(); };
            dialog.querySelector('#cancelJob').onclick = () => dialog.remove();
        },
        showGymEnergyDialog() {
            document.getElementById('gymDialog')?.remove();
            const gym = State.get('gymEnergy');
            const dialog = document.createElement('div'); dialog.id = 'gymDialog'; dialog.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #333; color: white; padding: 20px; z-index: 10001; border-radius: 8px; border: 1px solid #555;';
            dialog.innerHTML = `<h3>设置 Gym 能量百分比</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <label>Accuracy: <input type="number" id="gymAccuracy" value="${gym.accuracy}" style="width: 80px;"/></label>
                    <label>Agility: <input type="number" id="gymAgility" value="${gym.agility}" style="width: 80px;"/></label>
                    <label>Defence: <input type="number" id="gymDefence" value="${gym.defence}" style="width: 80px;"/></label>
                    <label>Strength: <input type="number" id="gymStrength" value="${gym.strength}" style="width: 80px;"/></label>
                </div>
                <button id="confirmGym">确认</button> <button id="cancelGym">取消</button>`;
            document.body.appendChild(dialog);
            dialog.querySelector('#confirmGym').onclick = () => {
                const values = { accuracy: parseInt(dialog.querySelector('#gymAccuracy').value), agility: parseInt(dialog.querySelector('#gymAgility').value), defence: parseInt(dialog.querySelector('#gymDefence').value), strength: parseInt(dialog.querySelector('#gymStrength').value) };
                if (Object.values(values).every(v => !isNaN(v))) { State.set('gymEnergy', values); dialog.remove(); } else { alert('请输入有效的数字！'); }
            };
            dialog.querySelector('#cancelGym').onclick = () => dialog.remove();
        },
        createQuickButtons() {
            const targetRow = document.querySelector(Config.selectors.quickButtonTargetDesktop); if (!targetRow) return;
            const container = document.createElement('div'); container.style.cssText = 'display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 15px; margin-bottom: 10px; width: 100%;';
            const handleGeneralResponse = (res, actionName) => {
                try { const json = JSON.parse(res.responseText); console.log(json.message || `${actionName} 操作完成，但收到未知JSON消息。`); }
                catch (e) { console.log(`[${actionName}] JSON解析失败，判定为操作成功（服务器返回HTML）。`); console.log(`${actionName} 操作成功！`); }
            };
            const addButton = (text, action) => { const btn = document.createElement('div'); btn.innerHTML = `<span style="color: #fff; font-weight: bold;">${text}:</span> <a href="#" style="color: #007bff; text-decoration: none;">[go]</a>`; btn.querySelector('a').addEventListener('click', action); container.appendChild(btn); };
            addButton('一键加 E', async (e) => { e.preventDefault(); console.log("正在执行: 一键加 E"); try { const res = await Utils.request({ method: 'POST', url: Config.urls.refillEnergy }); handleGeneralResponse(res, "一键加 E"); } catch(err) { console.log("一键加 E 请求失败"); } });
            addButton('转盘', async (e) => { e.preventDefault(); console.log("正在执行: 转盘"); try { const res = await Utils.request({ method: 'POST', url: Config.urls.spinWheel }); handleGeneralResponse(res, "转盘"); } catch(err) { alert("转盘请求失败"); } });
            addButton('一键买点', async (e) => { e.preventDefault(); console.log("正在执行: 一键买点"); try { const res = await Utils.request({ method: 'POST', url: Config.urls.buyPoints, data: "Points=25", headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" } }); handleGeneralResponse(res, "一键买点"); } catch(err) { alert("一键买点请求失败"); } });
            addButton('立即锻炼', async (e) => { e.preventDefault(); console.log("正在执行: 立即锻炼"); const energy = await StatusChecker.checkEnergy(); await Actions.doGym(energy); console.log("锻炼指令已发送！"); });
            targetRow.parentNode.insertBefore(container, targetRow.nextSibling);
        },
        initItemIdButton() { if (!this.isInventoryPage()) return; const targetHeader = document.querySelector(Config.selectors.inventoryHeader); if(targetHeader) { if (document.getElementById('showItemIdButton')) return; const btn = document.createElement('button'); btn.id = 'showItemIdButton'; btn.textContent = '显示/隐藏物品ID'; btn.className = 'btn btn-sm btn-info ms-3'; btn.onclick = () => { document.querySelectorAll(Config.selectors.inventoryItemWrapper).forEach(itemWrapper => { const p = itemWrapper.querySelector(Config.selectors.inventoryItemNameParagraph); if (!p) return; const idSpan = p.querySelector('.item-id-span'); if (idSpan) { idSpan.remove(); } else { const itemId = itemWrapper.id.replace('item-', ''); const newSpan = document.createElement('span'); newSpan.className = 'item-id-span'; newSpan.style.color = '#ffc107'; newSpan.style.marginLeft = '8px'; newSpan.textContent = `[ID: ${itemId}]`; p.appendChild(newSpan); } }); }; targetHeader.appendChild(btn); } },
    };

    const StatusChecker = {
        async runAll() { const [job, confinement, drug, booster, expedition, energy] = await Promise.all([ this.checkJob(), this.checkConfinement(), this.checkDrug(), this.checkBooster(), this.checkExpedition(), this.checkEnergy() ]); const status = { job, confinement, drug, booster, expedition, energy }; console.log("[状态检查] 完成:", status); return status; },
        async checkJob() {
            if (UIManager.isJobPage()) {
                const progressEl = document.querySelector(Config.selectors.progressMessage);
                if (progressEl && progressEl.getAttribute('data-bs-finishtime')) {
                    GM_setValue(Config.keys.jobFinishTime, progressEl.getAttribute('data-bs-finishtime'));
                } else {
                    const jobIcon = document.querySelector(Config.selectors.jobStatusIcon);
                    if (!jobIcon || jobIcon.classList.contains('d-none')) {
                        GM_setValue(Config.keys.jobFinishTime, '0');
                    }
                }
            }
            let finishTime = parseInt(GM_getValue(Config.keys.jobFinishTime, '0'), 10);
            const now = Math.floor(Date.now() / 1000);
            let remaining = Math.max(0, finishTime - now);
            const jobIcon = document.querySelector(Config.selectors.jobStatusIcon);
            const isIconVisible = jobIcon && !jobIcon.classList.contains('d-none');
            if (!isIconVisible && remaining > 0) {
                console.log("[同步] Job状态图标已消失，但存储数据仍有效。强制更新工作状态为“已结束”。");
                GM_setValue(Config.keys.jobFinishTime, '0');
                remaining = 0;
            }
            return { inProgress: remaining > 0, remainingTime: remaining };
        },
        async checkConfinement() {
            const h = document.querySelector(Config.selectors.hospitalIcon);
            const j = document.querySelector(Config.selectors.jailIcon);
            const iH = h && !h.classList.contains('d-none');
            const iJ = j && !j.classList.contains('d-none');
            if (iH && iJ) {
                console.log("检测到异常状态（同时在医院和监狱），即将刷新页面...");
                window.location.reload();
                return { inHospital: true, hospitalTime: Infinity, inJail: true, jailTime: Infinity };
            }
            let hT = 0;
            let jT = 0;
            if (iH) {
                try {
                    console.log("[状态检查] 检测到住院中，正在获取剩余时间...");
                    hT = await Utils.getTimeFromPopover(h.querySelector('a'));
                } catch (e) {
                    console.error("检查医院剩余时间出错:", e);
                    hT = Infinity;
                }
            }
            if (iJ) {
                try {
                    console.log("[状态检查] 检测到在监狱中，正在获取剩余时间...");
                    jT = await Utils.getTimeFromPopover(j.querySelector('a'));
                } catch (e) {
                    console.error("检查监狱剩余时间出错:", e);
                    jT = Infinity;
                }
            }
            return { inHospital: iH, hospitalTime: hT, inJail: iJ, jailTime: jT };
        },
        async checkDrug() { const el = document.querySelector(Config.selectors.drugIcon); if (el?.classList.contains('d-none')) return { remainingTime: 0 }; try { return { remainingTime: await Utils.getTimeFromPopover(el.querySelector('a')) }; } catch(e) { console.error("检查Drug时间出错:", e); return { remainingTime: Infinity }; } },
        async checkBooster() { const el = document.querySelector(Config.selectors.boosterIcon); if (el?.classList.contains('d-none')) return { remainingTime: 0 }; try { return { remainingTime: await Utils.getTimeFromPopover(el.querySelector('a')) }; } catch(e) { console.error("检查Booster时间出错:", e); return { remainingTime: Infinity }; } },
        async checkExpedition() {
            const endTimes = GM_getValue(Config.keys.expeditionEndTimes, {});
            const now = Date.now() / 1000;
            let minRemainingTime = Infinity;
            let runningCount = 0;
            for (let i = 1; i <= Config.constants.EXPEDITION_SLOTS; i++) {
                const endTime = endTimes[i] || 0;
                if (endTime > now) {
                    minRemainingTime = Math.min(minRemainingTime, endTime - now);
                    runningCount++;
                }
            }
            return {
                runningCount: runningCount,
                isAnySlotFree: runningCount < Config.constants.EXPEDITION_SLOTS,
                minRemainingTime: minRemainingTime === Infinity ? 0 : minRemainingTime,
            };
        },
        async checkEnergy() { const el = document.querySelector(Config.selectors.currentEnergy); const cur = el ? parseInt(el.textContent, 10) : 0; const thr = State.get('energyThreshold'); return { current: cur, threshold: thr, hasEnough: cur >= thr, timeToThreshold: cur >= thr ? 0 : (thr - cur) * 2 * 60 }; }
    };

    const Actions = {
        async doJob() { const cF = document.querySelector('form[action="/jobs/finish"]'); if (cF) { console.log("正在完成当前工作..."); cF.querySelector("input[type='submit']").click(); return 'action-taken'; } const jT = State.get('jobType'); const pB = document.querySelector(`button[data-bs-target="#prestigeJobModal"][data-job="${jT}"]`); if (pB) { console.log(`发现 Prestige 工作...`); pB.click(); await new Promise(r => setTimeout(r, 2000)); return this.handlePrestigeModal(); } const sF = document.querySelector(`form[action="/jobs/${jT}"]`); if (sF) { console.log(`正在开始新工作: ${jT}`); sF.querySelector("button[type='submit'][value='Start']").click(); return 'action-taken'; } console.log("没有可执行的工作动作。"); return 'no-buttons'; },
        async handlePrestigeModal() { const rT = document.querySelector("input[value^='Reduce Time']"); if (rT && !rT.value.includes("(5/5)")) { console.log("点击 'Reduce Time'"); rT.click(); await new Promise(r => setTimeout(r, 2000)); return this.handlePrestigeModal(); } const iR = document.querySelector("input[value^='Increase Reward']"); if (iR) { console.log("点击 'Increase Reward'"); iR.click(); await new Promise(r => setTimeout(r, 2000)); return this.handlePrestigeModal(); } console.log("Prestige 模态框处理完毕。"); document.querySelector(`form[action="/jobs/${State.get('jobType')}"] button[type='submit']`)?.click(); return 'action-taken'; },
        async doDischarge({ inHospital, hospitalTime, inJail }) { let rI, dU; if (inJail) { rI = "Personal Favour"; } else if (inHospital) { if (hospitalTime > 3600) rI = "大型医疗包"; else if (hospitalTime > 900) rI = "小型医疗包"; else if (hospitalTime > 0) rI = "绷带"; } if (!rI) return 'idle'; dU = (inHospital && State.get('hasArmoryAccess')) ? Config.urls.armory : Config.urls.inventory; if (window.location.href !== dU) { window.location.href = dU; return 'redirecting'; } const btn = document.querySelector(`button[aria-label='${Config.dischargeItems[rI].ariaLabel}']`); if (btn) { console.log(`正在使用: ${rI}...`); btn.click(); return 'action-taken'; } console.log(`物品 ${rI} 未找到，3秒后刷新页面。`); setTimeout(() => window.location.reload(), 3000); return 'error'; },
        setDefaultExpeditionTime(index) {
            const defaultEndTime = Math.floor(Date.now() / 1000) + 3 * 3600;
            const currentEndTimes = GM_getValue(Config.keys.expeditionEndTimes, {});
            if (!currentEndTimes[index] || currentEndTimes[index] <= Math.floor(Date.now() / 1000)) {
                currentEndTimes[index] = defaultEndTime;
                GM_setValue(Config.keys.expeditionEndTimes, currentEndTimes);
                console.log(`远征 ${index} 遇到错误，已设置默认3小时冷却时间。`);
            }
        },
        async doExpedition() {
            console.log("检查并开始空闲的远征...");
            const endTimes = GM_getValue(Config.keys.expeditionEndTimes, {});
            const now = Date.now() / 1000;
            for (let i = 1; i <= Config.constants.EXPEDITION_SLOTS; i++) {
                if (!endTimes[i] || endTimes[i] <= now) {
                    console.log(`检测到远征栏位 ${i} 空闲，尝试启动...`);
                    try {
                        const res = await Utils.request({ method: "POST", url: Config.urls.startExpedition(i, i) });
                        const data = JSON.parse(res.responseText);
                        if (res.status === 200 && data.status === 200 && data.completion) {
                            const currentEndTimes = GM_getValue(Config.keys.expeditionEndTimes, {});
                            currentEndTimes[i] = data.completion;
                            GM_setValue(Config.keys.expeditionEndTimes, currentEndTimes);
                            console.log(`远征 ${i} 开始成功，结束于: ${new Date(data.completion * 1000).toLocaleString()}`);
                        } else {
                            console.error(`远征 ${i} 返回状态错误:`, data.message); this.setDefaultExpeditionTime(i);
                        }
                    } catch (err) {
                        console.error(`远征 ${i} 请求或解析失败:`, err); this.setDefaultExpeditionTime(i);
                    }
                    await new Promise(r => setTimeout(r, Utils.getRandomDelay(1000, 2000)));
                }
            }
            return 'action-taken';
        },
        // 替换：Drug 每次只补一次 + 轻量节流 + 过量保护
        async doUseDrug(currentCooldown) {
            const drugId = State.get('drugId');
            if (!drugId) {
                console.log("Drug ID未设置，无法执行嗑药逻辑。");
                return 'idle';
            }

            // 仅当冷却未满24h才考虑使用一次
            const timeDeficit = Config.constants.SECONDS_IN_24_HOURS - currentCooldown;
            if (timeDeficit <= 0) {
                return 'idle';
            }

            // 轻量节流（默认3分钟，可用 State.set('drugMinGapMs', 毫秒) 覆盖）
            const minGapMs = State.get('drugMinGapMs') ?? 3 * 60 * 1000;
            const now = Date.now();
            const lastUse = parseInt(GM_getValue(Config.keys.lastDrugUseAt, '0'), 10);
            if (lastUse && now - lastUse < minGapMs) {
                console.log(`[Drug] 节流中，距上次使用 ${(now - lastUse) / 1000 | 0}s，跳过本轮。`);
                return 'idle';
            }

            // 可选安全措施：能量过高时不使用（默认100，可用 State.set('drugMinEnergyBeforeUse', 数字) 覆盖）
            State.set('drugMinEnergyBeforeUse', 100)
            const minEnergyBeforeUse = State.get('drugMinEnergyBeforeUse') ?? 100;
            try {
                const energy = await StatusChecker.checkEnergy();
                if (energy.current > minEnergyBeforeUse) {
                    console.log(`[Drug] 当前能量 ${energy.current} > ${minEnergyBeforeUse}，为避免过量/浪费，本轮不使用。`);
                    return 'idle';
                }
            } catch (e) {
                // 能量读取失败时，可忽略继续尝试一次
            }

            console.log(`[Drug] “每次只补一次”策略：尝试使用 1 次...`);
            try {
                const res = await Utils.request({ method: "POST", url: Config.urls.useDrug(drugId) });
                const text = res.responseText || '';
                if (/overdose|overdosed|过量|能量清空/i.test(text)) {
                    console.warn("[Drug] 检测到过量提示，已停止。");
                    return 'error';
                }
                GM_setValue(Config.keys.lastDrugUseAt, now.toString()); // 记录时间戳用于节流
                return 'action-taken';
            } catch (e) {
                console.error(`[Drug] 请求失败：`, e);
                return 'error';
            }
        },
        async doUseBooster(currentCooldown) {
            const boosterItemId = State.get('boosterItemId');
            if (!boosterItemId) { console.log("Booster物品ID未设置，无法执行补充逻辑。"); return 'idle'; }
            const timeDeficit = Config.constants.SECONDS_IN_24_HOURS - currentCooldown;
            if (timeDeficit <= 0) { return 'idle'; }
            const timesToUse = Math.ceil(timeDeficit / Config.constants.COOLDOWN_ITEM_REDUCTION_SECONDS);
            console.log(`Booster冷却时间低于24小时。需要使用物品 ${timesToUse} 次以补满。`);
            for (let i = 0; i < timesToUse; i++) {
                console.log(`正在进行第 ${i + 1}/${timesToUse} 次Booster补充...`);
                try {
                    await Utils.request({ method: "POST", url: Config.urls.useDrug(boosterItemId) });
                } catch (e) {
                    console.error(`第 ${i+1} 次Booster补充失败:`, e); break;
                }
                await new Promise(r => setTimeout(r, Utils.getRandomDelay(1000, 2000)));
            }
            return 'action-taken';
        },
        async doStudy({ current }) { console.log(`使用 ${current} 能量学习。`); try { await Utils.request({ method: "POST", url: Config.urls.university, headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: `energyToUse=${current}` }); } catch (e) { return 'error'; } return 'action-taken'; },
        async doGym({ current }) { const gC = State.get('gymEnergy'); if (Object.values(gC).reduce((a, b) => a + b, 0) <= 0) { console.log("Gym能量百分比未设置，跳过。"); return 'idle'; } console.log("正在锻炼..."); for (const type in gC) { const p = gC[type]; if (p > 0) { const e = Math.floor(current * (p / 100)); if (e > 0) { console.log(`训练 ${type}，使用 ${e} 能量。`); try { await Utils.request({ method: "POST", url: `${Config.urls.gymTrain}${type}/`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: `energyToUse=${e}` }); await new Promise(r => setTimeout(r, 1000)); } catch (err) { console.error(`训练 ${type} 失败:`, err); } } } } return 'action-taken'; }
    };

    const App = {
        hasLock: false,
        isFirstRunAfterLoad: true,
        lockHeartbeatInterval: null,
        async acquireLock() {
            const lockTime = parseInt(GM_getValue(Config.keys.lock, '0'), 10);
            const now = Date.now();
            if (lockTime === 0 || (now - lockTime > Config.timeouts.forceLockReset)) {
                console.log("[锁] 无锁或锁已过期，成功获取。");
                GM_setValue(Config.keys.lock, now.toString());
                this.hasLock = true;
                this.startHeartbeat();
                return true;
            }
            if (now - lockTime > Config.timeouts.lockStale) {
                console.warn(`[锁] 检测到陈旧锁 (存在超过 ${Config.timeouts.lockStale / 1000}s)，判定为无效并强制接管。`);
                GM_setValue(Config.keys.lock, now.toString());
                this.hasLock = true;
                this.startHeartbeat();
                return true;
            }
            console.log("[锁] 另一个标签页的脚本正在运行。");
            return false;
        },
        startHeartbeat() {
            if (this.lockHeartbeatInterval) {
                clearInterval(this.lockHeartbeatInterval);
            }
            this.lockHeartbeatInterval = setInterval(() => {
                if (this.hasLock) {
                    GM_setValue(Config.keys.lock, Date.now().toString());
                }
            }, Config.timeouts.lockHeartbeat);
        },
        stopHeartbeat() {
            if (this.lockHeartbeatInterval) {
                clearInterval(this.lockHeartbeatInterval);
                this.lockHeartbeatInterval = null;
            }
        },
        releaseLock() {
            this.stopHeartbeat();
            if (this.hasLock) {
                GM_deleteValue(Config.keys.lock);
                this.hasLock = false;
            }
        },
        handleRestPage() { const endTime = GM_getValue(Config.keys.restTimestamps, 0); if (!endTime || Date.now() > endTime) { console.log('[休息] 休息时间到，返回游戏。'); window.location.href = Config.urls.base; return; } const remaining = Math.round((endTime - Date.now()) / 1000); console.log(`[休息] 页面保持休息，剩余 ${remaining} 秒。`); document.body.innerHTML = `<div style="font-size: 2em; color: white; background: #222; height: 100vh; display: flex; align-items: center; justify-content: center;">脚本休息中... 剩余 ${remaining} 秒后自动返回</div>`; setTimeout(() => { window.location.href = Config.urls.base; }, remaining * 1000 + 2000); },
        async mainLoop() {
            let status = await StatusChecker.runAll();

            if (this.isFirstRunAfterLoad) {
                if (status.confinement.inJail || status.confinement.inHospital) {
                    console.log('[调度] 首次运行检测到禁闭状态，执行二次检查以确保状态稳定...');
                    await new Promise(r => setTimeout(r, 3000));
                    const confinementDoubleCheck = await StatusChecker.checkConfinement();
                    console.log('[调度] 禁闭状态二次检查结果:', confinementDoubleCheck);
                    status.confinement = confinementDoubleCheck;
                }
                this.isFirstRunAfterLoad = false;
            }

            if (State.get('enableAfkSimulator') && Math.random() < Config.humanizer.afkChance) {
                const afkTime = Utils.getRandomDelay(Config.humanizer.afkDuration.min, Config.humanizer.afkDuration.max);
                this.scheduleNextCheck(afkTime / 1000, false, `模拟真人随机挂机`);
                return;
            }

            if (status.confinement.inJail || status.confinement.inHospital) {
                if (State.get('autoDischarge')) {
                    const needsJob = State.get('autoJob') && !status.job.inProgress;
                    const needsExpedition = State.get('autoExpedition') && status.expedition.isAnySlotFree;
                    const needsEnergyAction = (State.get('autoStudy') || State.get('autoGym')) && status.energy.hasEnough;
                    const shouldDischarge = needsJob || needsExpedition || needsEnergyAction;

                    if (shouldDischarge) {
                        console.log("[调度] 检测到禁闭状态，且有挂起任务(工作/远征/耗能)，触发自动出院/出狱。");
                        await new Promise(r => setTimeout(r, Utils.getRandomDelay(Config.humanizer.actionDelay.min, Config.humanizer.actionDelay.max)));
                        if (await Actions.doDischarge(status.confinement) === 'redirecting') return;
                        this.scheduleNextCheck(0, true, '出狱/出院后立即重新检查');
                        return;
                    } else {
                        console.log("[调度] 检测到禁闭状态，但无紧急任务，为安全起见将保持禁闭状态等待。");
                    }
                } else {
                    console.log("[调度] 检测到处于禁闭状态，但未启用自动出院/出狱，脚本将等待。");
                }
            }

            if (!status.confinement.inJail && !status.confinement.inHospital) {
                if (State.get('autoJob') && !status.job.inProgress) {
                    await new Promise(r => setTimeout(r, Utils.getRandomDelay(Config.humanizer.actionDelay.min, Config.humanizer.actionDelay.max)));
                    if (!UIManager.isJobPage()) { console.log("工作已结束且不在工作页面，正在跳转..."); window.location.href = Config.urls.jobs; return; }
                    const jobActionStatus = await Actions.doJob();
                    if (jobActionStatus === 'no-buttons') { console.log("工作已结束，但在工作页面上未找到任何操作按钮。可能是页面卡住了，正在刷新..."); window.location.reload(); return; }
                    this.scheduleNextCheck(0, true, '开始新工作后立即重新检查');
                    return;
                }
                if (status.energy.hasEnough) {
                    await new Promise(r => setTimeout(r, Utils.getRandomDelay(Config.humanizer.actionDelay.min, Config.humanizer.actionDelay.max)));
                    let energyActionTaken = false;
                    if (State.get('autoStudy')) { if (await Actions.doStudy(status.energy) !== 'idle') energyActionTaken = true; }
                    else if (State.get('autoGym')) { if (await Actions.doGym(status.energy) !== 'idle') energyActionTaken = true; }
                    if (energyActionTaken) {
                        this.scheduleNextCheck(0, true, '消耗能量后立即重新检查');
                        return;
                    }
                }

                let backgroundActionTaken = false;
                if (State.get('autoExpedition') && status.expedition.isAnySlotFree) {
                    await Actions.doExpedition();
                    backgroundActionTaken = true;
                }
                // 修改：Drug 仅在确实使用时才触发快速轮询
                if (State.get('autoDrug') && status.drug.remainingTime >= 0 && status.drug.remainingTime < Config.constants.SECONDS_IN_24_HOURS) {
                    const r = await Actions.doUseDrug(status.drug.remainingTime);
                    if (r === 'action-taken') backgroundActionTaken = true;
                }
                // Booster 保持原有逻辑（不修改）
                if (State.get('autoBooster') && status.booster.remainingTime >= 0 && status.booster.remainingTime < Config.constants.SECONDS_IN_24_HOURS) { await Actions.doUseBooster(status.booster.remainingTime); backgroundActionTaken = true; }
                if (backgroundActionTaken) {
                    this.scheduleNextCheck(0, true, '执行后台任务后立即重新检查');
                    return;
                }
            }

            console.log("[调度] 本轮无任何即时动作，计算长等待...");
            const finalStatus = await StatusChecker.runAll();

            // ==========【代码修改：新的事件驱动调度逻辑】==========
            const waitEvents = [
                { reason: '工作结束', time: finalStatus.job.remainingTime },
                { reason: '远征结束', time: finalStatus.expedition.minRemainingTime },
                { reason: '能量到达阈值', time: finalStatus.energy.timeToThreshold },
                { reason: 'Drug冷却结束', time: finalStatus.drug.remainingTime >= Config.constants.SECONDS_IN_24_HOURS ? Infinity : finalStatus.drug.remainingTime },
                { reason: 'Booster冷却结束', time: finalStatus.booster.remainingTime >= Config.constants.SECONDS_IN_24_HOURS ? Infinity : finalStatus.booster.remainingTime }
            ];

            // 新增事件：Drug 节流结束（避免节流导致长时间不再尝试）
            if (State.get('autoDrug') && finalStatus.drug.remainingTime >= 0 && finalStatus.drug.remainingTime < Config.constants.SECONDS_IN_24_HOURS) {
                const lastUse = parseInt(GM_getValue(Config.keys.lastDrugUseAt, '0'), 10);
                const minGapMs = State.get('drugMinGapMs') ?? 3 * 60 * 1000;
                const gapRemainSec = lastUse ? Math.max(0, Math.ceil((lastUse + minGapMs - Date.now()) / 1000)) : 0;
                if (gapRemainSec > 0) {
                    waitEvents.push({ reason: 'Drug节流结束', time: gapRemainSec });
                }
            }

            if (finalStatus.confinement.inHospital) {
                waitEvents.push({ reason: '出院', time: finalStatus.confinement.hospitalTime });
            }
            if (finalStatus.confinement.inJail) {
                waitEvents.push({ reason: '出狱', time: finalStatus.confinement.jailTime });
            }

            const validEvents = waitEvents.filter(e => e.time > 0);

            if (validEvents.length > 0) {
                const nextEvent = validEvents.reduce((prev, curr) => prev.time < curr.time ? prev : curr);
                this.scheduleNextCheck(nextEvent.time, false, nextEvent.reason);
            } else {
                this.scheduleNextCheck(Infinity, false, '无明确事件，进入常规轮询');
            }
        },
        scheduleNextCheck(minWaitSeconds, forceFastPoll = false, reason = '未知原因') {
            if (State.get('autoOffline') && minWaitSeconds > Config.timeouts.restThreshold && !forceFastPoll) {
                this.scheduleNextCheck(minWaitSeconds, false, `下次事件在 ${minWaitSeconds.toFixed(0)} 秒后，超过休息阈值，准备离线休息`);
                GM_setValue(Config.keys.restTimestamps, Date.now() + minWaitSeconds * 1000);
                window.location.href = Config.urls.rest;
                return;
            }
            let delay;
            if (forceFastPoll) {
                delay = Utils.getRandomDelay(Config.timeouts.fastPoll.min, Config.timeouts.fastPoll.max);
            } else if (minWaitSeconds < Infinity && minWaitSeconds > 0) {
                delay = minWaitSeconds * 1000 + Utils.getRandomDelay(2000, 5000);
            } else {
                delay = Utils.getRandomDelay(Config.timeouts.slowPoll.min, Config.timeouts.slowPoll.max);
            }
            console.log(`[调度] 下次检查在 ${(delay / 1000).toFixed(1)} 秒后 (原因: ${reason})。`);
            setTimeout(() => this.mainLoop(), delay);
        },
        async run() {
            if (!UIManager.isGamePage()) {
                if (window.location.href.startsWith(Config.urls.rest)) this.handleRestPage();
                return;
            }
            if (!await this.acquireLock()) {
                return;
            }
            State.load();
            UIManager.init();
            this.mainLoop();
        }
    };

    window.addEventListener('load', () => {
        console.log('[脚本启动] 页面加载完成，延迟2秒启动主程序以等待游戏脚本初始化...');
        setTimeout(() => {
            App.run().catch(err => {
                console.error("脚本执行出现严重错误:", err);
                App.releaseLock();
            });
        }, 2000);
    });
    window.addEventListener('beforeunload', () => App.releaseLock());

})();