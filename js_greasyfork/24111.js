// ==UserScript==
// @name         Weibo album新浪微博相册大图链接修改
// @namespace    http://weibo.com/unluckyninja/
// @version      0.1
// @description  把微博相册大图页上方导航栏的链接，全部替换成大图链接（原为详细页地址）
// @author       UnluckyNinja
// @match        http://photo.weibo.com/*/photos/large/*
// @require      http://code.jquery.com/jquery-3.1.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24111/Weibo%20album%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E7%9B%B8%E5%86%8C%E5%A4%A7%E5%9B%BE%E9%93%BE%E6%8E%A5%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/24111/Weibo%20album%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E7%9B%B8%E5%86%8C%E5%A4%A7%E5%9B%BE%E9%93%BE%E6%8E%A5%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).on('click', '#slider', function(){
        $('#slider a[href]').each(function(i){
            var url = $(this).attr('href');
            url = url.replace('detail', 'large');
            $(this).attr('href', url);
        });
    });
})();