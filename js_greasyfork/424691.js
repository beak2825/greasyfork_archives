// ==UserScript==
// @name         进入b站直接跳到热门
// @description  先点下面这问号👇？👇，查看教材安装相应浏览器的插件再安装本脚本
// @namespace    bilibili
// @author       LiHaoMing
// @version      1.14
// @match        https://www.bilibili.com/
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
 
// @license      MIT License
// @contributionURL    
// @contributionAmount 1￥
// @downloadURL https://update.greasyfork.org/scripts/424691/%E8%BF%9B%E5%85%A5b%E7%AB%99%E7%9B%B4%E6%8E%A5%E8%B7%B3%E5%88%B0%E7%83%AD%E9%97%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/424691/%E8%BF%9B%E5%85%A5b%E7%AB%99%E7%9B%B4%E6%8E%A5%E8%B7%B3%E5%88%B0%E7%83%AD%E9%97%A8.meta.js
// ==/UserScript==
 
(function () {
 
        if (document.querySelector('.con')) {    //判断是否存在
           document.querySelector('.con').children[2].children[0].click();
        }
    
 
    
})();//立即运行