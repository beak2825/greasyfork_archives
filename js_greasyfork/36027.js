// ==UserScript==
// @name        OneTime layout saver
// @description Save and restore column layouts for OneTime
// @namespace   https://greasyfork.org/en/users/814-bunta
// @version     1.1
// @include     https://onetime.onedatacom.com/*
// @run-at      document-end
// @noframes
// @nowrap
// @libraries   
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/36027/OneTime%20layout%20saver.user.js
// @updateURL https://update.greasyfork.org/scripts/36027/OneTime%20layout%20saver.meta.js
// ==/UserScript==

console.log("script start");

var $ = unsafeWindow.$;
var widths1 = JSON.parse(GM_getValue("savedWidths1", "[30,215,250,80,240,70,65,40]"));
var widths2 = JSON.parse(GM_getValue("savedWidths2", "[30,215,250,80,240,70,65,40]"));

function loadFavouritesColumnLayout() {
  $("div#onejobgrid colgroup").each(function() {
    $(this).children().each(function(i) {
      $(this).removeAttr('style').css("width",widths1[i]+"px");
    });
  });
  
  $("div#buFavgrid colgroup").each(function() {
    $(this).children().each(function(i) {
      $(this).removeAttr('style').css("width",widths2[i]+"px");
    });
  });

}

function addSaveButton() {
  var elem = document.getElementById("saveLayoutBtn"); 
  elem.onclick = saveFavouritesColumnLayout;
}

function saveFavouritesColumnLayout() {
  var widthSettings = [];
  $("div#onejobgrid colgroup").first().children().each(function(i) {
    widthSettings.push($(this).width());
  });
  
  GM_setValue("savedWidths1", JSON.stringify(widthSettings));

  var widthSettings = [];
  $("div#buFavgrid colgroup").first().children().each(function(i) {
    widthSettings.push($(this).width());
  });
  
  GM_setValue("savedWidths2", JSON.stringify(widthSettings));
}

loadFavouritesColumnLayout();
addSaveButton();

console.log("script finish");
