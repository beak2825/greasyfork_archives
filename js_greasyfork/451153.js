
// ==UserScript==
// @name         B贴
// @namespace    cjwdddp
// @version      0.1
// @description  给b站用户贴上友好的标签,部分参考了原神玩家指示器
// @author       超级无敌大电炮
// @match        https://www.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451153/B%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/451153/B%E8%B4%B4.meta.js
// ==/UserScript==
//自定义配置,key:关键字,text:标签文本
const keywords = [
    {
        key: "原神",
        text: "原批"
    },
    {
        key: "明日方舟",
        text: "舟批"
    },
    {
        key:"王者荣耀",
        text:"农批"
    }
]
;(function () {
    'use strict';
    const users = new Map();
    const noTagUsers = new Set();
    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 || true // 检测是不是新版

    const get_pid = (c) => {
        if (is_new) {
            return c.dataset['userId']
        } else {
            return c.children[0]['href'].replace(/[^\d]/g, "")
        }
    }

    const get_comment_list = () => {
        if (is_new) {
            let lst = new Set()
            for (let c of document.getElementsByClassName('user-name')) {
                lst.add(c)
            }
            for (let c of document.getElementsByClassName('sub-user-name')) {
                lst.add(c)
            }
            return lst
        } else {
            return document.getElementsByClassName('user')
        }
    }

    function createEl(arr) {
        let tag = document.createElement("span");
        tag.style.color = "red"
        tag.style.fontWeight = "bold";
        tag.id="bilibili_tag";
        tag.innerHTML = `(${arr.join("|")})`;
        return tag;
    }
   
    function createTags(textContent) {
        let items = keywords.filter(item => textContent.includes(item.key));
        return items.map(item => item.text);
    }
    function getTags(pid) {
        return new Promise(res_ => {
            let url = blog + pid;
           
            GM_xmlhttpRequest({
                method: "get",
                url,
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                },
                onload: function (res) {
                  
                    if (res.status === 200) {
                        let st = JSON.stringify(JSON.parse(res.response).data);
                        res_(createTags(st))
                    } else {
                        console.log('失败')
                        console.log(res)
                        res_([]);
                    }
                },
                onerror() {
                    console.log("cuowu")
                }
            });
        });

    }
    function task(){
        let els = get_comment_list();
        els.forEach(async el => {
            let pid = get_pid(el);
            if (users.has(pid)) {
                let tags = users.get(pid);
                if(!Array.from(el.children).find(el=>el.id==="bilibili_tag"))el.appendChild(createEl(tags));
                return
            } else if (noTagUsers.has(pid)) {
              
                return
            } else {
                let tags = await getTags(pid);
                if (tags.length) {
                    users.set(pid, tags);
                   
                    if(!Array.from(el.children).find(el=>el.id==="bilibili_tag"))el.appendChild(createEl(tags));
                }
                else {
                    noTagUsers.add(pid);
                }
            }
        });
    };
    task();
    setInterval(() => {
    task();
    }, 4000)
})();

