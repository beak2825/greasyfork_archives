// ==UserScript==
// @name         tx-nba
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  争霸自动投降
// @author       haiger
// @match        *://hupu.cdn.ttnba.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414031/tx-nba.user.js
// @updateURL https://update.greasyfork.org/scripts/414031/tx-nba.meta.js
// ==/UserScript==

(function() {
    'use strict';
  let zbTimer = setInterval(() => {
      let mostUse = 6
      if (document.getElementsByClassName("index_btn")[0] &&
          document.getElementsByClassName("index_btn")[0].lastElementChild &&
          document.getElementsByClassName("index_btn")[0].lastElementChild.innerText > mostUse) {
          console.log('挑战完成')
          clearInterval(zbTimer)
      } else {
          var newBtn = document.getElementsByClassName("index-continue-btn-left")[0];
          var txBtn = document.getElementsByClassName("surrender-btn")[0];
          var beginBtn = document.getElementsByClassName("index_btn")[0];
          var btns = document.getElementsByClassName("card-sell-btn")
          let minutes = new Date().getMinutes()
          let seconds = new Date().getSeconds()
          console.log(minutes + ':' + seconds)
          if (btns && btns.length > 0) {
              for (let i = 0; i < btns.length; i++) {
                  if (btns[i].innerText == '确认') {
                      let confirm = btns[i]
                      angular.element(confirm).triggerHandler('click');
                      console.log('confirmClick')
                      break;
                  }
              }
          } else if (txBtn) {
              angular.element(txBtn).triggerHandler('click');
              console.log('txBtnClick')
          } else if (document.getElementsByClassName("card-explain-btn")[0]) {
              let getBtn = document.getElementsByClassName("card-explain-btn")[0]
              angular.element(getBtn).triggerHandler('click');
              console.log('getBtnClick')
          } else if (document.getElementsByClassName("action_btn")[0] || (beginBtn && beginBtn.innerText)) {
              let getPrize = document.getElementsByClassName("action_btn")[0]
              angular.element(getPrize).triggerHandler('click');
              console.log('getPrizeClick')
              if (beginBtn) {
                  if (beginBtn.innerText == '匹配对手' || beginBtn.innerText.indexOf('开启挑战') !== -1) {
                      angular.element(beginBtn).triggerHandler('click');
                      console.log('beginBtnClick')
                  }
              }
          } else if (newBtn) {
              angular.element(newBtn).triggerHandler('click');
              console.log('newBtnClick')
          } else if (document.getElementsByClassName("btn1v1")[0]) {
              let e = document.getElementsByClassName("btn1v1")[0].lastElementChild
              angular.element(e).triggerHandler('click');
              console.log('1v1Click')
          }
      }
  }, 1000);
})();
