// ==UserScript==
// @name         云牛网产品图片下载
// @namespace    http://www.bcbin.cn/
// @version      0.0.1
// @icon         https://mobile.ynchaozhi.com/favicon.ico
// @description  下载云牛网产品图片和详情信息
// @author       Bcbin
// @license      MIT
// @match        https://mobile.ynchaozhi.com/app/details?id=*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        GM_download
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/388545/%E4%BA%91%E7%89%9B%E7%BD%91%E4%BA%A7%E5%93%81%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/388545/%E4%BA%91%E7%89%9B%E7%BD%91%E4%BA%A7%E5%93%81%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var title = $('#pro_title').text();
    $('div#pro_attr').after('<div style="margin-bottom:20px;"><button id="copy_title">拷贝标题</button>&nbsp;&nbsp;&nbsp;<button id="copy_vip">拷贝云票</button>&nbsp;&nbsp;&nbsp;<button id="download_slider">下载轮播图片</button>&nbsp;&nbsp;&nbsp;<button id="download_detail">下载详情图片</button></div>');
    $(document).on('click', '#copy_title', function() {
        GM_setClipboard(title);
    })
    $(document).on('click', '#copy_vip', function() {
        GM_setClipboard($('span.vip').text());
    })
    $(document).on('click', '#download_slider', function() {
        $('#pro_imgs img').each(function(index, ele) {
            GM_download(ele.src, title+'-[slider]-['+(index+1)+'].jpg');
        });
    })
    $(document).on('click', '#download_detail', function() {
        $('#d_tabcont div.tabcont:first-child img').each(function(index, ele) {
            GM_download(ele.src, title+'-[detail]-['+(index+1)+'].jpg');
        });
    })
})();