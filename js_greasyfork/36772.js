// ==UserScript==
// @name         NGA 版头/版规/置顶部分折叠
// @namespace    https://greasyfork.org/zh-CN/users/164691-shy07
// @version      0.20
// @description  自动折叠 NGA 版头/版规/置顶部分，需要的时候可以点击版头按钮显示（替换跳转功能）
// @author       Shy07
// @match        *://nga.178.com/*
// @match        *://bbs.ngacn.cc/*
// @match        *://bbs.nga.cn/*
// @grant        none
// jshint esversion:6
// @downloadURL https://update.greasyfork.org/scripts/36772/NGA%20%E7%89%88%E5%A4%B4%E7%89%88%E8%A7%84%E7%BD%AE%E9%A1%B6%E9%83%A8%E5%88%86%E6%8A%98%E5%8F%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/36772/NGA%20%E7%89%88%E5%A4%B4%E7%89%88%E8%A7%84%E7%BD%AE%E9%A1%B6%E9%83%A8%E5%88%86%E6%8A%98%E5%8F%A0.meta.js
// ==/UserScript==

((ui, self) => {
  'use strict'

  if (ui === undefined) return

  const targetNode = document.querySelector('body')
  const config = {
    childList: true
  }
  let manualOpen = false

  const toggle = () => {
    const toppedTopic = document.querySelector('#toppedtopic')
    toppedTopic.style.display = manualOpen ? 'none' : 'block'
    manualOpen = !manualOpen
  }
  const hookClickEvent = () => {
    const el = document.querySelector('#toptopics a[class="block_txt block_txt_c0"]')
    if (el) {
      el.href = 'javascript:;'
      el.addEventListener('click', toggle)
    }
  }

  const hideToppedTopic = () => {
    const toppedTopic = document.querySelector('#toppedtopic')
    if (!manualOpen && toppedTopic) {
      toppedTopic.style.display = 'none'
    }
  }
  hideToppedTopic()
  hookClickEvent()

  // const observer = new MutationObserver((mutationsList, observer) => {
  //   hideToppedTopic()
  //   hookClickEvent()
  // })
  // observer.observe(targetNode, config)

  // 钩子
  const hookFunction = (object, functionName, callback) => {
    ((originalFunction) => {
      object[functionName] = function () {
        const returnValue = originalFunction.apply(this, arguments)
        callback.apply(this, [returnValue, originalFunction, arguments])
        return returnValue
      }
    })(object[functionName])
  }

  let initialized = false

  hookFunction(ui, 'eval', () => {
    if (initialized) return
    if (ui.topicArg) {
      hookFunction(
        ui.topicArg,
        'add',
        (returnValue, originalFunction, args) => {
          hideToppedTopic()
          hookClickEvent()
        }
      )
      initialized = true
    }
  })

})(commonui, __CURRENT_UID)
