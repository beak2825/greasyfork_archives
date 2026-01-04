// ==UserScript==
// @name         取关微博所有单方面关注的人
// @namespace    weibo
// @version      0.1-alpha
// @description  被动关注了很多营销号，一键清除关注，当然也会取消自己主动单方面关注的人
// @author       ss
// @match        https://weibo.com/*
// @grant        none
// @require     https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387239/%E5%8F%96%E5%85%B3%E5%BE%AE%E5%8D%9A%E6%89%80%E6%9C%89%E5%8D%95%E6%96%B9%E9%9D%A2%E5%85%B3%E6%B3%A8%E7%9A%84%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/387239/%E5%8F%96%E5%85%B3%E5%BE%AE%E5%8D%9A%E6%89%80%E6%9C%89%E5%8D%95%E6%96%B9%E9%9D%A2%E5%85%B3%E6%B3%A8%E7%9A%84%E4%BA%BA.meta.js
// ==/UserScript==

$(document).ready(function () {
    document.getElementsByClassName("btn_link")[0].onclick();  
    $('a[action-type="batselect"]').click();
    $('a[action-type="batselect"]')[0].click();
    $('.member_li').each(function (index, domEle) {
        if ($(domEle).find('.S_txt1').text() === '已关注') {
            domEle.click()
        }
    });
 });