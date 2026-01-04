// ==UserScript==
// @name         自動ログイン機能
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  楽天系のモールへの自動ログイン + Shopifyの伝票検索に対応
// @match        https://main.next-engine.com/*
// @match        https://order-rp.rms.rakuten.co.jp/order-rb/individual-order-detail-sc/init*
// @match        https://mainmenu.rms.rakuten.co.jp/*
// @match        https://glogin.rms.rakuten.co.jp/*
// @match        https://admin.shopify.com/store/eh8nfp-gh/orders?start=MQ%3D%3D
// @run-at       document-end
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/537480/%E8%87%AA%E5%8B%95%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E6%A9%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/537480/%E8%87%AA%E5%8B%95%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E6%A9%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = location.href;
    const mallFlagKey = "mall_action_in_progress";
    const mallRetryKeyPrefix = "mall_action_retry_request_";
    const currentJyuchuNoKey = "currentJyuchuNo";

    const valueMapping = {
        1: 1,
        27: 5,
        31: 2,
        32: 3,
        35: 4,
        36: 6,
        40: 'shopify'
    };

    if (url === "https://mainmenu.rms.rakuten.co.jp/") {
        let notified = false;

        function notifyNow() {
            if (notified) return;
            notified = true;
            (async () => {
                const isMallAction = await GM_getValue(mallFlagKey, false);
                if (!isMallAction) return;

                const jyuchuNo = await GM_getValue(currentJyuchuNoKey, null);
                if (!jyuchuNo) return;
                const retryKey = mallRetryKeyPrefix + jyuchuNo;

                await GM_setValue(retryKey, true);
                await GM_setValue(mallFlagKey, false);
                window.close();
            })();
        }

        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(notifyNow, 3800);
        });

        window.addEventListener('load', () => {
            notifyNow();
        });

        return;
    }

    if (url.startsWith("https://mainmenu.rms.rakuten.co.jp/?act=login&sp_id=1")) {
        window.addEventListener('DOMContentLoaded', async () => {
            const isMallAction = await GM_getValue(mallFlagKey, false);
            if (!isMallAction) return;
            const btn = document.querySelector('.btn-reset.btn-round.btn-red');
            if (btn) {
                btn.click();
            }
        });
        return;
    }

    if (url.startsWith("https://glogin.rms.rakuten.co.jp/")) {
        window.addEventListener('DOMContentLoaded', async () => {
            const isMallAction = await GM_getValue(mallFlagKey, false);
            if (!isMallAction) return;
            const loginBtn = document.querySelector('.rf-button-primary.rf-block.rf-medium');
            if (loginBtn) {
                loginBtn.click();
            }

        });
        return;
    }

    if (url.startsWith("https://mainmenu.rms.rakuten.co.jp/?act=app_login_error")) {
        window.addEventListener('DOMContentLoaded', async () => {
            const isMallAction = await GM_getValue(mallFlagKey, false);
            if (!isMallAction) return;

            await GM_setValue(mallFlagKey, true);

            const shopTypeNo = await GM_getValue('lastshopTypeNo', null);
            window.open(`https://starlight.plusnao.co.jp/rms/index?shop_type=${shopTypeNo}&id=1354`, "_blank");
            setTimeout(() => { window.close(); }, 500);
        });
        return;
    }

    if (url.startsWith("https://order-rp.rms.rakuten.co.jp/order-rb/individual-order-detail-sc/init")) {
        window.addEventListener('DOMContentLoaded', async () => {
            const layoutContent = document.getElementById("layoutContent");
            if (layoutContent && layoutContent.innerText.includes("エラー")) {
                await GM_setValue(mallFlagKey, true);
                const shopTypeNo = await GM_getValue('lastshopTypeNo', null);
                window.open(`https://starlight.plusnao.co.jp/rms/index?shop_type=${shopTypeNo}&id=1354`, "_blank");
                setTimeout(() => { window.close(); }, 500);
            } else {
                await GM_setValue(mallFlagKey, false);
            }
        });
        return;
    }

    if (url.startsWith("https://main.next-engine.com/Userjyuchu/jyuchuInp")) {
        window.addEventListener('load', async () => {
            const select = document.getElementById('tenpo_code');
            const moruBtn = document.getElementById('show-moru-btn');
            let prevJyuchuNo = null;

            function monitorJyuchuNo() {
                const jyuchuNoInput = document.getElementById('jyuchu_denpyo_no');
                if (!jyuchuNoInput) return;
                const currentJyuchuNo = jyuchuNoInput.value;
                if (currentJyuchuNo !== prevJyuchuNo) {
                    prevJyuchuNo = currentJyuchuNo;
                }
            }
            setInterval(monitorJyuchuNo, 300);

            if (select && moruBtn) {
                moruBtn.addEventListener('click', async () => {
                    const jyuchuNoInput = document.getElementById('jyuchu_denpyo_no');
                    const myJyuchuNo = jyuchuNoInput ? jyuchuNoInput.value : null;
                    if (myJyuchuNo) {
                        await GM_setValue(currentJyuchuNoKey, myJyuchuNo);
                    }

                    const value = select.value;
                    const mappedValue = valueMapping[parseInt(value)];
                    if (mappedValue) {
                        await GM_setValue(mallFlagKey, true);

                        if (mappedValue !== 'shopify') {
                            await GM_setValue('lastshopTypeNo', mappedValue);
                        }
                        if (mappedValue === 'shopify') {
                            const orderNumber = document.getElementById('tenpo_denpyo_no').value;
                            await GM_setValue('orderNumber', orderNumber);
                            window.open(`https://admin.shopify.com/store/eh8nfp-gh/orders?start=MQ%3D%3D`, '_blank');
                        }
                    }
                });
            }

            setInterval(() => {
                const jyuchuNoInput = document.getElementById('jyuchu_denpyo_no');
                if (!jyuchuNoInput) return;
                const myJyuchuNo = jyuchuNoInput.value;
                if (!myJyuchuNo) return;
                const myRetryKey = mallRetryKeyPrefix + myJyuchuNo;

                if (window[`_addedRetryListener_${myJyuchuNo}`]) return;
                window[`_addedRetryListener_${myJyuchuNo}`] = true;

                GM_addValueChangeListener(myRetryKey, async function(name, oldValue, newValue, remote) {
                    if (newValue === true) {
                        const moruBtn = document.getElementById('show-moru-btn');
                        if (moruBtn) {
                            moruBtn.click();
                        } else {
                        }
                        await GM_setValue(myRetryKey, false);
                        await GM_deleteValue(myRetryKey);
                    }
                });
            }, 500);

        });
    }

    if (url.startsWith("https://admin.shopify.com/store/eh8nfp-gh/orders?start=MQ%3D%3D")) {
        window.addEventListener('load', async function() {
            const orderNumber = await GM_getValue('orderNumber', null);
            if (orderNumber) {
                automateShopifySearch(orderNumber);
            }
        });
        return;
    }

    function automateShopifySearch(orderNumber) {
        'use strict';

        const observer = new MutationObserver(function(mutations) {
            const searchButton = document.querySelector('button._TopBarButton_ale7v_2._SearchActivator_8d1vr_4');
            if (searchButton) {
                searchButton.click();

                setTimeout(function() {
                    const searchInput = document.querySelector('input[aria-label="検索"]');
                    if (searchInput) {
                        searchInput.focus();

                        const instructionMessage = document.createElement('div');
                        instructionMessage.style.position = 'fixed';
                        instructionMessage.style.bottom = '32px';
                        instructionMessage.style.right = '32px';
                        instructionMessage.style.backgroundColor = '#007bff';
                        instructionMessage.style.color = '#fff';
                        instructionMessage.style.padding = '16px 28px';
                        instructionMessage.style.fontSize = '20px';
                        instructionMessage.style.fontWeight = 'bold';
                        instructionMessage.style.borderRadius = '10px';
                        instructionMessage.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.18)';
                        instructionMessage.style.display = 'none';
                        instructionMessage.style.zIndex = '820';
                        instructionMessage.style.border = '2px solid #ffd700';
                        instructionMessage.style.letterSpacing = '1px';
                        instructionMessage.style.textShadow = '0 2px 4px rgba(0,0,0,0.15)';

                        document.body.appendChild(instructionMessage);

                        searchInput.addEventListener('blur', function() {
                            instructionMessage.style.display = 'none';
                        });

                        searchInput.value = orderNumber;

                        const clickEvent = new MouseEvent('click', { 'bubbles': true, 'cancelable': true });
                        searchInput.dispatchEvent(clickEvent);

                        const inputEvent = new Event('input', { 'bubbles': true, 'cancelable': true });
                        searchInput.dispatchEvent(inputEvent);

                        setTimeout(function() {
                            instructionMessage.style.display = 'block';
                            instructionMessage.innerText = 'スペースを押して検索を完了させてください';
                        }, 200);

                        const intervalId = setInterval(function() {
                            const resultItem = Array.from(document.querySelectorAll('#search-results li'))
                            .find(item => {
                                const orderNumberElement = item.querySelector('mark');
                                return orderNumberElement && orderNumberElement.textContent.trim() === orderNumber;
                            });

                            if (resultItem) {
                                const link = resultItem.querySelector('a');
                                if (link) {
                                    link.click();
                                    clearInterval(intervalId);
                                    instructionMessage.style.display = 'none';
                                    GM_setValue('orderNumber', '');
                                }
                            }
                        }, 500);

                        window.addEventListener('keydown', function(event) {
                            if (event.code === 'Space') {
                                instructionMessage.style.display = 'none';
                            }
                        });
                    }
                }, 500);

                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

})();
