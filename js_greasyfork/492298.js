// ==UserScript==
// @name         GetFileListFeishu
// @namespace    https://www.feishu.cn/
// @version      0.1
// @description  复制飞书文件列表，支持官方飞书
// @author       AustinYoung
// @match        https://*.feishu.cn/drive/*
// @icon         https://www.feishu.cn/favicon.ico
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492298/GetFileListFeishu.user.js
// @updateURL https://update.greasyfork.org/scripts/492298/GetFileListFeishu.meta.js
// ==/UserScript==
window.searchCount = 0;
(function() {
    'use strict';

    // 添加悬浮框
    console.log('添加悬浮框')
    addFloat();
})();
function addFloat()
{
    window.searchCount++;
    console.log('查找搜索框:'+window.searchCount)
    let searchNote = document.querySelector(".explorer__page-header-with-navbar span")
    if(searchNote==null)
    {
        console.log('没有标题')
        if(window.searchCount<10)
        {
            setTimeout( addFloat,1000);
        }
        return;
    }
    let myFloat=document.createElement("div");
    myFloat.style.float ='right';
    myFloat.innerHTML ="<div id='myCopyDiv' style='cursor:pointer' title='复制列表到剪切板'>📋</div>"

    searchNote.appendChild(myFloat)
    document.getElementById('myCopyDiv').addEventListener('click',copyContainText);
}
const copyContainText = function()
{
    // 获取对象
    let containList = ['.explorer-file-list-virtualized__container','.explorer-grid-view-virtualized__container','.infinite-scroll']
    let contain;
    for(let v of containList)
    {
        contain = document.querySelector(v)
        if(contain != null)
        {
            break;
        }
    }
    console.log(contain)
    // 提取内容
    let arrTxt = [];
    // 预分析每行内容
    let lists = contain.querySelectorAll(".file-list-item");
    for(let v of lists)
    {
        // 替换为 CSV格式
        arrTxt.push( v.innerText.replace(/\n/g,'\t'))
    }
    // 复制到剪切板
    GM_setClipboard(arrTxt.join('\n'));
    myCopyDiv.innerText = '✔';
    // 重新显示复制按钮
    setTimeout(function(){myCopyDiv.innerText = '📋'},2000);
}
