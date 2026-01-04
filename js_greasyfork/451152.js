// ==UserScript==
// @name         原神玩家指示器（自用）
// @namespace    www.cber.ltd
// @version      0.7
// @description  B站评论区自动标注原神玩家，依据是动态里是否有原神相关内容（0.6一些小的修改）
// @author       xulaupuz
// @match        https://www.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451152/%E5%8E%9F%E7%A5%9E%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/451152/%E5%8E%9F%E7%A5%9E%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const unknown = new Set()
    const yuanyou = new Set()
    const no_yuanyou = new Set()

    // const keyword = "原神" // 可以自行修改，如"#原神","明日方舟"
    // const tag = " |原神玩家|"
    const keyword_match = {
        "原神": " |原神玩家|",
        "崩坏": " |崩坏玩家|"
    };


    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

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

    console.log(is_new)

    console.log("正常加载")
    let jiance = setInterval(() => {
        let commentlist = get_comment_list()
        if (commentlist.length != 0) {
            // clearInterval(jiance)
            commentlist.forEach(c => {
                let pid = get_pid(c)
                if (yuanyou.has(pid)) {
                    if (c.textContent.includes(tag) === false) {
                        c.append(tag)
                    }
                    return
                } else if (no_yuanyou.has(pid)) {
                    // do nothing
                    return
                }
                unknown.add(pid)
                //console.log(pid)
                let blogurl = blog + pid
                // let xhr = new XMLHttpRequest()
                GM_xmlhttpRequest({
                    method: "get",
                    url: blogurl,
                    data: '',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                    },
                    onload: function (res) {
                        if (res.status === 200) {
                            //console.log('成功')
                            let st = JSON.stringify(JSON.parse(res.response).data)
                            unknown.delete(pid)
                            for (var prop in keyword_match) {
                                // console.log(prop + " = " + keyword_match[prop]);
                                if (st.includes(prop)) {
                                    c.append(keyword_match[prop]);
                                    yuanyou.add(pid);
                                } else {
                                    no_yuanyou.add(pid);
                                }
                            }
                            // if (st.includes(keyword)) {
                            //     c.append(tag)
                            //     yuanyou.add(pid)
                            // } else {
                            //     no_yuanyou.add(pid)
                            // }
                        } else {
                            console.log('失败')
                            console.log(res)
                        }
                    },
                });
            });
        }
    }, 4000)
})();