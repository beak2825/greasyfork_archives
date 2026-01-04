// ==UserScript==
// @name         StcAutoClick
// @namespace    http://tampermonkey.net/
// @description  stc自动执行脚本
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://app.stc-hcdlearning.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stc-hcdlearning.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450783/StcAutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/450783/StcAutoClick.meta.js
// ==/UserScript==
(function () {
  'use strict';
  // 监听页面按钮出现xia
  window.setInterval(function () {
    var cancelBtn = document.getElementById('suggestinfo');
    var isHasCancelBtn = cancelBtn && cancelBtn.style.display
    if (isHasCancelBtn !== 'none') {
      window.do_action();
      console.log('==========执行顶部 1===========')
    }
    actionsBtnClick()
    modelBtnClick1()
    modelBtnClick2()
    modelBtnClick3()
  }, 3000)

  function actionsBtnClick(){
    var actionsBtnBox = document.getElementById('done_actions');
    var btns = actionsBtnBox.querySelectorAll('.btn-success')
    btns.forEach(item=>{
      item.click()
      console.log('======当前已完成行动 4=====');
    })
  }
  // 弹层 执行
  function modelBtnClick1(){
    var modelBtnBox = document.getElementById('select_person_modal');
    var isHasModelBtnBox = modelBtnBox && modelBtnBox.style.display
    console.log('=22222==isHasModelBtnBox :-29', isHasModelBtnBox)
    if(isHasModelBtnBox=='block'){
      var btnDoms =  modelBtnBox.querySelectorAll('#g_action_button')
      if(!btnDoms) return
      var btnDom =btnDoms[0];
      if(btnDom){
        btnDom.click()
        console.log('====== 处理了弹层 2=====');
      }
      // window.do_action_with_persons();
    }

  }
  //弹层 接受按钮
  function modelBtnClick2(){
    var modelBtnBox = document.getElementById('feedback_info');
    var isHasModelBtnBox = modelBtnBox && modelBtnBox.style.display
    if(isHasModelBtnBox=='block'){
      var btnDoms = modelBtnBox.querySelectorAll('#langokandsetfree');
      if(!btnDoms) return
      var btnDom =btnDoms[0];
      if(btnDom){
        btnDom.click()
        console.log('========处理了弹层 3========')
      }
    }

  } 
  //弹层 接受按钮
  function modelBtnClick3(){
    var modelBtnBox = document.getElementById('select_person_modal');
    var isHasModelBtnBox = modelBtnBox && modelBtnBox.style.display
    if(isHasModelBtnBox=='block'){
      var btnDoms = modelBtnBox.querySelectorAll('#g_action_button')[0];
      if(!btnDoms) return
      var btnDom =btnDoms[0];
      if(btnDom){
        btnDom.click()
        console.log('========处理了弹层 5========')
      }
    }
  }
})();