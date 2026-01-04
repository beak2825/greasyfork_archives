// ==UserScript==
// @name         Force YouTube Desktop
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Forces use of the Desktop version of YouTube
// @author       TheTank20
// @license      Unlicense
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477964/Force%20YouTube%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/477964/Force%20YouTube%20Desktop.meta.js
// ==/UserScript==
location.replace(`${window.location.href.replace("m.youtube.com","www.youtube.com")}${new URL(window.location.href).searchParams.toString()?"&app=desktop":"?app=desktop"}`);