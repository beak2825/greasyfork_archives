// ==UserScript==
// @name         在百度搜索结果页面打开搜索结果
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  百度默认是在新标签页打开搜索结果，有的人不喜欢，故有了这个脚本的0.1版本!
// @author       AlinQAQ
// @include      *://*.baidu.com/s*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/406807/%E5%9C%A8%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/406807/%E5%9C%A8%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
      function modify() {
          try {
              var content_right = document.getElementById('content_left');
              var a_arr = content_right.getElementsByTagName('a');
              for (var i = 0; i < a_arr.length; i++) {
                  a_arr[i].target = '_self';
                  //console.log(a_arr[i]);
              }
          } catch (err) {
              console.log("发生错误，错误："+err);
          }
      }

    modify();
})();