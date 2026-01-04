// ==UserScript==
// @name         AD Blocker RL-INSIDER
// @namespace    TamperMonkey Plugin
// @version      V1.2
// @description  Constantly removes advertisements from RL-INSIDER.
// @author       SecretDevX
// @match        https://rl.insider.gg/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422520/AD%20Blocker%20RL-INSIDER.user.js
// @updateURL https://update.greasyfork.org/scripts/422520/AD%20Blocker%20RL-INSIDER.meta.js
// ==/UserScript==
alert("AD Blocker for RL-INSIDER Activated! 'Made By SecretDevX'");
setInterval(function(){ $('.img_ad').remove() }, 300);
setInterval(function(){ $('.animation_container').remove() }, 300);
setInterval(function(){ $('#partnershipContainer').remove() }, 300);
setInterval(function(){ $('#bs').remove() }, 300);
setInterval(function(){ $('.vm-footer').remove() }, 300);
setInterval(function(){ $('#mys-wrapper').remove() }, 300);
setInterval(function(){ $('.jar').remove() }, 300);
setInterval(function(){ $('#IL_INSEARCH').remove() }, 300);
setInterval(function(){ $('.ns-z13ig-e-0').remove() }, 300);
setInterval(function(){ $('#google_ads_iframe_/21726375739/VM_5fb6afa4819e6f075b15e177_2__container__').remove() }, 300);
setInterval(function(){ $('#mys-wrapper').remove() }, 300);
setInterval(function(){ $('#mys-content').remove() }, 300);
setInterval(function(){ $('#ads_ppDesktopBottomLeaderboard').remove() }, 300);