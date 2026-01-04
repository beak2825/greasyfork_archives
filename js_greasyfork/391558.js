// ==UserScript==
// @name         Amazon Search Box Set Focus
// @version      1
// @grant        none
// @description	 This userscript sets the focus to the Search textbox so you can start typing right away when you go to Amazon.com
// @author       Tim Berneman
// @include      http*://*.amazon.com/*
// @namespace    https://greasyfork.org/users/14590
// @downloadURL https://update.greasyfork.org/scripts/391558/Amazon%20Search%20Box%20Set%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/391558/Amazon%20Search%20Box%20Set%20Focus.meta.js
// ==/UserScript==

document.getElementById("twotabsearchtextbox").focus();
