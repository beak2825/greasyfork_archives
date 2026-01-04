// ==UserScript==
// @name         Stake.com simple & safe Crash bot 
// @description  Aint got an Stake.com account yet, use my reflink to support my work here:
// @description  https://stake.com/?c=StakeGiveaways
// @description  to run the bot open https://stake.com/casino/games/crash
// @description  set up amount and payout by hand
// @description  Best profits i made with the following settings: 
// @description  Payout: 1.15 and betsize: 86,95900000 DOGE
// @description  The bot places every 2 minutes a bet. This is to prevent the crash´s ygl maths.
// @match        https://stake.com/casino/games/crash
// @version      3.0
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @downloadURL https://update.greasyfork.org/scripts/415552/Stakecom%20simple%20%20safe%20Crash%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/415552/Stakecom%20simple%20%20safe%20Crash%20bot.meta.js
// ==/UserScript==
setInterval(function(){
document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA styles__Button-fc7ea4-0 mGJpP")[0].click();
},110000);