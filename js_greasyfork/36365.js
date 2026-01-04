// ==UserScript==
// @name         ACGN股票系統股價更新傳送BOT
// @namespace    http://tampermonkey.net/
// @version      1.10.50
// @description  try to take over the world!
// @author       You// ==UserScript==
// @name         ACGN股票系統股價更新傳送BOT
// @namespace    http://tampermonkey.net/
// @description  try to take over the world!
// @author       You
// @include      /http[s]*:\/\/acgn-stock.com\/company\/[0-9]+/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36365/ACGN%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E8%82%A1%E5%83%B9%E6%9B%B4%E6%96%B0%E5%82%B3%E9%80%81BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/36365/ACGN%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E8%82%A1%E5%83%B9%E6%9B%B4%E6%96%B0%E5%82%B3%E9%80%81BOT.meta.js
// ==/UserScript==
var priceMap, date, nowTime, styleBtn = new Array();
var discordHallBotUrl = "https://discordapp.com/api/webhooks/391127605182595073/2g1MEtFzrn5NXE5AR_fEQHZ2UziPzefEzgjx8tXrSteVRfpFoprx4l4w2XGM1EWs3rwF";
var discordHallHighPriceBotUrl = "https://discordapp.com/api/webhooks/391119930105397249/oMRidq8mNosAKIEPOfWglGxtSlUDNDDlhgHZIRWDYgR2Fg07YZCSIjUX3f9FF7u3aMsn";
var lastRecordListPriceTime, highPriceCompanyCount;

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function getTimeString(date)
{
    // getMonth()	Returns the month (from 0-11) ....為了正常顯示1~12月 手動+1
    return ('0' + (date.getMonth() + 1)).slice(-2) + "/" + ('0' + date.getDate()).slice(-2) + " " + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2);
}

// 將股價更新情報送至#hall
function pushInformationToDiscord(){
	date = lastRecordListPriceTime = Meteor.connection._mongo_livedata_collections.variables.findOne("recordListPriceBegin").value;
    var timeA, timeB;
    timeA = new Date(Meteor.connection._mongo_livedata_collections.variables.findOne("recordListPriceBegin").value);
    timeB = new Date(Meteor.connection._mongo_livedata_collections.variables.findOne("recordListPriceEnd").value);
	var obj = {
		content : "UMP40好可愛～ \n"+" <:ahah:384873035137679360> 下次股價更新時間 " + getTimeString(timeA) + "～" + getTimeString(timeB) + "  (UTC+8) <:ahah:384873035137679360>"
	};
	var json = JSON.stringify(obj);
	var request = new XMLHttpRequest(); // xhr() 會建立非同步物件
	request.open("POST", discordHallBotUrl, false); // 同步連線 POST到該連線位址
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(json);
	priceMap = new Map();
}

// 將高價標準送至discord
function pushHighPriceCompanyAmountToDiscord(){
	highPriceCompanyCount = Number(Meteor.connection._mongo_livedata_collections.variables.findOne("highPriceCompanyCount").value);
    
	var obj = {
		content : "UMP40好可愛～ \n" + "<:ahah:384873035137679360> 股價前「" + highPriceCompanyCount + "」家公司(總公司數*5%) <:ahah:384873035137679360> "
	};
	var json = JSON.stringify(obj);
	var request = new XMLHttpRequest(); // xhr() 會建立非同步物件
	request.open("POST", discordHallHighPriceBotUrl, false); // 同步連線 POST到該連線位址
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(json);
	priceMap = new Map();
}


function checkServerInfo() {
    if(lastRecordListPriceTime != Meteor.connection._mongo_livedata_collections.variables.findOne("recordListPriceBegin").value)
        pushInformationToDiscord();
    if(highPriceCompanyCount != Meteor.connection._mongo_livedata_collections.variables.findOne("highPriceCompanyCount").value)
        pushHighPriceCompanyAmountToDiscord();
}

function searchStyleButton(){
    var i;
    for(i = 0; i < $('.nav-link').length; ++i)
        if($('.nav-link')[i].innerText.search("亮色") != -1){
            styleBtn[0] = $('.nav-link')[i];
            styleBtn[1] = $('.nav-link')[i + 1];
            break;
        }
}

function refresh(){
	styleBtn[0].click();
	sleep(200);
	styleBtn[1].click();
}

(function(){
    'use strict';
    console.log("startUpdateTimeDetect");
	nowTime = Number(Date.now());
	priceMap = new Map();
    setTimeout(searchStyleButton, 1000);
	setInterval(checkServerInfo, 60000);
	setInterval(refresh, 210000);
    setTimeout(function(){
        lastRecordListPriceTime = Meteor.connection._mongo_livedata_collections.variables.findOne("recordListPriceBegin").value;
        highPriceCompanyCount = Meteor.connection._mongo_livedata_collections.variables.findOne("highPriceCompanyCount").value;
    },1000);
})();