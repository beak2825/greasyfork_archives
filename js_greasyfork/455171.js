// ==UserScript==
// @name         ROBLOX 2016 Promocodes Page
// @namespace    http://greasyfork.org/
// @version      0.1
// @description  you need that userstyle after installing this userscript: https://userstyles.org/styles/227657/roblox-2016-promocodes-page-reconstruct-read-desc . ig you this this is broken, please contact on userstyles.org to this link up here!
// @author       You
// @match        https://www.roblox.com/redeem
// @match        https://web.roblox.com/redeem
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @license      none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455171/ROBLOX%202016%20Promocodes%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/455171/ROBLOX%202016%20Promocodes%20Page.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
document.title = "ROBLOX.com";
 
document.querySelector("#redeem-gift-card > div.container-header > h1").id = "textInfo";
const textInfo = document.querySelector("#textInfo");
textInfo.innerHTML = [`<div id="Body" class="body-width">
 
<h1><span>Redeem ROBLOX Promotions</span></h1>
<div id="RedeemContainer">
    <div id="Instructions">
        <div class="header">How to Use</div>
        <div class="listitem">Have you received a ROBLOX promotional code from one of our many events or give-aways?</div>
        <div class="listitem">This is the place to claim your goods. Enter the promotional code in the section to the right.</div>
        <div class="footnote">Promotional codes may expire, or only be active for a short period of time.</div>
    </div>`];
 
document.querySelector("#redeem-gift-card > div.col-sm-12.col-md-6.left-column > div > form > div.error-input-field.form-group.form-has-feedback > label").id = "headerPromo";
const header = document.querySelector("#headerPromo");
headerPromo.innerHTML = [`<div id="headerPromo">Enter Your Code:</div>`];
 
document.querySelector("#promotion-code-input").setAttribute("placeholder", "");
 
document.querySelector("#redeem-gift-card > div.col-sm-12.col-md-6.left-column > div > form > button").id = "buttonSubmit";
const buttonSubmit = document.querySelector("#buttonSubmit");
buttonSubmit.outerHTML = [`<button type="submit" class="redeem-btn btn-primary-lg btn-full-width">Redeem</button>`];
})();