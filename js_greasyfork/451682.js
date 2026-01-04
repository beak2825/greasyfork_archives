// ==UserScript==
// @license MIT
// @name         get discord token
// @version      1.0
// @description  此脚本查看discord token
// @include      https://discord.com/*
// @run-at       document-start
// @namespace    http://tampermonkey.net/
// @author       dengxinyu
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/451682/get%20discord%20token.user.js
// @updateURL https://update.greasyfork.org/scripts/451682/get%20discord%20token.meta.js
// ==/UserScript==


(function() {
    window.token = window.localStorage.token;
    console.log("token: "+window.localStorage.token);
})();
