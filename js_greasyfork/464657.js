// ==UserScript==
// @name         Random website Tab Title随机浏览器选项卡标题和图标(摸鱼)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Set a random title on any website tabs.
// @match        *://*/*
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/faker/4.1.0/faker.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464657/Random%20website%20Tab%20Title%E9%9A%8F%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E9%80%89%E9%A1%B9%E5%8D%A1%E6%A0%87%E9%A2%98%E5%92%8C%E5%9B%BE%E6%A0%87%28%E6%91%B8%E9%B1%BC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/464657/Random%20website%20Tab%20Title%E9%9A%8F%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E9%80%89%E9%A1%B9%E5%8D%A1%E6%A0%87%E9%A2%98%E5%92%8C%E5%9B%BE%E6%A0%87%28%E6%91%B8%E9%B1%BC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
/*
        let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let linkTags = document.head.getElementsByTagName('link');
    for (let i=0; i<linkTags.length; i++) {
        let el = linkTags[i];
        if ((el.getAttribute('rel') === 'shortcut icon') || (el.getAttribute('rel') === 'icon')) {
            el.href = canvas.toDataURL();
        }
    }
    */


    var iconUrl = "https://github.com/fluidicon.png";

    function detectFavicon() {
        var link = document.querySelector("link[rel*='icon']");
        return link && link.getAttribute("href") === iconUrl;
    }

    function setFavicon(iconUrl) {
        var link = document.querySelector("link[rel*='icon']");
        if (link) {
            var oldIcon = link.href;
            if (iconUrl !== oldIcon) {
                var newLink = document.createElement("link");
                newLink.setAttribute("rel", "shortcut icon");
                newLink.setAttribute("href", iconUrl);
                document.head.removeChild(link);
                document.head.appendChild(newLink);
            }
        }
    }

    function checkFavicon() {
        if (!detectFavicon()) {
            setFavicon(iconUrl);
        }
    }

    setInterval(checkFavicon, 500);
    // Clear tab title
   document.title = 'Programming Note';
      let newTitle = createRandomTitle();

    // Change page title
    document.title = newTitle;

    // Create a new title every five seconds
    setInterval(() => {
        newTitle = createRandomTitle();
        document.title = newTitle;
    }, 9999);

    function createRandomTitle() {
        // Use faker library to generate a random title
          // Create arrays of possible titles for each topic
  const cSharpTitles = [
    "Github Search",
    "C# 中的异步编程：最佳实践和常见问题。",
    "使用C# 开发跨平台应用程序的技巧。",
    "掌握快速排序算法：C# 实现指南。",
    "为什么 LINQ 是 C# 中必须掌握的技能？"
  ];

  const sqlServerTitles = [
    "SQL Server 中的索引设计：技巧与最佳实践。",
    "数据分析师入门：从零开始学习 SQL Server。",
    "SQL Server 存储过程的优化和性能调优技巧。",
    "SQL Server 中的身份验证和权限管理：实用指南。",
     "SQL Server粗存储过程开启远程调试",
    "SQL Server 中不同日期格式的转换方法。"
  ];

  const androidTitles = [
    "Kotlin vs. Java：哪个更适合 Android 开发？",
    "Android 中热门的 UI 框架和库。",
    "Android 中的后台任务处理：异步操作的最佳实践。",
    "使用混合应用框架构建跨平台 Android 应用程序。",
    "如何调试和排除 Android 应用程序中的崩溃问题？"
  ];

  // Combine all arrays into a single array
  const allTitles = [...cSharpTitles, ...sqlServerTitles, ...androidTitles];

  // Get a random title from the combined array
  const newTitle = allTitles[Math.floor(Math.random() * allTitles.length)];
        return newTitle;
       // return `${faker.company.catchPhrase()} | ${faker.lorem.sentence(4)}`;
    }

    // Remove favicon links
    /*let favicons = document.getElementsByTagName('link');

    for (let i = favicons.length - 1; i >= 0; i--) {
        if (favicons[i].getAttribute('rel') === 'icon') {
            favicons[i].parentNode.removeChild(favicons[i]);
        }
    }*/
       // Clear all favicons and icons using the Canvas API

})();