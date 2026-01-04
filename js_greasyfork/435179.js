// ==UserScript==
// @name         Bangbros Metric Bypass
// @version      0.1
// @description  Bypass metrics while allowing search
// @author       feederbox826
// @match        https://bangbros.com/*
// @icon         https://images2.bangbros.com/bangbros/mobileh1/favicons/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/833361
// @downloadURL https://update.greasyfork.org/scripts/435179/Bangbros%20Metric%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/435179/Bangbros%20Metric%20Bypass.meta.js
// ==/UserScript==
// jshint esversion: 6

document.tk = { send: (event, details, cb) => cb() };