// ==UserScript==
// @license     AGPL License
// @name        菜鸟教程链接本窗口打开
// @namespace   Violentmonkey Scripts
// @match       https://www.runoob.com/*
// @grant       none
// @version     1.0
// @author      n1nja88888
// @description 让菜鸟教程的链接直接在本窗口打开
// @downloadURL https://update.greasyfork.org/scripts/473570/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E9%93%BE%E6%8E%A5%E6%9C%AC%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/473570/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E9%93%BE%E6%8E%A5%E6%9C%AC%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
'use strict'
console.log('n1nja88888 creates this world!')

//获得所有的超链接
let aSet = $('a')
//获得所有表单
let formSet = $('form')
aSet.each(function(){
  if($(this).attr('target') === '_blank'){
    $(this).attr('target', '_self')
  }
})
formSet.each(function(){
  if($(this).attr('target') === '_blank'){
    $(this).attr('target', '_self')
  }
})
