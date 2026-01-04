// ==UserScript==
// @name         禁止水帖
// @namespace    mailto:oi_master@yeah.net
// @version      0.1
// @description  禁止在洛谷打开灌水区帖子
// @author       OI-Master
// @match        https://www.luogu.com.cn/discuss/show/*
// @icon         https://www.google.com/s2/favicons?domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426909/%E7%A6%81%E6%AD%A2%E6%B0%B4%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/426909/%E7%A6%81%E6%AD%A2%E6%B0%B4%E5%B8%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if($(".colored").text()=="灌水区"){
        setTimeout(function(){
            $('.lg-content-left').html('<section class="am-panel am-panel-default lg-summary"><br>说好的不水帖的呢……好好学习！<br><br></section>');
            $('.lfe-h1').text('禁止水帖 - 三秒后回到上一页');
            $('title').text('禁止水帖！');
        },500);
        setTimeout("window.history.go(-1)", 3500);
    }
})();