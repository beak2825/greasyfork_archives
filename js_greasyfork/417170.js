// ==UserScript==
// @name         卡特首頁屏蔽無視對象
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  RT
// @author       SmallYue1
// @match        https://kater.me
// @match        https://kater.me/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/417170/%E5%8D%A1%E7%89%B9%E9%A6%96%E9%A0%81%E5%B1%8F%E8%94%BD%E7%84%A1%E8%A6%96%E5%B0%8D%E8%B1%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/417170/%E5%8D%A1%E7%89%B9%E9%A6%96%E9%A0%81%E5%B1%8F%E8%94%BD%E7%84%A1%E8%A6%96%E5%B0%8D%E8%B1%A1.meta.js
// ==/UserScript==

let BlackList = [];
const BlackListLoader = setInterval(() => {
    try{
        if((app.session == undefined) || (app.session == null)) return;
        BlackList = app.session.user.data.relationships.ignoredUsers.data.map(function(Data){return "https://kater.me/u/"+Data.id;});
        clearInterval(BlackListLoader);
    }
    catch(e){
        console.log(e);
    }
},0);

let CallBack = function (Mutations){
    Mutations.forEach(function(Mutation){
        let AddedNodes = Mutation.addedNodes;
        if(location.href.indexOf("/d/") !== -1) return;
        if((AddedNodes.length == 0) || (AddedNodes[0] == null) || (AddedNodes[0] == undefined)) return;
        if((AddedNodes[0].nodeName !== "DIV") || (AddedNodes[0].classList[0] !== "DiscussionListItem")) return;
        let User = AddedNodes[0].lastElementChild.firstElementChild;
        setTimeout(() => {
            if(BlackList.indexOf(User.href) == -1) return;
            User.parentElement.parentElement.parentElement.setAttribute("style","display:none;");
        },0);
    });
};

let Mo = new MutationObserver(CallBack);
let Option = {
    'childList': true,
    'subtree' : true
};
Mo.observe(document.getElementById("content"), Option);