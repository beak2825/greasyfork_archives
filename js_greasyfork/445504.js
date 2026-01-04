// ==UserScript==
// @name         防挂机处理
// @namespace    https://greasyfork.org/zh-CN/scripts/445504
// @version      0.5
// @description  学习网站挂机认证处理，发现弹窗自动点击确定按钮。
// @author       dddreee
// @match        http://shjg.qskj.lllnet.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lllnet.cn
// @run-at document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445504/%E9%98%B2%E6%8C%82%E6%9C%BA%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/445504/%E9%98%B2%E6%8C%82%E6%9C%BA%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const WARN_STYLE = 'font-size: 24px; color: yellow'
  const SUCCESS_STYLE = 'font-size: 24px; color: blue'
  const ERROR_STYLE = 'font-size: 24px; color: #ff0000'
  let zIndex = 100000

  const VIDEO_NODE = {
    current: null
  }
  let closeModalTimeId = null

  const videoPauseListener = () => {
    console.clear()
    console.log('%c 视频暂停了', WARN_STYLE)
    closeModalTimeId = setTimeout(() => {
      const currentModal = findModal()
      if (!currentModal) {
        return false
      }
      console.log('%c 发现弹窗', WARN_STYLE)
      closeModal(currentModal)
    }, 500)
  }

  function initVideoListen () {
    if (VIDEO_NODE.current) {
      VIDEO_NODE.current.removeEventListener('pause', videoPauseListener)
      clearTimeout(closeModalTimeId)
      VIDEO_NODE.current = null
    }
    VIDEO_NODE.current = document.getElementsByTagName('video')[0]
    if (!VIDEO_NODE.current) {
      console.log('%c 没找到视频组件', ERROR_STYLE)
      return false
    }
    console.log('%c 发现视频', SUCCESS_STYLE)
    VIDEO_NODE.current.addEventListener('pause', videoPauseListener)
    showToast('启动成功')
    console.log('%c 启动成功', SUCCESS_STYLE)
  }  

  function findModal() {
    const allModal = [...document.querySelectorAll('.ant-modal-root')]
    return allModal.find(modalItem => {
      return modalItem.__vue__ && modalItem.__vue__.visible
    })
  }

  function closeModal(modal) {
    const button = modal.querySelector('button.okBtn')
    if (button) {
      console.log('%c 发现按钮', SUCCESS_STYLE)
      button.click()
      console.log('%c 弹窗已关闭', SUCCESS_STYLE)
    }
  }
  function initApp () {
    const app = document.querySelector('#app')
    if (!app) {
      console.log('%c 没找到app组件，请刷新重试', ERROR_STYLE)
      showToast('没找到app组件，请刷新重试')
      return false
    }
    console.log('%c 发现app组件', SUCCESS_STYLE)
    const { $router, $route } = app.__vue__
    if (!$router || !$route) {
      showToast('没找到$router或$route，请稍后重试')
    }
    $router.afterEach((to, from) => {
      if (to.path === '/course/player') {
        const toQuery = to.query
        const fromQuery = from.query
        console.log('%c 发现视频页面', SUCCESS_STYLE)
        if (toQuery.lessonId !== fromQuery.lessonId) {
          showToast('课程变化了，重新初始化防挂机检测')
          console.log('%c 切换视频', SUCCESS_STYLE)
          initVideoListen()
        }
        
      }
    })
    if ($route.path === '/course/player') {
      initVideoListen()
    }
  }
  setTimeout(() => {
    initApp()
  }, 1000)

  function showToast(msg) {
    const toast = document.createElement('div')
    toast.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: ' + zIndex++
    toast.innerHTML = `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.5); padding: 10px 20px; border-radius: 5px; color: #fff; font-size: 16px;">防检测脚本：${msg}</div>`
    document.body.appendChild(toast)
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  }
})();