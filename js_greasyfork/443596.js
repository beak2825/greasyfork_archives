// ==UserScript==
// @name         加班评价打开
// @namespace    wjddd
// @version      0.123456
// @description  打开网址
// @author       wangjia
// @match        https://docs.qq.com/doc/p/f91de57bccb619b04bfbec4e15f05c789ab2c333?dver=3.0.27498639
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443596/%E5%8A%A0%E7%8F%AD%E8%AF%84%E4%BB%B7%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/443596/%E5%8A%A0%E7%8F%AD%E8%AF%84%E4%BB%B7%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var arr = ['132701','138375','96691','131330','126291'];
    var yue = prompt("请输入本月月份","4");
     /*                       ,%%%%%%%%,
     *                      ,%%/\%%%%/\%%
     *                     ,%%%\c''''J/%%%
     *           %.        %%%%/ O  o \%%%
     *           `%%.      %%%%       |%%%
     *            `%%      `%%%%(__Y__)%%'
     *            //        ;%%%%`\-/%%%'
     *            ((      /   `%%%%%%%'
     *             \\     .'           |
     *              \\   /        \  | |
     *               \\/          ) | |
     *                \          /_ | |__
     *                (____________)))))))
     *
     */
    var ri = prompt("请输入当天日期");
    var shi = prompt("几时开始审核","16");
    var fen = prompt("几分开始审核","00");
    var nian = '2022';
    alert("您当前选择的时间为2022-"+yue+"-"+ri+"的"+shi+":"+fen+"-------当日21:05分")
    for (var i=0;i<arr.length;i++) {
        var pinjie ="http://admin.bbs3839.5054399.com/comment/gameComment-hasAudit.html?req%5Bstate_private%5D=0&req%5Bstate_high%5D=2&req%5Bis_pcs%5D=2&req%5Bstate_pcs%5D=100&req%5Bistop%5D=2&req%5Bfid%5D="+arr[i]+"&req%5Bcid%5D=&req%5Buid%5D=&req%5Bedit%5D=0&req%5Bcontent%5D=&req%5Btime_from%5D=2022-"+yue+"-"+ri+"+"+shi+"%3A"+fen+"%3A00&req%5Btime_to%5D=2022-"+yue+"-"+ri+"+21%3A05&req%5Bip%5D=&req%5Blength_from%5D=&req%5Blength_to%5D=&req%5Bstar_from%5D=&req%5Bstar_to%5D=&req%5Badminid%5D=&req%5Boppose_from%5D=&req%5Boppose_to%5D=&req%5Boriginal_pid%5D=0&req%5Bfrom_client%5D=0";
        window.open(pinjie);
    };
    for (var b=0;b<arr.length;b++) {
        var pinjie2 ="http://admin.bbs3839.5054399.com/comment/gameReply-hasAudit.html?req%5Bstate_private%5D=0&req%5Bfid%5D="+arr[b]+"&req%5Bcid%5D=&req%5Bid%5D=&req%5Bcontent%5D=&req%5Bidentity%5D=100&req%5Btime_from%5D=2022-"+yue+"-"+ri+"+"+shi+"%3A"+fen+"%3A00&req%5Btime_to%5D=2022-"+yue+"-"+ri+"+21%3A05%3A00&req%5Badminname%5D=&req%5Buid%5D=&req%5Bip%5D=&req%5Blength_from%5D=&req%5Blength_to%5D=";
        window.open(pinjie2);
    };
})();