// ==UserScript==
// @name        Freebit Autoroll
// @namespace   
// @description Auto roll
// @author      SilverWolf
// @include     https://freebitco.in/*
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @grant		GM_xmlhttpRequest
// @grant       unsafeWindow
// @version     0.0.1
// @icon        https://freebitco.in/favicon.ico
// @credit      
// @downloadURL https://update.greasyfork.org/scripts/34901/Freebit%20Autoroll.user.js
// @updateURL https://update.greasyfork.org/scripts/34901/Freebit%20Autoroll.meta.js
// ==/UserScript==
var timer = undefined;
var counter = 0;
var remain = 60*6;

var SPEED = 5;

var selector = {
  selecting: undefined,

  handle: function(event) {
    var tiles = new Set(document.querySelectorAll('#rc-imageselect td')), tile = event.target;

    while (tile && ! tiles.has(tile)) {
      tile = tile.parentNode;
    }

    if (tile) {
      event.stopPropagation();
      event.preventDefault();

      var selected = 'selected' in tile.dataset && tile.dataset.selected == 'true';

      if (this[event.type](selected)) {
        tile.dataset.selected = this.selecting;

        tile.firstElementChild.click();
      }
    }
  },

  mouseover: function(selected) {
    return ! (this.selecting === undefined || this.selecting === selected);
  },

  mousedown: function(selected) {
    this.selecting = ! selected;

    return true;
  },

  mouseup: function(selected) {
    this.selecting = undefined;

    return false;
  }
};

window.addEventListener('load', function(event) {
  var sheet = document.body.appendChild(document.createElement('style')).sheet;

  sheet.insertRule(
    '.rc-imageselect-table-33, .rc-imageselect-table-42, .rc-imageselect-table-44' +
    '{ transition-duration: ' + (1 / SPEED) + 's !important }', 0);
  sheet.insertRule(
    '.rc-imageselect-tile' +
    '{ transition-duration: ' + (4 / SPEED) + 's !important }', 1);
  sheet.insertRule(
    '.rc-imageselect-dynamic-selected' +
    '{ transition-duration: ' + (2 / SPEED) + 's !important }', 2);
  sheet.insertRule(
    '.rc-imageselect-progress' +
    '{ transition-duration: ' + (1 / SPEED) + 's !important }', 3);
  sheet.insertRule(
    '.rc-image-tile-overlay' +
    '{ transition-duration: ' + (1 / SPEED) + 's !important }', 4);

  var handler = selector.handle.bind(selector);

  document.body.addEventListener('mouseover', handler, false);
  document.body.addEventListener('mousedown', handler, false);
  document.body.addEventListener('mouseup', handler, false);
});

function publish(func) {
  if (typeof exportFunction == 'function') {
    return exportFunction(func, unsafeWindow);
  }

  return func;
}

var __setTimeout = unsafeWindow.setTimeout.bind(unsafeWindow);

unsafeWindow.setTimeout = publish(function(callback, delay) {
  return __setTimeout(callback, Number(delay) / SPEED);
});
function try_roll()
{
    var x = document.querySelector("#free_play_form_button"),
        myRP = document.getElementsByClassName("user_reward_points"),
        y = document.getElementById("bonus_container_free_points"),
        z = document.getElementById("bonus_container_fp_bonus");
    console.log("Detect if we can roll");
    document.title="Can we roll?";
    if(y == null){
        if(parseInt(myRP[0].innerText.replace(/,/g, '')) >=1200)
        setTimeout(function(){
            RedeemRPProduct('free_points_100');
        }, 3000);
        else
        if(parseInt(myRP[0].innerText.replace(/,/g, '')) >=600)
        setTimeout(function(){
            RedeemRPProduct('free_points_50');
        }, 3000);
        else
        if(parseInt(myRP[0].innerText.replace(/,/g, '')) >=120)
        setTimeout(function(){
            RedeemRPProduct('free_points_10');
        }, 3000);
        else
        if(parseInt(myRP[0].innerText.replace(/,/g, '')) >=12)
        setTimeout(function(){
            RedeemRPProduct('free_points_1');
        }, 3000);
    }
    if(z==null && parseInt(myRP[0].innerText.replace(/,/g, '')) >= 4400){
        setTimeout(function(){
            RedeemRPProduct('fp_bonus_1000');
        }, 3000);
    }
    if(x && x.style["display"] != "none")
    {
        console.log("Rolling...");
        document.title="Rooling...";
        x.click();
        remain = 60*6;
        counter = 0;
    }
}
function count_up()
{
    counter = counter + 1;
    if(counter >= remain)
    {
        location.reload();
    }
    try_roll();
}
function auto_roll()
{
    if(document.location.href.indexOf("freebitco.in") == -1)
        return;
    try_roll();
    timer = setInterval(count_up, 10*1000); /* 1 minutes */
}
setTimeout(function(){
        auto_roll();
    }, 3000);