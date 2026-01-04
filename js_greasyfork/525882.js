// ==UserScript==
// @name         显示 B 站视频发布日期
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  The video release date of bilibili is displayed
// @author       showlotus
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @homepage     https://github.com/showlotus/tampermonkey-scripts/blob/main/packages/bilibili-release-date
// @supportURL   https://github.com/showlotus/tampermonkey-scripts/issues
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525882/%E6%98%BE%E7%A4%BA%20B%20%E7%AB%99%E8%A7%86%E9%A2%91%E5%8F%91%E5%B8%83%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/525882/%E6%98%BE%E7%A4%BA%20B%20%E7%AB%99%E8%A7%86%E9%A2%91%E5%8F%91%E5%B8%83%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  /**
   * 通过 bvid 获取视频发布日期
   * @param {string} bvid
   * @returns {Promise<string>}
   */
  async function getPubdateByBvid(bvid) {
    return await fetch('https://api.bilibili.com/x/web-interface/view?bvid=' + bvid)
      .then(r => r.json())
      .then(r =>
        new Date(r.data.pubdate * 1000)
          .toLocaleString()
          .replace(/\/(\d)(?=(\/|\s))/g, '-0$1')
          .replace(/\//g, '-')
      )
  }

  function injectPubDate() {
    document.querySelectorAll('.card-box div.info:not([bvid])').forEach(async n => {
      if (n.hasAttribute('bvid')) return
      const bvid = n
        .querySelector('a')
        ?.getAttribute('href')
        ?.match(/video\/([^\/]+)/)?.[1]
      if (!bvid) return
      n.setAttribute('bvid', bvid)
      const pubdate = await getPubdateByBvid(bvid)
      const pubdateDiv = document.createElement('div')
      pubdateDiv.innerHTML = pubdate
      pubdateDiv.classList.add('playinfo')
      n.appendChild(pubdateDiv)
    })
  }

  function watchDomMutation(target, callback, options = { immediate: true }) {
    options.immediate && callback()
    const ob = new MutationObserver(callback)
    ob.observe(target, {
      childList: true,
      subtree: true
    })
  }

  setTimeout(() => {
    watchDomMutation(document.body, injectPubDate)
  }, 3000)
})()
