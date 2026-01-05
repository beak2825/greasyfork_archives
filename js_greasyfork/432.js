// ==UserScript==
// @name        楼中楼回复自动加@
// @include     http://tieba.baidu.com/p/*
// @include     http://tieba.baidu.com/f?ct=*
// @copyright   谷哥卫士
// @description  百度贴吧楼中楼回复自动加上@
// @icon           http://himg.bdimg.com/sys/portrait/item/ca80e8b0b7e593a5e58dabe5a3abb020
// @version     1.3

// @namespace https://greasyfork.org/users/54
// @downloadURL https://update.greasyfork.org/scripts/432/%E6%A5%BC%E4%B8%AD%E6%A5%BC%E5%9B%9E%E5%A4%8D%E8%87%AA%E5%8A%A8%E5%8A%A0%40.user.js
// @updateURL https://update.greasyfork.org/scripts/432/%E6%A5%BC%E4%B8%AD%E6%A5%BC%E5%9B%9E%E5%A4%8D%E8%87%AA%E5%8A%A8%E5%8A%A0%40.meta.js
// ==/UserScript==
for(var e=document.querySelectorAll('.j_lzl_s_p'),i=e.length-1;i>-1;i--)e[i].setAttribute('data-field',e[i].getAttribute('data-field').replace('e":"','e":"@'));