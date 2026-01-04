// ==UserScript==
// @name         FW内部QD
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  内部插件，请勿传播！
// @author       BSTzxsky
// @match        http://sys.12348.gov.cn/resources/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/389268/FW%E5%86%85%E9%83%A8QD.user.js
// @updateURL https://update.greasyfork.org/scripts/389268/FW%E5%86%85%E9%83%A8QD.meta.js
// ==/UserScript==

function clickbutton() {
  var buttonone = document.getElementsByClassName("el-tabs__item")
  var buttonone6 = document.getElementsByClassName("el-button--default")
  var buttonone2 = document.getElementsByClassName("dz-btnstyle")
  var buttonone8 = document.getElementsByClassName("el-message-box__wrapper")
  if(buttonone8.length>0){
  buttonone6[1].click();
  }
  else if(buttonone2.length>0){
    buttonone2[0].click();
    buttonone2[1].click();
    buttonone6[1].click();
  }
    else{
    buttonone[0].click();
    }
}
setInterval(clickbutton, 200);