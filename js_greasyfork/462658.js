// ==UserScript==
// @name         satoshihero.com : Auto Free Spin
// @namespace    satoshi.hero.auto.free.spin
// @version      2.1
// @description  https://ouo.io/QDt0ES
// @author       stealtosvra
// @match        https://satoshihero.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=satoshihero.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462658/satoshiherocom%20%3A%20Auto%20Free%20Spin.user.js
// @updateURL https://update.greasyfork.org/scripts/462658/satoshiherocom%20%3A%20Auto%20Free%20Spin.meta.js
// ==/UserScript==

(function() {
    'use strict';

function reloadPage() {location.reload();}
function clickPrimaryButton() {document.querySelector('.base-button.button.primary').click();}
function clickButtonContent() {document.querySelector('.button-content').click();}
function performActions() {clickPrimaryButton();

setTimeout(function() {clickButtonContent();
setTimeout(function() {document.querySelectorAll('.button-content')[1].click();}, 15000);}, 5000);}
setInterval(reloadPage, 300000);
setTimeout(performActions, 5000);

})();