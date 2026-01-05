// ==UserScript==
// @name         Scrypt.cc BTCEUR / Income
// @version      1.2.1
// @description  Adds EUR values to every btc info on the dashboard
// @author       Glitch, modded by den_tim
// @match        https://scrypt.cc/users/index.php
// @grant        none
// @namespace https://greasyfork.org/users/13709
// @downloadURL https://update.greasyfork.org/scripts/11282/Scryptcc%20BTCEUR%20%20Income.user.js
// @updateURL https://update.greasyfork.org/scripts/11282/Scryptcc%20BTCEUR%20%20Income.meta.js
// ==/UserScript==
function httpGet(theUrl)
{
  var xmlHttp = null;
  xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', theUrl, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}
var btcusd = Number(httpGet('https://api.bitcoinaverage.com/ticker/global/EUR/24h_avg'));
//var daily = Number(httpGet("https://scrypt.cc/users/calculator.php").match(/calculateIncome\(([^)]+)\)/gi)[0].replace(/[^\d.-]/g,''));
//var daily = Number(httpGet('https://scrypt.cc/users/calculator.php').match(/calculateIncome\(([^)]+)\)/gi) [0].split('(') [1].split('E') [0]) / 100000000;
//alert(Number(httpGet("https://scrypt.cc/users/calculator.php").match(/calculateIncome\(([^)]+)\)/gi)[0].split('(')[1].split('E')[0]));
//Find real average mining reward
var totalamount = 0;
var lastamount = 0;
var oldesttime = false;
var newesttime = false;
for (var i in document.getElementById('tralist').getElementsByTagName('label')) {
  var el = document.getElementById('tralist').getElementsByTagName('label') [i];
  if (el.id == 'l9') {
    var timestamp = new Date(el.innerHTML.replace('-', '/').replace('-', '/'));
    //console.log('timestamp ' + timestamp.valueOf());
    if (!newesttime) {
      //first timestamp in list
      newesttime = timestamp.valueOf();
    } else {
      oldesttime = timestamp.valueOf();
    }
  }
  if (el.id == 'l11') {
    var amount = Number(el.innerHTML.split(' ') [0]);
    //console.log('amount ' + amount);
    // Add previous amount but not last
    totalamount += lastamount;
    lastamount = amount;
  }
}
//console.log('Oldest timestamp: ' + oldesttime);
//console.log('Newest timestamp: ' + newesttime);
//console.log("Total amount:" + totalamount);
var timediff = newesttime - oldesttime;
var dailytotal = totalamount / timediff * 1000 * 60*60*24;
//console.log("Daily amount:" + dailytotal);

var khsprice = Number(httpGet('https://scrypt.cc/users/api.php?method=2&r=' + Math.random()).split('_', 1) [0].split(',', 2) [1]);
var openorders = httpGet('https://scrypt.cc/users/api.php?method=3&r=' + Math.random())
var openorderkhsbuy = 0
var openorderamountsell = 0
for (var i in openorders.split('!+')) {
  try {
    var line = openorders.split('!+') [i];
    var amount = Number(line.split('-') [5].split('*') [1])
    var khs = Number(line.split('-') [4].split('$') [1].replace(',', ''));
    var dir = line.split('%') [1][0];
    if (dir == '{') {
      openorderkhsbuy += khs;
    } else {
      openorderamountsell += amount;
    }
  } catch (err) {
  }
}
var referralText = httpGet('https://scrypt.cc/users/referral.php');
var parser = new DOMParser();
var referralDom = parser.parseFromString(referralText, 'text/html');
var referralKhs = referralDom.getElementById('idblc_4').textContent;
var referralDaily = referralDom.getElementById('idblc_6').textContent;
var referralMonthly = referralDom.getElementById('idblc_12_1').textContent;
var khs = Number(document.getElementById('idblc_9').getElementsByTagName('div') [1].textContent.replace(/[^\d.-]/g, ''));

var daily = dailytotal / khs;
//console.log("daily/khs:" + daily);
var dailyReward = daily;
var roi = khsprice / daily;
//console.log("roi " + roi);

var khsorder = Number(document.getElementById('idblc_9').getElementsByTagName('div') [2].textContent.replace(/[^\d.-]/g, ''));
var khstotal = Number(document.getElementById('idblc_9').getElementsByTagName('div') [3].textContent.replace(/[^\d.-]/g, ''));
daily = daily * khstotal;
var balance = Number(document.getElementById('idblc_2').getElementsByTagName('div') [1].textContent);
var order = Number(document.getElementById('idblc_2').getElementsByTagName('div') [2].textContent);
var total = Number(document.getElementById('idblc_2').getElementsByTagName('div') [3].textContent);
document.getElementById('idblc_2').getElementsByTagName('div') [1].innerHTML = 'BTC: ' + balance.toFixed(8) + '<br>EUR: ' + (balance * btcusd).toFixed(4);
document.getElementById('idblc_2').getElementsByTagName('div') [2].innerHTML = 'BTC: ' + order.toFixed(8) + '<br>EUR: ' + (order * btcusd).toFixed(4) + '<br>KHS: ' + openorderkhsbuy.toLocaleString();
document.getElementById('idblc_2').getElementsByTagName('div') [3].innerHTML = 'BTC: ' + total.toFixed(8) + '<br>EUR: ' + (total * btcusd).toFixed(4);
document.getElementById('idblc_9').getElementsByTagName('div') [1].innerHTML = 'KHS: ' + document.getElementById('idblc_9').getElementsByTagName('div') [1].textContent + '<br>~BTC: ' + (khs * khsprice).toFixed(8) + '<br>~EUR: ' + (khs * khsprice * btcusd).toFixed(4) + '<br>@' + khsprice * 100000000 + 'sat/KHS';
document.getElementById('idblc_9').getElementsByTagName('div') [2].innerHTML = 'KHS: ' + document.getElementById('idblc_9').getElementsByTagName('div') [2].textContent + '<br>BTC: ' + (openorderamountsell).toFixed(8) + '<br>EUR: ' + (openorderamountsell * btcusd).toFixed(4);
document.getElementById('idblc_9').getElementsByTagName('div') [3].innerHTML = 'KHS: ' + document.getElementById('idblc_9').getElementsByTagName('div') [3].textContent + '<br>~BTC: ' + (khstotal * khsprice).toFixed(8) + '<br>~EUR: ' + (khstotal * khsprice * btcusd).toFixed(4);
document.getElementById('idblc_2').style.height = 65;
document.getElementById('idblc_9').style.height = 80;
var container = document.getElementById('indexbalance2');
container.innerHTML = '<div id="divheading">'
+ '<div id="idblc_1">Rewards</div>'
+ '<div id="idblc_5">Estimated Daily Income</div>'
+ '<div id="idblc_5">Estimated Monthly Income</div><br><br>'
+ '</div>'
+ '<div id="idblc_2">'
+ '<div id="idblc_3">S/K/D&nbsp;&nbsp;&nbsp;</div>'
+ '<div id="idblc_4">' + (dailyReward * 100000000).toFixed(4) + "<BR>ROI: " + roi.toFixed(2) + ' days</div>'
+ '<div id="idblc_6">BTC: ' + daily.toFixed(8) + '<BR>EUR: ' + (btcusd * daily).toFixed(4) + '</div>'
+ '<div id="idblc_12">BTC: ' + (daily * 30).toFixed(8) + '<BR>EUR:  ' + (btcusd * daily * 30).toFixed(4) + '</div>'
+ '</div>'
+ '<div id="idblc_2">'
+ '<div id="idblc_3">Referral</div>'
+ '<div id="idblc_4">' + referralKhs + '</div>'
+ '<div id="idblc_6">' + referralDaily + '<BR>EUR: ' + (btcusd * Number(referralDaily.replace(/[^\d.-]/g, ''))).toFixed(4) + '</div>'
+ '<div id="idblc_12">' + referralMonthly + '<BR>EUR: ' + (btcusd * Number(referralMonthly.replace(/[^\d.-]/g, ''))).toFixed(4) + '</div>'
+ '</div>'
+ '<div id="idblc_9">'
+ '<div id="idblc_3">Total&nbsp;&nbsp;&nbsp;&nbsp;</div>'
+ '<div id="idblc_4">' + '' + '</div>'
+ '<div id="idblc_6">BTC: ' + (daily + Number(referralDaily.replace(/[^\d.-]/g, ''))).toFixed(8) + '<BR>EUR: ' + (btcusd * Number(referralDaily.replace(/[^\d.-]/g, '')) + btcusd * daily).toFixed(4) + '</div>'
+ '<div id="idblc_12">BTC: ' + (daily * 30 + Number(referralMonthly.replace(/[^\d.-]/g, ''))).toFixed(8) + '<BR>EUR: ' + (btcusd * daily * 30 + btcusd * Number(referralMonthly.replace(/[^\d.-]/g, ''))).toFixed(4) + '</div>'
+ '</div>';
