// ==UserScript==
// @name         必应搜索过滤
// @namespace    huelse/js-scripts/bing-filter
// @url          https://gitee.com/huelse/js-scripts/blob/master/bing-filter.js
// @version      1.0.1
// @description  过滤必应搜索结果
// @author       THENDINGs
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @match        https://*.bing.com/*
// @icon         https://www.bing.com/favicon.ico
// @grant        unsafeWindow
// @license      GPLv3 License
// @downloadURL https://update.greasyfork.org/scripts/443105/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/443105/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 屏蔽关键词列表
    const block_list = ['csdn', 'CSDN', '广告'];

    function center() {
        const sbox = document.querySelector('.sbox');
        if (sbox) sbox.style.cssText = 'margin:0 auto;position:fixed;left:0;right:0;';
    }

    function block() {
        const item_list = $('.b_algo');

        const ad_list = $('.b_algo .b_caption p');

        // 屏蔽广告区块
        $('.b_ad').css('display', 'none');

        // 屏蔽带有广告伪元素标签的
        $.each(ad_list, function(idx, el) {
            const ad_class = $(el).attr('class');
            // 部分正常内容的也在p中，如lineclamp
            if (ad_class && !ad_class.includes('lineclamp')) {
                $(el).parents('.b_algo').css('display', 'none');
            }
        });

        // 屏蔽关键词列表
        $.each(item_list, function(idx, el) {
            const text = el.innerText;
            $.each(block_list, function(idx1, el1) {
                if (text.includes(el1)) {
                    console.log(el)
                    $(el).css('display', 'none');
                    return false;
                }
            })
        });
    }

    function relink() {
        const as = $('#b_results h2 a')
        for (let i = 0; i < as.length; i++) {
            const url = as[i].href
            if (url.includes('bing.com/ck/a')) {
                $.get(url, function(data) {
                    const r = /var u = "(.*)";/.exec(data)
                    if (r && r[1]) {
                        as[i].href = r[1].replace(/[\?\&]+msclkid=.*/, '')
                    }
                })
            }
        }
    }

    $(function() {
        center();
        block();
        relink();
    });

})();
