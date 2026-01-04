// ==UserScript==
// @name         新新·三相之力指示器
// @namespace    OP
// @version      0.371
// @description  B站评论区自动标注三相玩家，依据是动态里是否有三相相关内容（基于NightSwan的新·三相之力指示器）
// @author       Earendil
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/458589/%E6%96%B0%E6%96%B0%C2%B7%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/458589/%E6%96%B0%E6%96%B0%C2%B7%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const Categ = {
        normal: {
            tag: "普通",
            color: "#11DD77"
        },
        rare: {
            tag: "稀有",
            color: "#6600CC"
        },
        hidden: {
            tag: "隐藏",
            color: "#254680"
        },
        vtuber: {
            tag: "Vtuber",
            color: "#946845"
        },
        epic: {
            tag: "史诗",
            color: "#FF0000"
        },
        legend: {
            tag: "传奇",
            color: "#FFD700"
        }
    }

    //【 稀有 |  原批】
    //成分，可自定义
    let components = new Array(
        {
            key: "$i('原神') && $i('明日方舟') && $i('王者荣耀')",
            tag: "三相之力",
            categ: Categ.legend
        },
        {
            key: "$i('原神') && $i('明日方舟') && !$i('王者荣耀')",
            tag: "二次元双象限",
            categ: Categ.epic
        },
        {
            key: "$i('原神') && $i('王者荣耀') && !$i('明日方舟')",
            tag: "双批齐聚",
            categ: Categ.epic
        },
        {
            key: "$i('明日方舟') && $i('王者荣耀') && !$i('原神')",
            tag: "稀有的存在",
            categ: Categ.epic
        },
        {
            key: "$i('原神')",
            tag: "原批",
            categ: Categ.rare
        },
        {
            key: "$i('明日方舟')",
            tag: "粥畜",
            categ: Categ.rare
        },
        {
            key: "$i('王者荣耀')",
            tag: "农批",
            categ: Categ.rare
        },
        {
            key: "$i('抽奖')",
            tag: "动态抽奖",
            categ: Categ.hidden
        },
        {
            key: "$i('塔菲')",
            tag: "嘉心糖",
            categ: Categ.vtuber
        },
        {
            key: "$i('雪莲')",
            tag: "罕见",
            categ: Categ.vtuber
        },
        {
            key: undefined,
            tag: "纯",
            categ: Categ.normal
        },
    )
    console.log(components)

    for (let component in components) {
        component = components[component]
        component.tag = `<b style='color: ${component.categ.color}'> 【 ${component.categ.tag} |  ${component.tag}】 </b>`
        component.yes = new Set()
        component.no = new Set()
    }

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
            commentlist.forEach(c => {
                let pid = get_pid(c)
                for (let component in components) {
                    component = components[component]
                    if (component.yes.has(pid)) {
                        if (!c.textContent.includes(component.tag)) {
                            c.innerHTML += component.tag
                        }
                    } else if (!component.no.has(pid)) {
                        continue
                    }
                    return
                }
                let blogurl = blog + pid
                GM_xmlhttpRequest({
                    method: "get",
                    url: blogurl,
                    data: '',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                    },
                    onload: function (res) {
                        if (res.status === 200) {
                            let st = JSON.stringify(JSON.parse(res.response).data)
                            let added = false
                            for (let component in components) {
                                component = components[component]
                                let key = component.key == undefined ? !added : component.key.replace(/\$i/g, "st.includes")
                                if (eval(key)) {
                                    c.innerHTML += component.tag
                                    component.yes.add(pid)
                                    added = true
                                } else {
                                    component.no.add(pid)
                                }
                            }
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