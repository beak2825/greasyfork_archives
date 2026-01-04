// ==UserScript==
// @name         一键获取洛谷md源码
// @namespace    https://www.luogu.com.cn/paste/gerpk5i4
// @license      MIT
// @version      0.1
// @description  在主页、博客、比赛、题单页面使用 Ctrl + Alt + C 快捷键，可直接获取markdown源码！
// @author       max0810
// @match        https://www.luogu.com.cn/*
// @downloadURL https://update.greasyfork.org/scripts/481836/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E6%B4%9B%E8%B0%B7md%E6%BA%90%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/481836/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E6%B4%9B%E8%B0%B7md%E6%BA%90%E7%A0%81.meta.js
// ==/UserScript==

(function()
{
    'use strict';
    const url = window.location.href;
    async function copy_blog()
    {
        fetch('/api/blog/detail/' + BlogGlobals.blogID).then(res => res.json()).then(res => navigator.clipboard.writeText(res.data.Content));
    };
    async function copy_user()
    {
        var introduction = _feInstance.currentData.user.introduction;
        await navigator.clipboard.writeText(introduction);
    };
    async function copy_contest()
    {
        var description = _feInstance.currentData.contest.description;
        await navigator.clipboard.writeText(description);
    };
    async function copy_training()
    {
        var description = _feInstance.currentData.training.description;
        await navigator.clipboard.writeText(description);
    };
    document.onkeydown = function(e)
    {
        if(e.keyCode == 67 && e.ctrlKey && e.altKey)
        {
            if(url.includes("blog")&&!url.includes("Admin"))
            {copy_blog();alert("复制成功！");}
            else if(url.includes('user')&&!url.includes('notification')&&!url.includes('setting'))
            {copy_user();alert("复制成功！");}
            else if(url.includes('contest')&&!url.includes('list')&&!url.includes('edit')&&!url.includes('contestId'))
            {copy_contest();alert("复制成功！");}
            else if(url.includes('training')&&!url.includes('list')&&!url.includes('edit'))
            {copy_training();alert("复制成功！");}
            else alert("复制失败，请检查本页面是否为可复制的页面！");
        }
    }
})();
