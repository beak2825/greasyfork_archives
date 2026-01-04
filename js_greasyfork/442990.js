// ==UserScript==
// @name         Kaggle助手
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  提取kaggle竞赛的code中的notebook页面，并跳转到新页面
// @author       myaijarvis
// @match        https://www.kaggle.com/code/*
// @match        https://www.kaggleusercontent.com/kf/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @run-at       document-end
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/442990/Kaggle%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/442990/Kaggle%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const url=document.URL || '';

(function() {
    'use strict';

    if (url.includes('kaggle.com')){
        addStyle();
        addBtn();
        $('#jumpBtn').click(()=>{
            let url=$('iframe').attr('src');
            console.log(url);
            window.open(url,'_blank');
        })
        return;
    }

    if (url.includes('kaggleusercontent.com')){
        $('body').css({'overflow-y':'auto'});
        document.title=$('h1').text();
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
        `<button style="top:300px;right:0px; position: fixed;z-index:1000;cursor:pointer;" class="layui-btn layui-btn-sm layui-btn-normal" id="jumpBtn">跳转</button>`
  );
    $("body").append(element);
}