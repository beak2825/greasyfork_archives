// ==UserScript==
// @author         Nalechko
// @name           Steam Booster Craft
// @description    Crafts Steam boosters
// @include        *steamcommunity.com/*tradingcards/boostercreator*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant          GM_xmlhttpRequest
// @version        0.0.1
// @license        MIT
// @namespace      http://steamcommunity.com/profiles/76561198005423682
// @downloadURL https://update.greasyfork.org/scripts/22857/Steam%20Booster%20Craft.user.js
// @updateURL https://update.greasyfork.org/scripts/22857/Steam%20Booster%20Craft.meta.js
// ==/UserScript==

console.log("Script initialized");
setTimeout(function() {
  console.log("Attempting to craft...");
  var url = window.location.href;
  id = url.substr(url.length-6);
  var rgBoosterData = CBoosterCreatorPage.sm_rgBoosterData[id];
  var series = CBoosterCreatorPage.sm_rgBoosterData[id].series;
  $J.post( 'http://steamcommunity.com/tradingcards/ajaxcreatebooster/', {
    sessionid: g_sessionID,
    appid: id,
    series: series,
    tradability_preference: 1
  });
  console.log("Crafted booster");
}, 1000);
