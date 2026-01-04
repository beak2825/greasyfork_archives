// ==UserScript==
// @name        恢复彩色样式-移除默哀
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      https://gist.github.com/LimeVista/3f67c95c68a79de647de02ceaeee40ee
// @description 2022/12/01 09:39:29
// @namespace https://greasyfork.org/users/990466
// @downloadURL https://update.greasyfork.org/scripts/455738/%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2%E6%A0%B7%E5%BC%8F-%E7%A7%BB%E9%99%A4%E9%BB%98%E5%93%80.user.js
// @updateURL https://update.greasyfork.org/scripts/455738/%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2%E6%A0%B7%E5%BC%8F-%E7%A7%BB%E9%99%A4%E9%BB%98%E5%93%80.meta.js
// ==/UserScript==


(function () {
      'use strict';

      document.body.style.filter = 'none';
      document.getElementsByTagName('html')[0].style.filter = 'none';
      document.getElementsByTagName('head')[0].style.filter = 'none';

      // 干掉微博
      const weiboThemeHtml = ".grayTheme {\n        -webkit-filter: grayscale(100%);\n        -moz-filter: grayscale(100%);\n" +
            "        -ms-filter: grayscale(100%);\n        -o-filter: grayscale(100%);\n        filter: grayscale(100%);\n" +
            "        filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);\n        filter: gray;\n      }"
      for (let weiboStyle of document.getElementsByTagName('style')) {
            if (weiboStyle.innerText === weiboThemeHtml) {
                  weiboStyle.innerHTML = ''
            }
      }

      // 干掉百度
      const baiduRegex = /https:\/\/www.baidu.com/;
      const windowUrl = window.location.href;
      if (windowUrl.match(baiduRegex)) {
            document.getElementById("s_lg_img").setAttribute("src", "https://www.baidu.com/img/flexible/logo/pc/index.png");
            document.getElementById("su").style.setProperty("background-color", "#4e6ef2", "important");
      }
})();