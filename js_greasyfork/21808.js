// ==UserScript==
// @name        steam family auto login
// @namespace   https://greasyfork.org/fr/users/30595-deicide
// @description auto log on steam if family mode is enabled
// @include     http*://steamcommunity.com/*
// @include     http*://store.steampowered.com/*
// @version     3
// @icon        http://store.steampowered.com/favicon.ico
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/21808/steam%20family%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/21808/steam%20family%20auto%20login.meta.js
// ==/UserScript==
if (document.getElementById("steam_parental_password_box")) {
  var pwd = GM_getValue('steamp');
  if (typeof pwd == 'undefined') {
    var pwd = prompt("Please enter your Steam family password");
    GM_setValue('steamp', pwd);
  }
  document.getElementById('submit_btn').disabled=false;
  document.getElementById("steam_parental_password_box").value = pwd;
  setTimeout(function(){
    document.getElementById("submit_btn").click();
  }, 100);
}

if(window.location.href.indexOf("agecheck") > -1) {
  document.getElementById("ageYear").value = 1975;
  setTimeout(function(){
      document.querySelector('.btnv6_blue_hoverfade.btn_small').click();
  }, 100);
}

if(window.location.href.indexOf("registerkey") > -1) {
  setTimeout(function(){
      document.getElementById("accept_ssa").checked = true;
      document.getElementById("register_btn").click();
  }, 200);
}