// ==UserScript==
// @name         成分标注
// @namespace    Cloudwish
// @version      0.22
// @description  B站评论区成分标注，依据是动态里是否有相关内容（基于三相指示器修改）
// @author       cloudwish
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
// @downloadURL https://update.greasyfork.org/scripts/451300/%E6%88%90%E5%88%86%E6%A0%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451300/%E6%88%90%E5%88%86%E6%A0%87%E6%B3%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 成分，可自定义
    // keyword数组设置为空代表不匹配任何关键字，若数组中有空字符串("")代表匹配所有用户
    var tag_data = {
        "抽奖": {
            "html": "<b style='color: #6495ED'>【抽奖】</b>",
            "keyword": ["抽奖"]
        },
        "原批": {
            "html": "<b style='color: #6600CC'>【原批】</b>",
            "keyword": ["原神"]
        },
        "舟批": {
            "html": "<b style='color: #6600CC'>【舟批】</b>",
            "keyword": ["明日方舟"]
        },
        "农批": {
            "html": "<b style='color: #6600CC'>【农批】</b>",
            "keyword": ["王者荣耀"]
        },
        "脆鲨": {
            "html": "<b style='color: #6495ED'>【脆鲨】</b>",
            "keyword": ["七海Nana7mi"]
        },
        "棺材铺": {
            "html": "<b style='color: #6495ED'>【棺材铺】</b>",
            "keyword": ["东雪莲", "東雪蓮"]
        },
        "除草机": {
            "html": "<b style='color: #6495ED'>【除草机】</b>",
            "keyword": ["塔菲"]
        },
        "小孩梓": {
            "html": "<b style='color: #6495ED'>【小孩梓】</b>",
            "keyword": ["阿梓从小就很可爱"]
        },
        "喵喵露": {
            "html": "<b style='color: #6495ED'>【喵喵露】</b>",
            "keyword": ["猫雷"]
        },
        "3楚": {
            "html": "<b style='color: #6495ED'>【3楚】</b>",
            "keyword": ["啵啵小狗341", "玉桂幺幺340"]
        },
        "三相之力": {
            "html": "<b style='color: #FFD700'>【三相之力】</b>",
            "keyword": []
        },
        "原舟双批": {
            "html": "<b style='color: #FF0000'>【原舟双批】</b>",
            "keyword": []
        },
        "原农双批": {
            "html": "<b style='color: #FF0000'>【原农双批】</b>",
            "keyword": []
        },
        "农舟双批": {
            "html": "<b style='color: #FF0000'>【农舟双批】</b>",
            "keyword": []
        },
    }
    // 合并规则，合并时每个tag只会被计算一次，优先级从上到下
    // 合并后生成的新tag可以继续参与合并
    // 例如：存在3个tag：tag_a, tag_b, tag_d；2条规则：tag_a + tag_b -> tag_c，tag_c + tag_d -> tag_e
    // 最终会得到tag_e
    var tag_merge_rule_list = [
        {
            "tag": ["原批", "舟批", "农批"],
            "result_tag": "三相之力"
        },
        {
            "tag": ["原批", "舟批"],
            "result_tag": "原舟双批"
        },
        {
            "tag": ["原批", "农批"],
            "result_tag": "原农双批"
        },
        {
            "tag": ["农批", "舟批"],
            "result_tag": "农舟双批"
        },
    ]

    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新

    const get_uid = (user) => {
        if (is_new) {
            return user.dataset['userId']
        } else {
            return user.children[0]['href'].replace(/[^\d]/g, "")
        }
    }

    const get_comment_user_list = () => {
        if (is_new) {
            let lst = new Set()
            for (let user of document.getElementsByClassName('user-name')) {
                lst.add(user)
            }
            for (let user of document.getElementsByClassName('sub-user-name')) {
                lst.add(user)
            }
            return lst
        } else {
            return document.getElementsByClassName('user')
        }
    }

    console.log(is_new)
    console.log("正常加载")

    for(const tag in tag_data) {
        tag_data[tag]["html"] = tag_data[tag]["html"].replaceAll("'", '"')
    }

    var user_html = {}

    let jiance = setInterval(() => {
        let user_list = get_comment_user_list()
        if (user_list.length != 0) {
            // clearInterval(jiance)
            user_list.forEach(user => {
                let uid = String(get_uid(user))
                if(!(Object.keys(user_html).includes(uid))) {
                    user_html[uid] = ""
                    let blogurl = blog + uid
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
                                let str = JSON.stringify(JSON.parse(res.response).data)
                                let tag_set = new Set()
                                for(const tag in tag_data) {
                                    for(const keyword of tag_data[tag]["keyword"]) {
                                        if(str.includes(keyword)) {
                                            tag_set.add(tag)
                                            break
                                        }
                                    }
                                }
                                for(const merge_rule of tag_merge_rule_list) {
                                    let is_merge = true
                                    for(const tag of merge_rule["tag"]) {
                                        if(!tag_set.has(tag)) {
                                            is_merge = false
                                            break
                                        }
                                    }
                                    if(is_merge) {
                                        for(const tag of merge_rule["tag"]) {
                                            tag_set.delete(tag)
                                        }
                                        tag_set.add(merge_rule["result_tag"])
                                    }
                                }
                                for(const tag of tag_set) {
                                    //console.log(tag)
                                    user_html[uid] += tag_data[tag]["html"]
                                }
                                user.innerHTML += user_html[uid]
                            } else {
                                console.log('获取UID'+uid+'用户的动态失败')
                                console.log(res)
                            }
                        },
                    });
                }
                else if(!user.innerHTML.replaceAll("'", '"').includes(user_html[uid])){
                    user.innerHTML += user_html[uid]
                }
            });
        }
    }, 5000)
})();