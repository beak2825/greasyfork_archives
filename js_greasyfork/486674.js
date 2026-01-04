// ==UserScript==
// @name         小说网阅读增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  各小说网站阅读增强，下载，页面优化
// @author       Remira
// @match        *://www.jinnanyq.com/*
// @match        *://www.hafuktxt.com/*
// @match        *://m.hafuktxt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinnanyq.com
// @license      GNU General Public License v3.0 or later
// @require      https://unpkg.com/axios@1.3.6/dist/axios.min.js
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/486674/%E5%B0%8F%E8%AF%B4%E7%BD%91%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/486674/%E5%B0%8F%E8%AF%B4%E7%BD%91%E9%98%85%E8%AF%BB%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

console.log('[US] The script has been loaded')

;(function () {
  'use strict'

  const host = location.host
  const pathname = location.pathname
  // console.info(host, pathname)
  function run() {
    console.log('1');
    if (/^(www|m)\.hafuktxt\.com$/.test(host)) {
      // 新笔趣阁
      let isPc = host.split('.')[0] === 'm' ? false : true
      const regular = {
        '/book/[0-9]+/': hafuk_Book, // 详情页
        '/chapter/[0-9]+/[0-9]+(?:_[0-9]+)?.html': hafuk_Chapter, // 章节页
      }
      Object.keys(regular).some((pattern) => {
        if (new RegExp(`^${pattern}$`).test(pathname)) {
          regular[pattern](isPc)
          return true
        }
      })
    } else {
      console.log('[US] Not on the list')
    }
  }
  run()

  function hafuk_Book(isPc) {
    console.log(`[US] hafuk_Book is running [isPc=${isPc}]`)
  }

  function hafuk_Chapter(isPc) {
    console.log(`[US] hafuk_Chapter is running [isPc=${isPc}]`)
    
    let nextPage = document.getElementById('pb_next')
    let content = document.getElementById('chaptercontent')
    let fullContent = getContentInPage(content)
    content.innerHTML = fullContent

    getFullContent(nextPage.href)

    let searchElement = document.getElementsByClassName('search')
    searchElement[0].remove()
    searchElement[0].remove()
    let readinline = document.getElementsByClassName('readinline')
    readinline[0].remove()

    let readPage = document.getElementsByClassName('Readpage')
    console.log(readPage);
    readPage[0].style.backgroundColor = '#ffffff00'
  }

  function getContentInPage(content) {
    let scriptTag = content.getElementsByTagName('script')[0]
    if (scriptTag) scriptTag.remove()
    let aTag = content.getElementsByTagName('a')[0]
    if (aTag) aTag.remove()

    let innerHtml = content.innerHTML
    innerHtml = innerHtml.replace(new RegExp('<br>记住手机版网址：m.hafuktxt.com', 'g'),'')
    innerHtml = innerHtml.replace(new RegExp('<br><br>\\(本章未完,请翻页\\)', 'g'), '')
    innerHtml = innerHtml.replace(/.*?页<br><br>/, '')
    // console.log(innerHtml);
    return innerHtml
  }

  async function getFullContent(href) {
    try {
      if (!href.includes('_')) {
        let nextTag = document.getElementsByClassName('Readpage_down')
        nextTag[0].href = href
        nextTag[1].href = href
        return
      }
      let res = await axios.get(href)
      let parser = new DOMParser()
      let htmlDoc = parser.parseFromString(res.data, 'text/html')
      // console.log(htmlDoc);
      let nextHref = htmlDoc.getElementById('pb_next')
      let nextContent = htmlDoc.getElementById('chaptercontent')
      nextContent = getContentInPage(nextContent)
      let content = document.getElementById('chaptercontent')
      content.innerHTML += nextContent
      await getFullContent(nextHref.href)
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * 1. 添加下载功能区域
   * 2. 获取小说章节信息 包括本页和共多少页多少章
   * 3. 创建队列，依次按链接打开并读取html
   * 4. 将指定区域内文本保存
   */
})()