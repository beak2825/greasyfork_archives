// ==UserScript==
// @name         ZYB 一键部署
// @description  用于 ZYB OP 镜像的一键部署～～
// @namespace    http://tampermonkey.net/
// @version      0.14
// @author       PsiloLau
// @match        https://op.zuoyebang.cc/static/odin/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zuoyebang.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452897/ZYB%20%E4%B8%80%E9%94%AE%E9%83%A8%E7%BD%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/452897/ZYB%20%E4%B8%80%E9%94%AE%E9%83%A8%E7%BD%B2.meta.js
// ==/UserScript==

;(function () {
  ;('use strict')

  const UN_DEPLOY = 'UN_DEPLOY' // 部署未完成
  const DEPLOYING = 'DEPLOYING' // 部署中
  const DEPLOYED = 'DEPLOYED' // 部署完成

  let deployStatus = 'UN_DEPLOY' // 当前状态
  let deployStatusTips = 'UN_DEPLOY' // 当前状态
  let deployStatusSmall = 'UN_DEPLOY' // 当前状态

  let anchor // 锚点
  let btnTimer // 循环点击定时
  let domTimer
  let maxTimes = 10
  let loadTimes = 0

  let elTree
  let smallDom
  let tipsDom

  let btn // 一键部署 dom
  let btnTips // 一键部署到tips
  let btnSmall // 一键部署到 small

  window.addEventListener(
    'hashchange',
    () => {
      clearInterval(domTimer)
      domTimer = setInterval(() => {
        onWaitLoaded()
      }, 2000)
    },
    false
  )

  window.addEventListener(
    'load',
    () => {
      clearInterval(domTimer)
      domTimer = setInterval(() => {
        onWaitLoaded()
      }, 2000)
    },
    false
  )

  function onClearTimer(timer) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function onWaitLoaded() {
    console.log('%c 💯 ', 'background:#eee;', '等待加载')
    loadTimes++
    if (loadTimes === maxTimes) {
      clearInterval(domTimer)
    }
    // 判断是否需要按钮
    const isDeployJob = onCheckHref()
    if (!isDeployJob) {
      return
    }

    if (!location.href.includes('?')) {
      const href = location.href.split('#')

      location.href = `${href[0]}?#${href[1]}`
    }

    const target = document.querySelector('.el-form')
    if (!target) {
      return
    }

    if (isBtnExist()) {
      clearInterval(domTimer)
      return
    }

    onPrepareInjection()
  }

  function isBtnExist() {
    const btn = document.getElementById('customBtn')
    return !!btn
  }

  // 预注入
  function onPrepareInjection() {
    const parent = onFindParent()
    btn = onCreateButton()

    if (!btn?.innerText) {
      return
    }

    if (!elTree) {
      fetchElTree()
    }
    btnTips = onCreateButton('tips')
    btnSmall = onCreateButton('small')

    // 注入 btn
    parent.insertBefore(btn, anchor)
    parent.insertBefore(btnSmall, anchor)
    parent.insertBefore(btnTips, anchor)
  }

  function onCheckHref() {
    const href = location.href
    if (!href.includes('deployDetail')) {
      return false
    } else {
      return true
    }
  }

  function onCreateButton(type = 'all') {
    const btn = document.createElement('button')

    if (!anchor.children.length) {
      return
    }

    if (type === 'all') {
      if (anchor && anchor.children[0].innerText !== '下一步') {
        if (deployStatus === DEPLOYING) {
          onFinishDeploy('全量完成')
        } else {
          clearInterval(domTimer)
        }
      } else {
        btn.innerText = '一键全量'
      }
      btn.id = 'customBtn'
      onBtnStyle(btn, 'danger')

      btn.addEventListener('click', onPersistentDeploy, false)
    } else if (type === 'tips') {
      if (anchor && anchor.children[0].innerText !== '下一步') {
        if (deployStatusTips === DEPLOYING) {
          onFinishDeployTips('Tips完成')
        } else {
          clearInterval(domTimer)
        }
      } else {
        if (tipsDom.children[0].innerText.includes('部署成功')) {
          btn.classList.add('is-disabled')
          onFinishDeployTips('Tips完成')
        }
        btn.innerText = '一键Tips'
      }
      onBtnStyle(btn, 'success')
      btn.id = 'customBtnTips'

      btn.addEventListener('click', onPersistentDeployTips, false)
    } else if (type === 'small') {
      if (anchor && anchor.children[0].innerText !== '下一步') {
        if (deployStatusSmall === DEPLOYING) {
          onFinishDeploySmall('Small完成')
        } else {
          clearInterval(domTimer)
        }
      } else {
        if (smallDom.children[smallDom.children.length - 1].innerText.includes('部署成功')) {
          btn.classList.add('is-disabled')
          onFinishDeploySmall('Small完成')
        }
        btn.innerText = '一键Small'
      }
      onBtnStyle(btn, 'warning')
      btn.id = 'customBtnSmall'
      btn.addEventListener('click', onPersistentDeploySmall, false)
    }

    return btn
  }

  function onBtnStyle(dom, color) {
    dom.classList.add('el-button', `el-button--${color}`, 'el-button--small')
    dom.style = 'margin-right: 10px;margin-bottom: 12px;padding: 6px 12px;font-size: 14px;'
  }

  function onFindParent() {
    const nodeList = document.querySelectorAll('.el-form-item__content')
    const parent = nodeList[nodeList.length - 1]
    anchor = parent.children[0]

    return parent
  }

  // btn 点击具体逻辑
  function onPersistentDeploy() {
    if (
      deployStatus === DEPLOYED ||
      deployStatusSmall === DEPLOYING ||
      deployStatusTips === DEPLOYING
    ) {
      return
    }

    if (deployStatus === DEPLOYING) {
      // 取消部署
      deployStatus = UN_DEPLOY
      btn.innerText = '一键全量'

      onClearTimer(btnTimer)

      console.log('%c 💯 ', 'background:#eee;', '部署已取消')
    } else {
      // 开始部署
      deployStatus = DEPLOYING
      btn.innerText = '部署中..'
      onDeploying()
    }
  }

  // btn 点击具体逻辑
  function onPersistentDeploySmall() {
    if (
      deployStatusSmall === DEPLOYED ||
      deployStatus === DEPLOYING ||
      deployStatusTips === DEPLOYING
    ) {
      return
    }

    if (deployStatusSmall === DEPLOYING) {
      // 取消部署
      deployStatusSmall = UN_DEPLOY
      btnSmall.innerText = '一键Small'

      onClearTimer(btnTimer)

      console.log('%c 💯 ', 'background:#eee;', '部署已取消')
    } else {
      // 开始部署
      deployStatusSmall = DEPLOYING
      btnSmall.innerText = '部署中..'
      onDeployingSmall()
    }
  }
  // btn 点击具体逻辑
  function onPersistentDeployTips() {
    if (
      deployStatusTips === DEPLOYED ||
      deployStatus === DEPLOYING ||
      deployStatusSmall === DEPLOYING
    ) {
      return
    }

    if (deployStatusTips === DEPLOYING) {
      // 取消部署
      deployStatusTips = UN_DEPLOY
      btnTips.innerText = '一键Tips'

      onClearTimer(btnTimer)

      console.log('%c 💯 ', 'background:#eee;', '部署已取消')
    } else {
      // 开始部署
      deployStatusTips = DEPLOYING
      btnTips.innerText = '部署中..'
      onDeployingTips()
    }
  }

  function onDeploying() {
    onClearTimer(btnTimer)

    // 封线处理 .show-peak-dialog
    const isSealed = onSealLineHandle()
    if (isSealed) {
      console.log('%c 💯 ', 'background:#eee;', '部署已取消')
      onFinishDeploy('已封线')
      btn.classList.add('el-button--danger')
      return
    }

    if (anchor.children.length && anchor.children[0].innerText.includes('下一步')) {
      // 轮训部署
      const realBtn = anchor.children[0]
      if (!realBtn.className.includes('is-disabled')) {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        })

        // 触发点击事件
        realBtn.dispatchEvent(clickEvent)
      }

      btnTimer = setTimeout(() => {
        onDeploying()
      }, 2000)
    } else {
      // 部署完成 | 回滚
      onFinishDeploy('全量完成')
    }
  }

  function fetchElTree() {
    elTree = document.body.getElementsByClassName('el-tree')[0]
    tipsDom = elTree.children[0].children[1]
    smallDom = elTree.children[1].children[1]
  }
  /**
   * 部署到 small 100%
   */
  function onDeployingSmall() {
    onClearTimer(btnTimer)

    // 封线处理 .show-peak-dialog
    const isSealed = onSealLineHandle()
    if (isSealed) {
      console.log('%c 💯 ', 'background:#eee;', '部署已取消')
      onFinishDeploySmall('已封线')
      btn.classList.add('el-button--danger')
      return
    }

    if (anchor.children.length && anchor.children[0].innerText.includes('下一步')) {
      if (!smallDom) {
        alert('未知错误')
        return
      }
      if (smallDom.children[smallDom.children.length - 1].innerText.includes('部署成功')) {
        onFinishDeploySmall('Small完成')
        return
      }

      // 轮训部署
      const realBtn = anchor.children[0]
      if (!realBtn.className.includes('is-disabled')) {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        })

        // 触发点击事件
        realBtn.dispatchEvent(clickEvent)
      }

      btnTimer = setTimeout(() => {
        onDeployingSmall()
      }, 2000)
    } else {
      // 部署完成 | 回滚
      onFinishDeploySmall('Small完成')
    }
  }

  /**
   * 只部署一次
   */
  function onDeployingTips() {
    // 封线处理 .show-peak-dialog
    const isSealed = onSealLineHandle()
    if (isSealed) {
      console.log('%c 💯 ', 'background:#eee;', '部署已取消')
      onFinishDeployTips('已封线')
      btn.classList.add('el-button--danger')
      return
    }

    if (anchor.children.length && anchor.children[0].innerText.includes('下一步')) {
      if (!tipsDom) {
        alert('未知错误')
        return
      }
      if (tipsDom.children[0].innerText.includes('部署成功')) {
        onFinishDeployTips('Tips完成')
        return
      }
      const realBtn = anchor.children[0]
      if (!realBtn.className.includes('is-disabled')) {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        })

        // 触发点击事件
        realBtn.dispatchEvent(clickEvent)
      }

      onFinishDeployTips('Tips完成')
    } else {
      // 部署完成 | 回滚
      onFinishDeployTips('Tips完成')
    }
  }

  function onFinishDeploy(text) {
    if (!btn) {
      return
    }

    deployStatus = DEPLOYED
    btn.innerText = text
    btn.classList.add('is-disabled')
  }
  function onFinishDeployTips(text) {
    if (!btnTips) {
      return
    }

    deployStatusTips = DEPLOYED
    btnTips.innerText = text
    btnTips.classList.add('is-disabled')
  }
  function onFinishDeploySmall(text) {
    if (!btnSmall) {
      return
    }

    deployStatusSmall = DEPLOYED
    btnSmall.innerText = text
    btnSmall.classList.add('is-disabled')
  }

  // 封线处理
  function onSealLineHandle() {
    const sealed = document.querySelectorAll('.show-peak-dialog')
    return sealed.length !== 0
  }
})()
