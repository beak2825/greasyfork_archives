// ==UserScript==
// @name         萌百旧主页(手机版)
// @namespace    1
// @supportURL   1
// @version      1.1
// @description  自动重定向到旧版主页
// @author       OctoberSama&ChatGPT
// @license      AGPL
// @match        zh.moegirl.org.cn/*
// @match        mzh.moegirl.org.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505429/%E8%90%8C%E7%99%BE%E6%97%A7%E4%B8%BB%E9%A1%B5%28%E6%89%8B%E6%9C%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505429/%E8%90%8C%E7%99%BE%E6%97%A7%E4%B8%BB%E9%A1%B5%28%E6%89%8B%E6%9C%BA%E7%89%88%29.meta.js
// ==/UserScript==

//重定向功能
function replace_url(url) {
    if (url.includes('moegirl.org.cn')) {
        url = url.replace(/Mainpage#\/(flow|topics)/, 'Mainpage#/legacy')
                 .replace(/^moegirl.org.cn\/Mainpage$/, 'moegirl.org.cn/Mainpage#/legacy')
                 .replace('mzh.moegirl.org.cn', 'zh.moegirl.org.cn');
    }
    console.log(url);
    return url;
}

var url = window.location.href;
var newUrl = replace_url(url);
if (url !== newUrl) {
    window.location.href = newUrl;
}



//删除菜单
var fuckingtab = document.querySelector("#home-layout-toggler");
    if(fuckingtab)
    {
        fuckingtab.remove();
        return;
    }
    var interval = setInterval(function() {
        fuckingtab = document.querySelector("#home-layout-toggler");
        if (fuckingtab) {
            fuckingtab.remove();
            clearInterval(interval);
        }
    }, 20);
