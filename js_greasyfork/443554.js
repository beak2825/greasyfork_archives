// ==UserScript==
// @name         嗖哈盘直接跳转
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  嗖哈盘链接直接跳转
// @author       Androidcn
// @license      GPL-3.0 License
// @match        https://www.sohapan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sohapan.com
// @grant        none
// @require     http://code.jquery.com/jquery-latest.js

// @downloadURL https://update.greasyfork.org/scripts/443554/%E5%97%96%E5%93%88%E7%9B%98%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/443554/%E5%97%96%E5%93%88%E7%9B%98%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==



(function() {
    'use strict';
     var $ = window.$;

    $("a[href]")
   .each(function()
   {
      this.href = this.href.replace("https://www.sohapan.com/?target=","");
   });
})();