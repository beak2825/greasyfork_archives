// ==UserScript==
// @name         v3rm default favicon
// @namespace    https://www.v3rmillion.net
// @version      1.0
// @description  v3rmillion default favicon
// @author       vsk
// @match        https://v3rmillion.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445864/v3rm%20default%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/445864/v3rm%20default%20favicon.meta.js
// ==/UserScript==


var head = document.getElementsByTagName('head')[0];
var icon = document.createElement('link');

icon.setAttribute('type', 'image/x-icon');
icon.setAttribute('rel', 'icon');

icon.setAttribute('href', 'https://v3rmillion.net/favicon.ico');

head.appendChild(icon);
