// ==UserScript==
// @name         Stake.com 10 minutes frequency redeem BCH 
// @description  Claims bonus on Stake.com every 10 minutes
// @description  New players please use my ref link here to get some bonus: https://stake.com/?c=StakeGiveaways
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @version      1.0
// @match        https://stake.com/sports
// @match        https://stake.com/?currency=bch&modal=vipReload
// @match        https://stake.com
// @match        https://stake.com/casino
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415362/Stakecom%2010%20minutes%20frequency%20redeem%20BCH.user.js
// @updateURL https://update.greasyfork.org/scripts/415362/Stakecom%2010%20minutes%20frequency%20redeem%20BCH.meta.js
// ==/UserScript==


setInterval(function(){window.location.replace("https://stake.com/?currency=bch&modal=vipReload");},60000*9)
setInterval(function(){document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA")[0].click()},30000);