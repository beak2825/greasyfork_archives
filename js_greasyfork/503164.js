// ==UserScript==
// @name         auto methods
// @license MIT
// @namespace    http://oneoneone.cn/
// @version      1.3
// @description  This is a script file used to move the slider verification code, but the success rate cannot be guaranteed.
// @author       ChoiWan
// @match        https://*.temu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      127.0.0.1
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/short-unique-id@5.2.0/dist/short-unique-id.min.js
// @require       https://scriptcat.org/lib/637/1.4.3/ajaxHooker.js#sha256=y1sWy1M/U5JP1tlAY5e80monDp27fF+GMRLsOiIrSUY=
// @downloadURL https://update.greasyfork.org/scripts/503164/auto%20methods.user.js
// @updateURL https://update.greasyfork.org/scripts/503164/auto%20methods.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

//------------------auto login-------------------------------

/**
 * 检查是否跳转到登录页面
 */
function doCheckJumpToLogin() {
  let isLogining = false
  const timeout = getRandomInteger(10, 20) * 1000
  setInterval(() => {
    if (!isLogining) {
      const href = window.location.href
      if (href.indexOf('temu.com/login.html') !== -1) {
        isLogining = true
        console.log('bingo ! atempt to login ...')
        waitElement('#user-account')
          .then(result => {
            var uid = new ShortUniqueId({length: getRandomInteger(9, 13), dictionary: 'number'})
            const account = uid.rnd() + '@qq.com'
            $('#user-account')
              .val(account)
            waitElement('#submit-button')
              .then(result => {
                $('#submit-button')
                  .click()
                waitElement('#pwdInputInLoginDialog')
                  .then(result => {
                    $('#user-account')
                      .val(account)
                    $('#pwdInputInLoginDialog')
                      .trigger('focus')
                    document.execCommand('insertText', false, account)
                    waitElement('#submit-button')
                      .then(result => {
                        $('#submit-button')
                          .click()
                        isLogining = false
                        window.location.replace('https://temu.com/uk?' + Math.random())
                      })
                      .catch(err => {
                        console.log('sorry:submit-button2')
                        isLogining = false
                      })
                  })
                  .catch(err => {
                    console.log('sorry:pwdInputInLoginDialog')
                    isLogining = false
                  })
              })
              .catch(err => {
                console.log('sorry:submit-button')
                isLogining = false
              })
            $('#submit-button')
              .click()
          })
          .catch(err => {
            console.log('sorry:user-account')
            isLogining = false
          })
      }
    }
  }, timeout)
}

//------------------auto clear-------------------------------
/**
 * 自动定时点击启动按钮
 */
function doAutoClick() {


  waitElement('.kasdsaj>.btn-box>#task-start').then(result => {
    const startBtn = $('.kasdsaj>.btn-box>#task-start')
    if (startBtn.length > 0) {
      const text = startBtn.text()
      if (text == 'start') {
        console.log('start')
        startBtn.click()
      }
    }
  })



  setInterval(() => {
    const startBtn = $('.kasdsaj>.btn-box>#task-start')
    if (startBtn.length > 0) {
      const text = startBtn.text()
      if (text == 'start') {
        console.log('start')
        startBtn.click()
      }
      else {
        console.log('stop')
        startBtn.click()
        setTimeout(() => {
          const _startBtn = $('.kasdsaj>.btn-box>#task-start')
          const text = startBtn.text()
          if (text == 'start') {
            console.log('start')
            _startBtn.click()
          }
        }, 300)
        setTimeout(() => {
          const _startBtn = $('.kasdsaj>.btn-box>#task-start')
          const text = startBtn.text()
          if (text == 'start') {
            console.log('start')
            _startBtn.click()
          }
        }, 1000)
        setTimeout(() => {
          const _startBtn = $('.kasdsaj>.btn-box>#task-start')
          const text = startBtn.text()
          if (text == 'start') {
            console.log('start')
            _startBtn.click()
          }
        }, 2000)
      }
    }
  }, 30000)
}

/**
 * 自动点击拒绝按钮
 */
function doRejectClick() {
  setInterval(() => {
    // Reject all
    const rejectItem = $('span:contains("Reject all")')
    // 隐藏cookie弹框
    if (rejectItem.length > 0) {
      rejectItem.click()
    }
  }, 500)
}

/**
 * 检查是否售罄
 */
function doCheckSoldOut() {
  setInterval(() => {
    const flag = $('div:contains("This item is sold out.")')
    if (flag.length > 0) {
      console.log('sold out')
      //clearAllCookies()
      //window.location.replace('https://temu.com/uk?' + Math.random())
    }
  }, 10000)
}

//--------------------auto refresh-----------------------------
/**
 * 自动刷新
 */
function doAutoRefresh(){
  setInterval(() => {
    waitElement('#best_new_log')
      .then(result => {
        const text = $('#best_new_log>p').text()
        if(text.indexOf('重复上报数据')!=-1){
          console.log('重复上报数据')
          // window.location.replace('https://temu.com/uk?' + Math.random())
        }
        if(text.indexOf('不匹配的goodsId')!=-1){
          console.log('不匹配的goodsId')
          window.location.replace('https://temu.com/')
        }
        if(text.indexOf('无效数据')!=-1){
          console.log('无效数据')
          // clearAllCookies()
          window.location.replace('https://temu.com/')
        }
      })

  },5000)
}

/**
 * 等待元素加载
 * @param selector
 * @param times
 * @param interval
 * @param flag
 * @returns {Promise<unknown>}
 */
function waitElement(selector, times, interval, flag = true) {
  var _times = times || 50,     // 默认50次
    _interval = interval || 100, // 默认每次间隔100毫秒
    _selector = selector, //选择器
    _iIntervalID,
    _flag = flag //定时器id
  return new Promise(function(resolve, reject) {
    _iIntervalID = setInterval(function() {
      if (!_times) { //是0就退出
        clearInterval(_iIntervalID)
        reject()
      }
      _times <= 0 || _times-- //如果是正数就 --
      var _self = document.querySelector(_selector) //再次选择
      if ((_flag && _self) || (!_flag && !_self)) { //判断是否取到
        clearInterval(_iIntervalID)
        resolve(_self)
      }
    }, _interval)
  })
}
/**
 * 等待一段时间
 * @param time
 * @returns {Promise<unknown>}
 */
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
/**
 * 获取随机整数
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
/**
 * 清理所有cookie和localStorage
 */
async function clearAllCookies() {
  localStorage.clear()
  sessionStorage.clear()
  var cookies = document.cookie.split(';')
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i]
    var eqPos = cookie.indexOf('=')
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
  }
  const databases = await indexedDB.databases()
  databases.forEach((element) => {
    // log(`name: ${element.name}, version: ${element.version}`);
    indexedDB.deleteDatabase(element.name)
  })
}

(function() {
  'use strict'

  doCheckJumpToLogin()

  // doAutoClick()
  doRejectClick()
  // doCheckSoldOut()

  // doAutoRefresh()


})()
