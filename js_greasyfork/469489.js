// ==UserScript==
// @name         Luogu-CopyMarkdown
// @namespace    https://github.com/Luogu-Extended-Org/Luogu-CopyMarkdown
// @description  获取洛谷部分页面源代码
// @author       BlackPanda
// @license      MIT
// @version      1.4.2
// @match          https://*.luogu.com.cn/*
// @match          https://*.luogu.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469489/Luogu-CopyMarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/469489/Luogu-CopyMarkdown.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var url = window.location.href;
    async function user_detail(){
        var button = document.createElement('button');
        button.textContent = '复制Md';
        button.style.position = "absolute";
        button.style.top = "100px";button.style.right = "100px";
        window.addEventListener('scroll', function() {
            var scrollY = window.scrollY;
            button.style.top = (100 + scrollY) + 'px';
        });
        button.classList.add('button-lgcm');
        button.addEventListener('click', async function() {
            var introduction = _feInstance.currentData.user.introduction;
            await navigator.clipboard.writeText(introduction);
            alert('复制成功');
        });
        document.body.appendChild(button);
    }
    async function blog(){
            var button = document.createElement('button');
            button.textContent = '复制Md';
            button.style.position = "absolute";
            button.style.top = "100px";button.style.right = "100px";
            window.addEventListener('scroll', function() {
                var scrollY = window.scrollY;
                button.style.top = (100 + scrollY) + 'px';
            });
            button.classList.add('button-lgcm');
            button.addEventListener('click', async function() {
                fetch('/api/blog/detail/' + BlogGlobals.blogID).then(res => res.json()).then(res => navigator.clipboard.writeText(res.data.Content));
                alert('复制成功');
            });
            document.body.appendChild(button);
        };
    async function contest_detail(){
        var button = document.createElement('button');
        button.textContent = '复制Md';
        button.style.position = "absolute";
        button.style.top = "100px";button.style.right = "100px";
        window.addEventListener('scroll', function() {
            var scrollY = window.scrollY;
            button.style.top = (100 + scrollY) + 'px';
        });
        button.classList.add('button-lgcm');
        button.addEventListener('click', async function() {
            var introduction = _feInstance.currentData.contest.description;
            await navigator.clipboard.writeText(introduction);
            alert('复制成功');
        });
        document.body.appendChild(button);
    };
    async function training_detail(){
        var button = document.createElement('button');
        button.textContent = '复制Md';
        button.style.position = "absolute";
        button.style.top = "100px";button.style.right = "100px";
        window.addEventListener('scroll', function() {
            var scrollY = window.scrollY;
            button.style.top = (100 + scrollY) + 'px';
        });
        button.classList.add('button-lgcm');
        button.addEventListener('click', async function() {
            var introduction = _feInstance.currentData.training.description;
            await navigator.clipboard.writeText(introduction);
            alert('复制成功');
        });
        document.body.appendChild(button);
    };
    var style = document.createElement('style');
    style.textContent = `
        .button-lgcm {
            outline:none !important;
            cursor: pointer;
            line-height: 1.25;
            position: relative;
            display: block;
            margin-left: -.0625rem;
            padding: .5rem .75rem;
            color: #fff !important;
            border: .0625rem solid #dee2e6;
            font-size: 15px;
            font-weight: unset;
            display: flex;
            min-width: 36px;
            height: 36px;
            margin: 0 3px;
            border-radius: 100px!important;
            align-items: center;
            justify-content: center;
            transition:all .3s;
            background-color: #5e72e4;
        }
        .button-lgcm:hover {
            box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08);
            transform: translateY(-1px);
        }
        `;
    document.head.appendChild(style);
    if (url.includes('blog') && !url.includes('Admin') && !url.includes('admin')) {
        var parsedUrl = new URL(url);
        if (url.includes('org')) {
            var path = parsedUrl.pathname.split('/');
            if (path.length >= 2 && path[1] != '') {
                window.addEventListener('load', blog);
            }
        } else {
            var path = parsedUrl.pathname.split('/');
            if (path.length >= 4) {
                console.log('a');
                window.addEventListener('load', blog);
            }
        }
    }
    if (url.includes('user') && !url.includes('notification')) {
        window.addEventListener('load', user_detail);
    }
    if (url.includes('contest') && !url.includes('list') && !url.includes('edit') && !url.includes('contestId')) {
        window.addEventListener('load', contest_detail);
    }
    if (url.includes('training') && !url.includes('edit') && !url.includes('list')) {
        window.addEventListener('load', training_detail);
    }
})();