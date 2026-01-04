// ==UserScript==
// @name         DiKuaiAutoClick
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  auto click
// @author       stumpx
// @match        http*://dikuai.ynyc.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452096/DiKuaiAutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/452096/DiKuaiAutoClick.meta.js
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
  function Confirm(count, desc = 'test') {
    return new Promise(resolve => {
      //test
      for (var i = 2; i <= 50; i++) {
                //每次延迟1秒
                (function (i) {
                    setTimeout(function () {
                            console.log();
                            obsClick('#app > div.wrapper > div > div.main > div.list > div.table > div > div.el-table__body-wrapper.is-scrolling-left > table > tbody > tr:nth-child('+i+')')
                            obsClick('#app > div.wrapper > div > div.main > div.wrapper.detail > div.main > div.right > div.detail > div > div.body > div:nth-child(19) > label')
                            obsClick('#app > div.wrapper > div > div.main > div.wrapper.detail > div.main > div.left > div.bottom > div.btns > button.el-button.btn.el-button--text.el-button--small.active')
                        },
                        i * 3000);
                })(i);
            }

    })
  }
  /*
  **自动刷新
  */
function reload() {
    'use strict';
    //time以毫秒为单位
    let time=180*1000;
    setTimeout(() => {
        console.log("开始刷新")
        location.reload()
    },time);
    // Your code here...
};

  //休眠
  sleep(1)
    //首页
    .then(() => obsPage('dikuai.ynyc.com'))
    //休眠
    .then(() => sleep(5))
    //监测存在元素然后点击
    .then(() => obsClick('#app > div.wrapper > div > div.top > div > table > tr > td.wait'))
    //自动下一个 #app > div.wrapper > div > div.main > div.wrapper.detail > div.main > div.left > div.mapContainer > div.tools > label.el-checkbox.is-checked > span.el-checkbox__label
    .then(() => sleep(2))
    .then(() => obsClick('#app > div.wrapper > div > div.main > div.wrapper.detail > div.main > div.left > div.mapContainer > div.tools > label.el-checkbox.is-checked > span.el-checkbox__label'))
    /*
    **选择页码
    **#app > div.wrapper > div > div.main > div.list > div.pager > div > ul > li:nth-child(3)
    */
    .then(() => sleep(1))
    .then(() => obsClick('#app > div.wrapper > div > div.main > div.list > div.pager > div > ul > li:nth-child(3)'))
    /*
    开始点击第一条
    #app > div.wrapper > div > div.main > div.list > div.table > div > div.el-table__body-wrapper.is-scrolling-left > table > tbody > tr.el-table__row.current-row
    .then(() => sleep(1))
    .then(() => obsClick('#app > div.wrapper > div > div.main > div.list > div.table > div > div.el-table__body-wrapper.is-scrolling-left > table > tbody > tr.el-table__row.current-row'))
    .then(() => sleep(1))
    .then(() => obsClick('#app > div.wrapper > div > div.main > div.wrapper.detail > div.main > div.right > div.detail > div > div.body > div:nth-child(19) > label'))
    .then(() => sleep(1))
    .then(() => obsClick('#app > div.wrapper > div > div.main > div.wrapper.detail > div.main > div.left > div.bottom > div.btns > button.el-button.btn.el-button--text.el-button--small.active'))
    */
    /*
    **第一条后
    **开始点击某一条
    **此处点击第二条
    */
    .then(() => sleep(1))
    .then(() => obsClick('#app > div.wrapper > div > div.main > div.list > div.table > div > div.el-table__body-wrapper.is-scrolling-left > table > tbody > tr:nth-child(2)'))
    .then(() => sleep(1))
    .then(() => obsClick('#app > div.wrapper > div > div.main > div.wrapper.detail > div.main > div.right > div.detail > div > div.body > div:nth-child(19) > label'))
    .then(() => sleep(1))
    .then(() => obsClick('#app > div.wrapper > div > div.main > div.wrapper.detail > div.main > div.left > div.bottom > div.btns > button.el-button.btn.el-button--text.el-button--small.active'))
    .then(() => reload())
    .then(() => Confirm())
})();