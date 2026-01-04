// ==UserScript==
// @name        Add view port mobile meta to all pages  
// @namespace   english
// @description Add view port mobile meta to all pages (mobile enable) - Install on FF Mobile
// @include     http*://*
// @version     1.2
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371042/Add%20view%20port%20mobile%20meta%20to%20all%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/371042/Add%20view%20port%20mobile%20meta%20to%20all%20pages.meta.js
// ==/UserScript==

var meta = document.createElement('meta');
meta.httpEquiv = "X-UA-Compatible";
meta.name = 'viewport';
meta.content= 'width=device-width, initial-scale=1'; 

document.getElementsByTagName('head')[0].appendChild(meta);
