// ==UserScript==
// @name         bilibili reply-location enable
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  哔哩哔哩网页端视频评论显示ip属地
// @author       wyh00040
// @license	MIT
// @match         *://www.bilibili.com/video/av*
// @match         *://www.bilibili.com/video/BV*
// @match         *://www.bilibili.com/list/*
// @match         *://www.bilibili.com/bangumi/play/ep*
// @match         *://www.bilibili.com/bangumi/play/ss*
// @match         *://www.bilibili.com/cheese/play/ep*
// @match         *://www.bilibili.com/cheese/play/ss*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494784/bilibili%20reply-location%20enable.user.js
// @updateURL https://update.greasyfork.org/scripts/494784/bilibili%20reply-location%20enable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let root_total = 0;
    const oldEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (...args) {
        return oldEventListener.call(this, ...args);
    };
    let oldFetch = fetch;
    function hookFetch(url, init) {
        if(/\/\/api\.bilibili\.com\/x\/v2\/reply\/wbi\/main\?/.test(arguments[0])){
            return new Promise((resolve, reject) => {
                oldFetch.apply(this, arguments).then((response) => {
                    const oldJson = response.json;
                    response.json = function () {
                        return new Promise((resolve, reject) => {
                            oldJson.apply(this, arguments).then((result) => {
                                setTimeout(()=>{
                                    let res = result;
                                    let reply_items = document.getElementsByClassName("reply-item");
                                    if(res.data.replies.length){
                                        let replies = res.data.replies;
                                        let i = 0;
                                        for(let x in replies){
                                            let root_reply_id = reply_items[i+root_total].children[1].children[0].getAttribute("data-root-reply-id");
                                            if( root_reply_id == replies[i].rpid_str){
                                                let reply_location = document.createElement("span");
                                                reply_location.style = "margin:0 20px 0 0";
                                                reply_location.className = "root-reply-location";
                                                if(replies[i].reply_control.location){
                                                    reply_location.innerHTML = replies[i].reply_control.location;
                                                }else{
                                                    reply_location.innerHTML = "IP属地：未知";
                                                }
                                                reply_items[i+root_total].children[1].getElementsByClassName("reply-time")[0].after(reply_location);
                                                let sub_replies = res.data.replies[i].replies;
                                                let j = 0;
                                                for(let x in sub_replies){
                                                    let sub_reply_location = document.createElement("span");
                                                    sub_reply_location.style = "margin:0 20px 0 0";
                                                    sub_reply_location.className = "sub-reply-location";
                                                    if(sub_replies[j].reply_control.location){
                                                        sub_reply_location.innerHTML = sub_replies[j].reply_control.location;
                                                    }else{
                                                        sub_reply_location.innerHTML = "IP属地：未知";
                                                    }
                                                    reply_items[i+root_total].children[2].getElementsByClassName("sub-reply-time")[j].after(sub_reply_location);
                                                    j++;
                                                }
                                            }
                                            i++;
                                        }
                                        root_total+=i;
                                    }
                                });
                                resolve(result);
                            });
                        });

                    };
                    resolve(response);
                });
            });
        }else if(/\/\/api\.bilibili\.com\/x\/v2\/reply\/reply\?/.test(arguments[0])){
            return new Promise((resolve, reject) => {
                oldFetch.apply(this, arguments).then((response) => {
                    const oldJson = response.json;
                    response.json = function () {
                        return new Promise((resolve, reject) => {
                            oldJson.apply(this, arguments).then((result) => {
                                setTimeout(()=>{
                                    let res = result;
                                    let reply_items = document.getElementsByClassName("reply-item");
                                    if(res.data.replies.length){
                                        let sub_replies = res.data.replies;
                                        let i = 0;
                                        for(let x in reply_items){
                                            let root_reply_id = reply_items[i].children[1].children[0].getAttribute("data-root-reply-id");
                                            if( root_reply_id == res.data.root.rpid_str){
                                                let j = 0;
                                                for(let x in sub_replies){
                                                    if(reply_items[i].children[2].getElementsByClassName("sub-reply-info")[j].getElementsByClassName("sub-reply-location").length == 0){
                                                        let sub_reply_location = document.createElement("span");
                                                        sub_reply_location.style = "margin:0 20px 0 0";
                                                        sub_reply_location.className = "sub-reply-location";
                                                        if(sub_replies[j].reply_control.location){
                                                            sub_reply_location.innerHTML = sub_replies[j].reply_control.location;
                                                        }else{
                                                            sub_reply_location.innerHTML = "IP属地：未知";
                                                        }
                                                        reply_items[i].children[2].getElementsByClassName("sub-reply-time")[j].after(sub_reply_location);
                                                    }
                                                    j++;
                                                }
                                                break;
                                            }
                                            i++;
                                        }
                                    }
                                });
                                resolve(result);
                            });
                        });

                    };
                    resolve(response);
                });
            });
        }else{
            return oldFetch.apply(this, arguments);
        }
    }
    window.fetch = hookFetch;
})();