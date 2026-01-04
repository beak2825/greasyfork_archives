// ==UserScript==
// @name LIHKG
// @namespace http://tampermonkey.net/
// @version 0.1
// @description En
// @author LIHKG
// @include http://msg.urbtix.hk/*
// @include http://busy.urbtix.hk/*

// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/426796/LIHKG.user.js
// @updateURL https://update.greasyfork.org/scripts/426796/LIHKG.meta.js
// ==/UserScript==

(function() {
'use strict';
location.replace("https://ticket.urbtix.hk/internet/zh_TW/eventDetail/41847");
})();

unsafeWindow.alert=function (str) {
console.log ("Greasemonkey intercepted alert: ", str);
};