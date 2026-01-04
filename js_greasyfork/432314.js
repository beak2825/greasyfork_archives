// ==UserScript==
// @name         虎牙免登陆清晰度
// @namespace    https://github.com/demon-zhonglin/tmJavaScript
// @version      0.9
// @description  虎牙免登陆可控清晰度【自动切最高清晰度】【自 2023-07 huya 更新后，全网首发 huya 绕过登录可切换画质清晰度】
// @author       demon-zhonglin
// @include      https://*.huya.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432314/%E8%99%8E%E7%89%99%E5%85%8D%E7%99%BB%E9%99%86%E6%B8%85%E6%99%B0%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/432314/%E8%99%8E%E7%89%99%E5%85%8D%E7%99%BB%E9%99%86%E6%B8%85%E6%99%B0%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 监听节点
  const waitNode = ({ selector = '', timeNum = 500, callback = Function.prototype, frq = 0}) => {
    try {
      const node = document.querySelector(selector)
      if (node) {
        callback(node, selector)
        return
      } else {
        setTimeout(function() {
          if (frq >= 10) return
          waitNode({ selector, timeNum, callback, frq: ++frq})
        }, timeNum)
      }
    } catch (error) {
      window.alert(`waitNode err: ${error}`)
    }
  }

  // 判断对象是否含有指定字段(可深层字段)
  const _hasOwnProperty = (__obj = {}, __key = '') => {
    let keys = __key.split('.')
    if (keys.length === 1) return Object.prototype.hasOwnProperty.call(__obj, __key)
    const childObj = __obj[keys[0]]
    keys.shift()
    return _hasOwnProperty(childObj, keys.join('.'))
  }

  // 监听属性是否含有指定字段
  const waitObjectHasKey = ({ _obj = {}, _key = '', timeNum = 500, callback = Funciton.prototype, frq = 0 }) => {
    if (_hasOwnProperty(_obj, _key)) {
      callback(_obj, _key)
      return
    } else {
      setTimeout(function() {
        if (frq >= 20) return
        frq += frq
        waitObjectHasKey({ _obj, _key, timeNum, callback, frq })
      }, timeNum)
    }
  }

    // 关闭登录弹窗
  const closeLogin = () => waitNode({
    selector: '#UDBSdkLgn',
    callback: (node, selector) => {
      node.style.cssText = 'display: none;'
    }
  })

  // 更新画质项 节点属性
  const changeVideotypeItem = () => {
    $('.player-videotype-list li').each(function(e, t) {
      let obj = $(t).data('data')
      obj.status = 1
      $(t).data('data', obj)
    })

    const videotypeList = $('.player-menu-panel ul.player-videotype-list > li')
    if (videotypeList.length > 0) {
      setTimeout(() => {
        try{
          videotypeList[0].click()
          closeLogin()
        } catch {
          window.alert('自动切换画质失败,请手动切换视频画质!')
        }
      }, 1000)
    }
  }

  // 覆盖关闭窗口事件
  waitObjectHasKey({
    obj: window,
    _key: 'HyLogin',
    callback: () => {
      window.HyLogin.prototype.closeUdbLogin = function() {
        window.HyLogin.notice("loginClose")
      }
    }
  })

  // 清空倒计时
  const clearCountdown = () => {
    const timeNum = window.localStorage.getItem('roomHeartbeat')
    if (Number.isInteger(timeNum)) {
      window.localStorage.setItem('roomHeartbeat', -Infinity) // 跳过未登录时间检测
    }
  }

  const main = () => {
    const loopEvent = (num = 0) => {
      // 避免多开浏览器tab有某个tab失效导致重新触发登录时间
      clearCountdown()

      // 防止未重置登录弹窗关闭事件前,手动关闭登录弹窗
      closeLogin()

      if (window.VPlayer.prototype.videoStatus === 0) { // 视频就绪
        changeVideotypeItem()
        return
      }
      setTimeout(() => {
        if (num > 10) return
        loopEvent(++num)
      }, 500 + 100 * num)
    }

    // 监听视频状态
    waitObjectHasKey({
      _obj: window,
      _key: 'VPlayer.prototype.videoStatus',
      callback: loopEvent
    })
  }

  main()
})();
