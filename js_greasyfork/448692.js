// ==UserScript==
// @name         4提交页面默认填写
// @version      0.1
// @description  第四步骤选择小区
// @namespace    data
// @license      dats
// @match        https://m.xflapp.com/f100/main/ownner_comment_publish*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/448692/4%E6%8F%90%E4%BA%A4%E9%A1%B5%E9%9D%A2%E9%BB%98%E8%AE%A4%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/448692/4%E6%8F%90%E4%BA%A4%E9%A1%B5%E9%9D%A2%E9%BB%98%E8%AE%A4%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //生成随机数
    function random(min,max) {
        return Math.floor(min + Math.random() * (max - min));
    }
    //点击入住时间
    console.log($('.pciker-content-flex'))
    $('.pciker-content-flex')[0].click()
    //随机点击年份
    $('.by-picker-column__wrapper').children()[random(4,9)].click()
    setTimeout(function () {
        //点击提交
        $(".by-toolbar__button--confirm")[0].click()
        //点击入住时间
        $('.pciker-content-flex')[1].click()
        setTimeout(function () {
            //随机点击年份
            $('.by-picker-column__wrapper').children()[random(10,13)].click()
            setTimeout(function () {
$('.grade-star-section').each(function(){
        $(this).children()[random(4,5)].click()
    });
                //点击提交
                $(".by-toolbar__button--confirm")[1].click()
                $('.tags-list-btn').click()
                setTimeout(function () {
                    $('.tags-safe-distance').children()[11].click()
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);























})();