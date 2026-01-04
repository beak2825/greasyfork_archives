// ==UserScript==
// @name         三大妈移除广告位
// @namespace    http://tampermonkey.net/
// @date        2020-10-23 16:47
// @version      0.1
// @description  try to take over the world!
// @author       niushuai233
// @github       https://github.com/niushuai233
// @match        *://*.3dmgame.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/414395/%E4%B8%89%E5%A4%A7%E5%A6%88%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/414395/%E4%B8%89%E5%A4%A7%E5%A6%88%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bts = $(".item a");
    if (bts && bts.length > 1) {
        var index = 0;
        for (index; index < bts.length; index++) {
            if ($(bts[index]).text().indexOf('微端下载') != -1) {
                console.log('remove '+ $(bts[index]).text());
                $(bts[index]).parent().parent().remove();
            }
        }
    }
    var arr = ["Tonglan", "RBT_video", "R_qingtianzhu", "index_bg_box", "yxj_fmt_gg", "R_fangkuai", "dj_warp_e", "tonglona_3"];
    var index_class = 0;
    for (index_class; index_class < arr.length; index_class++) {
        console.log();
        $("#" + arr[index_class]).remove();
        $("." + arr[index_class]).remove();
    }
    // Your code here...
})();