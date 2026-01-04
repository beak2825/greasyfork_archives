// ==UserScript==
// @name         inoreader full
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  inoreader full content in iframe(需要配合辅助插件修改响应头,允许跨域iframe展示,例如 ignore-x-frame-headers 在tagArr,数组添加想要注入脚本文件夹名
// @author       You
// @match        https://www.inoreader.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inoreader.com
// @grant        none
// @license           Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/441956/inoreader%20full.user.js
// @updateURL https://update.greasyfork.org/scripts/441956/inoreader%20full.meta.js
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

        //增加点击即开
        onclick()

        const articleTitle=document.querySelector('.article_title ')
        if(!articleTitle||!includesTags()) {
            lastUrl = undefined
            return
        }
        const articleUrl=document.querySelector('.article_title a').href
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
        return arr.reduce(  (previousValue, currentValue) => previousValue + currentValue.clientHeight ,0)
    }

    function createFrame(url,articleContent){
        console.log('click',url)
        const iframeElement = document.createElement(`iframe`);
        iframeElement.className = `articleEmbed`;
        iframeElement.src = url
        iframeElement.style.width="100%";
        iframeElement.style.height=`calc(100vh - ${getNextArrHeight(articleContent)}px)`;//没啥意义,就先这样吧
        iframeElement.style.height="100vh";
        iframeElement.sandbox="allow-scripts allow-same-origin allow-popups"//用sandbox属性禁止跳转,reddit这种就没办法了
        //iframeElement.security="restricted"//IE的禁止js的功能
        return iframeElement
    }
    function onclick(){
        const articleArr = document.querySelector('#reader_pane').querySelectorAll('.ar')
        articleArr.forEach((i)=>{
            if(!i.querySelector('.myClickButton')){
                const title=i.querySelector('.article_header_title').textContent
                const div=document.createElement('div')
                div.style.width="100px"
                div.style.height=i.clientHeight+"px"
                const blank=document.createElement('div')
                blank.textContent=" "
                blank.style.width="100%"
                blank.style.height="10%"

                const a=document.createElement('a')
                a.type="button"
                a.classList.add("myClickButton");
                a.href=i.querySelector('a').href
                a.target="_blank"
                const a2=document.createElement('button')
                a2.textContent='open'
                a2.style.width="100%"
                a2.style.height="40%"
                a.appendChild(a2)
                //a.onclick=()=>window.open(i.querySelector('a').href)
//                 a.addEventListener('mousedown', ()=>{
//                     if (event.button == 0) {
//                         console.log("鼠标左键!")
//                         window.open(i.querySelector('a').href)
//                     }else if (event.button == 2){
//                         console.log("鼠标右键!");
//                         const test=document.createElement('a')
//                         test.href=i.querySelector('a').href
//                         const middleClick = new MouseEvent("click", { "button": 1, "which": 4 });
//                         test.dispatchEvent(middleClick);
//                     }else if(event.button == 1){

//                         console.log("鼠标滚轮!");

//                     }
//                 })

                const button=document.createElement('button')
                button.textContent='copy'
                button.style.width="100%"
                button.style.height="40%"
                button.onclick=()=>{
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(`[${title}](${i.querySelector('a').href})`);
                    }
                }
                div.appendChild(a)
                div.appendChild(blank)
                div.appendChild(button)
                i.firstElementChild.appendChild(div)
            }
        })
    }

})();