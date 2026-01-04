// ==UserScript==
// @name         PTT web enhanced
// @namespace    2CF9973A-28C9-11EC-9EA6-98F49F6E8EAB
// @version      2.8.1
// @description  Enhance user experience of PTT web
// @author       Rick0
// @match        https://www.ptt.cc/*
// @grant        GM.xmlHttpRequest
// @connect      imgur.com
// @connect      ptt.cc
// @run-at       document-start
// @compatible   firefox Tampermonkey, Violentmonkey, Greasemonkey 4.11+
// @compatible   chrome Tampermonkey, Violentmonkey
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433635/PTT%20web%20enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/433635/PTT%20web%20enhanced.meta.js
// ==/UserScript==

(function() {
  'use strict'

  // == basic methods ==

  function createElement(html) {
    let template = document.createElement('template')
    template.innerHTML = html
    
    return template.content.firstChild
  }

  function insertElementToNextLine (positionElement, element) {
    let positionNextSibling = positionElement.nextSibling
    switch (positionNextSibling?.nodeType) {
      case Node.TEXT_NODE:
        positionNextSibling.parentNode.replaceChild(element, positionNextSibling)
        let textMatchList = positionNextSibling.data.match(/^([^\n]*)(\n?.*)$/s)
        if (textMatchList[1] !== undefined) element.insertAdjacentText('beforebegin', textMatchList[1])
        if (textMatchList[2] !== undefined) element.insertAdjacentText('afterend', textMatchList[2])
        break
        
      case Node.ELEMENT_NODE:
      case undefined:
        positionElement.insertAdjacentElement('afterend', element)
        break
      
      default:
        throw new Error('insertElementToNextLine receive invalid positionElement')
    }
  }

  function addStyle (cssCode) {
    document.head.append(createElement(`<style>${cssCode}</style>`))
  }

  function getImgurInfo (imgurUrl) {
    return new Promise((resolve, reject) => {
      let urlData = new URL(imgurUrl)

      if (regExpData.imgur.idExt.test(urlData.pathname)) {
        let imageId = RegExp.$1
        fetch(`https://api.imgur.com/3/image/${imageId}`, {
          method: 'GET',
          referrerPolicy: 'no-referrer',
          headers: {
            Authorization: 'Client-ID b654e1b04c90bc8'
          },
        })
          .then(res => res.json())
          .then(json => resolve(json.data))
          .catch(err => reject(err))
      } else if (regExpData.imgur.album.test(urlData.pathname)) {
        let albumId = RegExp.$1
        fetch(`https://api.imgur.com/3/album/${albumId}/images`, {
          method: 'GET',
          referrerPolicy: 'no-referrer',
          headers: {
            Authorization: 'Client-ID b654e1b04c90bc8'
          },
        })
          .then(res => res.json())
          .then(json => resolve(json.data[0]))
          .catch(err => reject(err))
      } else if (regExpData.imgur.gallery.test(urlData.pathname)) {
        let galleryId = RegExp.$1
        fetch(`https://api.imgur.com/3/gallery/${galleryId}/images`, {
          method: 'GET',
          referrerPolicy: 'no-referrer',
          headers: {
            Authorization: 'Client-ID b654e1b04c90bc8'
          },
        })
          .then(res => res.json())
          .then(json => resolve(Array.isArray(json.data) ? json.data[0] : json.data))
          .catch(err => reject(err))
      } else {
        reject(new Error(`不支援的格式: ${imgurUrl}`))
      }
    })
  }

  // == dependent methods ==

  function agreeOver18 () {
    document.cookie = `over18=1;path=/;expires=${(new Date(2100, 0)).toUTCString()}`
    location.replace(`https://www.ptt.cc/${decodeURIComponent(location.search.match(/[?&]from=([^&]+)/)[1])}`) 
  }

  function addHeadlines () {
    let boardToolsEl = document.querySelector('.btn-group.btn-group-dir')
    let headlinesUrl = `/bbs/${boardData.name}/search?q=recommend%3A100`
    let headlinesEl = createElement(`<a class="btn" href="${headlinesUrl}">爆文</a>`)
    // 如果在爆文搜尋頁面，按鈕加上樣式
    if (/[\?&]q=recommend%3A100/.test(location.search)) headlinesEl.classList.add('selected')
    boardToolsEl.append(headlinesEl)
  }

  function addSearch () {
    // 設定 css
    addStyle(
      `#navigation {
        display: flex;
      }
      #navigation > * {
        white-space: nowrap;
      }
      .ellipsis {
        text-overflow: ellipsis;
        overflow: hidden;
      }`
    )

    // 系列文
    let title = document.querySelectorAll('.article-metaline')[1]
      .querySelector('.article-meta-value')
      .textContent.match(/^(?:(?:Re|Fw): +)?(.+)$/)[1]
    let titleEl = createElement(`<a class="board ellipsis" style="cursor: pointer;">系列 ${title}</a>`)
    let titleUrl = `${location.pathname.match(/^(.+\/).+?$/)[1]}search?q=${encodeURIComponent(`thread:${title}`).replace(/%20/g, '+')}`
    titleEl.addEventListener('click', function (e) {
      location.href = titleUrl
    })

    // 同作者
    let author = document.querySelectorAll('.article-metaline')[0]
      .querySelector('.article-meta-value')
      .textContent.match(/^[^ ]+/)[0]
    let authorEl = createElement(`<a class="board" style="cursor: pointer;">作者 ${author}</a>`)
    let authorUrl = `${location.pathname.match(/^(.+\/).+?$/)[1]}search?q=${encodeURIComponent(`author:${author}`).replace(/%20/g, '+')}`
    authorEl.addEventListener('click', function (e) {
      location.href = authorUrl
    })

    // 插入到畫面中
    let navigation = document.querySelector('#navigation')
    navigation.firstElementChild.remove()
    navigation.insertAdjacentElement('afterbegin', titleEl)
    navigation.insertAdjacentElement('afterbegin', createElement('<div class="bar"></div>'))
    navigation.insertAdjacentElement('beforeend', authorEl)
  }

  function pttImageEnhanced () {
    function getPrevRichcontentEl (el) {
      while (el.parentElement.id !== 'main-content') {
        el = el.parentElement
      }
      return el
    }

    // == 取消所有 ptt web 原生的 imgur 圖片載入 ==
    for (let img of document.querySelectorAll('.richcontent > img[src*="imgur.com"]')) {
      img.src = ''
      img.parentElement.remove()
    }

    // == 建立 lazy observer ==
    let onEnterView = function (entries, observer) {
      for (let entry of entries) {
        if (entry.isIntersecting) {
          // 目標進入畫面
          let triggerRichcontent = entry.target
          let imgurUrl = triggerRichcontent.dataset.imgurUrl

          getImgurInfo(imgurUrl)
            .then(imgurInfo => {
              let attachment
              if (imgurInfo.animated) {
                attachment = createElement(`<video src="https://i.imgur.com/${imgurInfo.id}.mp4" autoplay loop muted style="max-width: 100%;max-height: 800px;"></video>`)
                attachment.addEventListener('loadedmetadata', function (e) {
                  triggerRichcontent.removeAttribute('style')
                })
              } else {
                attachment = createElement(`<img src="https://i.imgur.com/${imgurInfo.id}h.jpg" alt>`)
                attachment.addEventListener('load', function (e) {
                  triggerRichcontent.removeAttribute('style')
                })
              }
              triggerRichcontent.append(attachment)
            })
            .catch(err => {
              triggerRichcontent.remove()
            })
          observer.unobserve(triggerRichcontent)
        }
      }
    }
    let options = {
      rootMargin: '200%',
    }
    let lazyObserver = new IntersectionObserver(onEnterView, options)

    for (let link of document.querySelectorAll('.bbs-screen.bbs-content a[href*="imgur.com"]')) {
      // 建立 richcontent
      let prevRichcontentEl = getPrevRichcontentEl(link)
      let richcontent = createElement(`<div class="richcontent" style="min-height: 30vh;" data-imgur-url="${link.href}"></div>`)
      lazyObserver.observe(richcontent)
      insertElementToNextLine(prevRichcontentEl, richcontent)
    }
  }


  // == main ==

  var regExpData = {
    imgur: {
      idExt: /^\/(\w+)(?:\.(\w+))?$/,
      album: /\/a\/(\w+)/,
      gallery: /\/gallery\/(\w+)/,
    },
  }
  var pageData = {
    set metaReferrer (value) {
      if (this.metaReferrer !== undefined) {
        document.querySelector('meta[name="referrer"]').content = value
      } else {
        document.head.append(createElement(`<meta name="referrer" content="${value}">`))
      }
    },

    get metaReferrer () {
      return document.querySelector('meta[name="referrer"]')?.content
    },

    get isMobile () {
      return navigator.userAgentData.mobile
    },
  }
  var boardData = (() => {
    let result = {}

    if (/^\/(bbs|man)\/([^\/]+)(?:\/[^\/]+)*\/(?:M|G)\.\d+\.A\.[0-9A-F]{3}\.html/.test(location.pathname)) {
      result = {
        type: 'post',
        area: RegExp.$1,
        name: RegExp.$2,
        is404: document.title === '404',
      }
    } else if (/^\/(bbs|man)\/([^\/]+)(?:\/[^\/]+)*\/index(\d*).html/.test(location.pathname)) {
      result = {
        type: 'index',
        area: RegExp.$1,
        name: RegExp.$2,
        pageNum: RegExp.$3 === '' ? 0 : parseInt(RegExp.$3, 10),
      }
    } else if (/^\/(bbs|man)\/([^\/]+)\/search/.test(location.pathname)) {
      result = {
        type: 'search',
        area: RegExp.$1,
        name: RegExp.$2,
        isHeadline: /[\?&]q=recommend%3A100/.test(location.search),
      }
    } else if (location.pathname === '/ask/over18') {
      result = {
        type: 'over18',
      }
    }

    return result
  })()

  switch (boardData.type) {
    case 'over18':
      agreeOver18()
      break
  }

  document.addEventListener('DOMContentLoaded', function () {
    switch (boardData.type) {
      case 'post':
        if (!boardData.is404) {
          pageData.metaReferrer = 'no-referrer'
          pttImageEnhanced()
          // 只有一般看板頁面需要，排除精華區
          if (boardData.area === 'bbs') {
            addSearch()
          }
        }
        break

      case 'index':
      case 'search':
        addHeadlines()
        // 手機因為排版關係，使用最新來被爆文取代，但精華區並沒有最新按鈕，所以要排除
        if (pageData.isMobile && boardData.area === 'bbs') {
          let oldestEl = document.querySelector('.btn.wide')
          oldestEl.insertAdjacentElement('beforebegin', document.querySelectorAll('.btn')[2])
          oldestEl.remove()
        }
        break
    }
  }, { once: true })
})()
