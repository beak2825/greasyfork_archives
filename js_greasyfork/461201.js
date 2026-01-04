// ==UserScript==
// @name         Bing Rewards搜索任务自动完成
// @version      1.0.1
// @description  Bing Rewards自动搜索任务工具
// @author       Sentaku1129
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @run-at document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/1036733
// @downloadURL https://update.greasyfork.org/scripts/461201/Bing%20Rewards%E6%90%9C%E7%B4%A2%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/461201/Bing%20Rewards%E6%90%9C%E7%B4%A2%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==
 
var max_rewards = 50; /*每次重复执行的次数*/
var search_dic = ["观沧海","闻王昌龄左迁龙标遥有此寄","次北固山下","天净沙·秋思","咏雪","陈太丘与友期行",
                  "诫子书","狼","穿井得一人","杞人忧天","峨眉山月歌","江南逢李龟年","行军九日思长安故园",
                  "夜上受降城闻笛","秋词·其一","夜雨寄北","十一月四日风雨大作·其二","潼关","孙权劝学",
                  "木兰诗","卖油翁","陋室铭","爱莲说","登幽州台歌","望岳","登飞来峰","游山西村",
                  "己亥杂诗·其五","活板","竹里馆","春夜洛城闻笛","逢入京使","晚春","泊秦淮","贾生",
                  "过松源晨炊漆公店","约客","三峡","答谢中书书","记承天寺夜游","与朱元思书","野望",
                  "黄鹤楼","使至塞上","渡荆门送别","钱塘湖春行","得道多助，失道寡助","富贵不能淫",
                  "生于忧患，死于安乐","愚公移山","周亚夫军细柳","饮酒·其五","春望","雁门太守行","赤壁",
                  "渔家傲·天接云涛连晓雾"]; /*搜索字典*/
 
let menu1 = GM_registerMenuCommand('开始', function () {
    GM_setValue('Cnt', 0);
    location.href="https://www.bing.com/?br_msg=Please-Wait"
}, 'o');
 
let menu2 = GM_registerMenuCommand('停止', function () {
    GM_setValue('Cnt', max_rewards + 10);
}, 'o');
 
function AutoStrTrans(st) {
    let yStr = st; /*原字符串*/
    let rStr = "试验"; /*插入的字符*/
    let zStr = ""; /*结果*/
    let prePo = 0;
    for (let i = 0; i < yStr.length;) {
        let step = parseInt(Math.random() * 6) + 1;
        if (i > 0) {
            zStr = zStr + yStr.substr(prePo, i - prePo) + rStr;
            prePo = i;
        }
        i = i + step;
    }
    if (prePo < yStr.length) {
        zStr = zStr + yStr.substr(prePo, yStr.length - prePo)
    }
    return zStr;
}
 
(function() {
    'use strict';
 
    if(GM_getValue('Cnt') == null){GM_setValue('Cnt', max_rewards + 10);}
 
    //alert(GM_getValue('Cnt'));
    if(GM_getValue('Cnt') <= max_rewards/2){
 
        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = "[" + GM_getValue('Cnt') + " / " + max_rewards + "] " + tt.innerHTML;
 
        setTimeout(function(){
            GM_setValue('Cnt', GM_getValue('Cnt') + 1);
            let nowtxt = search_dic[ GM_getValue('Cnt')];
            nowtxt = AutoStrTrans(nowtxt);
            location.href = "https://www.bing.com/search?q=" + encodeURI( nowtxt );
        }, 3000);
    }
    if(GM_getValue('Cnt') > max_rewards/2 && GM_getValue('Cnt') < max_rewards){
 
        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = "[" + GM_getValue('Cnt') + " / " + max_rewards + "] " + tt.innerHTML;
 
        setTimeout(function(){
            GM_setValue('Cnt', GM_getValue('Cnt') + 1);
            let nowtxt = search_dic[ GM_getValue('Cnt')];
            nowtxt = AutoStrTrans(nowtxt);
            location.href = "https://cn.bing.com/search?q=" + encodeURI( nowtxt );
        }, 3000);
    }
})();