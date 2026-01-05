// ==UserScript==
// @name       百度云yun跳转
// @namespace   pan2yun
// @description    百度云从pan域名跳到yun域名（一般人没用，不要装）
// @include     http://pan.baidu.com/*
// @include     https://pan.baidu.com/*
// @exclude     http://pan.baidu.com/share/*
// @exclude     https://pan.baidu.com/share/*
// @version     14.07.11.2
// @author     17yard
// @grant       none
// @icon        http://ww3.sinaimg.cn/large/5cf8ff8dgw1ehu56yclmpj20280283yb.jpg
// @namespace https://greasyfork.org/scripts/

// @downloadURL https://update.greasyfork.org/scripts/3142/%E7%99%BE%E5%BA%A6%E4%BA%91yun%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/3142/%E7%99%BE%E5%BA%A6%E4%BA%91yun%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

//只为防止本人的chrome抽风 pan无法点击的未知毛病 一般用户不需要此脚本

location.replace(
	location.href.replace('://pan.baidu.com/', '://yun.baidu.com/')
)