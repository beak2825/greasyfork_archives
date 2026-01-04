// ==UserScript==
// @name           TstarTel 20181111 搶88
// @namespace      Patrick
// @description    Refreshes the page until target string is found
// @include        queue.tstartel.com*
// @include https://queue.tstartel.com/*
// @grant metadata
// @version 0.0.1.20181111120725
// @downloadURL https://update.greasyfork.org/scripts/374254/TstarTel%2020181111%20%E6%90%B688.user.js
// @updateURL https://update.greasyfork.org/scripts/374254/TstarTel%2020181111%20%E6%90%B688.meta.js
// ==/UserScript==

var FREQUENCY = 1000;

var text = document.body.innerHTMl || document.body.textContent;
var yourTime = new Date();

if (text.indexOf("Busy") > -1) {
    window.setTimeout(() => window.location.reload(), FREQUENCY);
} else {
    alert('Got it');
}