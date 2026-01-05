// ==UserScript==
// @name         Arena Fight
// @name:ru      Бой на арене
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @description:ru  try to take over the world!
// @author       IvanKalyada
// @match        http://www.coingamers.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18540/Arena%20Fight.user.js
// @updateURL https://update.greasyfork.org/scripts/18540/Arena%20Fight.meta.js
// ==/UserScript==
/* jshint -W097 */

if (window.location.href == "http://www.coingamers.co/viking-arena/") {
    setTimeout(function(){window.location = 'http://www.coingamers.co/battle/'}, 7000);
}
if (window.location.href == "http://www.coingamers.co/battle/") {
    setTimeout(function(){ document.getElementsByClassName('pbc-cover')[0].getElementsByTagName('a')[0].click(); }, 3*70*1000);
}
if (window.location.href == "http://www.coingamers.co/xgame/anti-bot/") {
    setTimeout(function(){window.location = 'http://www.coingamers.co/battle-user-hx652/'}, 7000);
}
if (window.location.href == "http://www.coingamers.co/battle-user-hx652/") {
    var cookie = document.getElementById('Battle Arena');
    if (cookie) setTimeout(function(){ cookie.click(); }, 7000);
    else setTimeout(function(){window.location = 'http://www.coingamers.co/viking-arena/'}, 7000);
}