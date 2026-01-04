// ==UserScript==
// @name         半自动加班批量打开5页面
// @namespace    wjddd
// @version      0.2
// @description  打开网址
// @author       zhumeiling
// @match        https://docs.qq.com/doc/p/05e1914423b425218c6f903155d615975341809e?dver=3.0.27505696
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443792/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%8A%A0%E7%8F%AD%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%805%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/443792/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%8A%A0%E7%8F%AD%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%805%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var arr = 132701;
    var brr = 21641;
    var yue = prompt("请输入本月月份","4");
    var ri = prompt("请输入当天日期");
    var shi = prompt("几时开始审核","16");
    var fen = prompt("几分开始审核","00");
    var nian = '2022';
    alert("您当前选择的时间为2022-"+yue+"-"+ri+"的"+shi+":"+fen+"-------当日21:05分")
    var pinjie ="http://admin.bbs3839.5054399.com/comment/gameComment-hasAudit.html?req%5Bstate_private%5D=0&req%5Bstate_high%5D=2&req%5Bis_pcs%5D=2&req%5Bstate_pcs%5D=100&req%5Bistop%5D=2&req%5Bfid%5D="+arr+"&req%5Bcid%5D=&req%5Buid%5D=&req%5Bedit%5D=0&req%5Bcontent%5D=&req%5Btime_from%5D=2022-"+yue+"-"+ri+"+"+shi+"%3A"+fen+"%3A00&req%5Btime_to%5D=2022-"+yue+"-"+ri+"+21%3A05&req%5Bip%5D=&req%5Blength_from%5D=&req%5Blength_to%5D=&req%5Bstar_from%5D=&req%5Bstar_to%5D=&req%5Badminid%5D=&req%5Boppose_from%5D=&req%5Boppose_to%5D=&req%5Boriginal_pid%5D=0&req%5Bfrom_client%5D=0";
    window.open(pinjie);
    var pinjie2 ="http://admin.bbs3839.5054399.com/comment/gameReply-hasAudit.html?req%5Bstate_private%5D=0&req%5Bfid%5D="+arr+"&req%5Bcid%5D=&req%5Bid%5D=&req%5Bcontent%5D=&req%5Bidentity%5D=100&req%5Btime_from%5D=2022-"+yue+"-"+ri+"+"+shi+"%3A"+fen+"%3A00&req%5Btime_to%5D=2022-"+yue+"-"+ri+"+21%3A05%3A00&req%5Badminname%5D=&req%5Buid%5D=&req%5Bip%5D=&req%5Blength_from%5D=&req%5Blength_to%5D=";
    window.open(pinjie2);
    var pinjie3 ='http://admin.bbs3839.5054399.com/bbs/topic-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D='+brr+'&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Btime%5D%5Bfrom%5D=2022-'+yue+'-'+ri+'+'+shi+'%3A'+fen+'&req%5Btime%5D%5Bto%5D=2022-'+yue+'-'+ri+'+21%3A05&req%5Bself%5D=0&req%5Btag%5D=0&req%5Bstatus%5D=1&req%5Bkeyword%5D=&req%5Btype%5D=0&req%5Bis_solve%5D=0&req%5Breply_status%5D=0&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bis_official%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0';
    window.open(pinjie3);
    var pinjie4 ='http://admin.bbs3839.5054399.com/bbs/reply-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D='+brr+'&req%5Btid%5D=&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=2022-'+yue+'-'+ri+'+'+shi+'%3A'+fen+'&req%5Btime%5D%5Bto%5D=2022-'+yue+'-'+ri+'+23%3A59&req%5Bis_essence%5D=0&req%5Bself%5D=0&req%5Bstatus%5D=1&req%5Bpass_time%5D%5Bfrom%5D=&req%5Bpass_time%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bis_top%5D=0&req%5Bsection_group_id%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0';
    window.open(pinjie4);
    var pinjie5 ='http://admin.bbs3839.5054399.com/bbs/comment-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D='+brr+'&req%5Breply_id%5D=&req%5Btid%5D=&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=2022-'+yue+'-'+ri+'+'+shi+'%3A'+fen+'&req%5Btime%5D%5Bto%5D=2022-'+yue+'-'+ri+'+23%3A59&req%5Bis_essence%5D=0&req%5Bself%5D=0&req%5Bstatus%5D=1&req%5Bpass_time%5D%5Bfrom%5D=&req%5Bpass_time%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0';
    window.open(pinjie5);
})();