// ==UserScript==
// @name         Btc Heat Auto Spinner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description Auto Spin 4 Seconds.
// @author       Android Phoneix
// @grant        none
// @include         *://btcheat.com/*
// @include         *://ethcombo.com/*
// @downloadURL https://update.greasyfork.org/scripts/371808/Btc%20Heat%20Auto%20Spinner.user.js
// @updateURL https://update.greasyfork.org/scripts/371808/Btc%20Heat%20Auto%20Spinner.meta.js
// ==/UserScript==

setInterval(function () {document.getElementById("playFancy").click();}, 4000);
setTimeout(function () { window.location.replace(window.location.href); }, 70000);