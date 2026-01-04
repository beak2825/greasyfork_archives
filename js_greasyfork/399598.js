// ==UserScript==
// @name         Filter douyu video category
// @description  过滤斗鱼“全部直播”列表中不想看的视频类别，请自行修改源码定制过滤关键字。
// @namespace    daimon2k
// @version      2020.04.06
// @match        *://*.douyu.com/directory/all
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399598/Filter%20douyu%20video%20category.user.js
// @updateURL https://update.greasyfork.org/scripts/399598/Filter%20douyu%20video%20category.meta.js
// ==/UserScript==


(function () {
  'use strict';
  window.setInterval(function() {
    // Update here to customize
    let keywords = ['王者荣耀', '英雄联盟', 'DNF', '和平精英', '颜值', 'CS:GO', '二次元', '舞蹈', 'lol云顶之弈', '交友', ]
    let $ = jQuery
    let allChannels = $('.layout-Cover-item')

    for (let channel of allChannels) {
      let isMatched = false
      for (let keyword of keywords) {
        if (isMatched) break
        if (channel.innerText.indexOf(keyword) >= 0)
          isMatched = true
      }
      if (isMatched) {
        $(channel).hide()
      }
    }
  }, 3000)
})()
