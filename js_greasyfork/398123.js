// ==UserScript==
// @name         微信公众号链接地址净化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  去除微信公众号链接中的多余参数
// @author       kizj
// @match        https://mp.weixin.qq.com/s*
// @exclude		 https://mp.weixin.qq.com/cgi-bin/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398123/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/398123/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var hrefArr = location.href.split("&")
    if (hrefArr.length>4){
		location.href = hrefArr.slice(0,4).join('&')
    } else{
		return
    }
})();
