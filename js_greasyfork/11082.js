// ==UserScript==
// @name         Scrypt.cc BTCUSD / Income
// @version      1.2.1
// @description  Adds USD values to every btc info on the dashboard.
// @author       Glitch
// @match        https://scrypt.cc/users/index.php
// @grant        none
// @namespace https://greasyfork.org/users/13326
// @downloadURL https://update.greasyfork.org/scripts/11082/Scryptcc%20BTCUSD%20%20Income.user.js
// @updateURL https://update.greasyfork.org/scripts/11082/Scryptcc%20BTCUSD%20%20Income.meta.js
// ==/UserScript==
 
 
function httpGet(theUrl)
{
    var xmlHttp = null;
 
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
 
var btcusd = JSON.parse(httpGet("https://api.coindesk.com/v1/bpi/currentprice/usd.json")).bpi.USD.rate_float;
var daily = Number(httpGet("https://scrypt.cc/users/calculator.php").match(/calculateIncome\(([^)]+)\)/gi)[0].replace(/[^\d.E-]/g,''));
var dailyReward = daily;
 
var referralText = httpGet("https://scrypt.cc/users/referral.php");
var parser = new DOMParser();
var referralDom = parser.parseFromString(referralText,"text/html");
 
var referralKhs = referralDom.getElementById("idblc_4").textContent;
var referralDaily = referralDom.getElementById("idblc_6").textContent;
var referralMonthly = referralDom.getElementById("idblc_12_1").textContent;
 
var khs = Number(document.getElementById('idblc_9').getElementsByTagName('div')[3].textContent.replace(/[^\d.-]/g,''));
daily = daily * khs;
 
var balance = Number(document.getElementById('idblc_2').getElementsByTagName('div')[1].textContent);
var order = Number(document.getElementById('idblc_2').getElementsByTagName('div')[2].textContent);
var total = Number(document.getElementById('idblc_2').getElementsByTagName('div')[3].textContent);
 
document.getElementById('idblc_2').getElementsByTagName('div')[1].textContent = balance.toFixed(8) + ", $" + (balance * btcusd).toFixed(4);
document.getElementById('idblc_2').getElementsByTagName('div')[2].textContent = order.toFixed(8) + ", $" + (order * btcusd).toFixed(4);
document.getElementById('idblc_2').getElementsByTagName('div')[3].textContent = total.toFixed(8) + ", $" + (total * btcusd).toFixed(4);

var container = document.getElementById("indexbalance2");
if (document.getElementById('tralist').children[1].textContent == "Mining") {
    var actual = (Number(document.getElementById('tralist').children[2].textContent.replace(/[^\d.-]/g,'')) * 144);
} else {
    var actual = (Number(document.getElementById('tralist').children[7].textContent.replace(/[^\d.-]/g,'')) * 144);
}
 
container.innerHTML = '<div id="divheading">'
+ '<div id="idblc_1">Rewards</div>'
+ '<div id="idblc_5">Estimated Daily Income</div>'
+ '<div id="idblc_5">Estimated Monthly Income</div><br><br>'
+ '</div>'
+ '<div id="idblc_2">'
+ '<div id="idblc_3">Expected</div>'
+ '<div id="idblc_4">' + (dailyReward * 100000).toFixed(4) + '</div>'
+ '<div id="idblc_6">BTC: ' + daily.toFixed(8) + ', $' + (btcusd * daily).toFixed(4) + '</div>'
+ '<div id="idblc_12">BTC: ' + (daily * 30).toFixed(8) + ', $' + (btcusd * daily * 30).toFixed(4) + '</div>'
+ '</div>'
//+ '<div id="idblc_2">'
//+ '<div id="idblc_3">Last&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>'
//+ '<div id="idblc_4">' + ((actual / khs) * 100000).toFixed(4) + '</div>'
//+ '<div id="idblc_6">BTC: ' + (actual * 1).toFixed(8) + ', $' + (btcusd * actual).toFixed(4) + '</div>'
//+ '<div id="idblc_12">BTC: ' + (actual * 30).toFixed(8) + ', $' + (btcusd * actual * 30).toFixed(4) + '</div>'
//+ '</div>'
+ '<div id="idblc_2">'
+ '<div id="idblc_3">Referral&nbsp;&nbsp;</div>'
+ '<div id="idblc_4">' + referralKhs + '</div>'
+ '<div id="idblc_6">' + referralDaily + ', $' + (btcusd * Number(referralDaily.replace(/[^\d.-]/g,''))).toFixed(4) + '</div>'
+ '<div id="idblc_12">' + referralMonthly + ', $' + (btcusd * Number(referralMonthly.replace(/[^\d.-]/g,''))).toFixed(4) + '</div>'
+ '</div>'
+ '<div id="idblc_9">'
+ '<div id="idblc_3">Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>'
+ '<div id="idblc_4">///////</div>'
+ '<div id="idblc_6">BTC: ' + (actual + Number(referralDaily.replace(/[^\d.-]/g,''))).toFixed(8) + ', $' + (btcusd * Number(referralDaily.replace(/[^\d.-]/g,'')) + btcusd * actual).toFixed(4) +'</div>'
+ '<div id="idblc_12">BTC: ' + (actual * 30 + Number(referralMonthly.replace(/[^\d.-]/g,''))).toFixed(8) + ', $' + (btcusd * actual * 30 + btcusd * Number(referralMonthly.replace(/[^\d.-]/g,''))).toFixed(4) + '</div>'
+ '</div>';