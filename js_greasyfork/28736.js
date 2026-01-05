// ==UserScript==
// @name        BvS Wkai indicator
// @namespace   yichizhng@gmail.com
// @include     http://*animecubed.com/billy/bvs/worldkaiju.html
// @version     1
// @grant       none
// @description indicator for Wkai summoning order.
// @downloadURL https://update.greasyfork.org/scripts/28736/BvS%20Wkai%20indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/28736/BvS%20Wkai%20indicator.meta.js
// ==/UserScript==

var n = new Date().toLocaleString('en-US', {timeZone: 'America/Winnipeg'});
var q = new Date(+new Date() + 24*60*60000).toLocaleString('en-US', {timeZone: 'America/Winnipeg'});

var m = /\d+\/(\d+)\//.exec(n);
var o = /\d+\/(\d+)\//.exec(q);

if (m) {
  //console.log(m[1])
  //var w = m[1]%5;
  var curWkai = ['Craftworld of War','AspenStory','ADAM','FarmVale', 'ForeverQuest'][m[1]%5];
  var nextWkai = ['Craftworld of War','AspenStory','ADAM','FarmVale', 'ForeverQuest'][o[1]%5];
  if (kairules) {
    var newNode1 = document.createElement("div");
    newNode1.appendChild(document.createTextNode('Current WKai: ' + curWkai));
    var newNode2 = document.createElement("div");
    newNode2.appendChild(document.createTextNode('Tomorrow\'s WKai: ' + nextWkai));
    kairules.parentNode.insertBefore(newNode1, kairules);
    kairules.parentNode.insertBefore(newNode2, kairules);
  } else {
    console.log(curWkai);
    console.log(nextWkai);
  }
}
else { console.error(':(')}