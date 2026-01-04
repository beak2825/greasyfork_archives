// ==UserScript==
// @name         Open Links in Gmail
// @namespace    https://wiki.gslin.org/wiki/Open_Links_in_Gmail
// @version      0.20210910.0
// @description  Open all matching links in Gmail using "i".
// @author       Gea-Suan Lin <darkkiller@gmail.com>
// @match        https://mail.google.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @require      https://greasyfork.org/scripts/38445-monkeyconfig/code/MonkeyConfig.js?version=251319
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/383064/Open%20Links%20in%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/383064/Open%20Links%20in%20Gmail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cfg = new MonkeyConfig({
        menuCommand: true,
        params: {
            match_regex: {
                type: 'text',
                default: '^https://github\.com/[^/]+/[^/]+/commit/',
            },
        },
        title: 'Open Links in Gmail',
    });

    let match_regex = new RegExp(cfg.get('match_regex'));
    window.addEventListener('keydown', ev => {
        if ('i' === ev.key) {
            for (let el of document.querySelectorAll('div[role="listitem"]:first-child a')) {
                let href = el.getAttribute('href');
                if (href.match(match_regex)) {
                    GM_openInTab(href, true);
                }
            }
        }
    });
})();
