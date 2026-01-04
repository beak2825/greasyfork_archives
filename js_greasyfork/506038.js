// ==UserScript==
// @name         bangumi免登录黑名单
// @namespace    bangumiBlacklistWithoutLogin
// @version      1.4
// @description  as title
// @author       sai
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/506038/bangumi%E5%85%8D%E7%99%BB%E5%BD%95%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/506038/bangumi%E5%85%8D%E7%99%BB%E5%BD%95%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const URL = window.location.href;
    const isTopic = /topic/.test(URL);
    const isGroup = /group/.test(URL);
    const isSubject = /subject/.test(URL);
    const blacklist = GM_getValue("blacklist") === undefined ? [] : GM_getValue("blacklist").split(",");
    function hiddenObj(obj){
        let nodes = document.querySelectorAll(obj);
        if(nodes.length == 0 || blacklist.length == 0) return;
        nodes.forEach(i => {
            if(blacklist.indexOf(i.dataset.itemUser) > -1){
                i.hidden = true;
                console.log(i.dataset.itemUser);
            }
        });
    }
    function applyBlock(){
        hiddenObj(".row_reply");
        hiddenObj(".sub_reply_bg");
        hiddenObj(".postTopic");
    }
    function addNode(nodeName,textContent,attr){
        let node = document.createElement(nodeName);
        if(textContent.length > 0) node.append(document.createTextNode(textContent));
        if(attr.length > 0){
            for(let i = 0;i < attr.length;i += 2){
                node.setAttribute(attr[i],attr[i + 1]);
            }
        }
        return node;
    }
    function addBtn(){
        let moreAction = document.querySelectorAll(".post_actions.re_info > .action.dropdown:last-of-type > ul");
        if(moreAction.length == 0){
            document.querySelectorAll(".post_actions.re_info").forEach(actions => {
                let action = addNode("div","",["class","action dropdown"]);
                let ul = addNode("ul","",[]);
                let a = addNode("a","",["class","icon","href","javascript:void(0);"]);
                let span = addNode("span","...",["class","ico ico_more"]);
                a.append(span);
                action.append(a);
                action.append(ul);
                actions.append(action);
            })
            moreAction = document.querySelectorAll(".post_actions.re_info > .action.dropdown:last-of-type > ul");
        }
        moreAction.forEach(ma => {
            let li = addNode("li","",[]);
            li.appendChild(addNode("a","屏蔽",["href","javascript:void(0);"]));
            li.appendChild(addNode("a","屏蔽数据",["href","javascript:void(0);"]));
            ma.appendChild(li);
        })
        document.addEventListener("click", event => {
            if(event.target.text === "屏蔽"){
                blacklist.push(event.target.closest(".post_actions.re_info").parentElement.dataset.itemUser);
                GM_setValue("blacklist", blacklist.toString());
                applyBlock();
            }
            if(event.target.text === "屏蔽数据"){

            }
        })
    }
    if(isTopic){
        applyBlock();
        addBtn();
    }else if(isGroup || isSubject){
        hiddenObj(".topic_list > tbody > tr");
    }

})();