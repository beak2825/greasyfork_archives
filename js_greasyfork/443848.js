// ==UserScript==
// @name         批量打开社区
// @namespace    wjddd
// @version      0.4
// @description  打开网址
// @author       王佳
// @match        https://docs.qq.com/doc/p/5e3885c6a86a726184ca3084f31f18b061ef21f3?dver=3.0.27505696
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443848/%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/443848/%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var brr = ['21641','27493','30','22224','17903'];
    var yue = prompt("请输入本月月份","4");
    var ri = prompt("请输入当天日期");
    var shi = prompt("几时开始审核","16");
    var fen = prompt("几分开始审核","00");
    var nian = '2022';

    alert("您当前选择的时间为2022-"+yue+"-"+ri+"的"+shi+":"+fen+"-------当日21:05分")
    for (var i=0;i<brr.length;i++) {
        var pinjie3 ='http://admin.bbs3839.5054399.com/bbs/topic-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D='+brr[i]+'&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Btime%5D%5Bfrom%5D=2022-'+yue+'-'+ri+'+'+shi+'%3A'+fen+'&req%5Btime%5D%5Bto%5D=2022-'+yue+'-'+ri+'+21%3A05&req%5Bself%5D=0&req%5Btag%5D=0&req%5Bstatus%5D=1&req%5Bkeyword%5D=&req%5Btype%5D=0&req%5Bis_solve%5D=0&req%5Breply_status%5D=0&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bis_official%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0';
        window.open(pinjie3);
    };
    for (var b=0;b<brr.length;b++) {
    var pinjie4 ='http://admin.bbs3839.5054399.com/bbs/reply-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D='+brr[b]+'&req%5Btid%5D=&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=2022-'+yue+'-'+ri+'+'+shi+'%3A'+fen+'&req%5Btime%5D%5Bto%5D=2022-'+yue+'-'+ri+'+23%3A59&req%5Bis_essence%5D=0&req%5Bself%5D=0&req%5Bstatus%5D=1&req%5Bpass_time%5D%5Bfrom%5D=&req%5Bpass_time%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bis_top%5D=0&req%5Bsection_group_id%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0';
    window.open(pinjie4);
    };
    for (var q=0;q<brr.length;q++) {
    var pinjie5 ='http://admin.bbs3839.5054399.com/bbs/comment-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D='+brr[q]+'&req%5Breply_id%5D=&req%5Btid%5D=&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=2022-'+yue+'-'+ri+'+'+shi+'%3A'+fen+'&req%5Btime%5D%5Bto%5D=2022-'+yue+'-'+ri+'+23%3A59&req%5Bis_essence%5D=0&req%5Bself%5D=0&req%5Bstatus%5D=1&req%5Bpass_time%5D%5Bfrom%5D=&req%5Bpass_time%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0';
    window.open(pinjie5);
    };
})();