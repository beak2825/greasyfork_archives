// ==UserScript==
// @name facebook right bar
// @namespace facebook right bar
// @locale en
// @description Removes right sidebar on facebook
// @match https://*.facebook.com/*
// @match http://*.facebook.com/*
// @grant none
// @version 0.0.1.20171218032329
// @downloadURL https://update.greasyfork.org/scripts/36449/facebook%20right%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/36449/facebook%20right%20bar.meta.js
// ==/UserScript==
document.querySelector("#u_0_s").remove()