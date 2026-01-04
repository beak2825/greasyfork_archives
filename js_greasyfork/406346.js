// ==UserScript==
// @name         countDownTimerBig by Jean Pirela
// @namespace    https://www.facebook.com/jeanpirelag
// @version      1.4
// @description  Appen timer in large size and visible when we go down to send the task.
// @author       Jean Pirela
// @match        https*://view.appen.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=appen.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406346/countDownTimerBig%20by%20Jean%20Pirela.user.js
// @updateURL https://update.greasyfork.org/scripts/406346/countDownTimerBig%20by%20Jean%20Pirela.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}

addGlobalStyle('#countdown_timer span {font-size: 155%; color: #3f0; padding-top: 0px; padding-right: 8px;');
addGlobalStyle('#masthead .inverse { position: fixed;');
addGlobalStyle('#countdown_timer { padding-top: 0px; padding-bottom: 0px; margin-top: 0px; margin-bottom: 0px');
addGlobalStyle('h1.job-title {padding-top: 25px');