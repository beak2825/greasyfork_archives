
// ==UserScript==
// @name         Autokey helper script - nitro type bot
// @namespace   https://ginfio.com/giveaways
// @version      3
// @description helper script for autokey
// @match      https://www.nitrotype.com/race/*
// @match https://www.nitrotype.com/race
// @license GNU Affero General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/459459/Autokey%20helper%20script%20-%20nitro%20type%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/459459/Autokey%20helper%20script%20-%20nitro%20type%20bot.meta.js
// ==/UserScript==
 
 
 
/*var mdk = 232;
ll="auto_typer.type(everything)";
r3="finish(mdk)";*/



 


function copyText(e){navigator.clipboard.writeText(e)}function checkForRaceText(){let e=setInterval(function(){document.querySelector(".dash-copy")&&(copyRaceText(),clearInterval(e))},1e3)}function reload_page(){window.location.reload()}function checkForDisqualified(){setInterval(function(){document.querySelector(".modal--raceError")&&(copyText("https://ginfio.com"),reload_page())},1e4)}function after_race(){let e=setInterval(function(){document.querySelector(".raceResults")&&(reload_page(),copyText("https://ginfio.com"),clearInterval(e))},Math.floor(1e3*Math.random()))}function copyRaceText(){setTimeout(function(){copyText("start_typing|||"+document.querySelector(".dash-copy").textContent)},1e3)}function checkForContinueButton(){setInterval(function(){btns=Array.from(document.querySelectorAll(".btn.btn--primary.btn--fw")),continue_btn=[],0<btns.length&&(continue_btn=btns.filter(function(e){return e.textContent.includes("ntinue")})),0<continue_btn.length?window.location.reload():console.log("did't find.")},1e4)}function refreshJustIncase(){setTimeout(function(){window.location.href="https://www.nitrotype.com/race"},5e4)}after_race(),checkForRaceText(),checkForDisqualified(),checkForContinueButton(),refreshJustIncase();