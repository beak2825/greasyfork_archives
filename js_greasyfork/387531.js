// ==UserScript==
// @name        StarrFantasyEnhanced
// @name:zh-CN  StarrFantasyEnhanced
// @namespace   rusyue@live.com
// @author      rusyue
// @icon        https://rusyue.com/images/avatar.png
// @description Let all skill slots automated, automatic reconnect when you are lost connection to server.
// @description:zh-cn 自动战斗、断线重连...
// @include     *://www.starrfantasy.com/index.php*
// @version     1.0.3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/387531/StarrFantasyEnhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/387531/StarrFantasyEnhanced.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    try {
        let message = await gameLoading();
        let hotbarItems = Array.prototype.slice.call(document.querySelectorAll('.hotbarItemOuter'), 1, -1); // 只要快捷栏2-9号 (排除自带自动的1号栏和脱离战斗的10号栏)
        let hotbarItemsMap = new Map(hotbarItems.map((el, idx) => [el, idx]));
        let autoSlotBtns = hotbarItems.map((el) => el.querySelector('i[title="Auto Battle Slot"]'));
        let monitor = null;

        console.log(message); // 游戏加载完毕

        hotbarItems.forEach((el) => el.classList.add('autobattleSlot')); // 所有快捷栏都添加上自动战斗按钮样式

        window.StarrFantasyEnhancedMonitor = monitor = setInterval(async () => {
            // 自动战斗
            let isInCombat = document.querySelector('#uiPanel-battle') !== null;

            if (isInCombat) {
                for (let [el, idx] of hotbarItemsMap) {
                    let isAutoSlot = autoSlotBtns[idx].classList.contains('active');

                    if (isAutoSlot) {
                        let hotbarItem = el.querySelector('.hotbarItem');
                        let cooldownOverlay = el.querySelector('.hotbarCooldownOverlay');
                        let isActive = hotbarItem.dataset.active === 'true';
                        let isCooldown = cooldownOverlay.offsetWidth === 0;

                        if (isActive && isCooldown) {
                            hotbarItem.click();
                        }
                    }

                    await sleep(300); // 使用每个技能间隔300毫秒
                }
            }

            // 断线重连
            let reconnectBtn = document.querySelector('#uiPanel-disconnected .dialogConfirmReconnect');
            if (reconnectBtn !== null) {
                reconnectBtn.click();
            }
        }, 5000);
    } catch (err) {
        console.log(err);
    }
}());

// 等待游戏加载完成
function gameLoading() {
    return new Promise((resolve, reject) => {
        let loading = document.querySelector('#loadingOverlay');
        let times = 1;
        let timer = setInterval(() => {
            if (loading !== null) {
                loading = document.querySelector('#loadingOverlay');
                console.log(`StarrFantasyEnhanced: Game loading... | Retrying: ${times} | Time: ${new Date().toLocaleTimeString()}`);
                if (times++ > 24) {
                    clearInterval(timer);
                    return reject('StarrFantasyEnhanced: Game failed to load, please try again later.');
                }
            } else {
                clearInterval(timer);
                return resolve('StarrFantasyEnhanced: Game loading completed!');
            }
        }, 5000);
    });
}

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
}