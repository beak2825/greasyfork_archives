// ==UserScript==
// @name         bilibili reply-location enable
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  哔哩哔哩网页端视频评论显示ip属地
// @author       wyh00040
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

(function () {
    'use strict';
    let regex_main_url = new RegExp("//api.bilibili.com/x/v2/reply/wbi/main?");
    let regex_reply_url = new RegExp("//api.bilibili.com/x/v2/reply/reply?");
    let root_total = 0;
    const oldEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (...args) {
        return oldEventListener.call(this, ...args);
    };
    let oldFetch = fetch;
    function hookFetch(url, init) {
        let path = arguments[0];
        if (regex_main_url.test(path)) {
            console.log("get main")
            return new Promise((resolve, reject) => {
                oldFetch.apply(this, arguments).then((response) => {
                    const oldJson = response.json;
                    response.json = function () {
                        return new Promise((resolve, reject) => {
                            oldJson.apply(this, arguments).then((result) => {
                                setTimeout(() => {
                                    let bili_comments = document.getElementsByTagName("bili-comments")[0];
                                    let feeds = bili_comments.shadowRoot.getElementById("feed").children;
                                    let replies = result.data.replies;
                                    if (replies.length) {
                                        if(result.data.cursor.is_begin) root_total = 0;
                                        let i = 0;
                                        for (let x in replies) {
                                            feeds[i + root_total].setAttribute("rpid", replies[i].rpid);
                                            let comment = feeds[i + root_total].shadowRoot.getElementById("comment");
                                            let sub_replies;
                                            let reply_location = document.createElement("div");
                                            reply_location.id = "location";
                                            reply_location.innerHTML = "IP属地：未获取";
                                            if (replies[i].reply_control.location) {
                                                reply_location.innerHTML = replies[i].reply_control.location;
                                            }
                                            comment.shadowRoot.getElementById("footer").children[0].shadowRoot.getElementById("pubdate").after(reply_location);
                                            sub_replies = replies[i].replies;
                                            let j = 0;
                                            for (let x in sub_replies) {
                                                let expander_contents = feeds[i + root_total].shadowRoot.getElementById("replies").children[0].shadowRoot.getElementById("expander-contents");
                                                let sub_reply_location = document.createElement("div");
                                                sub_reply_location.id = "location";
                                                sub_reply_location.innerHTML = "IP属地：未获取";
                                                if (sub_replies[j].reply_control.location) {
                                                    sub_reply_location.innerHTML = sub_replies[j].reply_control.location;
                                                }
                                                expander_contents.children[j].shadowRoot.getElementById("footer").children[0].shadowRoot.getElementById("pubdate").after(sub_reply_location);
                                                j++;
                                            }
                                            i++;
                                        }
                                        root_total += i;
                                    }
                                });
                                resolve(result);
                            });
                        });

                    };
                    resolve(response);
                });
            });
        } else if (regex_reply_url.test(path)) {
            console.log("get reply")
            return new Promise((resolve, reject) => {
                oldFetch.apply(this, arguments).then((response) => {
                    const oldJson = response.json;
                    response.json = function () {
                        return new Promise((resolve, reject) => {
                            oldJson.apply(this, arguments).then((result) => {
                                setTimeout(() => {
                                    let bili_comments = document.getElementsByTagName("bili-comments")[0];
                                    let feeds = bili_comments.shadowRoot.getElementById("feed").children;
                                    let replies = result.data.replies;
                                    if (replies.length) {
                                        let i = 0;
                                        for (let x in feeds) {
                                            let expander_contents = feeds[i].shadowRoot.getElementById("replies").children[0].shadowRoot.getElementById("expander-contents");
                                            if (feeds[i].getAttribute("rpid") == result.data.root.rpid) {
                                                if (result.data.page.count > 10) feeds[i].shadowRoot.getElementById("replies").children[0].shadowRoot.getElementById("pagination-foot").innerHTML = "";
                                                let sub_replies = replies;
                                                let j = 0;
                                                for (let x in sub_replies) {
                                                    if (!expander_contents.children[j].shadowRoot.getElementById("footer").children[0].shadowRoot.getElementById("location")) {
                                                        let sub_reply_location = document.createElement("div");
                                                        sub_reply_location.id = "location";
                                                        sub_reply_location.innerHTML = "IP属地：未获取";
                                                        if (sub_replies[j].reply_control.location) {
                                                            sub_reply_location.innerHTML = sub_replies[j].reply_control.location;
                                                        }
                                                        expander_contents.children[j].shadowRoot.getElementById("footer").children[0].shadowRoot.getElementById("pubdate").after(sub_reply_location);
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
        } else {
            return oldFetch.apply(this, arguments);
        }
    }
    window.fetch = hookFetch;
})();