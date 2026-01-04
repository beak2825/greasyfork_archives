// ==UserScript==
// @name         Chat Dark Mode for insagirl-toto
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  [수정] 배경색을 #1b1b1b로 변경하여 눈의 피로 완화
// @author       lolca12
// @match        https://insagirl-toto.appspot.com/chatting/lgic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525309/Chat%20Dark%20Mode%20for%20insagirl-toto.user.js
// @updateURL https://update.greasyfork.org/scripts/525309/Chat%20Dark%20Mode%20for%20insagirl-toto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyDarkMode() {
        // 배경색을 #353535로 변경
        document.body.style.backgroundColor = '#1b1b1b';
        document.body.style.color = 'white';

        const styles = `
            .backDiv {
                background-color: #1b1b1b !important;  // 변경
                display: inline-block !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            .talk {
                color: white !important;
                background-color: #1b1b1b !important;  // 변경
                padding: 5px !important;
                margin: 0 !important;
                display: inline !important;
            }
            .id {
                color: lightgray !important;
            }
            .my {
                background-color: #1b1b1b !important;  // 변경
            }
            .my .talk {
                background-color: #1b1b1b !important;  // 변경
            }
            .my .backDiv {
                background-color: #1b1b1b!important;  // 변경
                display: inline-block !important;
                width: 100% !important;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    applyDarkMode();

    const observer = new MutationObserver(() => {
        applyDarkMode();
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    observer.observe(targetNode, config);
})();