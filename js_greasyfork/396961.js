// ==UserScript==
// @name       谷歌香港链跳转谷歌日本
// @namespace   redirect_google_hk_to_jp
// @description    重定向谷歌香港到谷歌日本
// @include     http://www.google.com.hk/*
// @include     https://www.google.com.hk/*
// @version     0.0.1
// @author     NetTunnel
// @grant       none
// @icon        https://www.google.com/favicon.ico

// @downloadURL https://update.greasyfork.org/scripts/396961/%E8%B0%B7%E6%AD%8C%E9%A6%99%E6%B8%AF%E9%93%BE%E8%B7%B3%E8%BD%AC%E8%B0%B7%E6%AD%8C%E6%97%A5%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/396961/%E8%B0%B7%E6%AD%8C%E9%A6%99%E6%B8%AF%E9%93%BE%E8%B7%B3%E8%BD%AC%E8%B0%B7%E6%AD%8C%E6%97%A5%E6%9C%AC.meta.js
// ==/UserScript==
location.replace(
	location.href.replace('://www.google.com.hk', '://www.google.co.jp')
)