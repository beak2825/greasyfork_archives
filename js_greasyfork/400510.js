// ==UserScript==
// @name         删除知乎新消息提醒
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  每次知乎的小管家都给我发垃圾消息，也禁不掉，逼我写个脚本。
// @author       shuiRong
// @include      *www.zhihu.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400510/%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E6%96%B0%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/400510/%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E6%96%B0%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
     document.querySelector('.Messages-count').style.display = 'none';
    }
})();