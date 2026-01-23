// ==UserScript==
// @name           Bluesky media downloader
// @description    Download media from Bluesky
// @version        0.1.6
// @author         sanadan <jecy00@gmail.com>
// @namespace      https://javelin.works
// @match          https://bsky.app/*
// @grant          GM_download
// @grant          GM_getValue
// @grant          GM_setValue
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/513852/Bluesky%20media%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513852/Bluesky%20media%20downloader.meta.js
// ==/UserScript==

const BMD = (function () {
  'use strict'

  let history
  return {
    init: async function () {
      history = await GM_getValue('download_history', [])
      const observer = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => this.detect(node))))
      observer.observe(document.body, { childList: true, subtree: true })
    },
    detect: function (node) {
      const nodeName = node.nodeName
      if (nodeName === '#text' || nodeName === '#comment') return

      // 画像を探す
      const img = node.querySelector('img[fetchpriority]')
      if (!img || !img.src.includes('/feed_thumbnail/')) return

      // 画像のポスト1つ分の先頭を探す
      const article = img.closest('div[data-testid]')
      if (article.classList.contains('bmd')) return // 探索済み

      article.classList.add('bmd')
      const testid = article.dataset.testid
      if (testid.startsWith('postThreadItem')) {
        // ポストの画像の場合
        this.addButton(article)
      } else if (testid === 'contentHider-post') {
        // TLの画像の場合
        this.addButton2(article)
      }
    },
    addButton: function (article) {
      let imageBase = article.children[1].children[0]
      if (imageBase.children.length === 1) {
        // テキストなし
        imageBase = imageBase.children[0]
      } else {
        // テキストあり
        imageBase = imageBase.children[1]
      }
      const images = imageBase.children[0].children[0].querySelectorAll('img')
      let sources = []
      images.forEach((img) => {
        const url = img.src.replace('/feed_thumbnail/', '/feed_fullsize/')
        sources.push(url)
      })
      const source = sources.join(',')
      const imageId = sources[0].match(/plc:(.+?)@/)[1]
      const type = sources[0].split('@')[1]
      const author = article.querySelector('div[dir="auto"]').textContent
      let postText = ''
      const post = article.children[1].children[0].children[0]
      if (post) {
        postText = this.splitPost(post.textContent)
      }
      let date = ''
      const dateElement = article.querySelector('a[data-tooltip]')
      if (dateElement) {
        date = this.fromDate(dateElement.dataset.tooltip)
      } else {
        const dateElement2 = article.children[1].children[1].children[0].children[0].textContent
        if (dateElement2) {
          date = this.fromDate(dateElement2)
        }
      }
      const element = document.createElement('div')
      const postId = new URL(location.href).pathname.split('/').pop()
      element.innerHTML = history.includes(postId) ? this.check_svg : this.download_svg
      element.style.cursor = 'pointer'
      element.dataset.source = source
      element.dataset.author = author
      element.dataset.date = date
      element.dataset.postText = postText
      element.dataset.type = type
      element.dataset.postId = postId
      element.onclick = (event) => {
        event.preventDefault()
        this.download(element)
      }
      let base = article.children[1].children[3]
      if (base) base = base.children[0]
      else base = article.children[1].children[1].children[3]
      base.appendChild(element)
    },
    addButton2: function (article) {
      let base = article
      if (article.children.length >= 2) {
        base = article.children[1]
        if (base.children[0].children[0].tagName === 'A') return // OGP画像に引っかかったので無視

        const element = article.children[1].querySelector('div[aria-label]')
        if (element && element.role === 'link') return // 引用の画像に引っかかったので無視
      }
      const images = base.querySelectorAll('img[fetchpriority]')

      let sources = []
      images.forEach((img) => {
        const url = img.src.replace('/feed_thumbnail/', '/feed_fullsize/')
        sources.push(url)
      })
      let source = sources[0]
      if (images[0].closest('button')) {
        source = sources.join(',')
      }

      const imageId = sources[0].match(/plc:(.+?)@/)[1]
      const type = sources[0].split('@')[1]
      const authorBase = article.previousElementSibling.querySelectorAll('a[role="link"]')
      const author = authorBase[0].textContent
      let postText = ''
      const post = article.querySelector('div[data-testid="postText"]')
      if (post) {
        postText = this.splitPost(post.textContent)
      }
      const dateElement = article.previousElementSibling.querySelector('a[data-tooltip]')
      const date = this.fromDate(dateElement.dataset.tooltip)
      const element = document.createElement('div')
      const postId = new URL(dateElement.href).pathname.split('/').pop()
      element.innerHTML = history.includes(postId) ? this.check_svg : this.download_svg
      element.classList.add('bmd')
      element.style.cursor = 'pointer'
      element.dataset.source = source
      element.dataset.author = author
      element.dataset.date = date
      element.dataset.postText = postText
      element.dataset.type = type
      element.dataset.postId = postId
      element.onclick = (event) => {
        event.preventDefault()
        this.download(element)
      }
      article.nextElementSibling.appendChild(element)
    },
    splitPost: function (str) {
      if (str === '') return ''
      return this.replace(str).match(/.+?([\n!！。？]|$)/)[0].split('\n')[0].substr(0, 64) // 64文字なのは適当／80文字はエラーになったので
    },
    fromDate: function (str) {
      const items = str.split(/[\s年月日:\/]/)
      const year = items[0]
      const month = ('0' + items[1]).slice(-2)
      const day = ('0' + items[2]).slice(-2)
      var i = items.length < 6 ? 3 : 4
      const hour = this.zeroPadding(items[i])
      const minute = this.zeroPadding(items[i + 1])

      return `${year}-${month}-${day}_${hour}-${minute}`
    },
    zeroPadding: function (str) {
      return ('0' + str).slice(-2)
    },
    replace: function (str) {
      const invalidChars = { '#': '＃', '\\': '＼', '\/': '／', '\|': '｜', '<': '＜', '>': '＞', ':': '：', '*': '＊', '?': '？', '"': '＂', '\u202a': '', '\u202c': '' }
      return str.replace(/[#\\/|<>:*?"\u202a\u202c]/gu, v => invalidChars[v])
    },
    download: function (element) {
      const sources = element.dataset.source.split(',')
      const author = this.replace(element.dataset.author)
      const date = element.dataset.date
      const postText = this.replace(element.dataset.postText)
      const type = element.dataset.type
      const postId = element.dataset.postId
      let baseName = `cg/${author}/${date}`
      if (postText !== '') baseName += `_${postText}`
      const count = sources.length
      element.innerHTML = this.spinner_svg
      sources.forEach((source, index) => {
        let fileName = baseName
        if (count > 1) fileName += `_${index + 1}`
        fileName += `.${type}`
        GM_download(source, fileName)
      })
      if (!history.includes(postId)) {
        history.unshift(postId)
        GM_setValue('download_history', history)
      }
      element.innerHTML = this.check_svg
    },
    countDiv: function (startElement) {
      let count = 0
      let element = startElement
      while (true) {
        const parent = element.parentElement
        if (parent === null) {
          break
        }

        count += 1
        element = parent
      }
      return count
    },
    download_svg: `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 18 18" version="1.1">
<g id="surface1">
<path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%,0%,0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 4 17 L 4 19 C 4 20.104167 4.895833 21 6 21 L 18 21 C 19.104167 21 20 20.104167 20 19 L 20 17 " transform="matrix(0.75,0,0,0.75,0,0)"/>
<path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%,0%,0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 7 11 L 12 16 L 17 11 " transform="matrix(0.75,0,0,0.75,0,0)"/>
<path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(0%,0%,0%);stroke-opacity:1;stroke-miterlimit:4;" d="M 12 4 L 12 16 " transform="matrix(0.75,0,0,0.75,0,0)"/>
</g>
</svg>
`,
    check_svg: `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 18 18" version="1.1">
<g id="surface1">
<path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,50.196081%,0%);fill-opacity:1;" d="M 15.484375 2.582031 L 7.675781 10.390625 L 2.515625 5.226562 L 0 7.742188 L 7.675781 15.417969 L 10.191406 12.902344 L 18 5.097656 Z M 15.484375 2.582031 "/>
</g>
</svg>
`,
    spinner_svg: `
<svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><rect x="11" y="1" width="2" height="5" opacity=".14"/><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"/><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"/><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"/><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"/><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"/><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"/><animateTransform attributeName="transform" type="rotate" calcMode="discrete" dur="0.75s" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" repeatCount="indefinite"/></g></svg>
`,
  }
})()

BMD.init()
