// ==UserScript==
// @name         inoreader full in iframe
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fixed https://greasyfork.org/en/scripts/441956-inoreader-full - inoreader full content in iframe  (需要配合辅助插件修改响应头,允许跨域iframe展示,例如 ignore-x-frame-headers 在tagArr,数组添加想要注入脚本文件夹名)
// @author       henryxrl
// @match        https://www.inoreader.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inoreader.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511931/inoreader%20full%20in%20iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/511931/inoreader%20full%20in%20iframe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const tagArr=['feeddd-wechat-rss','github']//允许跨域的文件夹名放这里
    function includesTags(){
        const firstTag=document.querySelector('.article_tags').firstChild.textContent
        return tagArr.includes(firstTag)
    }
    let lastUrl
    setInterval(interval,500)
    function interval(){

        const articleTitle=document.querySelector('.article_title ')
        if(!articleTitle) {
            lastUrl = undefined
            return
        }
        const articleLocation=document.querySelector('.article_title a')
        const articleUrl=articleLocation.href

        if (articleLocation.protocol !== 'https:') {
            articleLocation.protocol = 'https';
        }

        const articleArr = document.querySelector('#reader_pane').querySelectorAll('.article')
        if(lastUrl!=articleUrl){
            lastUrl=articleUrl
            console.log('正在替换iframe:',articleUrl)
            let articleContent=document.querySelector('.article_content')
            const frame=createFrame(articleUrl,articleContent)
            Array.from(articleContent.childNodes).forEach((i)=>articleContent.removeChild(i))
            articleContent.appendChild(frame)
        }else{
            //todo 实时调整下高度?跨域好像不太行
        }
    }
    function getNextArrHeight(element){
        let arr=[]
        let next=element.nextElementSibling
        while (next!=null){
            arr.push(next)
            next=next.nextElementSibling
        }
        return arr.reduce((previousValue, currentValue) => previousValue + currentValue.clientHeight ,0)
    }

    function createFrame(url,articleContent){
        // console.log('click',url)
        const iframeElement = document.createElement(`iframe`);
        iframeElement.className = `articleEmbed`;
        iframeElement.src = url
        iframeElement.style.width="100%";
        iframeElement.style.maxWidth="100%";
        iframeElement.style.height=`calc(100vh - ${getNextArrHeight(articleContent)}px)`;//没啥意义,就先这样吧
        iframeElement.style.height="100vh";
        iframeElement.sandbox="allow-scripts allow-same-origin allow-popups"//用sandbox属性禁止跳转,reddit这种就没办法了
        //iframeElement.security="restricted"//IE的禁止js的功能
        return iframeElement
    }

})();