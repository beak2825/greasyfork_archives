// ==UserScript==
// @name         HappyCSDN
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/mouday/tampermonkey-script
// @version      0.3
// @description  做一个快乐的CV工程师，连接直接跳转，移除复制小尾巴，移除下载推荐
// @author       Mouday
// @email        pengshiyuyx@163.com
// @icon         https://csdnimg.cn/public/favicon.ico

// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432490/HappyCSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/432490/HappyCSDN.meta.js
// ==/UserScript==

// 新tab打开文章内部链接，取消中间跳转，加快coding步伐
function openLinkOnNewTab(){
    for(let a of [...document.querySelectorAll('#article_content a')]){
        a.target = '_blank';
        a.addEventListener('click', (e) => {
            e.stopPropagation()
        });
    }
}

// 移除复制小尾巴，保护delete键
function removeCopyAppend(){
    document.querySelector('#article_content').addEventListener('copy', function(e){
        e.stopPropagation()
    })
}


// 移除下载推荐栏，避免点错浪费时间
function removeDownloadRecommendBox(){
    document.querySelector('.second-recommend-box').style.display = 'none';
    document.querySelector('.first-recommend-box').style.display = 'none';

}

// 自动展开代码 2023-02-16
function autoExpandCode(){
    document.querySelectorAll('.hide-preCode-bt').forEach(item=>item.click())
}

(function() {
    'use strict';
    openLinkOnNewTab();
    removeCopyAppend();
    removeDownloadRecommendBox();
    autoExpandCode();
})();