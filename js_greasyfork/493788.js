// ==UserScript==
// @name         Sniffies Ad Block and UI Enhance
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license MIT
// @description  Remove ads from map and chat menu, also enhances UI by removing unnecessary stuff
// @author       NotApex
// @match        https://sniffies.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493788/Sniffies%20Ad%20Block%20and%20UI%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/493788/Sniffies%20Ad%20Block%20and%20UI%20Enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        document.querySelectorAll('div.overset.ng-tns-c3901889678-8').forEach(element => element.remove());
        document.querySelectorAll('div.overset-container.top-banner.house').forEach(element => element.remove());
        document.querySelectorAll('table.overset-copy-cta').forEach(element => element.remove());
        document.querySelectorAll('div.overset.ng-tns-c3901889678-9').forEach(element => element.remove());
        document.querySelectorAll('tr[data-testid="sniffiesChatRow"]').forEach(element => element.remove());

        document.querySelectorAll('div[class*="list-item-group"][class*="locked"]').forEach(element => {
            const buttons = element.querySelectorAll('button');
            if (buttons.length > 0 && buttons[0].textContent.trim() === 'Upgrade to Unlock') {
                element.remove();
            }
        });

        document.querySelectorAll('div.checkbox[tabindex="0"]').forEach(element => {
            const labelText = element.querySelector('label').textContent.trim();
            if (labelText === 'Information') {
                element.remove();
            }
        });

        document.querySelectorAll('div.lower-map-icon.travel-on-map.ng-tns-c922160418-11').forEach(element => element.remove());
        document.querySelectorAll('p.ng-tns-c3092893849-10').forEach(element => {
            const linkText = element.querySelector('a');
            if (linkText && linkText.getAttribute('data-testid') === 'mapFrameRegisterAccountLink') {
                element.remove();
            }
        });

        document.querySelectorAll('i[data-testid="sniffiesAngleRightButton"]').forEach(element => {
            element.remove();
        });

        document.querySelectorAll('div.nav-inline-icon.context-logo.ng-tns-c67989224-5').forEach(element => {
            element.style.pointerEvents = 'none';
        });

        document.querySelectorAll('button[data-testid="shopIcon"]').forEach(element => {
            element.remove();
        });

        document.querySelectorAll('modal[id="popup"]').forEach(element => {
            element.remove();
        });
    }

    const observer = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                removeElements();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
