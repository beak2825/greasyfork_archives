// ==UserScript==
// @name         Valley AI Sidebar
// @namespace    https://blog.valley.town/@zeronox
// @version      1.0
// @description  Ctrl+Shift+F 단축키로 사이드바 메뉴를 토글합니다.
// @author       zeronox
// @license      MIT
// @match        https://www.valley.town/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=valley.town
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547559/Valley%20AI%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/547559/Valley%20AI%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
            event.preventDefault();
            const sidebarButton = document.querySelector('button.p-1\\.5.lg\\:hidden');
            if (sidebarButton) {
                console.log('사이드바 토글 버튼을 찾아 클릭했습니다.');
                sidebarButton.click();
            } else {
                console.log('사이드바 토글 버튼을 찾지 못했습니다.');
            }
        }
    });
})();