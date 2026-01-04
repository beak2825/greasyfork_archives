// ==UserScript==
// @name         wckfxhs
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  用于测试
// @author       You
// @match        https://*/*
// @grant        unsafeWindow
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquerdescirptiony.min.js
// @include      https://ark.xiaohongshu.com/app-order/dispatch/waybill/wait
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489582/wckfxhs.user.js
// @updateURL https://update.greasyfork.org/scripts/489582/wckfxhs.meta.js
// ==/UserScript==

// 等待网页完成加载
   (function () {
        'use strict';
        setTimeout(function () {
            var targetElement = document.querySelector('.table-op-row');
            console.log('targetElement', targetElement);
            if (targetElement) {
                var newButton = document.createElement('button');
                newButton.textContent = '打开小眼睛';
                newButton.style.marginLeft = '10px';
                newButton.classList.add('d-button');
                newButton.classList.add('d-button-default');
                newButton.classList.add('d-button-with-content');
                newButton.classList.add('--color-static');
                newButton.classList.add('bold');
                newButton.classList.add('--color-bg-primary');
                newButton.classList.add('--color-white');
                newButton.addEventListener('click', function () {
                    var elements = document.querySelectorAll('img[data-v-589d67da]');
                    for (var i = 0; i < elements.length; i++) {
                        var element = elements[i];
                        var clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                        });
                        element.dispatchEvent(clickEvent);
                    }
                });
                targetElement.appendChild(newButton);
            } else {
                console.error('Target element not found.');
            }
        }, 5000);
    })();