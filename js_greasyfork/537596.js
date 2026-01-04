// ==UserScript==
// @name         Luogu Redirect to luogu.me (with confirmation)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Redirects from luogu.com to luogu.me with user confirmation
// @author       You
// @include      https://*.luogu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537596/Luogu%20Redirect%20to%20luogume%20%28with%20confirmation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537596/Luogu%20Redirect%20to%20luogume%20%28with%20confirmation%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Luogu Redirect Script is running");

    const currentUrl = window.location.href;
    console.log("Current URL:", currentUrl);

    if (currentUrl.includes("luogu.com")) {
        const newUrl = currentUrl.replace("luogu.com", "luogu.me");
        console.log("Redirect candidate:", newUrl);

        // 弹出确认框
        if (confirm("是否跳转到 luogu.me？\n点击“确定”跳转，点击“取消”留在当前页面。")) {
            console.log("Redirecting to:", newUrl);
            window.location.href = newUrl;
        } else {
            console.log("User cancelled the redirection.");
        }
    } else {
        console.log("URL does not include 'luogu.com'. No redirection.");
    }
})();
