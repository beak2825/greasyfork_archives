// ==UserScript==
// @name         成分指示器
// @namespace    www.cber.ltd
// @version      0.72
// @description  B站评论区自动标注，依据是动态里是否有原神相关内容（0.6一些小的修改）
// @author       @Credit for Xulaupuz
// @match        https://www.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451140/%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451140/%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const unknown = new Set()
    const detected = new Set()

    const keyword = ["原神", "明日方舟", "王者荣耀", "嘉然|贝拉|向晚|ASoul", "原神粉丝专属", "東雪蓮|雪莲", "#互动抽奖"] // 可以自行修改，如"#原神","明日方舟"
    const role = ["原批", "粥批", "农批", "戛心糖/A畜", "原盾", "罕见/罕见盾", "抽奖脑溢血"]
    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const subscribe = 'https://api.bilibili.com/x/relation/followings?vmid=detector&pn='

    const is_new = document.getElementsByClassName('item goback').length !== 0 // 检测是不是新版

    const get_pid = (c) => {
        if (is_new) {
            return c.dataset['userId']
        } else {
            return c.children[0]['href'].replace(/\D/g, "")
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
    let detect = setInterval(() => {
        let commentList = get_comment_list()
        if (commentList.length !== 0) {
            // clearInterval(jiance)
            commentList.forEach(c => {
                let pid = get_pid(c)
                if (detected.has(pid))
                    return
                unknown.add(pid)
                //console.log(pid)
                let blogUrl = blog + pid
                let subscribeUrl = subscribe.replace("detector", pid)
                // let xhr = new XMLHttpRequest()
                GM_xmlhttpRequest({
                    method: "get",
                    url: blogUrl,
                    data: '',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                    },
                    onload: function (res) {

                        if (res.status === 200) {

                            let st = JSON.stringify(JSON.parse(res.response).data)
                            unknown.delete(pid)

                            //fiddler
                            let number = 0;
                            keyword.forEach(
                                word => {
                                    let value = 0;

                                    let enable = false

                                    word.split("|").forEach(
                                        sub => {

                                            if (sub.length > 0 &&
                                                st.toLowerCase().includes(sub.toLowerCase())) {
                                                enable = true
                                                value += st.split(word).length;
                                            }
                                        }
                                    )

                                    if (enable) {
                                        c.append(" |" + role[number] + "❤ 次数:" + value + "|")
                                    }

                                    number++;
                                    if (!detected.has(pid)) {
                                        detected.add(pid)
                                    }
                                }
                            )

                        } else {
                            console.log('失败')
                            console.log(res)
                        }

                        ///
                    }
                })


                for (let i = 1; i < 5; i++) {
                    //reconnect
                    GM_xmlhttpRequest({
                        method: "get",
                        url: subscribeUrl + i,
                        data: '',
                        headers: {
                            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                        },
                        onload: function (res) {
                            if (res.status === 200) {
                                console.log("获取成功" + subscribeUrl + "" + i)

                                let st = JSON.stringify(JSON.parse(res.response).data)

                                //fiddler
                                let number = 0;

                                keyword.forEach(
                                    word => {
                                        let enable = false

                                        word.split("|").forEach(
                                            sub => {
                                                if (sub.length > 0 && st != null &&
                                                    st.toLowerCase().includes(sub.toLowerCase())) {
                                                    enable = true
                                                    console.log("检测到" + st)
                                                }
                                            }
                                        )

                                        if (enable)
                                            c.append(" | 订阅了: " + keyword[number])

                                        number++;

                                    }
                                )
                            } else {
                                console.log('失败')

                                //sleep for 20s
                                const start = new Date().getTime();
                                while (new Date().getTime() < start + 20000);
                            }
                        }
                    })

                }

            });
        }
    }, 4000)
})();