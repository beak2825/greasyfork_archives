// ==UserScript==
// @name        beat-admaven
// @namespace   ethan@stuffpipeline.co
// @description Blocks ads that run themselves as bookmarklets. You know who you are!
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26483/beat-admaven.user.js
// @updateURL https://update.greasyfork.org/scripts/26483/beat-admaven.meta.js
// ==/UserScript==


function getAdScriptEl() {
  return document.querySelector('script[data-cfasync="false"]');
}

function getAdNum() {
  return getAdScriptEl().src.split('?cdlad=')[1];
}

function injectAdStopCodes(adNum, epoch) {
  var stop1k = 'admaven_pop_' + adNum + '_d';
  var stop2k = 'admaven_pop_' + adNum + '_ts';
  var stop3k = 'admaven_pop_' + adNum + '_u["2310315220"]';
  
  var stop1v = epoch + '_1';
  var stop2v = epoch;
  var stop3v = epoch + '_1';
  
  sessionStorage.setItem(stop1k, stop1v);
  sessionStorage.setItem(stop2k, stop2v);
  sessionStorage.setItem(stop3k, stop3v);
}

function refreshStopCodes() {
  if (getAdScriptEl() !== undefined) {
    var myAdNum = getAdNum();
    var myEpoch = Date.now() + 90000000000;
    injectAdStopCodes(myAdNum, myEpoch);
  }
}

refreshStopCodes();