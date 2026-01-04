// ==UserScript==
// @icon         http://fund.eastmoney.com/favicon.ico
// @name         天天基金多图同列
// @namespace    *
// @version      0.1
// @description  打开自选基金页面自动打开'多图同列'
// @author       `Entropy Fund 0xEaa13@201021 47704086@qq.com
// @match        http*://favor.fund.eastmoney.com/*
// @grant        none
// @requir       https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/414222/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E5%A4%9A%E5%9B%BE%E5%90%8C%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/414222/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E5%A4%9A%E5%9B%BE%E5%90%8C%E5%88%97.meta.js
// ==/UserScript==


//打开自选基金页面自动打开'多图同列'
window.onload=function(){
   'use strict';
    //检查是否有该项目（是不是此页面）
    console.log(document.getElementsByClassName('em-tabs em-tabs-title em-myfavor-type')[0].children[1].children[1]);
    if (document.getElementsByClassName('em-tabs em-tabs-title em-myfavor-type').length>0){
        //模拟点击"多图同列"
        document.getElementsByClassName('em-tabs em-tabs-title em-myfavor-type')[0].children[1].children[1].click();
        //document.body.scrollTop = document.documentElement.scrollTop = -100;
        //获取当前滚动条行号
        console.log(document.documentElement.scrollTop);

        //窗口滚动到指定位置
        window.scrollTo({
            top: 530,
            behavior: "smooth"
        });



        }

};
