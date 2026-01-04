// ==UserScript==
// @name        Fix Link Bug - bookset.io
// @namespace   Violentmonkey Scripts
// @match       http://www.bookset.io/read/Learn-Vue-Source-Code/*
// @grant       none
// @version     1.0
// @author      haroro
// @description 2020/11/11 下午5:38:11
// @downloadURL https://update.greasyfork.org/scripts/415932/Fix%20Link%20Bug%20-%20booksetio.user.js
// @updateURL https://update.greasyfork.org/scripts/415932/Fix%20Link%20Bug%20-%20booksetio.meta.js
// ==/UserScript==
window.onload = function () {
  var nodeList = $(".article-menu-detail a")
  for (var i = 0;i < nodeList.length; i++) {
    var node = nodeList[i]
    var params = $(node).attr('href').split('/')
    var id = params[params.length - 1]
    $(node).attr('href', './'+id)
  }
}