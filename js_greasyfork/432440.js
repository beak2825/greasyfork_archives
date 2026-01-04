// ==UserScript==
// @name         Bad Dragon White/Blank Page Fix
// @namespace    https://greasyfork.org/en/scripts/432440-bad-dragon-white-blank-page-fix
// @version      0.1.5
// @description  Workaround for the white page & blank page bugs on Bad Dragon.
// @author       tikutaro
// @match        *://bad-dragon.com/*
// @icon         https://www.google.com/s2/favicons?domain=bad-dragon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432440/Bad%20Dragon%20WhiteBlank%20Page%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/432440/Bad%20Dragon%20WhiteBlank%20Page%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const exp = /.*\:\/\/.*\.cloudfront\.net\/(app|media)-.*\.js/;
    const scripts = [];
    for (const child of document.getElementsByTagName('script')) {
        if (exp.test(child.src)) {
            scripts.push(child.src);
        }
    }
    const head = document.getElementsByTagName('head')[0];
    for (const url of scripts) {
        const tag = document.createElement('script');
        tag.setAttribute('type', 'text/javascript');
        tag.setAttribute('src', url);
        head.appendChild(tag);
    }
})();