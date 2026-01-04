// ==UserScript==
// @name     gosuslugi.ru trackers stubs
// @description create stub functions for trackers, like yandex metrika
// @version  2
// @grant    none
// @match    https://*.gosuslugi.ru/*
// @match    https://gosuslugi.ru/*
// @run-at   document-end
// @namespace https://greasyfork.org/users/810472
// @downloadURL https://update.greasyfork.org/scripts/431652/gosuslugiru%20trackers%20stubs.user.js
// @updateURL https://update.greasyfork.org/scripts/431652/gosuslugiru%20trackers%20stubs.meta.js
// ==/UserScript==

function trackers_stub() {
  window.yaCounter24845174 = function () {};
  window.yaCounter24845174.reachGoal = function () {};
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + trackers_stub + ")();";
document.body.appendChild(script);