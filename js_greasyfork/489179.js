// ==UserScript==
// @name         拖拽搜索和打开链接
// @namespace    http://your.namespace.com
// @version      0.2
// @description  拖动搜索和打开链接
// @author       You
// @match        *://*/*
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489179/%E6%8B%96%E6%8B%BD%E6%90%9C%E7%B4%A2%E5%92%8C%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/489179/%E6%8B%96%E6%8B%BD%E6%90%9C%E7%B4%A2%E5%92%8C%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let selectedText = "";

    document.addEventListener('mousedown', function(event) {
        startX = event.clientX;
        startY = event.clientY;
        selectedText = getSelectedText();
        isDragging = true;
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;

            if (deltaX > 50) { // Adjust the threshold as needed
                if (selectedText) {
                    googleSearch(selectedText);
                } else {
                    openLink();
                }

                isDragging = false;
            }
        }
    });

    function getSelectedText() {
        return window.getSelection().toString();
    }

    function googleSearch(query) {
        GM_openInTab('https://www.google.com/search?q=' + encodeURIComponent(query), {
            active: false,
            insert: true,
            setParent: true
        });
    }

    function openLink() {
        const link = getLinkUnderCursor();
        if (link) {
            GM_openInTab(link, {
                active: false,
                insert: true,
                setParent: true
            });
        }
    }

    function getLinkUnderCursor() {
        const element = document.elementFromPoint(startX, startY);
        if (element.tagName === 'A' && element.href) {
            return element.href;
        }
        return null;
    }
})();