// ==UserScript==
// @name         KiraFan News
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Support to watch KiraFan News
// @author       @nilcric
// @match        https://kirara.star-api.com/cat_news/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399925/KiraFan%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/399925/KiraFan%20News.meta.js
// ==/UserScript==

location.href = "javascript:var Unity={call:function(U){window.open(U)}};";