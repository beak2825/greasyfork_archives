// ==UserScript==
// @name         B站阿瓦隆检测工具2
// @namespace    https://github.com/XiaoMiku01/check-awl
// @supportURL   https://github.com/XiaoMiku01/check-awl
// @version      0.1.6
// @description  用于检查评论是否被阿瓦隆拦截屏蔽
// @author       晓轩iMIKU-原作 带鱼-改
// @license MIT
// @compatible   chrome 80 or later
// @compatible   edge 80 or later
// @compatible   firefox 74 or later
// @compatible   safari 13.1 or later
// @match        *://*.bilibili.com/*
// @match        *://*.hdslb.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512755/B%E7%AB%99%E9%98%BF%E7%93%A6%E9%9A%86%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B72.user.js
// @updateURL https://update.greasyfork.org/scripts/512755/B%E7%AB%99%E9%98%BF%E7%93%A6%E9%9A%86%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B72.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
        const fetchPromise = originalFetch.apply(this, args);

        // 检查请求的 URL 是否包含 '/x/v2/reply/add'
        if (args[0].includes('/x/v2/reply/add')) {
            fetchPromise.then(async response => {
                const clone = response.clone(); // 克隆响应，以便后续读取
                const resText = await clone.text();
                //console.log('/x/v2/reply/add!');
                let oid = '';
                if (args[1] && args[1].body) {
                    const formData = new URLSearchParams(args[1].body);
                    oid = formData.get('oid');
                }
                //console.log('oid=', oid, 'response=', resText);
                setTimeout(() => {
                    check(resText, oid)
                }, 1000);
            }).catch(error => {
                console.error('Fetch error:', error);
            });
        }

        return fetchPromise;
    };

    // 检查评论状态
    async function check(response_str, oid) {
        let response_json = JSON.parse(response_str);
        if (response_json.data.reply.state !== 0) {
            copy_delete_reply(response_json, oid);
        } else {
            const exists = await check_reply(response_json, oid);
            if (exists === true) return;
            copy_delete_reply(response_json, oid);
        }
    }

    // 验证评论是否存在
    function check_reply(response_json, oid) {
        let api = "https://api.bilibili.com/x/v2/reply/jump";
        let type = response_json.data.reply.type;
        let rpid = response_json.data.reply.rpid;
        let url = `${api}?type=${type}&oid=${oid}&rpid=${rpid}`;
        return fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit', // 不携带cookie，模拟未登录用户
            headers: {
                // 不要添加'priority'等自定义请求头
                // 浏览器会自动添加标准的请求头
            },
            referrer: document.referrer || window.location.href,
            referrerPolicy: 'no-referrer-when-downgrade'
        }).then(res => res.json()).then(res => {
            // 处理响应
            let exists = false;
            if (res.data && res.data.replies) {
                res.data.replies.forEach(reply => {
                    if (reply.rpid === rpid) {
                        exists = true;
                    } else if (reply.replies) {
                        reply.replies.forEach(subReply => {
                            if (subReply.rpid === rpid) {
                                exists = true;
                            }
                        });
                    }
                });
            }
            return exists;
        }).catch(error => {
            console.error('Check reply error:', error);
            return false;
        });
    }

    // 提示用户删除被屏蔽的评论
    function copy_delete_reply(response_json, oid) {
        let message = response_json.data.reply.content.message;
        let confirmDelete = confirm(`你的评论：\n${message}\n被阿瓦隆屏蔽了，点击确定复制并删除\n(长评论小作文可能要过审才能显示，建议小作文显示被屏蔽点取消！！)`);
        if (confirmDelete) {
            let api = "https://api.bilibili.com/x/v2/reply/del";
            let type = response_json.data.reply.type;
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
                navigator.clipboard.writeText(message).then(() => {
                    setTimeout(() => {
                        document.getElementsByClassName('hot-sort')[0].click();
                        setTimeout(() => {
                            document.getElementsByClassName('new-sort')[0].click();
                        }, 250);
                    }, 500);
                });
            });
        }
    }
})();