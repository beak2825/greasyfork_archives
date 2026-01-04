// ==UserScript==
// @name         Fsm2qBittorrent
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  推送种子到qbittorrent
// @author       Goose
// @match        https://fsm.name/Torrents*
// @grant        GM_xmlhttpRequest
// @downloadURL
// @updateURL
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529264/Fsm2qBittorrent.user.js
// @updateURL https://update.greasyfork.org/scripts/529264/Fsm2qBittorrent.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // 配置参数
  const qbittorrentUrl = 'http://IP:PORT' // 修改替换
  const username = 'USER_NAME' // 修改替换
  const password = 'PASSWORD' // 修改替换
  const savePath = '/downloads/torrents' // 自定义保存路径，例如 '/downloads/torrents'

  // 添加 torrent 到 qBittorrent 的函数
  function addToqBittorrent(url) {
    // 构造添加 torrent 的 API 端点
    const apiUrl = `${qbittorrentUrl}/api/v2/torrents/add`

    // 准备发送的数据，包含 URL 和保存路径
    const data = new URLSearchParams({
      urls: url,
      savepath: savePath // 添加自定义保存路径
    }).toString();

    // 准备身份验证头
    const auth = btoa(`${username}:${password}`)

    // 使用 GM_xmlhttpRequest 向 qBittorrent API 发送请求
    GM_xmlhttpRequest({
      method: 'POST',
      url: apiUrl,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
      onload: function (response) {
        if (response.status >= 200 && response.status < 300) {
          // 显示成功消息，包含保存路径信息
          showMessage(`成功添加到 qBittorrent！\n保存至: ${savePath}`, 'green')
        } else {
          // 显示错误消息
          showMessage('无法添加到 qBittorrent。请再试一次。', 'red')
          console.error('失败的响应：', response)
        }
      },
      onerror: function (error) {
        console.error('错误：', error)
        // 显示错误消息
        showMessage('发生错误。请检查控制台日志。', 'red')
      },
    })
  }

  // 创建推送下载按钮的函数
  function createPushDownloadButton(parentElement, downloadUrl) {
    // 检查我们是否已经向此父元素添加了按钮
    if (parentElement.querySelector('.qbt-push-button')) {
      return
    }

    const pushDownloadButton = document.createElement('button')
    pushDownloadButton.setAttribute('type', 'button')
    pushDownloadButton.setAttribute('aria-disabled', 'false')
    pushDownloadButton.classList.add(
      'el-button',
      'el-button--primary',
      'is-plain',
      'is-circle',
      'side-btn',
      'qbt-push-button'
    )
    pushDownloadButton.style.borderColor = '#FFC125'
    pushDownloadButton.style.margin = '10px'
    pushDownloadButton.style.backgroundColor = 'transparent'

    pushDownloadButton.addEventListener('mouseover', () => {
      pushDownloadButton.style.backgroundColor = '#EEE5DE'
    })

    pushDownloadButton.addEventListener('mouseout', () => {
      pushDownloadButton.style.backgroundColor = 'transparent'
    })

    // 添加提示信息，显示将保存到哪个目录
    pushDownloadButton.title = `推送到 qBittorrent（保存至: ${savePath}）`

    const iconSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    iconSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    iconSvg.setAttribute('viewBox', '0 0 1024 1024')
    iconSvg.setAttribute('width', '16')
    iconSvg.setAttribute('height', '16')

    const iconPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    )
    iconPath.setAttribute(
      'd',
      'M771.238 349.034c-48.762-111.806-160.142-190.034-289.912-190.034-174.674 0-316.28 141.604-316.28 316.278 0 0.954 0.134 1.872 0.142 2.824-89.786 15.028-158.282 92.89-158.282 186.944 0 104.806 84.964 189.768 189.77 189.768l600.928 0 0-2.186c124.78-15.594 221.398-121.828 221.398-250.838C1019 463.828 908.524 351.862 771.238 349.034zM512.954 759.93l-158.14-158.14 94.884 0L449.698 380.396l126.512 0 0 221.396 94.882 0L512.954 759.93z'
    )
    iconPath.setAttribute('fill', '#FFC125')

    iconSvg.appendChild(iconPath)
    pushDownloadButton.appendChild(iconSvg)

    pushDownloadButton.addEventListener('click', function () {
      console.log('下载链接：', downloadUrl)
      console.log('保存路径：', savePath)
      addToqBittorrent(downloadUrl)
    })

    // 在父元素的开头插入推送下载按钮
    parentElement.insertBefore(pushDownloadButton, parentElement.firstChild)
  }

  // 显示消息的函数
  function showMessage(message, color) {
    const messageBox = document.createElement('div')
    messageBox.textContent = message
    messageBox.style.position = 'fixed'
    messageBox.style.top = '50%'
    messageBox.style.left = '50%'
    messageBox.style.transform = 'translate(-50%, -50%)'
    messageBox.style.background = color
    messageBox.style.color = '#fff'
    messageBox.style.padding = '10px 20px'
    messageBox.style.borderRadius = '5px'
    messageBox.style.zIndex = '9999'
    messageBox.style.whiteSpace = 'pre-line' // 允许换行显示
    document.body.appendChild(messageBox)

    // 1.5 秒后移除消息框（稍微增加时间，让用户能看到保存路径信息）
    setTimeout(function () {
      messageBox.remove()
    }, 1500)
  }

  // 查找种子链接并添加下载按钮的函数
  function findTorrentLinksAndAddButtons() {
    const downloadButtons = document.querySelectorAll(
      'div.el-row.is-align-middle > div.el-col.el-col-2.el-col-xs-0.is-guttered.txt-right > div > div:nth-child(1) > a'
    )
    const detailDownloadButton = document.querySelector(
      'div.el-row.torrent-pad-20 > div.el-col.el-col-16.el-col-xs-24.is-guttered > div:nth-child(3) > a'
    )
    if (downloadButtons.length != 0) {
      downloadButtons.forEach((downloadButton) => {
        const parentElement = downloadButton.closest('div')
        if (parentElement) {
          createPushDownloadButton(parentElement, downloadButton.href)
        }
      })
    } else if (detailDownloadButton) {
      const parentElement = detailDownloadButton.closest('div')
      if (parentElement) {
        createPushDownloadButton(parentElement, detailDownloadButton.href)
      }
    }
  }

  // 处理变更事件的函数
  function handleMutations(mutationsList, observer) {
    let needsCheck = false

    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        needsCheck = true
        break
      }
    }

    if (needsCheck) {
      // 小延迟以确保 DOM 完全更新
      setTimeout(findTorrentLinksAndAddButtons, 100)
    }
  }

  // 初次检查现有元素
  setTimeout(findTorrentLinksAndAddButtons, 1000)

  // 开始观察目标节点的变更
  const targetNode = document.querySelector('#app')
  if (targetNode) {
    const observer = new MutationObserver(handleMutations)
    observer.observe(targetNode, { childList: true, subtree: true })
    console.log('从 FSM 到 qBittorrent：观察者已启动')
    console.log('自定义保存路径：', savePath)
  } else {
    console.error('未找到目标节点！')
  }
})()