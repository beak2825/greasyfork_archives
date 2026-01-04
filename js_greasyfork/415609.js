// ==UserScript==
// @name         抢票脚本
// @namespace    weehowe.zw
// @version      1.0
// @description  auto click
// @author       问号
// @match        http*://*.youzan.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/415609/%E6%8A%A2%E7%A5%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/415609/%E6%8A%A2%E7%A5%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 休眠
   * @param time    休眠时间，单位秒
   * @param desc
   * @returns {Promise<unknown>}
   */
  function sleep(time, desc = 'sleep') {
    return new Promise(resolve => {
      //sleep
      setTimeout(() => {
        console.log(desc, time, 's')
        resolve(time)
      }, Math.floor(time * 1000))
    })
  }

  /**
   * 监测页面地址
   * @param path    页面地址片段
   * @param desc
   * @returns {Promise<unknown>}
   */
  function obsPage(path, desc = 'page') {
    return new Promise(resolve => {
      //obs page
      let page = setInterval(() => {
        if (location.href.search(path) > -1) {
          clearInterval(page)
          console.log(desc, path)
          resolve(path)
        } else {
          return
        }
      }, 100)
    })
  }


  function simulateClick() {
   return new Promise(resolve => {
      try{
        document.getElementsByClassName("van-checkbox__icon van-checkbox__icon--round")[0].click();
      } catch (error) {
        console.log("没有全选按钮")
      }
      try {
       document.getElementsByClassName("bottom-button theme-background-linear van-button van-button--danger van-button--normal van-button--round van-button--square")[0].click();
      } catch (error){
        console.log("没有结算按钮")
      }
      try {
      document.getElementsByClassName("van-button van-button--danger van-button--normal van-button--round van-submit-bar__button van-submit-bar__button--danger")[0].click();
      } catch (error){
        console.log("没有付款按钮")
        window.location.reload();// 刷新页面
      }
    })
  }


   simulateClick().then(() => sleep(0.3))

  //休眠
  //sleep(0.3)
    //百度首页
    //.then(() => obsPage('csdn'))
    //休眠
    //.then(() => sleep(1))
    //监测存在元素然后点击
    //.then(() => simulateClick())

})();