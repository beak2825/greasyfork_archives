// ==UserScript==
// @name        抖音清空点赞
// @namespace   Violentmonkey Scripts
// @match       https://www.douyin.com/user/self?showTab=*
// @grant       none
// @version     1.1.1
// @author      Kalicyh
// @license     MIT
// @description 2024/2/17 13:14:22
// @downloadURL https://update.greasyfork.org/scripts/487497/%E6%8A%96%E9%9F%B3%E6%B8%85%E7%A9%BA%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/487497/%E6%8A%96%E9%9F%B3%E6%B8%85%E7%A9%BA%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let key = JSON.parse(localStorage.getItem('security-sdk/s_sdk_cert_key')).data.replace(/^pub\./, '');
    let max_cursorTemp = 0;
    let intervalId = null;
    let executionCount = 0;
    let notificationCounter = 0;

    function startUnlike() {
        intervalId = setInterval(() => {
        fetch(`https://www.douyin.com/aweme/v1/web/aweme/favorite/?device_platform=webapp&aid=6383&count=999&max_cursor=${max_cursorTemp}`, {
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then((response) => {
            console.log("Response received:", response);
            response.json().then(({ aweme_list, max_cursor }) => {
                console.log("aweme_list:", aweme_list);
                console.log("max_cursor:", max_cursor);
                max_cursorTemp = max_cursor;
                aweme_list.map(({ aweme_id }) => {
                    fetch("https://www.douyin.com/aweme/v1/web/commit/item/digg/?aid=6383", {
                        "headers": {
                            "accept": "application/json, text/plain, */*",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "bd-ticket-guard-ree-public-key": key,
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        "referrer": "https://www.douyin.com/user/self?modal_id=7308336895358930212&showTab=like",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": `aweme_id=${aweme_id}&item_type=0&type=0`,
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    });
                    executionCount++;
                    notificationCounter++;
                    if (notificationCounter >= 10) {
                        showNotification(executionCount);
                        notificationCounter = 0;
                    }
                });
            });
        }).catch(error => {
            console.error("Error:", error);
        });
    }, 1500);
    }

    function stopUnlike() {
        clearInterval(intervalId);
        intervalId = null;
    }

    function createSwitch() {
        const switchContainer = document.createElement('div');
        switchContainer.style.position = 'fixed';
        switchContainer.style.top = '15px';
        switchContainer.style.right = '310px';
        switchContainer.style.zIndex = '9999';

        const switchLabel = document.createElement('label');
        switchLabel.style.position = 'relative';
        switchLabel.style.display = 'inline-block';
        switchLabel.style.width = '30px';
        switchLabel.style.height = '17px';

        const switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.style.opacity = '0';
        switchInput.style.width = '0';
        switchInput.style.height = '0';

        const slider = document.createElement('span');
        slider.style.position = 'absolute';
        slider.style.cursor = 'pointer';
        slider.style.top = '0';
        slider.style.left = '0';
        slider.style.right = '0';
        slider.style.bottom = '0';
        slider.style.backgroundColor = '#ccc';
        slider.style.borderRadius = '17px';
        slider.style.transition = '0.4s';

        const round = document.createElement('span');
        round.style.position = 'absolute';
        round.style.height = '13px';
        round.style.width = '13px';
        round.style.left = '1px';
        round.style.bottom = '2px';
        round.style.backgroundColor = 'white';
        round.style.borderRadius = '50%';
        round.style.transition = '0.4s';

        switchLabel.appendChild(switchInput);
        switchLabel.appendChild(slider);
        switchLabel.appendChild(round);
        switchContainer.appendChild(switchLabel);

        switchInput.addEventListener('change', (event) => {
            if (event.target.checked) {
                startUnlike();
                slider.style.backgroundColor = '#4CAF50'; // Green background color
                round.style.transform = 'translateX(15px)';
            } else {
                stopUnlike();
                slider.style.backgroundColor = '#ccc'; // Default background color
                round.style.transform = 'translateX(0)';
            }
        });

        document.body.appendChild(switchContainer);
    }

    function showNotification(count) {
        const notification = document.createElement('div');
        notification.textContent = `已取消点赞 ${count} 个视频`;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(0, 128, 0, 0.7)';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.color = '#fff';
        notification.style.zIndex = '9999';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    createSwitch();
})();