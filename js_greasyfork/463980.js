// ==UserScript==
// @name         游民886
// @namespace    gamersky-redirect
// @version      1.01
// @description  自动跳转到目标网站
// @match        *.gamersky.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://www.gamersky.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463980/%E6%B8%B8%E6%B0%91886.user.js
// @updateURL https://update.greasyfork.org/scripts/463980/%E6%B8%B8%E6%B0%91886.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a UI for setting the target website
    GM_registerMenuCommand('设置目标网站', function() {
        const targetWebsite = prompt('请输入目标网站的URL:');
        GM_setValue('targetWebsite', targetWebsite);
    });

    // Get the target website from GM storage
    const targetWebsite = GM_getValue('targetWebsite');

    // If we are on gamersky.com, redirect to the target website
    if (window.location.hostname === 'www.gamersky.com') {
        if (targetWebsite) {
            window.location.href = targetWebsite;
        } else {
            const confirmMsg = confirm('您还没有设置目标网站，是否前往设置？');
            if (confirmMsg) {
                GM_registerMenuCommand('设置目标网站', function() {
                    const targetWebsite = prompt('请输入目标网站的URL:');
                    GM_setValue('targetWebsite', targetWebsite);
                });
            }
        }
    }
})();
