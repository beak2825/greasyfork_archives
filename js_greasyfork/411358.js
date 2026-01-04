// ==UserScript==
// @name         海胆pt站豆瓣imdb评分彩虹渐变高亮
// @namespace    https://www.haidan.video/
// @version      2.4
// @description  分别由豆瓣/imdb评分计算彩虹色，每个种子左侧豆瓣色/右侧imdb色
// @author       You
// @match        https://www.haidan.video/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/411358/%E6%B5%B7%E8%83%86pt%E7%AB%99%E8%B1%86%E7%93%A3imdb%E8%AF%84%E5%88%86%E5%BD%A9%E8%99%B9%E6%B8%90%E5%8F%98%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/411358/%E6%B5%B7%E8%83%86pt%E7%AB%99%E8%B1%86%E7%93%A3imdb%E8%AF%84%E5%88%86%E5%BD%A9%E8%99%B9%E6%B8%90%E5%8F%98%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==
function getR(score) {
    var value = (Math.abs(score-5)/5)*765-255
    if (value > 255) value = 255;
    if (value < 0) value = 0;
    return value;
}

function getG(score) {
    var value = (1-(Math.abs(score-20/3)/5))*765-255
    if (value > 255) value = 255;
    if (value < 0) value = 0;
    return value;
}

function getB(score) {
    var value = (1-(Math.abs(score-10/3)/5))*765-255
    if (value > 255) value = 255;
    if (value < 0) value = 0;
    return value;
}

function fixPair(d,i) {
    d = d!=-1? d: i;
    i = i!=-1? i: d;
    d = d!=-1? d: 255;
    i = i!=-1? i: 255;
    return [d,i];
}


(function() {
    'use strict';
    var group = $('.name_col.table_cell');
    GM_log(group.length);
    var rate_b = group.find('b');
    GM_log(rate_b.length);
    var count = 0
    var last_douban = 0;
    var imdb = 0;
    var color_array = ['#FF7575','#FF8040','#F9F900','#9AFF02','#00E3E3','#6A6AFF','#BE77FF','#DCDCDC','#A9A9A9','#696969'];
    rate_b.filter(function() {
        var b = $(this);
        GM_log('text:', b.text(), ',count:', count)
        if (count % 2 == 0) {
            // 豆瓣评分
            if (b.text() == '-') {
                last_douban = '-';
            } else {
                last_douban = parseFloat(b.text());
            }
        } else {
            // imdb评分
            var avg_rate;
            if (b.text() == '-') {
                imdb = '-';
            } else {
                imdb = parseFloat(b.text());
            }
            // 取得一行的豆瓣和imdb评分后统一计算颜色
            var dr=-1,dg=-1,db=-1,ir=-1,ig=-1,ib=-1;

            if (last_douban != '-') {
                // last_douban = Math.round(last_douban*2)/2 // 按0.5作为步长分级
                dr = getR(last_douban);
                dg = getG(last_douban);
                db = getB(last_douban);
            }
            if (imdb != '-') {
                // imdb = Math.round(imdb*2)/2 // 按0.5作为步长分级
                ir = getR(imdb);
                ig = getG(imdb);
                ib = getB(imdb);
            }
            [dr,ir] = fixPair(dr,ir);
            [dg,ig] = fixPair(dg,ig);
            [db,ib] = fixPair(db,ib);
            if (imdb != 0 || last_douban != 0) {
                b.parents('.group').css({'background-image': 'linear-gradient(to right, rgb(' + dr + ',' + dg + ',' + db + '), rgb('+ ir + ',' + ig + ',' + ib + ')'});
            }
        }
        count++;
    });
    GM_log(rate_b.length);
})();