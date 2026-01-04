// ==UserScript==
// @name         去除灰色_西大特供版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除西大官网首页灰色滤镜，西大特供版，仅供技术学习交流用
// @author       Nwuer
// @match        https://www.nwu.edu.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nwu.edu.cn
// @grant        unsafeWindow
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/455889/%E5%8E%BB%E9%99%A4%E7%81%B0%E8%89%B2_%E8%A5%BF%E5%A4%A7%E7%89%B9%E4%BE%9B%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/455889/%E5%8E%BB%E9%99%A4%E7%81%B0%E8%89%B2_%E8%A5%BF%E5%A4%A7%E7%89%B9%E4%BE%9B%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
  $(function () {
    const domain = document.domain
    const netIframe = document?.querySelector('iframe#g_iframe')?.contentWindow

    switch (domain) {

      case 'www.nwu.edu.cn':
            $('html').css(
                'cssText',
                'filter: none !important; -webkit-filter: none !important;'
            )
            $('body').css(
                'cssText',
                'filter: none !important; -webkit-filter: none !important;'
            )
            break

      default:
        $('html').css(
          'cssText',
          'filter: none !important; -webkit-filter: none !important;'
        )
        $('body').css(
          'cssText',
          'filter: none !important; -webkit-filter: none !important;'
        )
        break
    }
  })
    // Your code here...
})();