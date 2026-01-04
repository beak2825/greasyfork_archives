// ==UserScript==
// @name         必应Rewards自动完成
// @namespace    https://ez118.github.io/
// @version      1.7.1
// @description  必应Rewards当日任务自动完成工具
// @author       ZZY_WISU
// @match        https://cn.bing.com/*
// @match        https://www.bing.com/*
// @license      GNU GPLv3
// @icon         https://cn.bing.com/favicon.ico
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/458077/%E5%BF%85%E5%BA%94Rewards%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/458077/%E5%BF%85%E5%BA%94Rewards%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==

var max_rewards = 25; /*每次重复执行的次数*/
var search_dic = ["观沧海","闻王昌龄左迁龙标遥有此寄","次北固山下","天净沙·秋思","咏雪","陈太丘与友期行",
                  "诫子书","穿井得一人","杞人忧天","峨眉山月歌","江南逢李龟年","行军九日思长安故园",
                  "夜上受降城闻笛","秋词·其一","夜雨寄北","十一月四日风雨大作·其二","潼关","孙权劝学",
                  "木兰诗","卖油翁","陋室铭","爱莲说","登幽州台歌","望岳","登飞来峰","游山西村",
                  "己亥杂诗·其五","活板","竹里馆","春夜洛城闻笛","逢入京使","晚春","泊秦淮","贾生",
                  "过松源晨炊漆公店","约客","三峡","答谢中书书","记承天寺夜游","与朱元思书","野望",
                  "黄鹤楼","使至塞上","渡荆门送别","钱塘湖春行","得道多助，失道寡助","富贵不能淫",
                  "生于忧患，死于安乐","愚公移山","周亚夫军细柳","饮酒·其五","春望","雁门太守行","赤壁",
                  "渔家傲·天接云涛连晓雾"]; /*搜索字典*/


/* 注册菜单 */
let menu1 = GM_registerMenuCommand('开始', () => {
    GM_setValue('Cnt', 0);
    location.href = "https://cn.bing.com/search?q=即将开始，请等待";
}, 'b');

let menu2 = GM_registerMenuCommand('停止', () => {
    GM_setValue('Cnt', max_rewards + 10);
}, 's');




/* 自动搜索部分 */
function AutoStrTrans(st) {
    let yStr = st; /*原字符串*/
    let rStr = search_dic[Math.floor(Math.random()*search_dic.length)].substr(0, 2); /*"试验"; 插入的字符*/
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

function doSearch(wd){
    let ipt = document.getElementById("sb_form_q");
    let btn = document.getElementById("sb_form_go");
    let form = document.getElementById("sb_form");

    if(GM_getValue('Cnt') % 3 == 0) {
        location.replace("https://cn.bing.com/search?q=" + encodeURI(wd) + "&PC=U316&FORM=CHROMN")
    } else if(GM_getValue('Cnt') % 3 == 1) {
        // 填入搜索词
        ipt.value = wd;
        setTimeout(() => { form.submit(); }, 500);
    } else if(GM_getValue('Cnt') % 3 == 2) {
        // 填入搜索词
        ipt.value = wd;
        setTimeout(() => { btn.click(); }, 500);
    }
}

/* 面板快捷打卡部分 */
function isPanelUrl(){
    return window.location.href.includes("bing.com/rewards/panelflyout") ? true : false;
}

function doOpenTabs(){
    let items = document.getElementsByClassName("promo_cont");
    items.forEach((item, index) => {
        setTimeout(() => {
            let at = item.getElementsByTagName("a")[0];
            if(at.getAttribute("target") == "_blank") {
                at.click();
            }
        }, index * 40);
    })
}

(function() {
    'use strict';

    if(isPanelUrl()) {
        setTimeout(() => {
            var element = document.getElementsByClassName("css-109")[0];

            // 创建一个按钮元素
            var button = document.createElement("input");
            button.value = "【必应Rewards自动完成】";
            button.type = "button"
            element.appendChild(button);
            button.addEventListener('click', () => {
                doOpenTabs();
            });
        }, 500);
        return;
    }


    // 变量初始化
    if(GM_getValue('Cnt') == null){ GM_setValue('Cnt', max_rewards + 10); }

    // 执行自动搜索计分
    if(GM_getValue('Cnt') < max_rewards){
        // 设置标题
        var siteTitle = document.getElementsByTagName("title")[0];
        siteTitle.innerHTML = "[" + GM_getValue('Cnt') + " / " + max_rewards + "] " + siteTitle.innerHTML;

        setTimeout(() => {
            GM_setValue('Cnt', GM_getValue('Cnt') + 1);

            let nowtxt = search_dic[ GM_getValue('Cnt')];
            nowtxt = AutoStrTrans( nowtxt );

            doSearch( nowtxt );
        }, 3000);
    }
})();