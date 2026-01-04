// ==UserScript==
// @name           rotate-screen
// @namespace      http://tampermonkey.net/
// @version        1.0.0
// @author         Vanisoul
// @description    旋轉網頁, Ctrl + Alt + 方向鍵
// @match          *://*/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/483633/rotate-screen.user.js
// @updateURL https://update.greasyfork.org/scripts/483633/rotate-screen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function rotatePage(degrees) {
        const originalWidth = document.documentElement.clientWidth || window.innerWidth;
        const originalHeight = document.documentElement.clientHeight || window.innerHeight;
        let container = document.querySelector('.rotate-container');
        if (!container) {
            container = document.createElement('div');
            container.classList.add('rotate-container');
            while (document.body.firstChild) {
                container.appendChild(document.body.firstChild);
            }
            document.body.appendChild(container);
        }
        container.style.cssText = "";
        if (degrees === 90 || degrees === -90) {
            container.style.width = `${originalHeight}px`;
            container.style.height = `${originalWidth}px`;
            container.style.maxWidth = '100vh';
            container.style.maxHeight = '100vw';
            container.style.overflow = 'auto';
            container.style.position = 'absolute';
            container.style.top = '50%';
            container.style.left = '50%';
            container.style.transform = `translate(-50%, -50%) rotate(${degrees}deg)`;
        }
        else if (degrees === 180 || degrees === -180) {
            container.style.width = `${originalWidth}px`;
            container.style.height = `${originalHeight}px`;
            container.style.overflow = 'auto';
            container.style.position = 'absolute';
            container.style.top = '50%';
            container.style.left = '50%';
            container.style.transform = `translate(-50%, -50%) rotate(${degrees}deg)`;
        }
    }
    document.addEventListener('keydown', function (event) {
        const controlKey = event.ctrlKey;
        const altKey = event.altKey;
        const touchKey = controlKey && altKey;
        if (touchKey) {
            switch (event.key) {
                case "ArrowUp":
                    rotatePage(180);
                    break;
                case "ArrowDown":
                    rotatePage(0);
                    break;
                case "ArrowLeft":
                    rotatePage(90);
                    break;
                case "ArrowRight":
                    rotatePage(-90);
                    break;
            }
        }
    });

})();
