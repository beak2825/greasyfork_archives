// ==UserScript==
// @name         Remove Url SEO Parameters
// @namespace    https://github.com/livinginpurple
// @version      2020.11.06.24
// @description  Remove Redundant Url SEO Parameters
// @author       livinginpurple
// @match        http://*.pixnet.net/*
// @match        https://*.pixnet.net/*
// @match        http://blog.xuite.net/*
// @match        https://blog.xuite.net/*
// @match        http://*.techbang.com/posts/*
// @match        https://*.techbang.com/posts/*
// @match        https://*.dcard.tw/*
// @match        https://*.inside.com.tw/*
// @match        https://*.logdown.com/*
// @match        https://cookpad.com/tw/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387719/Remove%20Url%20SEO%20Parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/387719/Remove%20Url%20SEO%20Parameters.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const scriptName = GM_info.script.name;
    console.log(`${scriptName} is loading.`);
    // 修改網址，且不留下歷史紀錄
    window.history.replaceState({},
        window.title,
        window.location.href.split('-')[0]
    );
    console.log(`${scriptName} is running.`);
})(document);