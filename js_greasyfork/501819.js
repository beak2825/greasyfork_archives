// ==UserScript==
// @name         B站表情包下载
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  批量下载B站表情包/收藏集图片
// @author       jzh
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/2.6.1/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501819/B%E7%AB%99%E8%A1%A8%E6%83%85%E5%8C%85%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/501819/B%E7%AB%99%E8%A1%A8%E6%83%85%E5%8C%85%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const buttons = [
    {
      selector:
        '.bili-emoji-picker--visible .bili-emoji-picker__body .bili-emoji-picker__content .bili-emoji-picker__emoji img',
      textContent: '下载选中系列表情包',
      alertMessage: '请先点击表情选项并选中需要下载的表情包'
      // <img src="//xxx.png@yyy" alt="[xxx]">
    },
    {
      selector:
        '.message-layout .message-main .whisper .message-content .message-content__wrapper .message-content__inner .im-container .msb-textarea .brt-root .brt-editor img',
      textContent: '下载输入框表情包',
      alertMessage: '输入框没有表情包'
      // <img src="//xxx.png@yyy" alt="[xxx]">
    },
    {
      selector:
        '.message-layout .message-main .whisper .message-content .message-content__wrapper .message-content__inner .im-container .im-scroll div[class^="_RichText_"] img',
      textContent: '下载对话框表情包',
      alertMessage: '对话框没有表情包'
      // <img src="//xxx.png@yyy" alt="[xxx]">
    },
    {
      textContent: '下载评论区表情包',
      alertMessage: '评论区没有表情包'
      // <img src="//xxx.png@yyy" alt="[xxx]">
    },
    {
      textContent: '下载收藏集图片',
      alertMessage: '请参照教程打开收藏集卡池详情'
      // <div class="card-item">
      //   <div class="card-container">
      //     <div class="card">
      //       <div class="card-img">
      //         <img src="https://xxx.png@yyy" class="img" />
      //       </div>
      //     </div>
      //   </div>
      //   <div class="name">xxx</div>
      // </div>
    }
  ]
  const buttonStyle = {
    width: '130px',
    marginBottom: '25px',
    cursor: 'pointer',
    padding: '2px',
    border: '1px solid #767676',
    backgroundColor: '#efefef',
    fontSize: '12px'
  }
  // 是否私信
  const isMessage = location.href.startsWith('https://message.bilibili.com')
  // 是否评论区
  const isComment = /^https:\/\/www\.bilibili\.com\/(video|bangumi|opus)/.test(location.href)
  // 是否收藏集
  const isBlackboard = location.href.startsWith('https://www.bilibili.com/blackboard')
  const div = document.createElement('div')
  Object.assign(div.style, {
    position: 'fixed',
    top: '250px',
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  })
  for (let i = 0; i < 5; i++) {
    if (isMessage) {
      if (i !== 0 && i !== 1 && i !== 2) {
        continue
      }
    } else if (isComment) {
      if (i !== 3) {
        continue
      }
    } else if (isBlackboard) {
      if (i !== 4) {
        continue
      }
    } else {
      return
    }
    const { selector, textContent } = buttons[i]
    const button = document.createElement('button')
    button.textContent = textContent
    Object.assign(button.style, buttonStyle)
    button.onclick = () => {
      try {
        let emojis = []
        if (isMessage) {
          emojis = getMessageEmojis(selector)
        } else if (isComment) {
          emojis = getCommentEmojis()
        } else if (isBlackboard) {
          emojis = getBlackboardEmojis()
        }
        downloadEmojis(emojis, i)
      } catch (e) {
        console.log(e)
      }
    }
    div.appendChild(button)
  }
  // 评论区添加单条评论表情下载按钮
  if (isComment) {
    const button = document.createElement('button')
    button.textContent = '单条评论表情下载'
    Object.assign(button.style, buttonStyle)
    button.onclick = () => {
      const emojis = getCommentEmojis()
      const emojiParent = new Set()
      emojis.forEach(item => {
        if (getImgName(item, 3).includes('_')) {
          // 排除普通表情
          emojiParent.add(item.parentNode)
        }
      })
      Array.from(emojiParent).forEach(item => {
        if (item.lastElementChild.tagName === 'BUTTON') {
          // 添加过的跳过
          return
        }
        // 写到外面会从原来的父节点移除
        const innerButton = document.createElement('button')
        innerButton.textContent = '下载'
        innerButton.onclick = () => {
          const emojis = Array.from(innerButton.parentNode.querySelectorAll('img'))
          downloadEmojis(emojis, 3)
        }
        item.appendChild(innerButton)
      })
    }
    div.appendChild(button)
  }
  document.body.appendChild(div)
  function getMessageEmojis(selector) {
    return Array.from(document.querySelectorAll(selector))
  }
  function getCommentEmojis() {
    return Array.from(
      document
        .querySelector('bili-comments')
        .shadowRoot.querySelectorAll('#contents #feed bili-comment-thread-renderer')
    ).flatMap(item =>
      Array.from(
        Array.from(
          item.shadowRoot
            .querySelector('#comment')
            .shadowRoot.querySelector('#body #main #content bili-rich-text')
            .shadowRoot.querySelectorAll('#contents>img')
        ).concat(
          Array.from(
            item.shadowRoot
              .querySelector('#replies bili-comment-replies-renderer')
              .shadowRoot.querySelectorAll(
                '#expander #expander-contents bili-comment-reply-renderer'
              )
          ).flatMap(item2 =>
            Array.from(
              item2.shadowRoot
                .querySelector('#body #main bili-rich-text')
                .shadowRoot.querySelectorAll('#contents>img')
            )
          )
        )
      )
    )
  }
  function getBlackboardEmojis() {
    return Array.from(
      document
        .querySelector('#mall-iframe')
        .contentDocument.querySelectorAll(
          '#app .digital-card .digital-card-content .drawer .content .v-switcher .v-switcher__content .v-switcher__content__wrap .v-switcher__content__item .dlc-detail .dlc-cards .scarcity-block'
        )
    ).flatMap(item => Array.from(item.querySelectorAll('.card-block .card-item')))
  }
  function getUrl(item, type) {
    let url, index
    switch (type) {
      case 0:
        // //xxx.png@yyy
        url = item.src
        index = url.indexOf('@')
        return index > 0 ? url.slice(0, index) : url
      case 1:
        // //xxx.png@yyy
        url = item.src
        index = url.indexOf('@')
        return index > 0 ? url.slice(0, index) : url
      case 2:
        // //xxx.png@yyy
        url = item.src
        index = url.indexOf('@')
        return index > 0 ? url.slice(0, index) : url
      case 3:
        // //xxx.png@yyy
        url = item.src
        index = url.indexOf('@')
        return index > 0 ? url.slice(0, index) : url
      case 4:
        url = item.querySelector('.card-container .card .card-img img').src
        index = url.indexOf('@')
        return index > 0 ? url.slice(0, index) : url
    }
  }
  function getImgName(item, type) {
    switch (type) {
      case 0:
        return item.alt.slice(1, -1) || item.alt
      case 1:
        return item.alt.slice(1, -1) || item.alt
      case 2:
        return item.alt.slice(1, -1) || item.alt
      case 3:
        return item.alt.slice(1, -1) || item.alt
      case 4:
        return item.querySelector('.name').innerText
    }
  }
  function getZipName(item, type) {
    switch (type) {
      case 0:
        return item.alt.slice(1, -1).match(/^(.*?)_/)?.[1] || item.alt
      default:
        return getImgName(item, type) + '等'
    }
  }
  function blobToBinary(blob) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader()
      fileReader.readAsArrayBuffer(blob)
      fileReader.onloadend = e => {
        resolve(new Uint8Array(e.target.result))
      }
      fileReader.onerror = () => {
        reject(new Error('blobToBinary failure'))
      }
    })
  }
  function downloadEmojis(emojis, i) {
    const seen = new Set()
    const filteredEmojis = emojis.filter(item => {
      const imgName = getImgName(item, i)
      if (i !== 0 && i !== 4 && !imgName.includes('_')) {
        // 排除普通表情
        return false
      }
      if (!seen.has(imgName)) {
        seen.add(imgName)
        return true
      }
      return false
    })
    if (filteredEmojis.length === 0) {
      alert(buttons[i].alertMessage)
      return
    }
    let zipName = ''
    // eslint-disable-next-line no-undef
    const zip = new JSZip()
    const promises = filteredEmojis.map(async (item, imgIndex) => {
      if (imgIndex === 0) {
        zipName = getZipName(item, i)
      }
      const url = getUrl(item, i)
      zip.file(
        getImgName(item, i) + '.' + url.split('.').pop(),
        await blobToBinary(await (await fetch(url)).blob())
      )
    })
    Promise.all(promises).then(() => {
      const url = URL.createObjectURL(zip.generate({ type: 'blob' }))
      const a = document.createElement('a')
      a.href = url
      a.download = zipName + '.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }
})()
