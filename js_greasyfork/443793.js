// ==UserScript==
// @name         百度搜索CSDN专栏文章
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  使用百度搜索CSDN专栏文章
// @author       myaijarvis
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @match        https://*.blog.csdn.net/article/details/*
// @match        https://blog.csdn.net/*/article/details/*
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @run-at       document-end
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/443793/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2CSDN%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/443793/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2CSDN%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

const url=document.URL || '';

(function() {
    'use strict';
    let text=$('.hide-article-box .lock-text').text();

    if (text.includes('解锁全文')){
        addStyle();
        addBtn();
        $('#jumpSearch').click(()=>{
            let title=$('#articleContentId').text();
            let url=`https://www.baidu.com/s?wd=${title}`;
            window.open(url,'_blank');
        })
        return;
    }

})();

function addStyle(){
    //debugger;
    let layui_css = `.layui-btn{display: inline-block; vertical-align: middle; height: 38px; line-height: 38px; border: 1px solid transparent; padding: 0 18px; background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 14px; border-radius: 2px; cursor: pointer; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;}
                   .layui-btn-sm{height: 30px; line-height: 30px; padding: 0 10px; font-size: 12px;}
                   .layui-btn-normal{background-color: #1E9FFF;}`;
    GM_addStyle(layui_css);
}

//创建按钮
function addBtn() {
    //debugger;
    let element = $(
        `<button style="top:250px;right:0px; position: fixed;z-index:1000;cursor:pointer;" class="layui-btn layui-btn-sm layui-btn-normal" id="jumpSearch">搜索</button>`
  );
    $("body").append(element);
}