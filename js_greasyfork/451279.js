// ==UserScript==
// @name         虚拟主播观众成分标注
// @namespace    Cloudwish
// @version      0.2.7
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
// @downloadURL https://update.greasyfork.org/scripts/451279/%E8%99%9A%E6%8B%9F%E4%B8%BB%E6%92%AD%E8%A7%82%E4%BC%97%E6%88%90%E5%88%86%E6%A0%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451279/%E8%99%9A%E6%8B%9F%E4%B8%BB%E6%92%AD%E8%A7%82%E4%BC%97%E6%88%90%E5%88%86%E6%A0%87%E6%B3%A8.meta.js
// ==/UserScript==
 
 
(function () {
    'use strict';
 
    //成分，可自定义
    var tag_data = {
        "原批": {
            "html": "<b style='color: #6600CC'>【原批】</b>",
            "keyword": ["原神"]
        },
        "脆鲨": {
            "html": "<b style='color: #4365ED'>【脆鲨】</b>",
            "keyword": ["七海Nana7mi", "海子姐", "海海"]
        },
        "ASOUL": {
            "html": "<b style='color: #6495ED'>【ASOUL】</b>",
            "keyword": ["嘉然", "贝拉", "向晚", "乃琳"]
        },
        "EOE": {
            "html": "<b style='color: #6495ED'>【EOE】</b>",
            "keyword": ["露早", "米诺", "虞莫", "莞儿", "柚恩"]
        },
        "棺材铺": {
            "html": "<b style='color: #9cbbe8'>【棺材铺】</b>",
            "keyword": ["东雪莲", "東雪蓮", "莲宝", "雪莲", "雪蓮"]
        },
        "除草机": {
            "html": "<b style='color: #e18586'>【除草机】</b>",
            "keyword": ["塔菲"]
        },
        "小孩梓": {
            "html": "<b style='color: #7D4F9E'>【小孩梓】</b>",
            "keyword": ["阿梓从小就很可爱", "梓宝"]
        },
        "可可音": {
            "html": "<b style='color: #f23a3a'>【可可音】</b>",
            "keyword": ["小可学妹"]
        },
        "喵喵露": {
            "html": "<b style='color: #56ca95'>【喵喵露】</b>",
            "keyword": ["猫雷"]
        },
        "3厨": {
            "html": "<b style='color: #6495ED'>【3厨】</b>",
            "keyword": ["啵啵小狗341", "玉桂幺幺340", "小狗说"]
        },
        "Kindred": {
            "html": "<b style='color: #960018'>【Kindred】</b>",
            "keyword": ["Vox"]
        },
        "DD骑士": {
            "html": "<b style='color: #6495ED'>【DD骑士】</b>",
            "keyword": ["张京华", "Overidea"]
        },
        "小星星": {
            "html": "<b style='color: #b418cb'>【小星星】</b>",
            "keyword": ["星瞳", "瞳子"]
        },
        "王牛奶": {
            "html": "<b style='color: #ff9696'>【王牛奶】</b>",
            "keyword": ["Hiiro", "粉猫", "希萝"]
        },
        "小毛线": {
            "html": "<b style='color: #4de289'>【小毛线】</b>",
            "keyword": ["阿萨", "Aza", "咋子哥"]
        },
        "皇家人": {
            "html": "<b style='color: #ECB1AC'>【皇家人】</b>",
            "keyword": ["罗伊", "Roi"]
        },
        "lulu民": {
            "html": "<b style='color: #74a5f5'>【lulu民】</b>",
            "keyword": ["lulu", "雫るる", "るる"]
        },
        "维阿信": {
            "html": "<b style='color: #92cd59'>【维阿信】</b>",
            "keyword": ["VirtuaReal", "维阿"]
        },
        "魇月月": {
            "html": "<b style='color: #886ce4'>【魇月月】</b>",
            "keyword": ["梦魇Tsuki"]
        },
    }
    // 合并规则，合并时每个tag只会计算一次，优先级从上到下
    var tag_merge_rule_list = [
        {
            "html": "<b style='color: #f6c644'>【小海梓】</b>",
            "tag": ["脆鲨", "小孩梓", "可可音"]
        },
        {
            "html": "<b style='color: #FFD700'>【5SOUL】</b>",
            "tag": ["ASOUL", "3厨"]
        },
        {
            "html": "<b style='color: #000000'>【V87】</b>",
            "tag": ["棺材铺", "喵喵露", "除草机"]
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
 
    for(var rule of tag_merge_rule_list) {
        rule["html"] = rule["html"].replaceAll("'", '"')
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
                                        user_html[uid] += merge_rule["html"]
                                    }
                                }
                                for(const tag of tag_set) {
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