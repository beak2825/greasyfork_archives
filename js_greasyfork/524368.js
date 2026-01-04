// ==UserScript==
// @name         Mail.com Helper
// @namespace    ccn0
// @version      3
// @description  Quality of life changes to Mail.com
// @author       CCN0
// @license      MIT
// @match        *://*.mail.com/*
// @icon         https://s.uicdn.com/mailint/1.0.0/assets/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524368/Mailcom%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/524368/Mailcom%20Helper.meta.js
// ==/UserScript==

(function() {
    function mailMailMailMail() {
        function removeElements(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        };
        function fullScreenButtonButGood() { /*add this to the main thing if you want to use it, but it throws errors bc its always checking*/
            const fullscreenbutton = document.getElementById('fullscreen');
            fullscreenbutton.id = "";
            fullscreenbutton.setAttribute("onclick","document.getElementById('mail-detail').requestFullscreen()");
        }

        removeElements('[data-test^="actions-menu__item-premiummail"]');
        removeElements('[data-test^="actions-menu__item-games"]');
        removeElements('[data-test^="actions-menu__item-cloud"]');
        removeElements('[data-test^="actions-menu__item-ooeditor"]');
        removeElements('[data-test^="actions-menu__item-mailcheck"]');
        removeElements('[data-test^="actions-menu__item-blog"]');
        removeElements('[title^="Upgrade to mail.com Premium"]');
        removeElements('li[title^="Increase cloud storage"]');
        removeElements('[data-area^="features"]');
        removeElements('.search.widget');
        removeElements('.native-content-box-ad__iframe'); /*idk why ad block doesnt work*/
        removeElements('.ad');
        removeElements(`.piba-compact`);

        const links = document.querySelectorAll('a[href*="://deref-mail.com"]');

        links.forEach(function(link) {
            var originalHref = link.getAttribute('href');

            var url = new URL(originalHref);
            var redirectUrl = url.searchParams.get('redirectUrl');

            var decodedRedirectUrl = decodeURIComponent(redirectUrl);

            link.setAttribute('href', decodedRedirectUrl);
        });
    };
    setInterval(mailMailMailMail, 250);
})();