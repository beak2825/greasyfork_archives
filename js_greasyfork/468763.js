// ==UserScript==
// @name         Lemmy Federation Awareness
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Color posts and comments based on moderation rules of the origin server
// @author       CodingAndCoffee
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lemmy.world
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468763/Lemmy%20Federation%20Awareness.user.js
// @updateURL https://update.greasyfork.org/scripts/468763/Lemmy%20Federation%20Awareness.meta.js
// ==/UserScript==

(function() {
    'use strict';

    'use strict';
    //Thank you God!
    var isLemmy;
    try {
        isLemmy = document.head.querySelector("[name~=Description][content]").content === "Lemmy";
    } catch (_er) {
        isLemmy = false;
    }

    const hasStrictModerationRules = [
        'beehaw.org'
    ];

    const kBinSites = [
        'kbin.social',
        'fedia.io',
        'karab.in',
        'readit.buzz'
    ];

    function isStrictlyModerated(hostname) {
        return hasStrictModerationRules.indexOf(hostname) !== -1;
    }

    function isKbin(hostname) {
        return kBinSites.indexOf(hostname) !== -1;
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

    function colorizeCommentsAndPosts() {
        document.querySelectorAll('.post-listing').forEach(function(post) {
            if (typeof post.dataset['isColorized'] === 'string') {
                return;
            }

            var userInfo = post.querySelector('a.text-info');
            var hostname;
            var userTitle = userInfo.title;
            if (userTitle.substring(1).indexOf('@') === -1) {
                hostname = window.location.hostname;
            } else {
                hostname = userTitle.split('@').reverse()[0];
            }
            post.setAttribute('data-hostname', hostname);

            if (isStrictlyModerated(hostname)) {
                post.setAttribute('data-is-strictly-moderated', true);
            } else if (isKbin(hostname)) {
                post.setAttribute('data-is-kbin', true);
            } else if (hostname !== window.location.hostname) {
                post.setAttribute('data-is-federated-content', true);
            }
            post.setAttribute('data-is-colorized', true);
        });

        document.querySelectorAll('.comments .comment article').forEach(function(comment) {
            if (typeof comment.dataset['isColorized'] === 'string') {
                return;
            }

            var userInfo = comment.querySelector('a.text-info');
            if (!userInfo) {
                var commentTitle = comment.querySelector('div.d-flex span.mx-1');
                userInfo = commentTitle.nextSibling;
            }
            if (userInfo) {
                var userTitle = userInfo.title;
                var userHostname;
                if (userTitle.substring(1).indexOf('@') === -1) {
                    userHostname = window.location.hostname;
                } else {
                    userHostname = userInfo.title.split('@').reverse()[0];
                }

                if (isStrictlyModerated(userHostname)) {
                    comment.setAttribute('data-is-strictly-moderated', true);
                } else if (isKbin(userHostname)) {
                    comment.setAttribute('data-is-kbin', true);
                } else if (userHostname !== window.location.hostname) {
                    comment.setAttribute('data-is-federated-content', true);
                }
                comment.setAttribute('data-is-colorized', true);
            }
        });
    }

    if (isLemmy) {
        GM_addStyle('[data-is-strictly-moderated="true"] { background-color: rgba(55, 20, 20, 1.0); padding: 2px; border-radius: 5px; }');
        GM_addStyle('[data-is-federated-content="true"] { background-color: rgba(20, 45, 20, 1.0); padding: 2px; border-radius: 5px; }');
        GM_addStyle('[data-is-kbin="true"] { background-color: rgba(25, 25, 35, 1.0); padding: 2px; border-radius: 5px; }');

        //window.colorizeCommentsAndPosts = colorizeCommentsAndPosts;
        setInterval(colorizeCommentsAndPosts, 50);
    }


})();