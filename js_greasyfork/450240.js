// ==UserScript==
// @name         更好的知乎
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  改造知乎，包括：去掉重定向，去掉赞赏、一键复制代码块。
// @author       Ihurryup
// @match        https://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @license      AGPL
// @note         2022-08-30  0.1.4  优化逻辑，修复bug
// @note         2022-08-29  0.1.3  添加代码一键复制功能
// @downloadURL https://update.greasyfork.org/scripts/450240/%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/450240/%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

const debug = true



function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');

    if (!styleElement) {
         styleElement = document.createElement('style');
         styleElement.type = 'text/css';
         styleElement.id = 'styles_js';
         document.getElementsByTagName('head')[0].appendChild(styleElement);
     }
     styleElement.appendChild(document.createTextNode(newStyle));
}


function clearRediction(elt){
        if(elt === null || elt === undefined){
            elt = document
        }

        for(link of elt.querySelectorAll("a.external")) {
            var href = link.href
            var res = href.match("https?://link.zhihu.com/\\?target=(.+)")
            if(res != null) {
                link.href = decodeURIComponent(res[1])
            }
        }
        for(link of elt.querySelectorAll("a.LinkCard")){
            var href = link.href
            var res = href.match("https?://link.zhihu.com/\\?target=(.+)")
            if(res != null) link.href = decodeURIComponent(res[1])
        }
        for(let pre of elt.querySelectorAll("div.highlight>pre")){
            if(pre.lastChild.tagName !== "DIV"){
                let btn = document.createElement("div")
                btn.className="hljs-btn"
                btn.setAttribute("data-title","复制")
                btn.onclick=function(){
                    let text = pre.innerText
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(text)
                        btn.setAttribute("data-title","已成功复制")
                    }
                    setTimeout(function(){
                        btn.setAttribute("data-title","复制")
                    },3500)
                }
                pre.appendChild(btn)
            }
        }
        for(let latex of elt.querySelectorAll("ztext-math")){
            latex.ondblclick = function(){
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(latex.getAttribute("data-tex"))
                    //btn.setAttribute("data-title","已成功复制")
                }
            }
        }
    }

function topTime(elt){
    if(elt === null || elt === undefined){
        elt = document
    }
    else{
        let flag = false
        for(cls of [".ContentItem",".Post-Main"]){
            let r = elt.closest(cls)
            if(r === null || r === undefined){
                continue
            }
            else{
                elt = r
                flag = true
                break
            }
        }
        if(!flag){
            return
        }
    }
    let time = elt.querySelector("div.ContentItem-time")
    time.remove()

    if(elt.querySelector("div.ContentItem-time") == null){
        let target = null
        for(cls of ["span.Voters",".Post-Header",".ContentItem-meta",".SearchItem-meta"]){
            target = elt.querySelector(cls)
            if(target !== null && target !== undefined){
                break
            }
        }
        if(target !== null && target!== undefined){
            target.appendChild(time)

        }
    }
}
function checkSearch(){
    let d = document.querySelector("div.SearchNoContent-wrap")
    if(d != null){
        let a = document.createElement("a")
        let query_content = getQueryVariable("q")
        if(query_content){
            let query_c = decodeURIComponent(query_content)
            query_c = query_c + " site:zhihu.com"
            a.href = "https://www.baidu.com/s?wd=" + encodeURIComponent(query_c)
            a.innerText = "尝试用百度搜索知乎内容"
            d.appendChild(a)
        }
        return ;
    }
}


(function() {
    'use strict';


    let targetNode = document.querySelector("div.SearchMain")
    if(targetNode != null){
        const config = {childList: true ,subtree : true };
        const callback = function(mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if(mutation.addedNodes.length > 0 ){
                        let node = mutation.addedNodes[0]
                        if(node.className == "SearchNoContent-wrap"){
                            checkSearch()
                        }
                        if(node.className.search("RichText") > -1) {
                            if(debug) console.log("开始处理",node)
                            clearRediction(node)
                            topTime(node)
                        }
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
    else{
        let targetNode = document.querySelector("main.App-main")
        if(targetNode != null){
            const config = {childList: true ,subtree : true };
            const callback = function(mutationsList, observer) {
                // Use traditional 'for loops' for IE 11
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        if(mutation.addedNodes.length > 0 ){
                            let node = mutation.addedNodes[0]
                            if(debug) console.log("开始处理",node)
                            clearRediction(node)
                            if(node.className.search("ContentItem-actions") > -1)topTime(node)
                            else if(node.className.search("RichContent-inner") > -1) topTime(node)
                        }
                    }
                }
            };
            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        }
        clearRediction()
    }
    addNewStyle(" div.Reward { display: none; } ")//去赞赏
    addNewStyle(".hljs-btn{\
    display: none;\
    position: absolute;\
    right: 4px;\
    top: 4px;\
    font-size: 12px;\
    color: #ffffff;\
    background-color: #9999AA;\
    padding: 2px 8px;\
    margin: 8px;\
    border-radius: 4px;\
    cursor: pointer;\
    box-shadow: 0 2px 4px rgb(0 0 0 / 5%), 0 2px 4px rgb(0 0 0 / 5%);\
}\
.hljs-btn:after{content: attr(data-title)}\
div.highlight:hover .hljs-btn{display: block}\
div.highlight{position:relative; overflow-x: auto;}\
")
    for(let richText of document.querySelectorAll("div.ContentItem-time")){
        topTime(richText)
    }
    for(let pre of document.querySelectorAll("div.highlight>pre")){
        let btn = document.createElement("div")
        btn.className="hljs-btn"
        btn.setAttribute("data-title","复制")
        btn.onclick=function(){
            let text = pre.innerText
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text)
                btn.setAttribute("data-title","已成功复制")
            }
            setTimeout(function(){
                btn.setAttribute("data-title","复制")
            },3500)
        }
        pre.appendChild(btn)
    }

})();