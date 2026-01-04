// ==UserScript==
// @name         B站阿瓦隆检测工具
// @namespace    https://github.com/XiaoMiku01/check-awl
// @supportURL   https://github.com/XiaoMiku01/check-awl
// @version      0.1.6
// @description  用于检查评论是否被阿瓦隆拦截屏蔽
// @author       晓轩iMIKU
// @license MIT
// @compatible   chrome 80 or later
// @compatible   edge 80 or later
// @compatible   firefox 74 or later
// @compatible   safari 13.1 or later
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439770/B%E7%AB%99%E9%98%BF%E7%93%A6%E9%9A%86%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/439770/B%E7%AB%99%E9%98%BF%E7%93%A6%E9%9A%86%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
class XMLHttp {
    request = function (param) { };
    response = function (param) { };
}
let http = new XMLHttp();
//拦截XMLHttpRequest
function initXMLHttpRequest() {
    let open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
        let send = this.send;
        let _this = this;
        let post_data = [];
        this.send = function (...data) {
            post_data = data;
            return send.apply(_this, data);
        };
        // 请求前拦截
        http.request(args);

        this.addEventListener(
            "readystatechange",
            function () {
                if (this.readyState === 4) {
                    let config = {
                        url: args[1],
                        status: this.status,
                        method: args[0],
                        data: post_data,
                    };
                    // 请求后拦截
                    http.response({ config, response: this.response });
                }
            },
            false
        );
        return open.apply(this, args);
    };
}
(function () {
    'use strict';
    http.response = function (res) {
        if (res.config.url.includes("/x/v2/reply/add")) {
            let oid = res.config.data[0].match(/oid=(\d+)/)[1];
            setTimeout(() => {
                chick(res.response, oid)
            }, 1000);
        }
    };
    initXMLHttpRequest();

   async function chick(response_str, oid) {
        let response_json = JSON.parse(response_str)
        if (response_json.data.reply.state != 0) {
            copy_delete_reply(response_json, oid);
        }
        else {
            const flags =  await check_reply(response_json, oid)
            if (flags === true) return
            copy_delete_reply(response_json, oid);
        }
    }

function check_reply(response_json, oid) {
        let api = "https://api.bilibili.com/x/v2/reply/jump";
        let type = response_json.data.reply.type;
        // let oid = response_json.data.reply.oid;
        let rpid = response_json.data.reply.rpid;
        let url = `${api}?type=${type}&oid=${oid}&rpid=${rpid}`;
        let flags = new Promise((resolve, reject) => {
            fetch(url, {
                method: 'GET',
            }).then(res => res.json()).then(res => {
                var temp = false
                res.data.replies.forEach(reply => {
                    if (reply.rpid == rpid) temp = true;
                    else if (reply.replies != null) {
                        reply.replies.forEach(reply => {
                            if (reply.rpid == rpid) temp = true;
                        })
                    }
                })
            resolve(temp);
            })
        });
        return flags;
    }

    function copy_delete_reply(response_json, oid) {
        let r = confirm(`你的评论：\n${response_json.data.reply.content.message}\n被阿瓦隆屏蔽了,点击确定复制并删除\n(长评论小作文可能要过审才能显示，建议小作文显示被屏蔽点取消！！)`);
        if (r) {
            let api = "https://api.bilibili.com/x/v2/reply/del";
            let type = response_json.data.reply.type;
            // let oid = response_json.data.reply.oid;
            let rpid = response_json.data.reply.rpid;
            let csrf = document.cookie.match(/bili_jct=([^;]+)/)[1];
            fetch(api, {
                method: 'POST',
                body: `type=${type}&oid=${oid}&rpid=${rpid}&csrf=${csrf}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: "include"
            }).then(() => {
                navigator.clipboard.writeText(response_json.data.reply.content.message).then(() => {
                    setTimeout(() => {
                        document.getElementsByClassName('hot-sort')[0].click();
                        setTimeout(() => {
                            document.getElementsByClassName('new-sort')[0].click();
                        }, 250);
                    }, 500);
                })
            })
        }
    }
})();