// ==UserScript==
// @name         Auto Claim Reload every 10 mins on stake.bet v1.0
// @description  Auto Claim Reload every 10 mins on stake.bet - if this helped, tip me on site <3 : janeryza
// @author       janeryza
// @version      1.0
// @license      apache
// @match        https://stake.bet/casino/home?tab=reload&modal=vip&currency=xrp
// @match        https://stake.bet/*
// @grant        none
// @namespace    https://greasyfork.org/users/918278
// @downloadURL https://update.greasyfork.org/scripts/445524/Auto%20Claim%20Reload%20every%2010%20mins%20on%20stakebet%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/445524/Auto%20Claim%20Reload%20every%2010%20mins%20on%20stakebet%20v10.meta.js
// ==/UserScript==
setInterval(function(){window.location.replace("https://stake.bet/casino/home?tab=reload&modal=vip&currency=xrp");},300000)
setInterval(function(){document.getElementsByClassName("variant-success lineHeight-base size-medium spacing-mega weight-semibold align-center min-width fullWidth square svelte-1h1l6hw")[0].click();},1000)

// auto vault, we do this every 30 minutes
setInterval(function() {
    window.location.replacce("https://stake.bet/casino/home?operation=deposit&modal=vault");
}, 600000)
setInterval(function() {
    document.getElementsByClassName("variant-game lineHeight-none size-small spacing-input weight-semibold align-left no-shadow square svelte-1x36jdy")[0].click();
}, 20000)
setInterval(function() {
    document.getElementsByClassName("variant-success lineHeight-base size-medium spacing-mega weight-semibold align-center fullWidth square svelte-1x36jdy")[0].click();
}, 40000)
