// ==UserScript==
// @name         Copy Wiki URL on Wikiwand
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allows to quickly copy wiki url on wikiwand page.
// @author       psxvoid
// @match        https://www.wikiwand.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikiwand.com
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442394/Copy%20Wiki%20URL%20on%20Wikiwand.user.js
// @updateURL https://update.greasyfork.org/scripts/442394/Copy%20Wiki%20URL%20on%20Wikiwand.meta.js
// ==/UserScript==

(function() {
    'use strict';

        GM_registerMenuCommand('Copy Wiki URL', () => {
            const wikiwandUrl = document.location.href;

            const matches = /wikiwand\.com\/(?<lang>.*?)\/(?:articles)\/(?<articleName>.*)/.exec(wikiwandUrl);
            const { lang, articleName } = matches.groups;
            const wikiUrl = `https://${lang}.wikipedia.org/wiki/${articleName}`;

            GM_setClipboard(wikiUrl);
    }, 'r');
})();