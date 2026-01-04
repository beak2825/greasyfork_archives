// ==UserScript==
// @name         csdn清爽版,删除大部分无用的功能，专注于预览文章
// @description  先点下面这问号👇？👇，查看教材安装相应浏览器的插件再安装本脚本
// @namespace    csdn
// @author       LiHaoMing
// @version      1.14
// @match        https://blog.csdn.net/*
// @license      MIT License
// @contributionURL    
// @contributionAmount 1￥
// @downloadURL https://update.greasyfork.org/scripts/444128/csdn%E6%B8%85%E7%88%BD%E7%89%88%2C%E5%88%A0%E9%99%A4%E5%A4%A7%E9%83%A8%E5%88%86%E6%97%A0%E7%94%A8%E7%9A%84%E5%8A%9F%E8%83%BD%EF%BC%8C%E4%B8%93%E6%B3%A8%E4%BA%8E%E9%A2%84%E8%A7%88%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/444128/csdn%E6%B8%85%E7%88%BD%E7%89%88%2C%E5%88%A0%E9%99%A4%E5%A4%A7%E9%83%A8%E5%88%86%E6%97%A0%E7%94%A8%E7%9A%84%E5%8A%9F%E8%83%BD%EF%BC%8C%E4%B8%93%E6%B3%A8%E4%BA%8E%E9%A2%84%E8%A7%88%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==
 
 
 
(function () {
 
    setTimeout(() => {
 let aside = document.querySelector('.blog_container_aside'),
 main = document.querySelector('main')
//if(document.querySelector('.pay-text-link-container'))return
console.log(aside)
console.log(main)
        if(aside){    //判断是否存在
           aside.remove();
           main.style.float = 'unset';
           main.style.margin = 'auto';
 
        }
    
 },1000)
    
})();//立即运行