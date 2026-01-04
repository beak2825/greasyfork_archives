// ==UserScript==
// @name         CC98 浏览助手
// @namespace    http://tampermonkey.net/
// @version      2024-05-05
// @description  折叠灌水回复 & 隐藏用户名
// @author       @日落北岛
// @match        https://www.cc98.org/*
// @match        www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @icon         https://www.cc98.org/static/images/default_avatar_boy.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493964/CC98%20%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493964/CC98%20%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

const rootObserverForUsername = new MutationObserver(function(mutations, observer) {
    const usernameNode = document.getElementsByClassName("topBarUserName")[0];
    if (usernameNode) {
        usernameNode.innerHTML = "CC98用户";
        observer.disconnect();
    }
});
// 开始监视整个 body 以便捕获元素的添加
rootObserverForUsername.observe(document.getElementById("root"), { childList: true, subtree: true });

const judgeReply = function (content) {
    let s=content
    const stopWords=["bd","BD","Bd","cy","hk","mo","lz","sy","sf","qlxw","qlx5","qlx5l","帮顶","插眼"," ",",",".","，","。","!","！","?","？","\n"]
    for (const stopWord of stopWords){
        s=s.replaceAll(stopWord, "");
    }
    return s;
}

const getContent= function(article){
    let nodes=article.childNodes;
    let content="";
    for(let node of nodes){
        if(node.nodeType===Node.ELEMENT_NODE && node.tagName==="DIV" && (!node.getAttribute("style")))continue;
        if(node.nodeType===Node.TEXT_NODE)content+=node.textContent
        else content+=node.innerText
    }
    return content
}

const rootObserverForContent = new MutationObserver(function(mutations, observer) {
    // console.log(mutations)
    const replyNodes = document.querySelectorAll(".reply");
    if (replyNodes) {
        for(let reply of replyNodes){
            if(reply.hasAttribute("processed"))continue
            reply.setAttribute("processed","true")
            const article=reply.querySelector("article")
            let floor=reply.querySelector(".reply-floor").innerText
            const replyId=reply.id
            if(!floor)floor=replyId
            let content=getContent(article)
            if (judgeReply(content) || article.getElementsByClassName("visibleImage").length)continue
            else{
                reply.hidden="true"
                let hintElement = document.createElement('div');
                hintElement.textContent = floor+' 楼已被折叠，点击显示';
                hintElement.setAttribute("replyId",replyId)
                hintElement.addEventListener('click', function(){
                    document.getElementById(this.getAttribute("replyId")).hidden=false
                    hintElement.hidden=true
                })
                console.log(floor+' 楼已被折叠')
                observer.disconnect()
                reply.insertAdjacentElement('afterend', hintElement);
                observer.observe(document.getElementById("root"), { childList: true, characterData: true, subtree: true })
            }
        }
        //observer.disconnect();
    }
});

if (window.location.pathname.includes('/topic')){
    rootObserverForContent.observe(document.getElementById("root"), { childList: true, characterData: true, subtree: true });
}
})();