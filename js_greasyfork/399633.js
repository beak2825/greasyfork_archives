// ==UserScript==
// @name         Steamcommunity Link Automatic Redirect
// @namespace    https://www.maxalex.tk
// @version      0.1
// @description  Steam社区外链自动跳转
// @author       MaxAlex, aka zyf722
// @match        https://steamcommunity.com/linkfilter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399633/Steamcommunity%20Link%20Automatic%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/399633/Steamcommunity%20Link%20Automatic%20Redirect.meta.js
// ==/UserScript==

window.location.href = window.location.href.split('/?url=')[1]