// ==UserScript==
// @name        Disable javascript alert boxs
// @namespace   Disable javascript alert boxs
// @description A simple userscript that defeats and disable the javascript alert boxes
// @author      SMed79
// @version     1.0
// @icon        http://i.imgur.com/EMCvngV.png
// @run-at      document-start
// @include     http://*
// @include     https://*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25435/Disable%20javascript%20alert%20boxs.user.js
// @updateURL https://update.greasyfork.org/scripts/25435/Disable%20javascript%20alert%20boxs.meta.js
// ==/UserScript==

window.alert_ = window.alert;
window.alert = function(a) {
    console.log.call(this, a);
}

setTimeout(function() {
    window.alert = window.alert_;
    delete window.alert_;
}, 5000);
