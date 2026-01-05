// ==UserScript==
// @name         Infogalactic Redirect
// @namespace    http://gab.ai/Jeremy20_9
// @version      0.1
// @description  redirect from a wretched wikipedia page to its infogalactic better
// @author       Jeremiah 20:9
// @match        https://*.wikipedia.org/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27352/Infogalactic%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/27352/Infogalactic%20Redirect.meta.js
// ==/UserScript==

var loc = window.location.href;
var locparts = loc.split("/");
window.location.href = "http://infogalactic.com/info/" + locparts[locparts.length-1];