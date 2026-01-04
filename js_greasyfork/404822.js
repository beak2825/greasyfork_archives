// ==UserScript==
// @name         知乎一键转载
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  模仿又拍云 demo 实现并修改的知乎一件转载，可以一键复制到剪贴板！隐藏知乎右边侧栏，加宽回答可视区域，使您阅读的更加舒服！欢迎食用！
// @author       NXD
// @match        https://www.zhihu.com/question/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404822/%E7%9F%A5%E4%B9%8E%E4%B8%80%E9%94%AE%E8%BD%AC%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/404822/%E7%9F%A5%E4%B9%8E%E4%B8%80%E9%94%AE%E8%BD%AC%E8%BD%BD.meta.js
// ==/UserScript==

// Question-sideColumn 隐藏右边栏
GM_addStyle('.Question-sideColumn {display: none !important}');
// 回答界面加宽
GM_addStyle('.Question-mainColumn {width: 1000px !important}');

(function() {
    'use strict';
    function createElement(eleName, text, attrs){
        let ele = document.createElement(eleName);
        ele.innerText = text;
        for(let k in attrs){
            ele.setAttribute(k, attrs[k]);
        }
        return ele;
    }
    // 复制到剪贴板函数
    function addToClipboard(text){
        navigator.clipboard.writeText(text).then(function() {
            // 一切都没问题的话会执行 alert 操作
            alert('succeed copy');
        }, function(err) {
            // 失败时执行的函数
            console.info('failed copy', err);
            alert('faild copy')
        });
    }
    // added 是一个全局变量, 用来保存已经添加过按钮的节点.
    let added = [];
    // 按钮样式
    let btnStyle = 'background-color: #0084ff; margin-top: 15px; margin-bottom: 15px; margin-left:-5px; cursor:pointer; color: #fff; border-radius: 3px; border: 1px solid; padding: 3px 6px';
    // 第一个回答 Card AnswerCard
    function addFirstBtn(){
        // 获得第一个回答
        let first = document.querySelector("#root > div > main > div > div.Question-main > div.ListShortcut > div > div.Card.AnswerCard");
        // 获取每个回答的头部信息位置
        let meta = first.querySelector('div[class="ContentItem-meta"]');
        GM_addStyle('.ContentItem-meta{position: relative;}');
        // https://www.zhihu.com/question/398927155/answer/1266562835 获取到网址拿到最后的answer Id
        let who = meta.querySelector('meta[itemprop="url"]').getAttribute('content').split('/').pop();
        // 添加过的不再添加
        if(added.indexOf(who) === -1){
           // 没添加的插入数组
            added.push(who);
            // 创建按钮
            let btn = createElement('button', '转载按钮', {style: btnStyle});
            // 获取文章内容
            let text = first.querySelector('div[class="RichContent-inner"]').innerText;
            // 将文章内容复制到剪贴板
            btn.addEventListener('click', ()=>{addToClipboard(text)});
            meta.append(btn);
        }
    }
    // 更多回答：Card MoreAnswers
    function addBtn(){
        // 更多回答
        let all = document.querySelectorAll('div[class="List-item"]');
        for(let item of all){
            // 获取每个回答的头部信息位置
            let meta = item.querySelector('div[class="ContentItem-meta"]');
            GM_addStyle('.ContentItem-meta{position: relative;}');
            // https://www.zhihu.com/question/398927155/answer/1266562835 获取到网址拿到最后的answer Id
            let who = meta.querySelector('meta[itemprop="url"]').getAttribute('content').split('/').pop();
            // 添加过的不再添加
            if(added.indexOf(who) !== -1){
                continue;
            }
            // 没添加的插入数组
            added.push(who);
            // 创建按钮
            // let btn = createElement('buton', '转载按钮', {style: btnStyle});
            // ...buton写错，终于发现问题了。。
            let btn = createElement('button', '转载按钮', {style: btnStyle});
            // 获取文章内容
            let text = item.querySelector('div[class="RichContent-inner"]').innerText;
            // 将文章内容复制到剪贴板
            btn.addEventListener('click', ()=>{addToClipboard(text)});
            meta.append(btn);
        }
    }
    // 点击查看全部回答调用addBtn
    // 点击后
    window.addEventListener('load', addBtn);
    // 点击前
    // 1. 加载完调用 处理第一个回答
    window.addEventListener('load', addFirstBtn);
    // 2. 随着滚动条调用后续方法
    window.addEventListener('scroll', addBtn);
})();



