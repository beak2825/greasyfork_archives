// ==UserScript==
// @name         DiKuaiReload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto click
// @author       stumpx
// @match        http*://dikuai.ynyc.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452156/DiKuaiReload.user.js
// @updateURL https://update.greasyfork.org/scripts/452156/DiKuaiReload.meta.js
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

  /**
   * 监测input节点设置内容
   * @param selector    CSS选择器
   * @param text        设置的内容
   * @param desc
   * @returns {Promise<unknown>}
   */
  function obsValue(selector, text, desc = 'value') {
    return new Promise(resolve => {
      //obs node
      let timer = setInterval(() => {
        let target = document.querySelector(selector)
        if (!!target) {
          clearInterval(timer)
          target.value = text
          console.log(desc, text)
          resolve(selector)
        } else {
          return
        }
      }, 100)
    })
  }

  /**
   * 监测到节点后点击
   * @param selector    CSS选择器
   * @param desc
   * @returns {Promise<unknown>}
   */
  function obsClick(selector, desc = 'click') {
    return new Promise(resolve => {
      //obs node
      let timer = setInterval(() => {
        let target = document.querySelector(selector)
        if (!!target) {
          clearInterval(timer)
          target.click()
          console.log(desc, selector)
          resolve(selector)
        } else {
          return
        }
      }, 100)
    })
  }

  /**
   * 监测节点是否存在
   * @param selector    CSS选择器
   * @param desc
   * @returns {Promise<unknown>}
   */
  function obsHas(selector, desc = 'has') {
    return new Promise(resolve => {
      //obs node
      let timer = setInterval(() => {
        let target = document.querySelector(selector)
        if (!!target) {
          clearInterval(timer)
          console.log(desc, selector)
          resolve(selector)
        } else {
          return
        }
      }, 100)
    })
  }

  /**
   * 监测节点内容
   * @param selector    CSS选择器
   * @param text        节点内容
   * @param desc
   * @returns {Promise<unknown>}
   */
  function obsText(selector, text, desc = 'text') {
    return new Promise(resolve => {
      //obs node
      let timer = setInterval(() => {
        let target = document.querySelector(selector)
        if (!!target && target.textContent.trim() == text) {
          clearInterval(timer)
          console.log(desc, text)
          resolve(selector)
        } else {
          return
        }
      }, 100)
    })
  }

  /**
   * 监测节点内容点击
   * @param selector    CSS选择器
   * @param text        节点内容
   * @param desc
   * @returns {Promise<unknown>}
   */
  function obsTextClick(selector, text, desc = 'text') {
    return new Promise(resolve => {
      //obs node
      let timer = setInterval(() => {
        let target = document.querySelector(selector)
        if (!!target && target.textContent.trim() == text) {
          clearInterval(timer)
          target.click()
          console.log(desc, text)
          resolve(selector)
        } else {
          return
        }
      }, 100)
    })
  }

  /**
   * 监测节点非内容
   * @param selector    Css选择器
   * @param text        节点内容
   * @param desc
   * @returns {Promise<unknown>}
   */
  function obsNotText(selector, text, desc = 'not text') {
    return new Promise(resolve => {
      //obs node
      let timer = setInterval(() => {
        let target = document.querySelector(selector)
        if (!!target) {
          if (target.textContent.trim() == text) {
            return
          } else {
            clearInterval(timer)
            console.log(desc, text)
            resolve(selector)
          }
        } else {
          return
        }
      }, 100)
    })
  }

  /**
   * 函数返回真继续执行
   * @param func    函数，返回真继续执行
   * @param desc
   * @returns {Promise<unknown>}
   */
  function obsTrueFunc(func, desc = 'func=>true') {
    return new Promise(resolve => {
      if (!!func) {
        let ret = func()
        if (ret) {
          console.log(desc, ret)
          resolve('func=>true')
        }
      }
    })
  }

  /**
   * 执行函数
   * @param func    函数
   * @param desc
   * @returns {Promise<unknown>}
   */
  function obsFunc(func, desc = 'func') {
    return new Promise(resolve => {
      if (!!func) {
        func()
        console.log(desc)
        resolve('func')
      }
    })
  }

  /**
   * 变量为真继续执行
   * @param isTrue    bool变量
   * @param desc
   * @returns {Promise<unknown>}
   */
  function obsTrue(isTrue, desc = 'true') {
    return new Promise(resolve => {
      if (!!isTrue) {
        console.log(desc, isTrue);
        resolve(isTrue)
      }
    })
  }
function reload() {
    'use strict';
    //time以毫秒为单位
    let time=2700*1000;
    setTimeout(() => {
        console.log("开始刷新")
        location.reload()

    },time);
    // Your code here...
};
function Confirm(count, desc = 'test') {
    return new Promise(resolve => {
      //test
      for (var j = 1; j <= 5; j++) {
                //每次延迟1秒
                (function (j) {
                    setTimeout(function () {
                            console.log("测试开始"+j);
                        console.log("测试1");
                        console.log("测试2");
                        },
                        j * 3000);
                })(j);
            }
    })
  }
  //休眠
  sleep(1)
    //地块首页
    .then(() => obsPage('dikuai.ynyc.com'))
    //休眠
    .then(() => sleep(1))
    //监测存在元素然后点击
    .then(() => console.log("刷新"))
    .then(() => reload())
})();