// ==UserScript==
// @name         v2ex unread
// @name:zh-CN   v2ex 标记未读 新回复
// @namespace    https://github.com/axipo/v2exUnread
// @version      0.3
// @description  add unread mark for **visited** post of v2ex.com
// @description:zh-CN 给v2ex增加未读标记的油猴脚本
// @author       axipo
// @match        https://*.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411724/v2ex%20unread.user.js
// @updateURL https://update.greasyfork.org/scripts/411724/v2ex%20unread.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(location.pathname === '/' || location.pathname === '/my/topics'){
        // read visit log
        let containers = document.querySelectorAll("#Main .topic_info");
        containers = Array.prototype.slice.apply(containers);
        let links = document.querySelectorAll("#Main .topic-link");
        links = Array.prototype.slice.apply(links);
        let replies = links.map(link => /#reply(\d+)/.exec(link.href)[1]);
        let postIds = links.map(link => /\/t\/([0-9]+)/.exec(link.href)[1]);
        containers.forEach((container, index) => {
            if(!replies[index]){
                return
            }
            let oldReply = localStorage.getItem('post' + postIds[index])
            oldReply = parseInt(oldReply ? oldReply : 0)
            if(!oldReply){
                return
            }
            let recentReply = replies[index] - oldReply
            if(!recentReply){
                return
            }
            let span = document.createElement('span')
            span.innerText = recentReply + ' new'
            span.style = `
                margin: 0 0.5rem;
                color: white;
                background-color: #f56c6c;
                padding: 0px 6px;
                border-radius: 6px / 50%;
                font-weight: bold;
            `
            container.appendChild(span)
        })
        return
    }

    var regRes = /\/t\/([0-9]+)$/.exec(location.pathname);


    if(regRes){
        let postId = regRes[1]
        let text = document.querySelector("#Main > .box:nth-child(4) > .cell:nth-child(1)").innerText;
        let recentReply = /(\d+) 条回复/.exec(text)[1];
        localStorage.setItem('post' + postId, recentReply);
    }
})();