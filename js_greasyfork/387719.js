// ==UserScript==
// @name         Remove Url SEO Parameters
// @namespace    https://github.com/livinginpurple
// @version      2026.01.24.25
// @description  Remove Redundant Url SEO Parameters
// @author       livinginpurple
// @match        *://*.pixnet.net/*
// @match        *://*.techbang.com/posts/*
// @match        *://*.dcard.tw/*
// @match        *://*.inside.com.tw/*
// @match        *://*.logdown.com/*
// @match        *://cookpad.com/tw/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387719/Remove%20Url%20SEO%20Parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/387719/Remove%20Url%20SEO%20Parameters.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const scriptName = GM_info.script.name;
    console.log(`${scriptName} is loading.`);

    window.history.replaceState({},
        window.title,
        window.location.href.split('-')[0]
    );
    console.log(`${scriptName} is running.`);
})();