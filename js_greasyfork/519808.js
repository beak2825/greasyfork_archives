// ==UserScript==
// @name         提醒自己这里面有不该看的内容
// @namespace    http://tampermonkey.net/
// @version      2025-07-28 2.4.6
// @description  强制自己不要看不应该看的东西
// @author       You
// @match        *://*/*
// @exclude      *://www.baidu.com/*
// @exclude      *://*.bing.com/*
// @exclude      *://*.google.com/*
// @exclude      *://*.stw6.com/*
// @exclude      https://greasyfork.org/*
// @grant        GM_addStyle

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/519808/%E6%8F%90%E9%86%92%E8%87%AA%E5%B7%B1%E8%BF%99%E9%87%8C%E9%9D%A2%E6%9C%89%E4%B8%8D%E8%AF%A5%E7%9C%8B%E7%9A%84%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/519808/%E6%8F%90%E9%86%92%E8%87%AA%E5%B7%B1%E8%BF%99%E9%87%8C%E9%9D%A2%E6%9C%89%E4%B8%8D%E8%AF%A5%E7%9C%8B%E7%9A%84%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    GM_addStyle(`
        .showContent {
            padding-top: 50px; 
            font-size: 48px; 
            text-align: center; 
            width: 100%; 
            background: white; 
            font-weight: bold; 
            color: black;
        }
    `);


    function alertContent(title) {
        var tips = "你正在浏览"+ title +"相关的内容，你不应该看这些内容，关闭它！"
        document.body.innerHTML = '<h1 class="showContent">你还想修炼吗？？？！！！</h1>'
        // document.body.insertAdjacentHTML('beforeend', '<div>你还想修炼吗？？？！！！</div>')
        var tipdiv = document.createElement("div");
        tipdiv.textContent= tips;
        tipdiv.className = "showContent";
        document.body.appendChild(tipdiv);
        setInterval(() => {
            var warndiv = document.createElement("div");
            warndiv.textContent= "离开这里，清醒一下自己的脑子！！！！！！";
            warndiv.className = "showContent";
            document.body.appendChild(warndiv);
            window.scrollTo(0, document.documentElement.scrollHeight)
        }, 2000);
    }
    setTimeout(() => {
        // 获取文章内容
     var content = document.body.innerHTML
     if (location.href.indexOf('msn.cn') > -1) {
         content = document.getElementsByTagName('cp-article-reader')[0]._articleContent.body.innerHTML
     }
        // 简单判断是否在看不该看的东西
     if ( (/第.*章/.test(content) && /书架/.test(content)) || (content.indexOf("玄幻") > -1 && content.indexOf("都市") > -1 )) {
       alertContent('小说')
         return;
     }
     if ( /章节列表/.test(content) || /连载中/.test(content) || /日漫/.test(content) || /韩漫/.test(content) || /第\d+话/.test(content)) {
       alertContent('漫画')
         return;
     }
     if ( content.indexOf("海贼王") > -1 || content.indexOf("航海王") > -1 || content.indexOf("路飞") > -1 || content.indexOf("娜美") > -1) {
        alertContent('海贼王')
         return;
     }
    }, 2000)
    
})();