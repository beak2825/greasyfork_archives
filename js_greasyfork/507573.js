// ==UserScript==
// @name         八桂学习助手
// @namespace    https://greasyfork.org/zh-CN/scripts/507573-%E5%85%AB%E6%A1%82%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B
// @version      2025.11.8
// @match        https://*.gxela.gov.cn/*
// @description  自动学习广西干部网络学院课程脚本；允许分发和使用，但禁止复制、修改、合并。
// @author       Tandent-zz
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/507573/%E5%85%AB%E6%A1%82%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/507573/%E5%85%AB%E6%A1%82%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
        var Info_tooltip = document.createElement('div');
        Info_tooltip.id = 'Info_tooltip';
        Info_tooltip.style.position = 'fixed';
        Info_tooltip.style.top = '50px';
        Info_tooltip.style.right = '50px';
        Info_tooltip.style.width = '210px';
        Info_tooltip.style.height = '260px';
        Info_tooltip.style.backgroundColor = '#f1f1f1';
        Info_tooltip.style.border = '1px solid #ccc';
        Info_tooltip.style.borderRadius = '8px';
        Info_tooltip.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        Info_tooltip.style.zIndex = '1000';
        Info_tooltip.style.padding = '5px';
        Info_tooltip.innerHTML = '为最大限度减少因不同浏览器导致的影响，提高抗干扰能力和运行效率，八桂学习助手已封装为应用程序，无需安装，下载打开即可使用。2025年版【八桂学习助手】11月9日10:08分正式上线，前10名用户使用优惠码：888，购买可享8.88折<hr>' +
                    '<div style="display: inline-flex; align-items: center; white-space: nowrap;margin-right: 2px;margin-left:10px;"><a href="https://www.bgxxzs.us.kg/" target="_blank" style="color: blue; text-decoration: underline;">进入官网</a></div>' +
                    '<div style="display: inline-flex; align-items: center; white-space: nowrap;margin-left:2px;margin-right: 2px;"><a href="https://www.bgxxzs.us.kg/UsingTutorials.html" target="_blank" style="color: blue; text-decoration: underline;">使用教程</a></div>'+
                    '<div style="display: inline-flex; align-items: center; white-space: nowrap;margin-left:2px;margin-right: 2px;"><a href="https://www.bgxxzs.us.kg/manage.html" target="_blank" style="color: blue; text-decoration: underline;">联系管理</a></div><hr>'+
                    '<div style="display: inline-flex; align-items: center; white-space: nowrap;margin-right: 2px;margin-left:10px;"><a href="https://share.feijipan.com/s/RKXBDgPW" target="_blank" style="color: blue; text-decoration: underline;">下载使用</a></div>' ;
        document.body.appendChild(Info_tooltip);
})();