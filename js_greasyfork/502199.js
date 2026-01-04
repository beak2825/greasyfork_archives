// ==UserScript==
// @name         Mydealz Popup Modifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ändert die Größe des Benachrichtiguns- und Nachrichtenpopups
// @match        https://www.mydealz.de/*
// @grant        GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/502199/Mydealz%20Popup%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/502199/Mydealz%20Popup%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .popover--layout-s.popover--visible.zIndex--fixed.popover--arrow-navDropDownPrimary.popover--border-navDropDownPrimary.popover--menu.popover {
            width: 300px !important;
            height: 600px !important;
            max-width: 300px !important;
            max-height: 600px !important;
            overflow-y: auto !important;
            box-shadow: -5px 0 10px -5px rgba(0, 0, 0, 0.5) !important;
        }

        .flex--dir-col.overscroll--containY.notifications-content.flex {
            height: 100% !important;
            max-height: 600px !important;
        }
    `);

    function handlePopupScroll() {
        const popup = document.querySelector('.popover--layout-s.popover--visible');
        if (popup && popup.scrollHeight - popup.scrollTop <= popup.clientHeight + 100) {
            // Hier die Logik zum Nachladen von Inhalten implementieren
            console.log('Lade mehr Inhalte...');
        }
    }

    function modifyPopup() {
        const popup = document.querySelector('.popover--layout-s.popover--visible');
        if (popup) {
            popup.removeEventListener('scroll', handlePopupScroll);
            popup.addEventListener('scroll', handlePopupScroll);
        }
    }

    // Beobachter für dynamisch hinzugefügte Popups
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.classList && node.classList.contains('popover--visible')) {
                    setTimeout(modifyPopup, 100);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial ausführen, falls das Popup bereits vorhanden ist
    setTimeout(modifyPopup, 500);
})();