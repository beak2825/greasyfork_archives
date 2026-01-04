// ==UserScript==
// @name         javdb性癖净化器
// @namespace    psrx
// @version      0.3
// @description  过滤掉你不喜欢的内容
// @author       psrx
// @include      https://javdb.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425858/javdb%E6%80%A7%E7%99%96%E5%87%80%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/425858/javdb%E6%80%A7%E7%99%96%E5%87%80%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==
;(function () {
  'use strict'

  const 你不喜欢的关键字 = [
    '剛毛',
    '虐',
    '奴',
    '調教',
    '熟女',
    '熟娘',
    '拷問',
    'vr',
    '拘束',
    '大便',
    '尿',
    'ドM',
      'SM',
    '唾',
    'M男',
      '個人撮影',
      'アナル',
      '糞',
      '鼻',
      '浣腸',
      '失禁',
      '排泄',
      '失便'
  ].map((i) => i.toLowerCase())

  // 如DKWT-010,只需要写DKWT
  const 你不喜欢的番号 = [].map((i) => i.toLowerCase())

  const avDoms = [...document.querySelectorAll('.movie-list .item')]
  const avs = avDoms.map((i) => {
    return {
      title: i.querySelector('.video-title').lastChild.textContent.toLowerCase(),
      id: i.querySelector('.video-title strong').textContent.toLowerCase(),
    }
  })

  avs.forEach((av, index) => {
    ;(你不喜欢的关键字.find((关键字) => av.title.includes(关键字)) ||
      你不喜欢的番号.find((番号) => av.id.includes(番号))) &&
      avDoms[index].remove()
  })
})()
