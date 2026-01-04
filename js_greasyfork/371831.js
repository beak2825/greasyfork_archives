// ==UserScript==
// @name         Iconfont 一键添加到购物车
// @namespace    https://imewchen.com/
// @version      0.1.2
// @description  IconFont添加“全部添加到购物车”的按钮
// @author       MewChen
// @include      http*://iconfont.cn/collections/detail?*
// @include      http*://www.iconfont.cn/collections/detail?*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371831/Iconfont%20%E4%B8%80%E9%94%AE%E6%B7%BB%E5%8A%A0%E5%88%B0%E8%B4%AD%E7%89%A9%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/371831/Iconfont%20%E4%B8%80%E9%94%AE%E6%B7%BB%E5%8A%A0%E5%88%B0%E8%B4%AD%E7%89%A9%E8%BD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        setTimeout(
            function(){
                var btnHTML = '<span title="一键添加到购物车" onclick="var iconList = document.querySelectorAll(\'.icon-gouwuche1\');for (var i = 0; i < iconList.length; i++) {iconList[i].click();}" class="radius-btn" style="background-color:#2ca8ff;">+</span>';
                $('.block-radius-btn-group').append(btnHTML);
            },5000
        );
    });
})();