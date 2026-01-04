// ==UserScript==
// @name           天翼云盘下载助手
// @author         wusuluren
// @description    天翼云盘免登录下载
// @require        http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match          *://cloud.189.cn/*
// @supportURL     https://github.com/Wusuluren
// @version        0.0.1
// @grant          None
// @namespace https://greasyfork.org/users/194747
// @downloadURL https://update.greasyfork.org/scripts/370220/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/370220/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
 
    $(function(){
        var timer = setInterval(function() {
          if(this.downloadUrl !== undefined) {
             $('.download-link').attr('href', this.downloadUrl)
             clearInterval(timer)
          }
        }, 100)
    })
})();
