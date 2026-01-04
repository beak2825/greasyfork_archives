// ==UserScript==
// @name         APM 快速选择项目
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  apm 快速选择项目
// @author       HolmesZhao
// @match        *://apm.zuoyebang.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zuoyebang.cc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466553/APM%20%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9%E9%A1%B9%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/466553/APM%20%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9%E9%A1%B9%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // Welcome to Cursor
    var gScheme = ""
    // Create an array of button configurations
    const buttonConfigs = [
        { text: '喵喵机 APM', color: 'white', url: `https://apm.zuoyebang.cc/apmplus/app/crash/list?aid=10000172` },
        { text: '喵喵机测试 APM', color: 'white', url: `https://apm.zuoyebang.cc/apmplus/app/crash/list?aid=10000599` },
        { text: '喵喵错题 APM', color: 'white', url: `https://apm.zuoyebang.cc/apmplus/app/crash/list?aid=10000225` },
        { text: '碳氧 APM', color: 'white', url: `https://apm.zuoyebang.cc/apmplus/app/crash/list?aid=10000013` },
    ];
    // Check if variable is a function
    const isFunction = (variable) => {
        return typeof variable === 'function';
    };
    const bakOnload = window.onload;
    window.onload = function () {
        if (isFunction(bakOnload)) {
            bakOnload();
        }

        const url = window.location.href;
        const isHttps = url.indexOf('https') !== -1;
        gScheme = isHttps ? "https" : "http"
        // Create a button element
        const mainButton = document.createElement('button');
        mainButton.textContent = '选择页面';
        mainButton.style.position = 'fixed';
        mainButton.style.top = '0';
        mainButton.style.left = '50%';
        mainButton.style.transform = 'translate(-50%, 0)';
        mainButton.style.backgroundColor = 'white';
        mainButton.style.padding = '10px';
        mainButton.style.borderRadius = '10px';
        mainButton.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.3)'; // Decreased shadow size
        mainButton.style.zIndex = '9999'; // Set z-index to 9999 to bring it to the front
        let isPopupOpen = false;

        // Create a popup element
        const popup = document.createElement('div');
        popup.style.display = 'none';
        popup.style.position = 'absolute';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.padding = '20px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.3)'; // Decreased shadow size
        popup.style.zIndex = '9999'; // Set z-index to 9999 to bring it to the front

        // Loop through the button configurations and create a button for each one
        buttonConfigs.forEach((config) => {
            const button = document.createElement('button');
            button.textContent = config.text;
            button.style.backgroundColor = config.color;
            button.style.margin = '10px';
            button.style.padding = '10px';
            button.style.borderRadius = '10px';
            button.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.3)'; // Decreased shadow size
            popup.appendChild(button);

            button.addEventListener('click', async () => {
                console.log(config.data);
                // add your click method here
                //await chooseBusiness(config.data);
                if (config.url != null && config.url.indexOf('http') !== -1) {
                    if (config.url.indexOf('https') !== -1) {
                        config.url = config.url.replace('https', gScheme)
                    } else if (config.url.indexOf('http') !== -1) {
                        config.url = config.url.replace('http', gScheme)
                    }
                    window.location.href = config.url
                }
            });
        });

        // Add an event listener to the main button to show the popup when clicked
        mainButton.addEventListener('click', () => {
            if (isPopupOpen) {
                popup.style.display = 'none';
                isPopupOpen = false;
            } else {
                popup.style.display = 'block';
                isPopupOpen = true;
            }
        });

        // Add the main button and popup to the page
        document.body.appendChild(mainButton);
        document.body.appendChild(popup);

        // Make the main button draggable with smoother movement
        makeDraggable(mainButton);

        function makeDraggable(el) {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;
            let dragStartX;
            let dragStartY;

            el.addEventListener('mousedown', dragStart);
            el.addEventListener('mouseup', dragEnd);
            el.addEventListener('mousemove', drag);

            function dragStart(e) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                dragStartX = e.clientX;
                dragStartY = e.clientY;

                if (e.target === el) {
                    isDragging = true;
                }
            }

            function dragEnd(e) {
                initialX = currentX;
                initialY = currentY;

                isDragging = false;
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();

                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;

                    xOffset = currentX;
                    yOffset = currentY;

                    const dragDistanceX = e.clientX - dragStartX;
                    const dragDistanceY = e.clientY - dragStartY;
                    const dragDistance = Math.sqrt(dragDistanceX * dragDistanceX + dragDistanceY * dragDistanceY);

                    if (dragDistance > 5) {
                        setTranslate(currentX, currentY, el);
                    }
                }
            }

            function setTranslate(xPos, yPos, el) {
                el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
            }
        }
    }

    async function chooseBusiness(data) {
        const body = new URLSearchParams(data).toString();
        const response = await fetch(`${gScheme}://pms.zuoyebang.cc/testplatapi/business/setrecentbusiness`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/x-www-form-urlencoded",
                "proxy-connection": "keep-alive",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "http://pms.zuoyebang.cc/head/BugListPage?currentPage=1",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": body,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        const responseData = await response.json();
        console.log(responseData);
    }


})();