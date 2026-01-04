// ==UserScript==
// @name         梦想岛显示全部图片
// @namespace    http://tampermonkey.net/
// @version      20250811
// @description  mxd05.cc
// @author       塞北的雪
// @license      MIT
// @match        https://www.mxd05.cc/gallery/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mxd05.cc
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/545440/%E6%A2%A6%E6%83%B3%E5%B2%9B%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/545440/%E6%A2%A6%E6%83%B3%E5%B2%9B%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function formatNumber(n, leng = 3) {
        const num = Number(n);
        if (isNaN(num)) return String(n);
        return num.toString().padStart(leng, '0');
    }
    function splitImageUrl(url) {
        const lastSlashIndex = url.lastIndexOf('/');
        const dirPath = url.substring(0, lastSlashIndex + 1);

        const filenameWithExt = url.substring(lastSlashIndex + 1);
        const lastDotIndex = filenameWithExt.lastIndexOf('.');

        let fileName, fileExt;

        if (lastDotIndex === -1) {
            fileName = filenameWithExt;
            fileExt = '';
        } else {
            fileName = filenameWithExt.substring(0, lastDotIndex);
            fileExt = filenameWithExt.substring(lastDotIndex);
        }
        return {
            dir: dirPath,
            fn: fileName,
            ext: fileExt
        };
    }

    jQuery(document).ready(function() {
        console.log('jQuery版本:', $.fn.jquery);
        setTimeout(function(){
            jQuery('div.tishi').remove();
            jQuery('div.header_right ul li').empty();
            jQuery('div.header_right ul li:eq(0)').append('<a id="viptxt">加载全部图片</a>');
            jQuery('div.header_right ul li').on('click','#viptxt',function(){
                let pages=parseInt(jQuery("div#tishi p span").text());
                console.log(`当前画册共${pages}页`);
                let p=jQuery('div.gallerypic img:eq(0)').attr('src')
                let u=splitImageUrl(p);
                let len_u=String(u.fn).length;
                let s='';
                for(let i=0;i<=pages;i++){
                    let pp=p.replace(u.fn,formatNumber(i,len_u));
                    console.log(pp);
                    s+=`<img src='${pp}' />`;
                }
                jQuery('div.gallerypic').css('width','80%');
                jQuery('div.gallerypic').html(s);
            });
        },5000);
    });
})();