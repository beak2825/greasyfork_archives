// ==UserScript==
// @name         storytrain
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  add more list column for shejiinn.com
// @author       You
// @match        https://www.storytrain.info/content/*
// @grant        none
// @license MIT 
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/437745/storytrain.user.js
// @updateURL https://update.greasyfork.org/scripts/437745/storytrain.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const hasSignaturePattern = /【(.+)】|\[(.+)\]/

  let validCount = 0

  $('.sms-content-table tr').each(function () {
    const content = $(this).children('td:nth(2)').text()
    const res = hasSignaturePattern.exec(content)
    if (!res) {
      $(this).remove()
    } else {
      const sign = res[1] || res[2]
      if (sign) {
        validCount++
        $(this).append(`<td><b>${sign}</td>`)
        $(this).append(`<td><a target="_blank" href="https://www.baidu.com/s?wd=${sign}">去百度</a></td>`)
        $(this).append(`<td><a target="_blank" href="https://www.tianyancha.com/search?key=${sign}">查企业</a></td>`)
      }
    }
  })

    if (!validCount) {
        $('.pagination .active').next().children('a')[0].click()
    }
})();