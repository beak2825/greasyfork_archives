// ==UserScript==
// @name         Статистика с Плавающим Окном
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Парсит информацию с указанных URL и выводит ее в отдельном окне
// @author       QIYANA
// @match        https://zelenka.guru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @license MIT
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/494897/%D0%A1%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0%20%D1%81%20%D0%9F%D0%BB%D0%B0%D0%B2%D0%B0%D1%8E%D1%89%D0%B8%D0%BC%20%D0%9E%D0%BA%D0%BD%D0%BE%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/494897/%D0%A1%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0%20%D1%81%20%D0%9F%D0%BB%D0%B0%D0%B2%D0%B0%D1%8E%D1%89%D0%B8%D0%BC%20%D0%9E%D0%BA%D0%BD%D0%BE%D0%BC.meta.js
// ==/UserScript==

(function() {
    const USER_URI = document.querySelector('.Menu.HeaderMenu.JsOnly .blockLinksList a').href;
    'use strict';
    function createPopupWindow(data) {
        let popupWindow = document.getElementById('customPopupWindow');
        if (!popupWindow) {
            popupWindow = document.createElement('div');
            popupWindow.id = 'customPopupWindow';
            popupWindow.style.position = 'fixed';
            popupWindow.style.top = GM_getValue('popupWindowTop', '50px');
            popupWindow.style.left = GM_getValue('popupWindowLeft', '50px');
            popupWindow.style.width = '300px';
            popupWindow.style.height = 'auto';
            popupWindow.style.background = 'grey';
            popupWindow.style.color = 'white';
            popupWindow.style.border = '1px solid black';
            popupWindow.style.zIndex = '10000';
            popupWindow.style.padding = '10px';
            popupWindow.style.overflow = 'auto';
            popupWindow.style.cursor = 'move';
            popupWindow.style.borderRadius = '10px';
            document.body.appendChild(popupWindow);

            popupWindow.addEventListener('mousedown', function(event) {
                event.preventDefault();
                let startX = event.clientX;
                let startY = event.clientY;
                let startTop = parseInt(document.defaultView.getComputedStyle(popupWindow).top, 10);
                let startLeft = parseInt(document.defaultView.getComputedStyle(popupWindow).left, 10);

                function onMouseMove(event) {
                    let newX = startLeft + event.clientX - startX;
                    let newY = startTop + event.clientY - startY;
                    popupWindow.style.left = newX + 'px';
                    popupWindow.style.top = newY + 'px';
                }

                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    GM_setValue('popupWindowTop', popupWindow.style.top);
                    GM_setValue('popupWindowLeft', popupWindow.style.left);
                }

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        popupWindow.textContent = data;
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: USER_URI,
        onload: function(response1) {
            if (response1.status === 200) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: USER_URI+"likes",
                    onload: function(response2) {
                        if (response2.status === 200) {
                            const parser1 = new DOMParser();
                            const htmlDoc1 = parser1.parseFromString(response1.responseText, "text/html");
                            const parser2 = new DOMParser();
                            const htmlDoc2 = parser2.parseFromString(response2.responseText, "text/html");

                            const countsModule1 = htmlDoc1.querySelector('.counts_module');
                            const countsModule2 = htmlDoc2.querySelector('#pageDescription');

                            if (countsModule1 && countsModule2) {
                                const subscription = countsModule1.querySelector('a[href="account/following"]');
                                const follower = countsModule1.querySelector('a[href="qiyanaitsme/followers"]');
                                if (subscription) subscription.remove();
                                if (follower) follower.remove();

                                let dataToDisplay = countsModule1.textContent + '\n';
                                dataToDisplay += countsModule2.textContent.trim();

                                dataToDisplay = dataToDisplay.replace(/(\d+)\s([^\d]+)/g, '$1 $2\n').trim();

                                createPopupWindow(dataToDisplay);
                            }
                        } else {
                            console.error("Ошибка при загрузке страницы likes");
                        }
                    }
                });
            } else {
                console.error("Ошибка при загрузке страницы");
            }
        }
    });
})();