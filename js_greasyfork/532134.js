// ==UserScript==
// @name 8se.me No Popups !!!
// @namespace http://tampermonkey.net/
// @version 0.1
// @description No Popups !!!
// @author only1word
// @match *://*.8se.me/*
// @grant none
// @license MIT
// @run-at      document-idle

// @downloadURL https://update.greasyfork.org/scripts/532134/8seme%20No%20Popups%20%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/532134/8seme%20No%20Popups%20%21%21%21.meta.js
// ==/UserScript==

(function() {
    window.Swal = ()=>{}
Object.freeze(window.Swal)
})();