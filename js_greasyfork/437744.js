// ==UserScript==
// @name         lothelperExtend
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  add more list column for shejiinn.com
// @author       You
// @match        https://www.lothelper.com/cn/showsms/*
// @grant        none
// @license MIT
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/437744/lothelperExtend.user.js
// @updateURL https://update.greasyfork.org/scripts/437744/lothelperExtend.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const hasSignaturePattern = /【(.+)】|\[(.+)\]/

  window.setTimeout(() => {
    let validCount = 0
    $('#tb_msg_show li').each(function () {
      const content = $(this).children('span:nth(0)').text()
      const res = hasSignaturePattern.exec(content)
      if (!res) {
        $(this).remove()
      } else {

        const sign = res[1] || res[2]
        if (sign) {
            validCount++
          $(this).append(`<span style="float: right; margin-right: 4px;"><a target="_blank" href="https://www.baidu.com/s?wd=${sign}">去百度</a></span>`)
          $(this).append(`<span style="float: right; margin-right: 4px;"><a target="_blank" href="https://www.tianyancha.com/search?key=${sign}">查企业</a></span>`)
          $(this).append(`<span style="float: right; margin-right: 4px;"><b>${sign}</span>`)
        }
      }
    })
    if (!validCount) {
      console.log($('.pagination .active').next().children('a'))
      $('.pagination .active').next().children('a')[0].click()
    }
  }, 1000)
})();