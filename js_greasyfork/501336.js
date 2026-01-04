// ==UserScript==
// @name         IW auto battle
// @namespace    ponchain
// @version      0.0.1
// @description  铁木自动战斗
// @author       ponchain
// @match        https://ironwoodrpg.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501336/IW%20auto%20battle.user.js
// @updateURL https://update.greasyfork.org/scripts/501336/IW%20auto%20battle.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let monsterObserver;
    let threshold = null;
    function monitorElement(selector, callback, interval = 1000) {
        let timerId;
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                clearTimeout(timerId);
                timerId = null;
            } else {
                timerId = setTimeout(checkElement, interval);
            }
        };

        timerId = setTimeout(checkElement, interval);
    }
    // 停止战斗
    function stopBattle() {
        return new Promise(resolve => {
            const stopBtn = document.querySelector('.action-stop.ng-star-inserted');
            if (stopBtn) {
                stopObserving()
                stopBtn.click();
                resolve()

            }
        })

    }
    function startBattle() {
        return new Promise((resolve => {
            monitorElement('.action-start.ng-star-inserted', (startBtn) => {
                setTimeout(() => {
                    console.log(234);
                    startBtn.click();
                    startObserving()
                    resolve()
                }, 800); //避免频繁触发,再延迟800ms
            });
        }))

    }
    // 回调函数，当 .monster 元素被插入时执行
    function onMonsterInserted(mutationsList) {
        console.log('监听');
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('interface')) {
                        const healText = (
                            document.querySelector('.interface').querySelector('.health') || {
                                innerText: '0',
                            }
                        ).innerText;
                        const regex = /(\d+)(?:\s*[a-zA-Z]*)?/;
                        const healVal = +healText.match(regex)[1];
                        console.log(healVal, threshold);
                        if (healVal < threshold) {
                            stopBattle().then(resolve => {
                                // startObserving()
                                startBattle()
                            })

                        }
                    }
                });
            }
        }
    }

    // 开始监听
    function startObserving() {
        monitorElement('.interfaces.ng-star-inserted', (interfacesElement) => {
            if (!monsterObserver) {
                monsterObserver = new MutationObserver(onMonsterInserted);
                monsterObserver.observe(interfacesElement, { childList: true });
            }

        });
    }

    // 停止监听
    function stopObserving() {
        if (monsterObserver) {
            monsterObserver.disconnect();
            monsterObserver = null;
        }
    }

    // 按钮点击事件处理
    function toggleMonitoring() {
        if (monsterObserver) {
            stopObserving();
            button.innerText = '开始';
        } else {
            const inputValue = prompt('请输入血量阈值:');
            threshold = parseInt(inputValue, 10);
            if (!isNaN(threshold)) {
                startBattle();
                button.innerText = '停止';
            } else {
                alert('请输入有效的数字');
            }
        }
    }

    // 动态插入按钮
    const button = document.createElement('button');
    button.id = 'toggle-button';
    button.innerText = '开始';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.left = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '8px';
    button.style.backgroundColor = '#4CAF50';
    button.addEventListener('click', toggleMonitoring);
    document.body.appendChild(button);
})();