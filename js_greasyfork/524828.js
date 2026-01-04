// ==UserScript==
// @name         MopeKiller
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  MopeIoScript
// @author       @KareKaren
// @match        https://mope.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mope.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524828/MopeKiller.user.js
// @updateURL https://update.greasyfork.org/scripts/524828/MopeKiller.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.getElementById('gCanvas').style.cursor = 'url(https://cur.cursors-4u.net/others/oth-2/oth115.cur), default';
 var div = document.getElementById('moneyRect');
    if (div) {
        div.parentNode.removeChild(div);
    }
    const statusContainer = document.createElement('div');
    statusContainer.style.position = 'fixed';
    statusContainer.style.top = '10px';
    statusContainer.style.right = '10px';
    statusContainer.style.zIndex = '9999';
    statusContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    statusContainer.style.color = 'white';
    statusContainer.style.padding = '15px';
    statusContainer.style.borderRadius = '10px';
    statusContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    statusContainer.style.fontFamily = 'Arial, sans-serif';
    statusContainer.style.fontSize = '14px';

    const rightMouseStatus = document.createElement('div');
    rightMouseStatus.innerText = 'AutoDive: Остановлено';
    rightMouseStatus.style.fontWeight = 'bold';
    rightMouseStatus.style.color = 'red';
    statusContainer.appendChild(rightMouseStatus);

    const leftMouseStatus = document.createElement('div');
    leftMouseStatus.innerText = 'AutoShift: Остановлено';
    leftMouseStatus.style.fontWeight = 'bold';
    leftMouseStatus.style.color = 'red';
    statusContainer.appendChild(leftMouseStatus);

    document.body.appendChild(statusContainer);

    let isRightMouseDown = false;
    let isLeftMouseDown = false;
    let rightMouseInterval, leftMouseInterval;

    function startRightMouseHold() {
        if (!isRightMouseDown) {
            isRightMouseDown = true;
            rightMouseStatus.innerText = 'AutoDive: Запущено';
            rightMouseStatus.style.color = 'green';
            rightMouseInterval = setInterval(() => {
                var event = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 2
                });
                document.getElementById('gCanvas').dispatchEvent(event);
            }, 100);
        }
    }

    function stopRightMouseHold() {
        if (isRightMouseDown) {
            isRightMouseDown = false;
            rightMouseStatus.innerText = 'AutoDive: Остановлено';
            rightMouseStatus.style.color = 'red';
            clearInterval(rightMouseInterval);
            var event = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 2
            });
            document.getElementById('gCanvas').dispatchEvent(event);
        }
    }

    function startLeftMouseHold() {
        if (!isLeftMouseDown) {
            isLeftMouseDown = true;
            leftMouseStatus.innerText = 'AutoShift: Запущено';
            leftMouseStatus.style.color = 'green';
            leftMouseInterval = setInterval(() => {
                var event = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0 
                });
                document.getElementById('gCanvas').dispatchEvent(event);
            }, 100); 
        }
    }

    function stopLeftMouseHold() {
        if (isLeftMouseDown) {
            isLeftMouseDown = false;
            leftMouseStatus.innerText = 'AutoShift: Остановлено';
            leftMouseStatus.style.color = 'red'; 
            clearInterval(leftMouseInterval);
            var event = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0 
            });
            document.getElementById('gCanvas').dispatchEvent(event);
        }
    }

    window.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === '1') {
            if (isRightMouseDown) {
                stopRightMouseHold();
            } else {
                startRightMouseHold();
            }
            event.preventDefault(); 
        } else if (event.altKey && event.key === '2') {
            if (isLeftMouseDown) {
                stopLeftMouseHold();
            } else {
                startLeftMouseHold();
            }
            event.preventDefault(); 
        }
    });
})();
