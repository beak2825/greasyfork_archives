// ==UserScript==
// @name         Whatsapp TextArea Resize
// @namespace    https://github.com/kenng/whatsapp-chatbox-resizer
// @version      1.0
// @description  resizable chatbox text area
// @author       Ken Ng
// @match        https://web.whatsapp.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427888/Whatsapp%20TextArea%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/427888/Whatsapp%20TextArea%20Resize.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function () {
    ('use strict');
    const resizerSize = 10;

    function prependResizer() {
        const resizer = document.createElement('div');
        resizer.className = 'iw-resizer';
        resizer.style.height = `${resizerSize}px`;
        resizer.style.backgroundColor = '#ccc';
        resizer.style.cursor = 'move';
        const footer = document.getElementsByTagName('footer')[0];
        footer.prepend(resizer);
    }

    function resize(e) {
        document.body.style.cursor = 'move';
        const chatboxElem = document.querySelector('footer [contenteditable]');
        const chatboxElemParen = chatboxElem.parentElement.parentElement;
        chatboxElem.style.maxHeight = 'initial';
        chatboxElem.parentElement.style.maxHeight = '100%';

        const min_height = 42;
        const original_height = parseFloat(
            getComputedStyle(chatboxElemParen, null)
                .getPropertyValue('height')
                .replace('px', ''),
        );
        const original_y = chatboxElemParen.getBoundingClientRect().top;
        const new_y = original_y - e.pageY - resizerSize;
        const height = original_height + new_y;

        if (height > min_height) {
            chatboxElemParen.style.height = height + 'px';
            chatboxElemParen.style.top = new_y + 'px';
        }
        // console.log(height, original_height, new_y, original_y, e.pageY);
    }

    function stopResize() {
        document.body.style.cursor = 'initial';
        window.removeEventListener('mousemove', resize);
    }

    function evMouseDown(ev) {
        ev.preventDefault();

        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    }

    function makeResizableDiv() {
        const resizers = document.getElementsByClassName('iw-resizer');

        for (let i = 0; i < resizers.length; i++) {
            const currentResizer = resizers[i];
            currentResizer.removeEventListener('mousedown', evMouseDown);
            currentResizer.addEventListener('mousedown', evMouseDown);
        }
    }

    function init() {
        let mutationObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.previousSibling?.id === 'main') {
                    prependResizer();
                    makeResizableDiv();
                }
                // console.log(mutation);
            });
        });

        mutationObserver.observe(
            document.getElementById('app').querySelector('[tabindex].two'),
            {
                childList: true,
                subtree: true,
            },
        );
    }

    function checkIfLoaded() {
        setTimeout(function () {
            let pane = document.getElementById('pane-side');
            if (pane != null) {
                init();
            } else {
                checkIfLoaded();
            }
        }, 800);
    }
    checkIfLoaded();
})();
