// ==UserScript==
// @name         2021 Tumblr new tab max resolution
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  NuTumblr url max image size
// @author       Binarystar
// @match        http://*.media.tumblr.com/*
// @match        https://*.media.tumblr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421617/2021%20Tumblr%20new%20tab%20max%20resolution.user.js
// @updateURL https://update.greasyfork.org/scripts/421617/2021%20Tumblr%20new%20tab%20max%20resolution.meta.js
// ==/UserScript==

let url = document.location.toString();
let check = url.match(/\/s\d+x\d+\//g)

if (check != "\/s99999x99999\/" && check != null){
     document.location = url.replace(/\/s\d+x\d+\//g, "\/s99999x99999\/");
}