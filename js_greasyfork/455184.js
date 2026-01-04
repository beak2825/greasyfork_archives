// ==UserScript==
// @name         LCLAB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LC LAB
// @author       XB
// @match        http://10.110.75.32:8384/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=75.32
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455184/LCLAB.user.js
// @updateURL https://update.greasyfork.org/scripts/455184/LCLAB.meta.js
// ==/UserScript==

let timer=null;
let oldpages=[];
let first=null;
function get_now_date(){
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);//获取年份
  var Y =date.getFullYear();//获取月份
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);//获取当日日期
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return Y+'-'+M+'-'+D;
}
function refresh(){
    const page = document.getElementsByClassName("pagination-page-list");
    if(page.length>0){
        if(oldpages.indexOf(page[0])===-1){
            const option = document.createElement("option");
            option.innerText="60";
            page[0].appendChild(option);
            const tab = first.getElementsByClassName("");
            oldpages.push(page[0]);
        }
    }

    const tab = first.getElementsByClassName("tabs-selected tabs-last")[0];
    if(tab.innerText==="新建借物"){
        const tmp = first.getElementsByTagName('iframe');
        const window = tmp[tmp.length-1].contentWindow;
        window.$("input[name='forItem']").val("3834");
        window.$("input[name='type']").val("7");
        window.$("input[name='broUserMobile']").val("15137798324");
        window.$("input[name='forItemType']").val("非IPD项目");
        window.$("input[name='forItemStage']").val("JD02000 PDT-产品开发阶段");
        window.$("input[name='forItemStageDetail']").val("DVT");
        window.$("input[name='receiveTime1']").val(get_now_date());
        window.$("input[name='receiveTime2']").val("17:00");

        window.$("#title").val("BMC研发测试使用");
    }
}


(function() {
    'use strict';
    clearInterval(timer);
    first=document;
    timer=setInterval(() => {
        refresh();
    }, 1000);
    // Your code here...
})();