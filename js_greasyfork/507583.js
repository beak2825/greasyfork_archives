// ==UserScript==
// @name         ShowaipiaxiContent
// @version      0.5
// @description  显示 aipiaxi 全文 而不需要登录和关注
// @author       miccall
// @match        https://www.aipiaxi.com/article-detail/*
// @icon         https://www.aipiaxi.com/xj-pc-web/icon.png
// @grant       none
// @license      MIT
// @namespace aipiaxi
// @downloadURL https://update.greasyfork.org/scripts/507583/ShowaipiaxiContent.user.js
// @updateURL https://update.greasyfork.org/scripts/507583/ShowaipiaxiContent.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("miccall init");

    function showMainContent(){
        const articleContentDiv = document.querySelector('.article-content');
        if (articleContentDiv) {
            articleContentDiv.removeAttribute("style");
        } else {
            console.log('Element not found');
        }
        const xjarticle = document.querySelector('.xj-article')
        if (xjarticle) {
            xjarticle.removeAttribute("style");
        } else {
            console.log('Element not found');
        }
    }

    function addDownloadBtn() {
        console.log('Add button');
        const bottom = document.querySelector('.bottom');
        let btn = document.createElement("button");
        btn.innerHTML = "不关注显示全文";
        btn.onclick = showMainContent;

        if(bottom)
        {
            bottom.firstChild.appendChild(btn);
            console.log('bottom add');
        }
     }

    function showMainContent2(){
        const xjarticle = document.querySelector('.xj-article');
        const container = document.querySelector('.article-body-container');
        const Body = document.querySelector('.body');
        if (Body) {
            Body.removeAttribute("style");
        } else {
            console.log('Element not found');
        }
        if (container && xjarticle)
        {
            console.log('xjarticle',xjarticle);
            console.log('container',container);
            container.appendChild(xjarticle);
        }
    }

    setTimeout(()=>{
        showMainContent();
        showMainContent2();
        addDownloadBtn();
      },2000)
})();