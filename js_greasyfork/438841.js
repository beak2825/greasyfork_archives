// ==UserScript==
// @name         复制成 Markdown 的 Link
// @namespace    https://raiseyang.github.io/
// @version      0.3.0
// @description  将当前网站链接拷贝成 Markdown 格式
// @author       RaiseYang
// @include        *
// @match        https://blog.csdn.net/**
// @match        https://juejin.cn/**
// @match        https://developer.android.google.cn/**
// @match        https://github.com/**
// @match        https://www.jianshu.com/**
// @match        https://cloud.tencent.com/**
// @match        https://medium.com/**
// @match        https://.*\.zhihu.com/**
// @exclude      /(^[^:\/#\?]*:\/\/([^#\?\/]*\.)?www\.baidu\.com(:[0-9]{1,5})?\/.*$)/
// @exclude      /(^[^:\/#\?]*:\/\/([^#\?\/]*\.)?www\.google\.com\.hk\/.*$/
// @icon         https://raiseyang.github.io/static/markdown_copy.png
// @grant        GM_setClipboard
// @require     https://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/438841/%E5%A4%8D%E5%88%B6%E6%88%90%20Markdown%20%E7%9A%84%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/438841/%E5%A4%8D%E5%88%B6%E6%88%90%20Markdown%20%E7%9A%84%20Link.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    var $ = window.$;

    console.log('复制成 Markdown 的 Link 脚本加载了');
    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "id001";
    button.textContent = "拷贝链接";
    button.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 10px;
            background:#282C34;
            width: 92px;
            height: 30px;
            color:white;
            z-index:999;
            font-weight:bold;
            font-size:15px;
            border-radius:50px;
            `;

    //绑定按键点击功能
    button.onclick = function () {
        console.log('点击了按键');

        // 当前网站链接
        var link = window.location.href;

        let title;

        let CSDNegexp = /.*csdn\.net\/.+/; // 匹配CSDN
        let Juejinegexp = /.*juejin\.cn\/.+/; // 匹配掘金
        let Androidegexp = /developer\.android\.google\.cn.+/;
        let GitHubegexp = /github\.com.+/;
        let JianShuegexp = /.*jianshu\.com.+/;
        let TencentCloudegexp = /cloud.tencent\.com.+/;
        let Mediumegexp = /medium\.com.+/;
        let ZhiHuegexp = /.*zhihu\.com.+/;

        if (CSDNegexp.test(link)) {
            console.log("CSDNegexp")

            title = $("#articleContentId").text(); // CSDN的title定制化
        } else if (Juejinegexp.test(link)) {
            console.log("Juejinegexp")
            title = $(".article-title").text().trim(); // 掘金的title定制化
        } else if (Androidegexp.test(link)) {
            console.log("Androidegexp")
            title = $(document).attr('title');
            //button.style.right = 100;//按钮左移100px不起作用
        } else if (GitHubegexp.test(link)) {
            console.log("GitHubegexp")
            title = $(document).attr('title'); //android/gradle-recipes: Ready-to-use recipes for common build customizations that showcase the Android Gradle plugin's public APIs and DSL.
            let endIndex = title.indexOf(":");
            title = title.substr(0, endIndex);

        } else if (JianShuegexp.test(link)) {
            console.log("JianShuegexp")
            title = $(document).attr('title'); //Kevin Learn Android：Android 知识点梳理 - 简书
            let endIndex = title.indexOf(" - 简书");
            title = title.substr(0, endIndex);
        } else if (TencentCloudegexp.test(link)) {
            console.log("TencentCloudegexp")
            title = $(document).attr('title'); //OkHttp使用完全教程 - 云+社区 - 腾讯云
            let endIndex = title.indexOf(" - 云+社区 - 腾讯云");
            title = title.substr(0, endIndex);
        } else if (Mediumegexp.test(link)) {
            console.log("Mediumegexp")
            title = getMeta("og:title");

        } else if (ZhiHuegexp.test(link)) {
            console.log("ZhiHuegexp")
           title = $(document).attr('title'); //Kotlin Flow场景化学习 - 知乎
            let endIndex = title.indexOf(" - 知乎");
            title = title.substr(0, endIndex);

        } else {
            console.log("other site")
            title = $(document).attr('title');
        }

        //alert("["+title+"]("+link+")");
        let markdownLink = "[" + title + "](" + link + ")"; // 拼接成Markdown格式
        GM_setClipboard(markdownLink, "text"); // 复制到剪切板
        console.log('GM_setClipboard=' + markdownLink); // 控制台打印，便于调试
        return;
    };

    setTimeout(() => {
        $("body").append(button); // 添加button按钮
    }, 1000);

	// 获取<meta>信息 <meta data-rh="true" property="og:title" content="Room 🔗 Flow">
    function getMeta(metaName) {
        const metas = document.getElementsByTagName("meta");

        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute("property") === metaName) {
                return metas[i].getAttribute("content");
            }
        }

        return;
    }

})();
