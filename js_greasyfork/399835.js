// ==UserScript==
// @name         知乎回答头部显示回答日期
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       Yupeg.LV
// @include      *.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/399835/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E5%A4%B4%E9%83%A8%E6%98%BE%E7%A4%BA%E5%9B%9E%E7%AD%94%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/399835/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E5%A4%B4%E9%83%A8%E6%98%BE%E7%A4%BA%E5%9B%9E%E7%AD%94%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==

function timestampToTime(timestamp) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
}
(function () {
    'use strict';
    var $ = $ || window.$;
    setInterval(() => {
        $('.yupeg_add_time').remove();
        $('.ContentItem').each(function (index, element) {
            let ctime = $(this).find('meta[itemprop="dateCreated"]'),
                mtime = $(this).find('meta[itemprop="dateModified"]'),
                cc = ctime.attr('content'),
                mc = mtime.attr('content'),
                cd = timestampToTime(cc),
                md = timestampToTime(mc);
            let add = $(this).find('div[class="css-h5al4j"]');
            add.append(`<span class='yupeg_add_time'>&nbsp;&nbsp;&nbsp;&nbsp;创建于:${cd}&nbsp;&nbsp;&nbsp;&nbsp;最后修改:${md}</span>`);

            let add2 = $(this).find('div[class="RichContent is-collapsed"]');
            add2.prepend(`<div class='yupeg_add_time' style='text-align:left;color:#999;font-size:14px;'>
                            创建于:${cd}&nbsp;&nbsp;&nbsp;&nbsp;最后修改:${md}
                        </div>`);
        });
    }, 1000);
    $('.QuestionPage ').each(function (index, element) {
        let ctime = $(this).find('meta[itemprop="dateCreated"]'),
            mtime = $(this).find('meta[itemprop="dateModified"]'),
            cc = ctime.attr('content'),
            mc = mtime.attr('content'),
            cd = timestampToTime((new Date(cc)).getTime()),
            md = timestampToTime((new Date(mc)).getTime());
        let add = $(this).find('div[class="QuestionHeader-side"]');
        add.append(`<div  style='text-align:left;color:#999'>
                        <p>创建于:${cd}</p>
                        <p>最后编辑:${md}</p>
                    </div>`);
    });
})();