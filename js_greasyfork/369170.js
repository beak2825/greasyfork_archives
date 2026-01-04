// ==UserScript==
// @name         北大青鸟
// @namespace    http://pansx.net/
// @version      0.6
// @description  北大青鸟题库辅助!
// @author       pansx
// @match        http://*.kgc.cn/testing/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369170/%E5%8C%97%E5%A4%A7%E9%9D%92%E9%B8%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/369170/%E5%8C%97%E5%A4%A7%E9%9D%92%E9%B8%9F.meta.js
// ==/UserScript==

(function () {
  'use strict'
  //青鸟账号登录
  $('body > section > div > div > ul > li.gray').click()
  //直接点开自测
  $('#a_skill').click()
  //只看错题
  $('#errorCheck').click()
  
  $('#putIn').click(() => {
    setTimeout(() => {
      //免拖动滑条
      $('#slider').hide()
      $('#sliderStatus').val(1)
    }, 500)
    
  })
  
  //交卷完成自动确定
  let dom
  
  $('#putInBtn').click(() => {
    var i=setInterval(() => {
      if ((dom = $('#closeReturnDialog')[0]) !== undefined) {
        dom.click()
          console.log(dom)
        clearInterval(i)
      }
    }, 200)
  })
  
  //点击错题的数字
  if ((dom = $('#cardNum>li.red>a')[0]) !== undefined) {
    dom.click()
  }
})()