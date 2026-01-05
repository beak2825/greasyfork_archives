// ==UserScript==
// @name  Renren Xu1s
// @namespace https://malash.me/
// @author  Malash <i@malash.me>
// @icon  http://a.xnimg.cn/favicon.ico
// @version 1.0.0
// @description Renren续一秒——人人被屏蔽内容查看器
// @homepageURL https://github.com/malash/renren-xu1s
// @include http://www.renren.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/11803/Renren%20Xu1s.user.js
// @updateURL https://update.greasyfork.org/scripts/11803/Renren%20Xu1s.meta.js
// ==/UserScript==

(function ($, window) {
    $('body').append('<style>.xu1s{opacity: 0.5;color: red;font-size: 1.2em;}.xu1s:hover{opacity: 1;color: red !important;text-shadow: 0 0 10px yellow;}.xu1s:before{content:"看不了？"}.xu1s:hover:before{content:"续一秒！"}</style>');
    setInterval(function(){
        $('.share-photo img').each(function() {
            if ($(this).data('xu1s')) {
                return;
            }
            console.log('new', this);
            $(this).data('xu1s', 'xu1s');
            $($(this).parent().parent()).children('.source-desc').append('<a href="' + $(this).data('viewer').url + '" class="xu1s" target="_blank"></a>')
        });
    }, 1000);
})(jQuery, window);
