// ==UserScript==
// @name         碧蓝幻想Auto
// @namespace    https://greasyfork.org/zh-CN/users/188224-shino161
// @version      0.5.2
// @description  省下机械化的操作，养肝养生project
// @author       Shino161
// @compatible   chrome
// @license      MIT
// @include      *://game.granbluefantasy.jp/#event/*
// @include      *://game.granbluefantasy.jp*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368607/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/368607/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3Auto.meta.js
// ==/UserScript==

(() => {
  'use strict';
  // 抓取DOM元素时间间隔，毫秒
  const gbfStepKey = 'GBF_STEP_INDEX'
  let catchDOMcd = 1000
  let catchDOMtimer
  //控制脚本是否运行
  let actionExec = true
  let stepIndex = localStorage.getItem(gbfStepKey) || 0
  // 古战场自动打牛
  // btn-usual-ok      OK按钮
  // btn-assist        救援发送 
  // with-potion       救援发送确认
  // btn-attack-start  攻击
  // btn-auto          自动auto
  // btn-control       控制
  // btn-usual-cancel  取消
  
  // let ancientBattleField = [
  //   '.btn-ex-raid2',
  //   '.extra-raid2 div',
  //   '.btn-supporter',
  //   '.btn-usual-ok',
  //   '.btn-assist',
  //   '.with-potion',
  //   '.btn-usual-ok',
  //   '.btn-attack-start',
  //   '.btn-auto',
  //   '.btn-result',
  //   '.btn-usual-ok',
  //   '.btn-usual-cancel'
  // ]
  let eventSteps = [{
    'target': '.vh',
  },{
    'target': '.btn-supporter',
    'index': 70
  },{
    'target': '.btn-usual-ok',
  },{
    'target': '.btn-attack-start',
  },{
    'target': '.btn-auto',
  }]
  let actionSteps = eventSteps
  function catchDOMele(selector) {
    return new Promise((resolve, reject) => {
      function catchDOMelePromise (selector) {
        if ($(`${selector.target}`).length == 1) {
          console.error(`=> catch success | ${selector}`);
          $(`${selector.target}`).trigger('tap')
          clearTimeout(catchDOMtimer)
          resolve('success')
        }else if ($(`${selector.target}`).length > 1) {
          console.error(`=> catch success | ${selector}`);
          $(`${selector.target}:eq(${selector.index})`).trigger('tap')
          clearTimeout(catchDOMtimer)
          resolve('success')
        }else {
          catchDOMtimer = setTimeout(() => {
            console.log(`=> invoke catchDOM | ${selector}`);
            catchDOMelePromise(selector)
          },catchDOMcd)
        }
      }
      catchDOMelePromise(selector)
    })  
  }
  function actionBufferQueue (queue, i) {
    // if (!actionExec) {
    //   console.error('不要停下来啊（指脚本');
    //   return
    // }
    localStorage.setItem(gbfStepKey,i)
    console.log(localStorage.getItem(gbfStepKey));
    catchDOMele(queue[i]).then((res) => {
      console.log(res);
      if (res == 'success' && i < queue.length) {
        console.log('catch return');
        actionBufferQueue(queue, ++i)
      }else {
        actionBufferQueue(queue, 0)
      }
    })
  }
  actionBufferQueue(actionSteps, stepIndex)
  
  
})();