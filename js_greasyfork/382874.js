// ==UserScript==
// @name         say goodbye to CSDN
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  清除搜索结果中指向 CSDN 网站的条目
// @author       zoffy zhang
// @license      MIT
// @run-at       document-idle
// @include      https://*.google.com/*
// @include      http*://*.baidu.com/*
// @include      https://*.bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382874/say%20goodbye%20to%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/382874/say%20goodbye%20to%20CSDN.meta.js
// ==/UserScript==

// 参数配置
var configs = {
  'google.com': ['#rso', '.g', 'cite', /csdn\.net/],
  'bing.com': ['#b_results', '.b_algo', 'cite', /csdn\.net/],
  'baidu.com': ['#content_left', '.result', 'a.c-showurl', /csdn/i]
}

function removeDom(parentSel, childrenSel, targetSel, regexp) {
  var parent = document.querySelector(parentSel)
  var children = parent.querySelectorAll(childrenSel)
  for (let i = children.length - 1, len = children.length; i >= 0; i--) {
    var text = children[i].querySelector(targetSel).innerText
    if (regexp.test(text)) {
      parent.removeChild(children[i])
    }
  }
}

;(function() {
  'use strict'
  var origin = window.location.origin
  var keys = Object.keys(configs)
  var theKey = keys.find(function(key) {
    return origin.match(key)
  })
  var params = configs[theKey]
  removeDom.apply(null, params)
})()
