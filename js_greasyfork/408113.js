// ==UserScript==
// @name         云驰项目Title添加前缀
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  云驰项目Title添加前缀,方便确认对应环境
// @author       XingMingYue
// @icon https://yx.broadtext.cn/favicon.ico
// @include      *192.168.16.*
// @match        *.broadtext.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/408113/%E4%BA%91%E9%A9%B0%E9%A1%B9%E7%9B%AETitle%E6%B7%BB%E5%8A%A0%E5%89%8D%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/408113/%E4%BA%91%E9%A9%B0%E9%A1%B9%E7%9B%AETitle%E6%B7%BB%E5%8A%A0%E5%89%8D%E7%BC%80.meta.js
// ==/UserScript==

var urlMapping = {
  'http://192.168.16.161:8000/ycboot': '161_',
  'https://yx.broadtext.cn/yx2': 'YX2_',
  'http://www.broadtext.cn/yx2_dev': 'DEV_',
  'http://192.168.16.166:8000/yx2_dev': 'DEV_',
  'http://www.broadtext.cn/yx2_test': 'TEST_',
  'http://192.168.16.166:8000/yx2_test': 'TEST_',
  'http://192.168.16.171/': '171_',
  'http://192.168.16.172/': '172_'
}

window.onload = function () {
  'use strict'
  // 每隔150毫秒检查更新Title
  window.setInterval(function () {
    var url = document.URL
    for (var key in urlMapping) {
      var value = urlMapping[key]
      if (url.indexOf(key) !== -1) {
        var title = document.title
        if (title.indexOf(value) === -1) {
          document.title = value + title
        }
      }
    }
  }, 150)
}
