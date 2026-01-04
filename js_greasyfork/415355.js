// ==UserScript==
// @name         Stake.com 60 minutes frequency redeem LTC 
// @description  Claims bonus on Stake.com every 60 minutes
// @description  New players please use my ref link here to get some bonus: https://stake.com/?c=StakeGiveaways
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @version      1.0
// @match        https://stake.com/sports
// @match        https://stake.com/?currency=ltc&modal=vipReload
// @match        https://stake.com
// @match        https://stake.com/casino
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415355/Stakecom%2060%20minutes%20frequency%20redeem%20LTC.user.js
// @updateURL https://update.greasyfork.org/scripts/415355/Stakecom%2060%20minutes%20frequency%20redeem%20LTC.meta.js
// ==/UserScript==


setInterval(function(){window.location.replace("https://stake.com/?currency=ltc&modal=vipReload");},60000*55)
setInterval(function(){document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA")[0].click()},30000);