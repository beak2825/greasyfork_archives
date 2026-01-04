// ==UserScript==
// @name         Kbin Federation Awareness
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Color posts and comments based on moderation rules of the origin server
// @author       CodingAndCoffee
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468747/Kbin%20Federation%20Awareness.user.js
// @updateURL https://update.greasyfork.org/scripts/468747/Kbin%20Federation%20Awareness.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isKbin = (typeof(window.KBIN_POST_ID) === 'string');

    const hasStrictModerationRules = [
        'beehaw.org'
    ];

    function isStrictlyModerated(hostname) {
        return hasStrictModerationRules.indexOf(hostname) !== -1;
    }

    //special thanks to StackOverflow - the one true source of all code, amen.
    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleBy8626") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    if (isKbin) {
        GM_addStyle('[data-is-strictly-moderated="true"] { background-color: rgba(55, 20, 20, 1.0); }');
        GM_addStyle('[data-is-federated-content="true"] { background-color: rgba(20, 45, 20, 1.0); }');

        document.querySelectorAll('#content article.entry').forEach(function(article) {
            var hostname = new URL(article.querySelector('footer menu .dropdown li:nth-child(4) a').href).hostname;
            article.setAttribute('data-hostname', hostname);

            if (isStrictlyModerated(hostname)) {
                article.setAttribute('data-is-strictly-moderated', true);
            } else if (hostname !== window.location.hostname) {
                article.setAttribute('data-is-federated-content', true);
            }
        });

        document.querySelectorAll('.comments blockquote.entry-comment').forEach(function(comment) {
            var userInfo = comment.querySelector('header a:nth-child(1)');
            if (userInfo) {
                var userHostname = userInfo.title.split('@').reverse()[0];

                if (isStrictlyModerated(userHostname)) {
                    comment.setAttribute('data-is-strictly-moderated', true);
                } else if (userHostname !== window.location.hostname) {
                    comment.setAttribute('data-is-federated-content', true);
                }
            }
        });
    }

})();