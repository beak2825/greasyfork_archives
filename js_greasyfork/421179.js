// ==UserScript==
// @name         剑灵 种彩虹活动
// @include      https://bns.qq.com/cp/a20210119rainbow/index.htm*
// @version      0.1
// @description  enter:确定邀请; 1:实时领取; 2:补充领取; 3:领取星星; 4:开启/关闭种彩虹
// @author       Ryousuke Saitou
// @match        https://www.tampermonkey.net/scripts.php
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/669061
// @downloadURL https://update.greasyfork.org/scripts/421179/%E5%89%91%E7%81%B5%20%E7%A7%8D%E5%BD%A9%E8%99%B9%E6%B4%BB%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/421179/%E5%89%91%E7%81%B5%20%E7%A7%8D%E5%BD%A9%E8%99%B9%E6%B4%BB%E5%8A%A8.meta.js
// ==/UserScript==
var i = 0;
var scheduled = "";
document.onkeydown=function(e){
    var event = e || window.event;
    var key = event.which || event.keyCode || event.charCode;
    if(key ==13){
        obsClick('.pop-btns.clearfix>.btn6.ti',10)
    }else if(key ==49){
        obsClick('.welfares1.clearfix li>.btn1.ti',10)
    }else if(key == 50){
        obsClick('.welfares1.clearfix li>.add-btn1.ti',10)
    }else if(key == 51){
        obsClick('.invi-btns.clearfix>.btn3.ti',10)
    }else if(key == 52){
       if(i%2 == 0){
           scheduled = setInterval(scheduledClick,2000)
       }else{
           clearInterval(scheduled)
       }
       i++
    }
}

function scheduledClick(){
    obsClick('.rainbow-handle>.btn4.ti',10)
}

function fireKeyEvent(el, evtType, keyCode) {
  var evtObj;
  if (document.createEvent) {
      if (window.KeyEvent) {//firefox 浏览器下模拟事件
          evtObj = document.createEvent('KeyEvents');
          evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
      } else {//chrome 浏览器下模拟事件
          evtObj = document.createEvent('UIEvents');
          evtObj.initUIEvent(evtType, true, true, window, 1);

          delete evtObj.keyCode;
          if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
              Object.defineProperty(evtObj, "keyCode", { value: keyCode });
          } else {
              evtObj.key = String.fromCharCode(keyCode);
          }

          if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
              Object.defineProperty(evtObj, "ctrlKey", { value: true });
          } else {
              evtObj.ctrlKey = true;
          }
      }
      el.dispatchEvent(evtObj);

  } else if (document.createEventObject) {//IE 浏览器下模拟事件
      evtObj = document.createEventObject();
      evtObj.keyCode = keyCode
      el.fireEvent('on' + evtType, evtObj);
  }
}

function obsClick(selector, time = 0, desc = 'click') {
  return new Promise(resolve => {
    //obs node
    let timer = setInterval(() => {
      let target = document.querySelector(selector)
      if (!!target) {
        clearInterval(timer)
        if (time < 0) {
          setTimeout(() => {
            target.click()
            console.log(desc, selector)
            resolve(selector)
          }, Math.abs(time) * 1000)
        } else if (time > 0) {
          target.click()
          setTimeout(() => {
            console.log(desc, selector)
            resolve(selector)
          }, Math.abs(time) * 1000)
        } else {
          target.click()
          console.log(desc, selector)
          resolve(selector)
        }
      } else {
        return
      }
    }, 100)
  })
}


// 禁止alert框
addJS_Node (null, null, overrideSelectNativeJS_Functions);

function overrideSelectNativeJS_Functions () {
    window.alert = function alert (message) {
        console.log (message);
    }
}

function addJS_Node (text, s_URL, funcToRun) {
    var D = document;
    var scriptNode = D.createElement ('script');
    scriptNode.type = "text/javascript";
    if (text) scriptNode.textContent = text;
    if (s_URL) scriptNode.src = s_URL;
    if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}

