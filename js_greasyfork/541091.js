// ==UserScript==
// @name         洛谷保存站自动跳转
// @namespace    https://www.tampermonkey.net/
// @version      3.0
// @description  luogu.com 和洛谷讨论区部分帖子被封印了，此脚本可自动跳转至相应保存站，产品链接 https://www.luogu.com.cn/article/h1qvkk68。由于洛谷专栏公开可见需要审核，无法访问时请使用备用链接 https://www.luogu.me/article/h1qvkk68。
// @author       linch & Vitamin_B
// @homepage     https://www.luogu.com.cn/user/737242
// @match        *://*.luogu.com/*
// @match        *://*.luogu.com.cn/*
// @match        *://*.luogu.me/*
// @run-at       document-end
// @license      GNU GPL-3.0
// @icon         https://cdn.luogu.com.cn/upload/image_hosting/u8fj7st9.png
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/541091/%E6%B4%9B%E8%B0%B7%E4%BF%9D%E5%AD%98%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/541091/%E6%B4%9B%E8%B0%B7%E4%BF%9D%E5%AD%98%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

// Copyright (c) 2025 linch Vitamin_B

(function() {
    'use strict';
    // 自动更新相关配置
    const UPDATE_CHECK_INTERVAL = 7*24*60*60; // 忽略后7*24小时检查一次更新
    const VERSION_URL = "https://www.luogu.com.cn/article/h1qvkk68";
    const CURRENT_VERSION = "3.0";
    const now = Date.now();
    let a = document.URL;
    let t = document.documentElement.outerHTML;
    let b = "https://lglg.top/";
    let c=-1;
    let f = document.title;

    // 检查更新
    function checkUpdate() {
        const lastCheck = GM_getValue("lastUpdateCheck", 0);
        if (now - lastCheck < UPDATE_CHECK_INTERVAL) return;
        GM_xmlhttpRequest({
            method: "GET",
            url: VERSION_URL,
            onload: function(response) {

                // 简单解析页面获取最新版本号
                const latestVersion = parseVersion(response.responseText);
                if (latestVersion && compareVersions(latestVersion, CURRENT_VERSION) > 0) {
                    notifyUpdate(latestVersion);
                }
            },
            onerror: function() {
                console.log("更新检查失败");
            }
        });
    }

    // 解析版本号
    function parseVersion(text) {
        const versionMatch = text.match(/@version\s+([\d.]+)/);
        return versionMatch ? versionMatch[1] : null;
    }

    // 比较版本号
    function compareVersions(a, b) {
        const partsA = a.split('.').map(Number);
        const partsB = b.split('.').map(Number);
        for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
            const partA = partsA[i] || 0;
            const partB = partsB[i] || 0;
            if (partA > partB) return 1;
            if (partA < partB) return -1;
        }
        return 0;
    }

    // 通知更新
    function notifyUpdate(latestVersion) {
        var result = confirm("脚本【洛谷保存站自动跳转】有新版本可用\n当前版本:"+CURRENT_VERSION+"，最新版本: "+latestVersion+"\n点击确定前往更新。忽略后 7 天内将不再提醒（若点击后无法正常跳转，请直接访问 https://www.luogu.com.cn/article/h1qvkk68）");
        GM_setValue("lastUpdateCheck", now);
        if(result) window.location.replace(VERSION_URL);
    }

    function work(){

        //帖子跳转 by linch
        for (let i = 0; i < a.length; i++) {
            if (i < a.length - 8 && a[i] == 'd' && a[i + 1] == 'i' && a[i + 2] == 's' && a[i + 3] == 'c' && a[i + 4] == 'u' && a[i + 5] == 's' && a[i + 6] == 's' && a[i+7]!='?') {
                c=i+8;
                break;
            }
        }

        if(c!=-1){
            if(f.indexOf("cannot serve content")>=0){
                b = "https://www.luogu.com.cn/discuss/";
                for(let i=c;i<a.length;i++){
                    b+=a[i];
                }
                console.log("即将跳转至洛谷中国站");
                window.location.replace(b);
            }
            if(t.indexOf("该内容已删除")>=0 || t.indexOf("题目讨论版需要有提交才能查看")>=0 || t.indexOf("请先登录")>=0 || t.indexOf("完成实名验证才能查看")>=0){
                if(f.indexOf("Error")<0) return;
                for(let i=c;i<a.length;i++){
                    b+=a[i];
                }
                console.log("即将跳转至帖子保存站");
                window.location.replace(b);
            }
        }
        else{
            //云剪切板/专栏跳转 其中部分代码 by Vitamin_B, linch 进行优化升级。
            b = "";
            for (let i = 0; i < a.length; i++) {
                if (i < a.length - 4 && a[i] == '.' && a[i + 1] == 'c' && a[i + 2] == 'o' && a[i + 3] == 'm') {
                    b += ".me";
                    i += 3;
                }
                else b+=a[i];
            }
            if(f.indexOf("cannot serve content")>=0 && (a.indexOf("article")>=0 || a.indexOf("paste")>=0)){
                console.log("即将跳转至云剪切板和专栏保存站");
                window.location.replace(b);
            }
            else if(f.indexOf("安全访问中心 - 洛谷")>=0){
                b="";
                console.log("即将跳转至洛谷国际站以跳转至云剪切板和专栏保存站");
                for (let i = 0; i < a.length; i++) {
                    if(i < a.length - 3 && a[i] == '.' && a[i + 1] == 'c' && a[i + 2] == 'n'){
                        i+=2;
                    }
                    else{
                        b+=a[i];
                    }
                }
                window.location.replace(b);
            }
        }
    }
    function isElementDisplayed(element) {
        return window.getComputedStyle(element).display == 'none';
    }
    function closead(){
        let f=document.getElementById('announcement-overlay');
        let x=isElementDisplayed(f);
        if(!x){
            console.log(nextAnnouncementOrClose());
        }
        return x;
    }
    function tryclose(){
        var interval=setInterval(function(){
            if(closead()) clearInterval(interval);
        },1000);
    }
    checkUpdate();//不需要自动更新可注释。
    work();
    tryclose();
    if(a.indexOf("luogu.me")!=-1 && (f.indexOf("保存文章")!=-1 || f.indexOf("保存剪贴板")!=-1)) console.log(saveArticle());
    setInterval(work, 2000);//自行修改判断时长。
})();