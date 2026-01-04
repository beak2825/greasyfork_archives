// ==UserScript==
// @name         自动展开百度文库内容
// @description  先点下面这问号👇？👇，查看教材安装相应浏览器的插件再安装本脚本
// @namespace    百度文库
// @author       LiHaoMing
// @version      1.4
// @match        https://wenku.baidu.com/view/*
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
 
// @license      MIT License
// @contributionURL    
// @contributionAmount 1￥
// @downloadURL https://update.greasyfork.org/scripts/424736/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/424736/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
 


(function () {
 
    setTimeout(() => {

if(document.querySelector('.pay-text-link-container'))return
        if(document.querySelector('.fold-page-text')){    //判断是否存在
           document.querySelector('.fold-page-text').click();

        }
    
 },1000)
    
})();//立即运行