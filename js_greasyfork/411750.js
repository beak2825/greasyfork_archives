// ==UserScript==
// @name         去除知乎跳转提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://zhuanlan.zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411750/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E8%B7%B3%E8%BD%AC%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/411750/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E8%B7%B3%E8%BD%AC%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a_list=document.querySelectorAll('a');
    if(a_list&&a_list.length){
       a_list.forEach(function(target){
         if(target&&target.href){
           var _href=target.href
           var _index=_href.indexOf('?target=')
           if(_index!==-1){
             target.href=decodeURIComponent(_href.substr(_index+8))
           }
         }
       })
    }
})();