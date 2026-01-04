// ==UserScript==
// @name         拉取 stcmcu 论坛视频链接
// @version      0.1
// @license      MIT
// @namespace    http://tampermonkey.net/
// @description  自动获取 stcmcu 论坛视频链接，并发送到aria2服务器
// @author       Clistery
// @match        https://www.stcaimcu.com/forum.php?mod=viewthread*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fangstar.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498811/%E6%8B%89%E5%8F%96%20stcmcu%20%E8%AE%BA%E5%9D%9B%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/498811/%E6%8B%89%E5%8F%96%20stcmcu%20%E8%AE%BA%E5%9D%9B%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  console.log('current: ' + document.readyState + ' ' + window.location.href)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', (event) => {
      loadLinks()
    })
  } else {
    loadLinks()
  }

  function toBase64Unicode(str) {
    // 使用 TextEncoder 将字符串转换为 Uint8Array
    let utf8Bytes = new TextEncoder().encode(str)

    // 将 Uint8Array 转换为普通的字符串
    let binaryString = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join('')

    // 使用 btoa 将字符串转换为 Base64
    return btoa(binaryString)
  }

  // 添加通知样式
  const style = document.createElement('style')
  style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            background-color: #444;
            color: white;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            opacity: 0;
            transition: opacity 0.5s ease, top 0.5s ease;
            z-index: 9999;
        }
        .notification.show {
            opacity: 1;
            top: 40px;
        }
        .notification.hide {
            opacity: 0;
            top: 20px;
        }
    `
  document.head.appendChild(style)

  // 显示通知函数
  function showNotification(message, duration = 3000) {
    const notification = document.createElement('div')
    notification.className = 'notification'
    notification.textContent = message
    document.body.appendChild(notification)

    // 显示通知
    setTimeout(() => {
      notification.classList.add('show')
    }, 100)

    // 隐藏通知
    setTimeout(() => {
      notification.classList.remove('show')
      notification.classList.add('hide')
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 500)
    }, duration)
  }

  function sanitizeFilename(filename, maxLength = 255) {
    if (!filename) {
      return filename
    }
    // 定义替换规则
    const replacements = {
      '<': '_',
      '>': '_',
      ':': '-',
      '"': "'",
      '/': '&',
      '\\': '&',
      '|': '_',
      '?': '_',
      '*': '_',
    }

    // 正则表达式：匹配所有非法字符
    const illegalChars = /[<>:"/\\|?*]/g

    // 替换非法字符
    let sanitized = filename.replace(illegalChars, (char) => replacements[char] || '')

    // 如果替换后的文件名长度超过最大长度，则进行截断
    if (sanitized.length > maxLength) {
      // 保留扩展名（如果有）
      const extension =
        sanitized.lastIndexOf('.') > maxLength - 6
          ? ''
          : sanitized.slice(sanitized.lastIndexOf('.'))
      sanitized = sanitized.slice(0, maxLength - extension.length) + extension
    }

    return sanitized
  }

  function loadLinks() {
    if (window.links) {
      console.log('video links loaded!')
      return
    }
    console.log('load video links...')
    let video_dir = undefined
    let thread_subject = document.querySelectorAll('#thread_subject')
    if (thread_subject.length <= 0) {
      console.log('加载视频标题失败 1')
      return
    }
    video_dir = sanitizeFilename(thread_subject[0].textContent)
    if (!video_dir) {
      console.log('加载视频标题失败 2')
      return
    }
    console.log('视频标题: ' + video_dir)
    let apoyl_multivideo_container = document.querySelectorAll('.apoyl_multivideo_container')
    if (apoyl_multivideo_container.length <= 0) {
      console.log('获取视频播放容器失败')
      return
    }
    let rightVideoList = document.querySelectorAll('.apoyl_multivideo_scroll_container')
    if (rightVideoList.length <= 0) {
      console.log('获取视频播放列表失败')
      return
    }
    let allBtn = rightVideoList[0].querySelectorAll('.apoyl_multivideo_btn')
    window.links = []

    let max_len = new String(allBtn.length).length
    function prefix(index) {
      let len = new String(index).length
      let repect = max_len - len
      let prefix = ''
      while (repect > 0) {
        prefix += '0'
        repect--
      }
      return prefix + index
    }

    for (let index = 0; index < allBtn.length; index++) {
      const btn = allBtn[index]
      let link = decodeURIComponent(btn.onclick.toString().split('url=')[1].split("');")[0])
      window.links.push({
        index: index + 1,
        name: sanitizeFilename(btn.textContent),
        prefix: prefix(index + 1),
        url: link,
      })
    }
    console.log(window.links)

    let downloadBtn = document.createElement('div')
    downloadBtn.style.position = 'relative'
    downloadBtn.style.display = 'block'
    downloadBtn.style.background = 'transparent'

    downloadBtn.innerHTML = `
        <div id="download-all-video"
          style="background-image: linear-gradient(0deg, #558b2f, #7cb342);
          cursor: pointer;
          position: absolute;
          display: block;
          padding: 5px 10px;
          z-index: 100001;
          border-radius: 10px;
          box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
          ">
          <div style="overflow: hidden;">
            download
          </div>
        </div>
        `
    rightVideoList[0].appendChild(downloadBtn)
    downloadBtn.onclick = async () => {
      if (window.links) {
        let failTask = []
        for (const item of window.links) {
          await submitTask(item)
            .then((response) => {
              return response.text()
            })
            .catch((error) => {
              showNotification('提交任务失败: ' + item.prefix + '.' + item.name)
              console.log('error', error)
              failTask.push(item)
            })
        }

        showNotification('任务提交完成，失败: ' + failTask.length + ' 个')
        for (const item of failTask) {
          await submitTask(item)
            .then((response) => {
              return response.text()
            })
            .catch((error) => {
              showNotification('提交任务失败: ' + item.prefix + '.' + item.name)
              console.log('error', error)
              failTask.push(item)
            })
        }
      }
    }

    async function submitTask(item) {
      let url = new URL('your proxy url')
      url.searchParams.set('type', 'newtask')
      url.searchParams.set('url', toBase64Unicode(item.url))
      url.searchParams.set(
        'token',
        'your aria2 token'
      )
      url.searchParams.set('dir', toBase64Unicode(`/downloads/${video_dir}`))
      url.searchParams.set('out', toBase64Unicode(item.prefix + '_' + item.name))

      showNotification('开始提交下载任务: ' + item.prefix + '_' + item.name)

      return fetch(url.toString())
    }
  }
})()
