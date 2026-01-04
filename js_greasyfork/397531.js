// ==UserScript==
// @name         妹子图图片一键显示
// @namespace    http://tampermonkey.net/
// @version      2020.03.08
// @description  批量显示妹子图图片，免去分页烦恼！
// @author       sbdx
// @match        https://www.mzitu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397531/%E5%A6%B9%E5%AD%90%E5%9B%BE%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/397531/%E5%A6%B9%E5%AD%90%E5%9B%BE%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let albumCount=0;//相册图片总数
    jQuery('.main-meta').append(`<button id='ext_loadAllImage'>一键加载</button>`);
    jQuery('button#ext_loadAllImage').on('click',jQuery('.main-meta'),function(){
        albumCount=parseInt($('.pagenavi a:eq(-2)').text());
        console.log(albumCount);
        let firstImgSrc=$('.main-image img')[0].src;
        jQuery('div.pagenavi').hide();
        let html='',idx,url;
        for(let i=1;i<=albumCount;i++)
        {
            idx=(`000${i}`).slice(-2);
            url=firstImgSrc.replace(/\d{2}\.jpg$/i,`${idx}.jpg`);
            console.log(url);
            html += `<p><img src="${url}" /></p>`;
        }
        let main=jQuery('.main-image');
        main.empty().append(html);
    });
})();