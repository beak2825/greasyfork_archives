// ==UserScript==
// @license MIT
// @name         out discord
// @version      1.1
// @description  此脚本退出dc登录
// @include      https://discord.com/*
// @run-at       document-start
// @namespace    http://tampermonkey.net/
// @author       dengxinyu
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/451671/out%20discord.user.js
// @updateURL https://update.greasyfork.org/scripts/451671/out%20discord.meta.js
// ==/UserScript==


(function() {
    window.token = window.localStorage.token;
    window.localStorage.clear();
})();
