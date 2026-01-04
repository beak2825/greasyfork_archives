// ==UserScript==
// @name         Jike Enhanced
// @namespace    https://web.okjike.com/
// @version      0.3
// @description  即刻网页版增强，支持全局返回和消息跳转，来愉快地刷即刻吧！
// @author       iMaeGoo
// @match        https://web.okjike.com/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419530/Jike%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/419530/Jike%20Enhanced.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 添加返回 btn
  function addBackBth () {
    const backEl = document.createElement('a')
    backEl.classList.add('gm-back-btn')
    // backEl.innerText = '<'
    backEl.innerHTML = '<img src="data:image/png;base64,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" style="color:hsl(0, 0%, 25%);width:20px;height:20px"/>'
    backEl.onclick = () => { history.back() }
    document.body.appendChild(backEl)
  }

  // 拦截请求
  function interceptRequest () {
    const originFetch = fetch
    unsafeWindow.fetch = async (url, request) => {
      const response = await originFetch(url, request)
      if (url === 'https://web-api.okjike.com/api/graphql') {
        // 拦截处理即刻 API
        try {
          const text = await response.text()
          response.text = () => { return new Promise((resolve) => { resolve(text) }) }
          const req = JSON.parse(request.body)
          const res = JSON.parse(text)
          if (req.operationName === 'ListNotification') {
            setTimeout(() => { addNotificationLink(res) }, 200)
          }
        } catch (e) {
          console.error(e)
        }
      }
      return response
    }
  }

  // 添加通知链接
  function addNotificationLink (res) {
    const nodes = res.data.viewer.notifications.nodes
    const notificationsEl = document.querySelectorAll('[class^="Notification__NotiItemContainer"]')
    const startIndex = notificationsEl.length - nodes.length
    let index = -1
    for (const node of nodes) {
      index++
      if (node.referenceItem && node.linkUrl) {
        let url
        if (node.linkType === 'COMMENT') {
          const postId = node.linkUrl.substr(node.linkUrl.indexOf('targetId=') + 'targetId='.length, 24)
          url = `https://web.okjike.com/originalPost/${postId}`
        } else {
          url = node.linkUrl.replace('jike://page.jk', 'https://web.okjike.com')
        }
        const elem = notificationsEl[startIndex + index]
        if (elem) {
          elem.onclick = () => { location.href = url }
          elem.style.cursor = 'pointer'
        }
      }
    }
  }

  GM_addStyle(`
    .gm-back-btn {
      position: fixed;
      z-index: 101;
      top: 0;
      left: 0;
      width: 32px;
      height: 32px;
      border-radius: 16px;
      margin: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: rgb(153, 153, 153);
      background-color: rgb(242, 245, 248);
      cursor: pointer;
    }

    .cDyYuq {
      width:300px !important; 
    }

    .iFOUyg {
      flex: none !important;
    }

    .EdRZd {
      padding: 0px 48px !important;
  `)

  addBackBth()
  interceptRequest()
})()
