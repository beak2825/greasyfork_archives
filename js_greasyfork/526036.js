// ==UserScript==
// @name         Xat Bigger Chat, No Ads, Or Bottom of chat
// @namespace    http://tampermonkey.net/
// @version      2.69
// @description  Adjust the navbar to simplify and add images to Help and Trade links
// @author       You
// @match        https://xat.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526036/Xat%20Bigger%20Chat%2C%20No%20Ads%2C%20Or%20Bottom%20of%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/526036/Xat%20Bigger%20Chat%2C%20No%20Ads%2C%20Or%20Bottom%20of%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration options
    const config = {
        hidePromoFrame: true,
        modifySVGColor: true,
        removeBottomTabs: true,
        centerContent: true,
        removeElements: true,
        simplifyNavbar: true
    };

    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    function hidePromoFrame() {
        document.querySelectorAll('iframe[src*="abx/abx.html"]').forEach(iframe => {
            iframe.style.display = 'none';
        });
    }

    function modifySVGColor() {
        document.querySelectorAll('img[src*="xatplanet.svg"], img[src*="xatsat.svg"]').forEach(svgImage => {
            svgImage.style.filter = 'grayscale(100%) contrast(150%) brightness(90%)';
        });
    }

    function removeBottomTabs() {
        waitForElement('#bottomTabs', function(bottomTabs) {
            bottomTabs.remove();
        });
    }

    function centerContent() {
        GM_addStyle(`
            .row.justify-content-center.no-gutters {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 80vh;
                margin: 0;
            }
            #embedframe {
                margin: auto;
                height: 786px;
                width: 100vw;
            }
            #adframe, #embedframe, #promoframe {
                max-width: 1128px;
                border: none;
                overflow: hidden;
            }
        `);
    }

    function removeElements() {
        waitForElement('#groupUserContent', function(groupUserContent) {
            groupUserContent.remove();
        });

        waitForElement('#navBottom', function(navBottom) {
            navBottom.remove();
        });
    }

    function simplifyNavbar() {
        waitForElement('.navbar-nav.ml-auto', function(navbar) {
            const helpLink = document.createElement('li');
            helpLink.className = 'nav-item';
            helpLink.innerHTML = `
                <a class="nav-link" href="https://xat.com/_help" target="_blank">
                    <img class="mr-2" src="/content/web/R00205//img/navbar/help.svg" alt="help" width="16">
                    <span data-localize="web.help">help</span>
                </a>
            `;
            navbar.appendChild(helpLink);

            const tradeLink = document.createElement('li');
            tradeLink.className = 'nav-item';
            tradeLink.innerHTML = `
                <a class="nav-link" href="https://xat.com/_trade" target="_blank">
                    <img class="mr-2" src="/content/web/R00205//img/navbar/trade.svg" alt="trade" width="16">
                    <span data-localize="web.trade">trade</span>
                </a>
            `;
            navbar.appendChild(tradeLink);

            const groupsDropdown = document.getElementById('navGroups');
            if (groupsDropdown) {
                groupsDropdown.parentElement.removeChild(groupsDropdown);
            }

            const mobileLink = document.getElementById('navMobile');
            if (mobileLink) {
                mobileLink.parentElement.removeChild(mobileLink);
            }

            const langLink = document.getElementById('navLang');
            if (langLink) {
                langLink.parentElement.removeChild(langLink);
            }
        });
    }

    // Delay execution and check config settings before applying changes
    setTimeout(() => {
        if (config.removeElements) removeElements();
        if (config.hidePromoFrame) hidePromoFrame();
        if (config.modifySVGColor) modifySVGColor();
        if (config.removeBottomTabs) removeBottomTabs();
        if (config.centerContent) centerContent();
        if (config.simplifyNavbar) simplifyNavbar();
    }, 1000);
})();
