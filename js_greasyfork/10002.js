// ==UserScript==
// @name         Cookie Clickerのクリック機能を自動化
// @namespace    https://twitter.com/aoh72931
// @version      1.8
// @description  Cookie Clicker Auto click
// @author       aoh72931
// @match        http://orteil.dashnet.org/cookieclicker/
// @match        http://orteil.dashnet.org/cookieclicker/*
// @match        http://natto0wtr.web.fc2.com/CookieClicker/
// @match        http://natto0wtr.web.fc2.com/CookieClicker/*
// @match        http://web.archive.org/web/*/http://orteil.dashnet.org/cookieclicker/*
// @match        https://web.archive.org/web/*/http://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10002/Cookie%20Clicker%E3%81%AE%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E6%A9%9F%E8%83%BD%E3%82%92%E8%87%AA%E5%8B%95%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/10002/Cookie%20Clicker%E3%81%AE%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E6%A9%9F%E8%83%BD%E3%82%92%E8%87%AA%E5%8B%95%E5%8C%96.meta.js
// ==/UserScript==

javascript:(function() {
  setInterval(function(){ Game.ClickCookie(); }, 4);
}());

javascript:(function() {
  setInterval(function(){for (var i in Game.shimmers) { Game.shimmers[i].pop(); }}, 500);
}());

javascript:setInterval(function(){
  if(Game.seasonPopup.life>0)Game.seasonPopup.click()
},100);void''

javascript:setInterval(function(){
  if(Game.goldenCookie.life>0)Game.goldenCookie.click()
},100);void''