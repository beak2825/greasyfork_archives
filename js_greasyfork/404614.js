// ==UserScript==
// @name         cytube_auto_control
// @namespace    https://cytube.xyz/
// @version      1.2.1
// @description  プレイリストロック状態や再生順序を自動切り替え
// @author       hatarake-
// @match        https://cytube.xyz/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404614/cytube_auto_control.user.js
// @updateURL https://update.greasyfork.org/scripts/404614/cytube_auto_control.meta.js
// ==/UserScript==

$(function(){
var changeLockState = function(targetState) {
  var lockbtn = $("#qlockbtn");

  if(!lockbtn.hasClass(targetState)) lockbtn.trigger("click");
}
var lock = function() {
  changeLockState("btn-danger");
}
var open = function() {
  changeLockState("btn-success");
}

var changeRandomState = function(nextState, prevState) {
  var randombtn = $("#randomplaybtn");

  if(randombtn.hasClass(nextState)){
    randombtn.trigger("click");
    randombtn.trigger("click");
  } else if(randombtn.hasClass(prevState)){
    randombtn.trigger("click");
  }
}
var uekara = function() {
  changeRandomState("btn-success", "btn-warning");
}
var random = function() {
  changeRandomState("btn-warning", "btn-default");
}
var vote = function() {
  changeRandomState("btn-default", "btn-success");
}

var addVideo = function(url) {
  $("#mediaurl").val(url);
  $("#queue_next").trigger("click");
}

var chime1 = function() {
  addVideo("https://youtube.com/watch?v=4K0FTmR2FXY");
}
var chime2 = function() {
  addVideo("https://youtube.com/watch?v=HqN2W208xDQ");
}
var taisou = function() {
  addVideo("https://youtube.com/watch?v=dyIPVcsrEDo");
}

var tenki = function() {
  $.getJSON(
    "https://hatarake-youtube-api.herokuapp.com/tenki",
    {},
    function(json) {
      addVideo(json["url"]);
    });
}

var taisouAndTenki = function() {
  $.getJSON(
    "https://hatarake-youtube-api.herokuapp.com/tenki",
    {},
    function(json) {
      addVideo(json["url"]);
      taisou();
    });
}


var main = function() {
  var d = new Date();
  if(d.getHours() == 9 && d.getMinutes() == 0){
    // 09時00分になったら プレイリスト開放で ラジオ体操&天気予報を入れて 上から流す
    open();
    taisouAndTenki();
    uekara();
  } else if(d.getHours() == 10 && d.getMinutes() == 30){
    // 10時30分になったら 投票にする
    vote();
  } else if(d.getHours() == 12 && d.getMinutes() == 0){
    // 12時00分になったら チャイムを入れて 上から流す
    chime1();
    uekara();
  } else if(d.getHours() == 13 && d.getMinutes() == 0){
    // 13時00分になったら ランダムにする
    random();
  } else if(d.getHours() == 14 && d.getMinutes() == 0){
    // 14時00分になったら 投票にする
    vote();
  } else if(d.getHours() == 18 && d.getMinutes() == 0){
    // 18時00分になったら プレイリスト閉じて 終業チャイムを入れて 上からにする
    // lock();
    chime2();
    uekara();
  } else if(d.getHours() == 19 && d.getMinutes() == 30){
    // 19時30分になったら ランダムにする
    random();
  } else if(d.getHours() == 21 && d.getMinutes() == 0){
    // 21時00分になったら 投票にする
    vote();
  } else if(d.getHours() == 0 && d.getMinutes() == 0){
    // 00時00分になったら 上からにする
    uekara();
  }
}

// 35秒ごとにチェック
if(!$("#randomplaybtn")[0]["disabled"]) {
  setInterval(main, 35 * 1000);
}
});