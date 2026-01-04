// ==UserScript==
// @name         BIT-补足下载附件时的默认文件名
// @namespace    http://tampermonkey.net/
// @version      0.2.15
// @description  补充附件中 <a> 元素的 download 属性
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       Y.D.X.
// @match        https://jxzx.bit.edu.cn/*.htm
// @match        https://jwb.bit.edu.cn/*.htm
// @match        https://student.bit.edu.cn/*
// @match        https://www.bit.edu.cn/*.htm
// @match        https://opt.bit.edu.cn/*.htm
// @match        https://mingde.bit.edu.cn/*.htm
// @match        https://xuteli.bit.edu.cn/*.htm
// @match        https://xcb.bit.edu.cn/*.htm
// @match        https://grd.bit.edu.cn/*.htm
// @match        https://sie.bit.edu.cn/*.htm
// @match        https://cs.bit.edu.cn/*.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466254/BIT-%E8%A1%A5%E8%B6%B3%E4%B8%8B%E8%BD%BD%E9%99%84%E4%BB%B6%E6%97%B6%E7%9A%84%E9%BB%98%E8%AE%A4%E6%96%87%E4%BB%B6%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/466254/BIT-%E8%A1%A5%E8%B6%B3%E4%B8%8B%E8%BD%BD%E9%99%84%E4%BB%B6%E6%97%B6%E7%9A%84%E9%BB%98%E8%AE%A4%E6%96%87%E4%BB%B6%E5%90%8D.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // 优先使用在前面的 title_selector
  const matches = [
    { // 教学中心
      host: 'jxzx',
      attachments_selector: '.pageArticle > .Annex > ul > li > a'
    },
    { // 教务部
      host: 'jwb',
      attachments_selector: '.Annex > ul > li > a'
    },
    { // World Wide Web
      host: 'www',
      attachments_selector: '.article .Annex > ul > li > a'
    },
    { // Student
      host: 'student',
      attachments_selector: '.fujian > ul  > li > a'
    },
    { // Optics
      host: 'opt',
      attachments_selector: '.fujian > ul > li > a'
    },
    { // 明德
      host: 'mingde',
      attachments_selector: '.pageArticle .Annex > ul > li > a'
    },
    { // 徐特立
      host: 'xuteli',
      attachments_selector: '.annex > ul > li > a'
    },
    { // 宣传部
      host: 'xcb',
      attachments_selector: '.rt_fujian > ul > li > a'
    },
    { // Graduate
      host: 'grd',
      attachments_selector: '.gp-annex3 > ul > li > a'
    },
    { // School of Information and Electronics
      host: 'sie',
      attachments_selector: '.annexList > li > a'
    },
    { // Computer Science
      host: 'cs',
      attachments_selector: 'div.annex.lh24 > ul > li > a'
    }
  ]

  /**
   * 猜测带有扩展名的文件名
   *
   * @param {string} text
   * @param {string} url
   * @returns {string}
   */
  function guess_filename (text, url) {
    const SUFFIX_PATTERN = /\.[0-9a-zA-Z]+$/

    const match_text = SUFFIX_PATTERN.exec(text)
    const suffix_by_text = match_text !== null ? match_text[0] : null
    const match_url = SUFFIX_PATTERN.exec(url)
    const suffix_by_url = match_url !== null ? match_url[0] : null

    if (suffix_by_url === null) {
      // 若`url`无更多信息，则照抄`text`
      return text
    } else {
      // 若`url`提供了信息
      if (suffix_by_text === null) {
        // 若`text`缺扩展名，则加上扩展名
        // 这是最常见的情况。
        return text + suffix_by_url
      } else {
        // 若`text`也疑似有扩展名，则与`url`的比较一下，看情况决定是否加上
        if (suffix_by_text === suffix_by_url) {
          return text
        }

        if (suffix_by_text.match(/^\.[0-9]+$/) || (suffix_by_text.length < suffix_by_url)) {
          // 例：`text`是`XeTeX-3.141592653-2.6-0.999996`，那么`suffix_by_text`会是`.999996`，并非真的扩展名。
          return text + suffix_by_url
        } else {
          return text
        }
      }
    }
  }

  function set_attachments_filenames () {
    const site_host = window.location.host

    for (const s of matches) {
      if (site_host === `${s.host}.bit.edu.cn`) {
        document.querySelectorAll(s.attachments_selector).forEach(attach => {
          if (!attach.download) {
            attach.download = guess_filename(attach.textContent, attach.href)
          }
        })

        break
      }
    }
  }

  set_attachments_filenames()
})()
