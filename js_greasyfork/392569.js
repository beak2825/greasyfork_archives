// ==UserScript==
// @name         贴吧移动版显示完整评论
// @namespace    http://tampermonkey.net/
// @include      https://tieba.baidu.com/p/*
// @version      0.1.2
// @description  手机版-贴吧移动版显示完整帖子
// @author       浅忆
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392569/%E8%B4%B4%E5%90%A7%E7%A7%BB%E5%8A%A8%E7%89%88%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/392569/%E8%B4%B4%E5%90%A7%E7%A7%BB%E5%8A%A8%E7%89%88%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

window.onload=function() {
    'use strict';
    var d = document.querySelector("#pblist > li:nth-child(1)").className;
    var cla = d.replace('class_hide_flag','');
    var ulListLength = document.querySelector("#pblist").getElementsByTagName("li").length;
    for (var i = 1;i < ulListLength + 1;i++ ) {
        var qb = document.querySelector("#pblist > li:nth-child("+i+")");
        if(qb !== null){
            qb.className = cla;
            var od = document.querySelector("#pblist > li:nth-child("+i+") > div > div > div.list_item_top.clearfix > div.list_item_more_operation").innerText;
            if(od !== null && od === "广告"){
                console.log(od);
                console.log(qb);
                qb.innerHTML = "广告已被屏蔽";
            }
        }
    }
    console.log("输出选择的信息");
    console.log(ulListLength);

    document.querySelector("#main > div.father-cut-recommend-normal-box").innerHTML = "屏蔽更多推荐";
    document.querySelector("#pblist > div.father-cut-daoliu-normal-box > div > button").innerText = "已全部加载完成";
    // Your code here...
};

