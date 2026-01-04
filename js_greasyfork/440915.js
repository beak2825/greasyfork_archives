// ==UserScript==
// @name        Fast BTC Miner👍 
// @namespace   Sign up now and leave it Mining 
// @match       https://miningonebitcoin.com/*
// @grant       none
// @version     1.1.0
// @icon         https://www.google.com/s2/favicons?domain=miningonebitcoin.com
// @author      tomekmahrooq
// @description Make BTC Miner fast 
// @downloadURL https://update.greasyfork.org/scripts/440915/Fast%20BTC%20Miner%F0%9F%91%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/440915/Fast%20BTC%20Miner%F0%9F%91%8D.meta.js
// ==/UserScript==


var delay = 10;
countEarnings = function() {
  var totalProfit = 0.00000000;
  var balance = 0;
  var dps = document.getElementsByClassName('deposit_pb');
  for (i in dps) {
    if (isNaN(parseInt(i))) continue;
    var amount = parseFloat(dps[i].getAttribute('data-amount'));
    if (isNaN(amount)) return;
    var compound = parseFloat(dps[i].getAttribute('data-compound'));
    if (isNaN(compound)) compound = 0;
    var percent = parseFloat(dps[i].getAttribute('data-percent'));
    if (isNaN(percent)) return;
    var duration = parseFloat(dps[i].getAttribute('data-duration'));
    if (isNaN(duration)) return;
    var last_pay = parseFloat(dps[i].getAttribute('data-last-pay'));
    if (isNaN(last_pay)) return;
    var totaltime = parseFloat(dps[i].getAttribute('data-totaltime'));
    if (isNaN(totaltime)) return;
    duration += delay * 10;
    if (totaltime > 0 && duration > totaltime) duration = totaltime;
    dps[i].setAttribute('data-duration', duration);
    var profit = (amount/100)*(duration/1000)*(percent/3600);
    totalProfit += profit;
    var profit1 = (amount/100)*((duration-last_pay)/1000)*(percent/3600);
    balance += profit1*(1-(compound/10));
  }
  var obj = document.getElementById('total_profit');
  if (obj) {
    obj.innerHTML = totalProfit.toFixed(13);
  }
  var obj = document.getElementById('total_balance');
  if (obj) {
    obj.innerHTML = balance.toFixed(8);
  }
  setTimeout('countEarnings()', delay);
};