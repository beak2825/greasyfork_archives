// ==UserScript==
// @name         cytube_auto_control
// @namespace    https://cytube.xyz/
// @version      1.0
// @description  プレイリストロック状態や再生順序を自動切り替え
// @author       hatarake-
// @match        https://cytube.xyz/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404408/cytube_auto_control.user.js
// @updateURL https://update.greasyfork.org/scripts/404408/cytube_auto_control.meta.js
// ==/UserScript==

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

var main = function() {
  var d = new Date();
  if(d.getHours() == 9 && d.getMinutes() == 0){
    // 09時00分になったら プレイリスト開放で 上から流す
    open();
    uekara();
  } else if(d.getHours() == 10 && d.getMinutes() == 0){
    // 10時30分になったら プレイリスト開放で 投票にする
    open();
    vote();
  } else if(d.getHours() == 12 && d.getMinutes() == 0){
    // 12時00分になったら プレイリスト開放で 上から流す
    open();
    uekara();
  } else if(d.getHours() == 13 && d.getMinutes() == 0){
    // 13時00分になったら プレイリスト開放で ランダムにする
    open();
    random();
  } else if(d.getHours() == 14 && d.getMinutes() == 0){
    // 14時00分になったら プレイリスト開放で 投票にする
    open();
    vote();
  } else if(d.getHours() == 18 && d.getMinutes() == 0){
    // 18時00分になったら プレイリスト閉じて 上からにする
    lock();
    uekara();
  } else if(d.getHours() == 19 && d.getMinutes() == 30){
    // 19時30分になったら プレイリスト閉じて ランダムにする
    lock();
    random();
  } else if(d.getHours() == 21 && d.getMinutes() == 0){
    // 21時00分になったら プレイリスト閉じて ランダムにする
    lock();
    vote();
  } else if(d.getHours() == 0 && d.getMinutes() == 0){
    // 00時00分になったら プレイリスト閉じて ランダムにする
    lock();
    uekara();
  }
}

// 25秒ごとにチェック
setInterval(main, 25 * 1000);