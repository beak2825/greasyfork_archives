// ==UserScript==
// @name         SexInSex自动点击支持楼主
// @namespace    sexinsex.phygelus.first
// @version      0.3.1
// @description  自动点击SexInSex的支持楼主按钮
// @author       phygelus
// @include        *://*sexinsex.net/*
// @include        *://*sis.xxx/*
// @include        *://*bluerockcafe.com/*
// @include        *://174.127.195*/*
// @include        *://*1*2*3*.com/*
// @include        *://*3d3d3d.net/*
// @include        *://*9dizhi.com/*
// @include        *://*bluerocks.cc/*
// @include        *://*bobo123.one/*
// @include        *://*btnihao.com/*
// @include        *://*catsis.info/*
// @include        *://*d44.icu/*
// @include        *://*easygo1.net/*
// @include        *://*fastspeedtank.net/*
// @include        *://*gapipi.com/*
// @include        *://*goeasyspeed.net/*
// @include        *://*happybar8.net/*
// @include        *://*joyplacetobe.com/*
// @include        *://*nihao*.net/*
// @include        *://*pinktechmate.net/*
// @include        *://*popopo.me/*
// @include        *://*relaxhappylife.com/*
// @include        *://*sis*.net/*
// @include        *://*solc.one/*
// @include        *://*stepncafe.com/*
// @include        *://*swimtoofast.com/*
// @include        *://*t*t*t*.com/*
// @include        *://*thatsucks.info/*
// @include        *://*twinai.xyz/*
// @include        *://*v2r.club/*
// @include        *://*vr1p.com/*
// @include        *://*whereismy*.com/*
// @include        *://*win4you.net/*
// @include        *://*yaayaa.net/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT License  //共享规则
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/499389/SexInSex%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%94%AF%E6%8C%81%E6%A5%BC%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/499389/SexInSex%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%94%AF%E6%8C%81%E6%A5%BC%E4%B8%BB.meta.js
// ==/UserScript==


// 代码开始
(function() {

    /* 
        Update:2025-05-20
        重构代码。
        优化了tid提取逻辑；
        取消了投票贴、悬赏贴的自动执行；
        修复了非首页的执行报错。
     */
    // tid提取
    const tid = (() => {
        const urlTid = new URLSearchParams(window.location.search).get('tid');
        if (urlTid) return urlTid;
        const pathMatch = window.location.pathname.match(/\/thread-(\d+)/);
        return pathMatch ? pathMatch[1] : null;
    })();

    // 执行
    if (document.querySelector(`a[onclick^="ajaxget('thanks.php?tid=${tid}"]`)) ajaxget('thanks.php?tid=' + tid, 'thanksdiv');

})();