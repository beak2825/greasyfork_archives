// ==UserScript==
// @name         Stake.com 24 houres frequency redeem XRP 
// @description  Claims bonus on Stake.com every 24 houres
// @description  New players please use my ref link here to get some bonus: https://stake.com/?c=StakeGiveaways
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @version      1.0
// @match        https://stake.com/sports
// @match        https://stake.com/?currency=xrp&modal=vipReload
// @match        https://stake.com
// @match        https://stake.com/casino
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415365/Stakecom%2024%20houres%20frequency%20redeem%20XRP.user.js
// @updateURL https://update.greasyfork.org/scripts/415365/Stakecom%2024%20houres%20frequency%20redeem%20XRP.meta.js
// ==/UserScript==


setInterval(function(){window.location.replace("https://stake.com/?currency=xrp&modal=vipReload");},60000*60*24)
setInterval(function(){document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA")[0].click()},30000);