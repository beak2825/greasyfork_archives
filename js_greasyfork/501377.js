// ==UserScript==
// @name         drrrkari_timereport
// @name:ja      デュララ時報
// @namespace    https://greasyfork.org/users/735907-cauliflower-carrot
// @version      5.8
// @description  Some additional functions for drrrkari.com
// @description:ja デュラチャ(仮) 時報　メッセージ発言
// @author       Aoi
// @match        http://drrrkari.com/room/
// @icon         https://www.google.com/s2/favicons?domain=drrrkari.com
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/501377/drrrkari_timereport.user.js
// @updateURL https://update.greasyfork.org/scripts/501377/drrrkari_timereport.meta.js
// ==/UserScript==

var version = '5.8'; // 最新バージョン
var interval = 900; // 何秒毎に時報を送信するか
var preffix = '';
var offset = 9.0;
var suffix = '';
var siteUrl = 'http://drrrkari.com';

// Send message
function sendmsg(msg) {
  $.post(siteUrl + '/room/?ajax=1', Object.assign({ valid: 1 }, { message: msg }));
  var content = '<dl class="talk ' + $("#user_icon").text() + '" id="' + $("#user_id").text() + '">';
  content += '<dt>' + $("#user_name").text() + '</dt>';
  content += '<dd>';
  content += '<div class="bubble" style="margin: -16px 0px 0px;">';
  content += '<div style="position: relative; float: left; margin: 0px; top: 39px; left: -3px; width: 22px; height: 16px; background: #ffffff;) left -81px repeat-x transparent;">';
  content += '<div style="width: 100%; height: 100%; background: url(&quot;http://drrrkari.com/css/tail.png&quot;) left -17px no-repeat transparent;">';
  content += '</div>';
  content += '</div>';
  content += '<p class="body" style="margin: 0px 0px 0px 15px;">' + msg.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi, "<a href='/jump.php?url=$1' target='_blank'>$1</a>") + '</p>';
  content += '</div></dd></dl>';
  document.getElementById('talks').insertAdjacentHTML('afterbegin', content);
}

// ----TIME_REPORT----
var timerep_on = false;
var weeks = ["日", "月", "火", "水", "木", "金", "土"];

function theTime(offset) {
  let d = new Date();
  let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  let nd = new Date(utc + (3600000 * offset)).getTime();
  return new Date(nd);
}

function sendTime() {
  let nd = theTime(offset);
  let month = nd.getMonth() + 1;
  let day = nd.getDate();
  let hour = nd.getHours();
  let minute = nd.getMinutes();
  let week = nd.getDay();
  sendmsg(preffix + " " + (10 > month ? '0' + month : month) + '/' + (10 > day ? '0' + day : day) + '(' + weeks[week] + ') ' + (10 > hour ? '0' + hour : hour) + ':' + (10 > minute ? '0' + minute : minute) + " " + suffix);
}

var timebtn = document.createElement("BUTTON");

timebtn.addEventListener("click", function () {
  if (timebtn.innerHTML == "時報開始") {
    timerep_on = true; main();
    timebtn.innerHTML = "時報停止";
    timebtn.style.backgroundColor = "#99ff99";
  }
  else {
    timerep_on = false;
    timebtn.innerHTML = "時報開始";
    timebtn.style.backgroundColor = "#ff9999";
  }
});

timebtn.innerHTML = "時報開始";

document.getElementById('setting_pannel2').getElementsByTagName("p")[0].insertAdjacentHTML("beforeend", "<br>drrrkari_timereport ver" + version + "<br>");

document.getElementById('setting_pannel2').getElementsByTagName("p")[0].appendChild(timebtn);

var timeSendBtn = document.createElement("BUTTON");
timeSendBtn.innerHTML = "時報送信";
timeSendBtn.style.backgroundColor = "#99ff99";
document.getElementsByClassName("userprof")[0].appendChild(timeSendBtn);
timeSendBtn.addEventListener("click", function () {
  sendTime();
});

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
interval = 1000 * interval;
const main = async () => {
  while (timerep_on) {
    await sleep(interval - (new Date().getTime()) % interval);
    if (timerep_on) {
      sendTime();
    }
  }
}

timebtn.click();
