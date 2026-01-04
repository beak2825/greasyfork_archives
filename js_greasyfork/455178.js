// ==UserScript==
// @name         提取视频链接
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://www.ixigua.com/*
// @match        https://user.youku.com/*
// @match        https://*.bilibili.com/*
// @connect      api.bilibili.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant    GM_setClipboard
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455178/%E6%8F%90%E5%8F%96%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/455178/%E6%8F%90%E5%8F%96%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function () {
  'use strict';
  let baseurl = window.location.origin
  let domain = document.domain
  console.log('domain', domain)
  var site = -1
  switch (domain) {
    case 'www.ixigua.com':
      site = 0
      break
    case 'user.youku.com':
      site = 1
      break
    case 'bilibili.com':
    case 'message.bilibili.com':
    case 'space.bilibili.com':
      site = 2
      break
  }
  if (site < 0) {
    console.log('=================================')
    console.log('=================================')
    console.log('无法识别网址', '当前domain', domain)
    console.log('=================================')
    console.log('=================================')
  }

  let flagArr = [{
    btnbar: '.component-sortTabs__container',
    itempanel: '.FeedContainer__itemWrapper:not(.loading)',
    titlepanel: 'div > a',
    title: 'title'
  }, {
    btnbar: '.ant-tabs-nav',
    itempanel: '.categorypack_yk_pack',
    titlepanel: 'div > a',
    title: 'title'
  }, {
    btnbar: '.fav-info',
    itempanel: '.small-item',
    titlepanel: 'li > a',
    title: 'title'
  }, ]

  let matchObj = flagArr[site]
  console.log('matchObj',matchObj)


  let buildCheckBoxBtn = document.createElement('button')
  buildCheckBoxBtn.innerHTML = '解析网页'
  buildCheckBoxBtn.addEventListener('click', (e) => {
    let videoItems = document.querySelectorAll(matchObj.itempanel)
    console.log('videoItems', videoItems)
    console.log('videoItems length', videoItems.length)
    videoItems.forEach(item => {
      console.log(item)
      let title = item.querySelector(matchObj.titlepanel)
      console.log('title', title, title.getAttribute(matchObj.title))
      let href = title.getAttribute("href")
      let url = href.startsWith('http') ? href : href.startsWith('//') ? `https:${href}` : baseurl + href
      let check = `
      <label><input type="checkbox"  style="-webkit-appearance: checkbox" id="getThisUrl" name="getThisUrl" value="${url}">提取</label>
      `
      item.innerHTML = item.innerHTML + check
      console.log('url', url)
    })
  })


  let copySpaceUrlBtn = document.createElement('button')
  copySpaceUrlBtn.innerHTML = '复制链接'

  copySpaceUrlBtn.addEventListener('click', (e) => {
    let query = document.querySelectorAll('#getThisUrl')
    console.log('query', query)
    let checkedList = []
    query.forEach(item => {
      console.log(item.checked, item.value)
      if (item.checked) {
        checkedList.push(`${item.value}`)
      }
    })
    console.log('checkedLIst', checkedList.join(' '))
    GM_setClipboard(checkedList.join('\n'))
    alert(`已复制${checkedList.length}个视频地址`);
  })

  setTimeout(() => {
    let btnbar = $(matchObj.btnbar)
    console.log('btnbar',btnbar)

    btnbar.append(buildCheckBoxBtn)
    btnbar.append(copySpaceUrlBtn)
  }, 3000);
})();