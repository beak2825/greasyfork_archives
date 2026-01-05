// ==UserScript==
// @name        ink
// @namespace   ink
// @description ink_trade
// @include     http://www.gaiaonline.com/*
// @version     1
// @grant       none
// readme: this is a simple script to trade r/b/g ink to white.
// i made it because gaia hasnt updated the store to do bulk ink trades
// like they have for bug to ink trades. i assume theres no rule against
// this as it just a simple ink trade rather than a gold generating
// script. however, i take no responsibility.
// @downloadURL https://update.greasyfork.org/scripts/13061/ink.user.js
// @updateURL https://update.greasyfork.org/scripts/13061/ink.meta.js
// ==/UserScript==

var timeout = 4000; // pause 4 seconds between pages, change if you want
if(document.getElementById('exchange')) StepOne();
else if(document.getElementById('tradeheader')) StepTwo();
else if(document.getElementById('exchange5').childNodes.length == 21) StepThree();
else if(document.getElementById('exchange5').childNodes.length == 18) StepFour();

function StepOne() {
  setTimeout(function(){
    var trades = document.querySelectorAll("[id='exchange']");
    for (var i=0; i<trades.length; i++) {
      var anchor = trades[i].getElementsByTagName('a')[0];
      if (anchor.getAttribute('alt') == 'Select White Ink') {
        anchor.click();
        break;
      }
    }
  }, timeout);
}

function StepTwo() {
  setTimeout(function(){
    var inputs = document.getElementsByTagName('input');
    for (var i=0; i<inputs.length; i++) {
      if (inputs[i].getAttribute('alt') == 'Exchange Red Ink + Blue Ink + Green Ink for a White Ink') {
        inputs[i].click();
        break;
      }
    }
  }, timeout);
}

function StepThree() {
  setTimeout(function(){
    var imgs = document.getElementsByTagName('img');
    for (var i=0; i<imgs.length; i++) {
      if (imgs[i].getAttribute('alt') == 'Yes') {
        imgs[i].click();
        break;
      }
    }
  }, timeout);
}

function StepFour() {
  setTimeout(function(){
    var anchors = document.getElementsByTagName('a');
    for (var i=0; i<anchors.length; i++) {
      if (anchors[i].getAttribute('href') == '/gaia/exchange.php?store=bvnsukowrbkthaiq') {
        anchors[i].click();
        break;
      }
    }
  }, timeout);
}
