// ==UserScript==
// @name         Unpaywall meetup.com
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove paywall, unblur photos, enable scrolling, and re-enable dynamic content
// @author       louietyj
// @match        https://www.meetup.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531382/Unpaywall%20meetupcom.user.js
// @updateURL https://update.greasyfork.org/scripts/531382/Unpaywall%20meetupcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unPaywall() {
        document.querySelectorAll('div[role="dialog"]').forEach(el => {
            if (el.textContent.includes('Join Meetup+')) {
                el.style.display = 'none';
            }
        });
        document.querySelectorAll('div[data-slot="modal-overlay"]').forEach(el => {
            el.style.display = 'none';
        });
    }

    function unblurPhotos() {
        const elements = document.querySelectorAll('[class*="blur"]');
        elements.forEach(element => {
            Array.from(element.classList).forEach(cls => {
                if (cls.includes('blur')) {
                    element.classList.remove(cls);
                }
            });
        });
    }

    function enableScrolling() {
        const style = document.createElement('style');
        style.textContent = `
            html, body {
                overflow: auto !important;
                overflow-y: auto !important;
                position: static !important;
                height: auto !important;
            }
        `;
        document.head.appendChild(style);

        window.addEventListener('wheel', function (e) {
            e.stopImmediatePropagation();
        }, { capture: true });
    }

    function removeLocks() {
        const svgs = document.querySelectorAll('svg[data-src="https://secure.meetupstatic.com/next/images/design-system-icons/lock-outline.svg"]');
        svgs.forEach(svg => {
            svg.remove();
        });
    }

    function removeInert() {
        document.querySelectorAll('.inert, [inert]').forEach(el => {
            el.classList.remove('inert');
            el.removeAttribute('inert');
        });
    };

    function run() {
        unPaywall();
        unblurPhotos();
        enableScrolling();
        removeLocks();
        removeInert();
    }

    //window.addEventListener('load', run);
    const observer = new MutationObserver(run);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
