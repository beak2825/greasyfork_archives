// ==UserScript==
// @name         张鑫旭广告专享清理器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  张鑫旭adblock专属广告太烦人了,搞了个脚本处理了这个问题.
// @author       Francis
// @include      https://www.zhangxinxu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhangxinxu.com
// @grant        none
// @require      https://unpkg.com/jquery/dist/jquery.slim.min.js
// @run-at       document-start
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/436315/%E5%BC%A0%E9%91%AB%E6%97%AD%E5%B9%BF%E5%91%8A%E4%B8%93%E4%BA%AB%E6%B8%85%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/436315/%E5%BC%A0%E9%91%AB%E6%97%AD%E5%B9%BF%E5%91%8A%E4%B8%93%E4%BA%AB%E6%B8%85%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

document.documentElement.style.display = 'none'
$(document).ready(() => {
    'use strict';

    $('#sidebar, .da_title, .da_col2, .link, .ins_txt, #daITxz2, .hd_remind, .description').remove()

    let filters = [/^\w{4}\-\w{2}$/];

    filters.forEach(pattern => {
        Array.prototype.slice.call(document.getElementsByTagName('*')).filter(item=>pattern.test(item.tagName)).forEach(function(item){item.remove()});
    });
    $('a').filter((idx,item)=> /^\w{12}$/.test($(item).attr('class'))).remove();

    $('span').filter((idx,item)=>{return $(item).text() === '此链接已被Adblock屏蔽，建议在本页面暂停Adblock'}).remove()
    document.documentElement.style.display = '';
});