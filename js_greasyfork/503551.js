// ==UserScript==
// @name         Screenshoter tiggo pro max 8 pro
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  ...
// @author       спермочка
// @match        https://lzt.market/user/payments
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @resource     screenshotStyle https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css
// @downloadURL https://update.greasyfork.org/scripts/503551/Screenshoter%20tiggo%20pro%20max%208%20pro.user.js
// @updateURL https://update.greasyfork.org/scripts/503551/Screenshoter%20tiggo%20pro%20max%208%20pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(GM_getResourceText('screenshotStyle'));

    function createScreenshotButton(targetDiv) {
        const button = document.createElement('button');
        button.textContent = '📸 Скачать чек';
        button.style.padding = '5px 10px';
        button.style.marginTop = '25px';
        button.style.backgroundColor = '#2BAD72';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1';

        targetDiv.style.position = 'relative';
        targetDiv.appendChild(button);

        button.addEventListener('click', () => {
            if (typeof html2canvas === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                script.onload = () => captureScreenshot(targetDiv);
                document.head.appendChild(script);
            } else {
                captureScreenshot(targetDiv);
            }
        });
    }

    function captureScreenshot(targetDiv) {
        const wrapper = document.createElement('div');

        targetDiv.parentNode.insertBefore(wrapper, targetDiv);
        wrapper.appendChild(targetDiv);

        const originalBackground = targetDiv.style.backgroundColor;
        targetDiv.style.backgroundColor = 'rgba(39, 39, 39, 1)';

        html2canvas(wrapper, {
            backgroundColor: null,
            scale: 2,
        }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'screenshot.png';
            link.click();

            targetDiv.style.backgroundColor = originalBackground;
            wrapper.parentNode.insertBefore(targetDiv, wrapper);
            wrapper.remove();
        }).catch(error => {
            console.error('Error capturing screenshot:', error);
            targetDiv.style.backgroundColor = originalBackground;
            wrapper.parentNode.insertBefore(targetDiv, wrapper);
            wrapper.remove();
        });
    }

    window.addEventListener('load', () => {
        const paymentDivs = document.querySelectorAll('div.item');
        paymentDivs.forEach(createScreenshotButton);
    });
})();
