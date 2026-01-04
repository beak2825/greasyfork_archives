// ==UserScript==
// @name         CC98 显示用户风评
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在查看帖子时的用户信息栏内显示用户风评
// @author       Q&A
// @match        https://www.cc98.org/topic/*
// @icon         https://www.cc98.org/static/98icon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      api.cc98.org
// @downloadURL https://update.greasyfork.org/scripts/470191/CC98%20%E6%98%BE%E7%A4%BA%E7%94%A8%E6%88%B7%E9%A3%8E%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/470191/CC98%20%E6%98%BE%E7%A4%BA%E7%94%A8%E6%88%B7%E9%A3%8E%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let dom = document.getElementsByClassName("column userMessage-left");
    let event = new Event('loaded');
    addEventListener("loaded",(event)=>{
        //console.log(dom.length);
        let uids = [];
        Array.from(dom).forEach((item)=>{
            if(item.childNodes[0].tagName!="A") {
                return;
            }
            let uid = item.childNodes[0].href.split("/").slice(-1)[0];
            uids.push(uid);
        });
        let user_info_url = "https://api.cc98.org/user?id="+uids.join("&id=");
        //console.log(uids);
        //console.log(user_info_url);
        function createNode(htmlStr) {
            var div = document.createElement("div");
            div.innerHTML = htmlStr;
            return div.childNodes[0];
        }
        GM_xmlhttpRequest({
            method: "get",
            url: user_info_url,
            onload: function(res){
                //console.log(res);
                let data = JSON.parse(res.response);
                //console.log(data);
                let uid_pops = {};
                data.forEach((item,idx)=>{
                    uid_pops[`${item.id}`] = item.popularity;
                });
                Array.from(dom).forEach((item)=>{
                    if(item.childNodes[0].tagName!="A") {
                        return;
                    }
                    let uid = item.childNodes[0].href.split("/").slice(-1)[0];
                    let pop = uid_pops[uid];
                    if(pop == undefined) {
                        return;
                    }
                    let info = item.childNodes[1];
                    if(info.childElementCount==5) {
                        return;
                    }
                    info.insertBefore(createNode(`<div class="userMessageOpt">风评 ${pop}</div>`),info.childNodes[3]);
                });
            }
        });
    });
    let last_len = 0;
    setInterval(()=>{
        let len = dom.length;
        if(len>0&&len!=last_len) {
            dispatchEvent(event);
        }
        last_len = len;
    }, 1);
})();