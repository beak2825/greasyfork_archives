// ==UserScript==
// @name        slots.lv roulette - replace real with practice
// @namespace   lv.slots.roulette.realtopractice
// @description Seamlessly replaces the real money game with the practice one.
// @include     https://www.slots.lv/table-games/american-roulette?mode=real
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35581/slotslv%20roulette%20-%20replace%20real%20with%20practice.user.js
// @updateURL https://update.greasyfork.org/scripts/35581/slotslv%20roulette%20-%20replace%20real%20with%20practice.meta.js
// ==/UserScript==

waitForElementToExist('iframe', function(gameIframe){
  console.log("Game iframe exists!");
  setTimeout(function(){
    gameIframe.src = "https://www.slots.lv/static/casino-st-games/american-roulette/?mode=fun&lang=en&currency=USD&token=&siteId=12&reloadUrl=https%3A%2F%2Fwww.slots.lv%2Fservices%2Fcasino%2Fcasino-lobby-services%2Fv1%2Fgames%2F1010%2Furl%2Fredirect%3FsiteId%3D12%26currencyCode%3DUSD%26mode%3Dpractice%26channelType%3Ddesktop%26language%3Den%26forceNewSession%3Dfalse%26subdomain%3Dwww&homeUrl=https%3A%2F%2Fwww.slots.lv%2F&cashierUrl=javascript%3Aparent.UserInfo.showDeposit%28%29&loginUrl=https%3A%2F%2Fwww.slots.lv%2Flogin&signupUrl=https%3A%2F%2Fwww.slots.lv%2Fjoin&cdn=https%3A%2F%2Fcdn14.assetfolder.eu%7Chttps%3A%2F%2Fcdn15.assetfolder.eu";
  }, 100);
});

function waitForElementToExist(selector, action) {
  var elm = document.querySelector(selector);
  if(elm !== null)
    action(elm);
  else
    setTimeout(waitForElementToExist.bind(null, selector, action), 100);
}