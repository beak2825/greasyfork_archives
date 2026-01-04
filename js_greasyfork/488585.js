// ==UserScript==
// @name         九桃小说章节地址打印
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  快速复制所有小说章节的 url 地址，方便爬取章节内容
// @author       You
// @match        http://33txs.com/xiaoshuo/book/*
// @icon         data:image/png;base64,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

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.slim.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488585/%E4%B9%9D%E6%A1%83%E5%B0%8F%E8%AF%B4%E7%AB%A0%E8%8A%82%E5%9C%B0%E5%9D%80%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/488585/%E4%B9%9D%E6%A1%83%E5%B0%8F%E8%AF%B4%E7%AB%A0%E8%8A%82%E5%9C%B0%E5%9D%80%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.headline').append('<a id="copy_chapter" href="javascript:void(0);">复制章节地址</a>');

    $(document).on('click', '#copy_chapter', function(){
        let href = window.location.href;
        let $array = $('.layui-main>.box:eq(1)>.read>dl:eq(1)>dd');
        let urls = [];
        for (let i = 0; i < $array.length; i++) {
            let $dd = $($array).eq(i);
            let url = $($dd).find('a').attr('href');
            urls.push(href + url.substring(url.lastIndexOf('/') + 1));
        }
        let $textarea = $('#copy_area');
        if ($textarea.length > 0) {
            if ($textarea.css('display') !==  'none') {
                $textarea.hide();
            } else {
                $textarea.show();
            }
        } else {
            $('.headline').after('<div style="text-align: center;"><textarea id="copy_area"></textarea></div>');
            $textarea = $('#copy_area');
            $textarea.css('width', 360);
            $textarea.css('height', 150);
            $textarea.css('margin', 10);
            $textarea.css('padding', 2);
        }
        $textarea.html(urls.join('\n'));
    });
})();