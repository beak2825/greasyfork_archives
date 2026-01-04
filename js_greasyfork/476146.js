// ==UserScript==
// @name         给起点加个复制按钮
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  一键复制章节全文
// @author       Win-yk
// @license      MIT
// @match        https://www.qidian.com/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qidian.com
// @grant        GM_setClipboard
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/476146/%E7%BB%99%E8%B5%B7%E7%82%B9%E5%8A%A0%E4%B8%AA%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/476146/%E7%BB%99%E8%B5%B7%E7%82%B9%E5%8A%A0%E4%B8%AA%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function do_copy(){
        var content = '';
        jQuery('.content-text').each(function(){
            var now_content = jQuery(this).text();
            if(!jQuery(this).is('span')) {
                if(jQuery(this).children().length) {
                    var dirty = jQuery(this).children().first().text();
                    now_content = now_content.substr(0, now_content.length - dirty.length);
                }
                now_content = '\n' + now_content + '\n';
            }
            content += now_content + '\n';
        });
        GM_setClipboard(content, "text");
        setTimeout(function(){
            jQuery('#reader-toast-container').empty();
            jQuery('#reader-toast-container').append('<div class="fixed z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-12px bg-on-image-black-90 py-16px px-20px text-on-image-bw-white flex flex-col items-center"><span class="text-s1 font-medium">复制成功</span></div>');
            setTimeout(function(){
                jQuery('#reader-toast-container').empty();
                jQuery('#reader-toast-container').append('<!---->');
            }, 600);
        }, 150);
    }
    function main() {
        var btn = '<div data-v-6cdbc58a="" data-v-47ffe1ec="" class="tooltip-wrapper relative flex"><button id="copy-button" data-v-47ffe1ec="" class="w-64px h-64px flex flex-col items-center justify-center rounded-8px bg-sheet-b-gray-50 text-s-gray-900 noise-bg group hover:bg-sheet-b-bw-white hover:text-primary-red-500 hover:bg-none"><span class="icon-empty text-24px"></span><span class="text-bo4 text-s-gray-500 mt-2px group-hover:text-primary-red-500">复制</span></button><!----></div>'
        jQuery('#r-menu').children().first().addClass('mt-8px');
        jQuery('#r-menu').prepend(btn);
        jQuery('#copy-button').bind('click', function(){
            try {
                do_copy();
            }
            catch(err) {
                alert('复制失败\n\n' + err.message);
            }
        });
    }

    let observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (!jQuery('#copy-button').length) {
                    main();
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();