// ==UserScript==
// @name         *AUTO CLAIM* Auto Claim automático de TRX a cada 10 minutos em stake.com v5.0
// @description  Auto Claim automático de TRX a cada 10 minutos em stake.com.
// @author       shadowdance
// @version      5.0
// @license      apache
// @match        https://stake.com/casino/games/dice?tab=reload&modal=vip&currency=trx
// @match        https://stake.com/*
// @match        https://stake.com/casino/games/dice?tab=reload&modal=vip&currency=trx
// @grant        none
// @namespace https://greasyfork.org/users/824858
// @downloadURL https://update.greasyfork.org/scripts/441296/%2AAUTO%20CLAIM%2A%20Auto%20Claim%20autom%C3%A1tico%20de%20TRX%20a%20cada%2010%20minutos%20em%20stakecom%20v50.user.js
// @updateURL https://update.greasyfork.org/scripts/441296/%2AAUTO%20CLAIM%2A%20Auto%20Claim%20autom%C3%A1tico%20de%20TRX%20a%20cada%2010%20minutos%20em%20stakecom%20v50.meta.js
// ==/UserScript==
setInterval(function(){window.location.replace("https://stake.com/casino/games/dice?tab=reload&modal=vip&currency=trx");},100000)
setInterval(function(){document.getElementsByClassName("variant-success lineHeight-base size-medium spacing-mega weight-semibold align-center fullWidth square svelte-1x36jdy")[0].click();},20000)