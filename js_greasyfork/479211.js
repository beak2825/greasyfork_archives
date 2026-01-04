// ==UserScript==
// @name         bilibili显示豆瓣评分跳转
// @namespace    https://github.com/Jiny3213
// @version      1.0
// @description  一个简单的脚本，显示番剧和电影的豆瓣评分，点击可以跳转豆瓣，为你在b站看剧提供参考
// @author       Jiny3213
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479211/bilibili%E6%98%BE%E7%A4%BA%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/479211/bilibili%E6%98%BE%E7%A4%BA%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let title, isAppend, father
  if(document.querySelector('[class^="mediainfo_mediaTitle"]')) {
    title = document.querySelector('[class^="mediainfo_mediaTitle"]').innerText
    isAppend = false
    father = document.querySelector('[class^="mediainfo_bottomBar"]')
  } else if (document.querySelector('.media-info-title-t')) {
    title = document.querySelector('.media-info-title-t').innerText
    isAppend = true
    father = document.querySelector('.media-info-count')
  } else {
    return
  }
  GM_xmlhttpRequest({
  headers: {
    'content-type': 'text/html; charset=utf-8',
    'User-agent': window.navigator.userAgent,
  },
  url: 'https://www.douban.com/search?q=' + title,
  method: 'GET',
  onreadystatechange: (res) => {
    if (res.readyState === 4) {
      const doc = (new DOMParser).parseFromString(res.response, 'text/html');
      console.log(doc)
      const doubanScore = doc.querySelector('.result-list .result .rating_nums').innerText
      const href = doc.querySelector('.result-list .result .title a').href
      const doubanScoreEl = document.createElement('a')
      doubanScoreEl.href = href
      doubanScoreEl.target = '_blank'
      doubanScoreEl.style.color = "#7fc06e"
      if(isAppend) {
        document.querySelector('.media-info-count-item-review').classList.remove('media-info-count-item-review')
        const titleEl = document.createElement('span')
        doubanScoreEl.classList.add('media-info-count-item')
        doubanScoreEl.classList.add('media-info-count-item-review')
        titleEl.classList.add('media-info-label')
        titleEl.innerText = '豆瓣评分'
        titleEl.style.color = "#7fc06e"
        const scoreEl = document.createElement('em')
        scoreEl.innerText = `${doubanScore}分` 
        scoreEl.style.color = "#7fc06e"
        doubanScoreEl.appendChild(titleEl)
        doubanScoreEl.appendChild(scoreEl)
        father.appendChild(doubanScoreEl)
      } else {
        doubanScoreEl.innerText = `豆瓣评分：${doubanScore}分`
        father.insertBefore(doubanScoreEl, document.querySelector('[class^="upinfo_upInfoCard"]'))
      }
    }
  },
})
})();