// ==UserScript==
// @name         mrfz玩家指示器升级版
// @namespace    www.cber.ltd
// @version      0.7.2
// @description  B站评论区自动标注明日方舟玩家，依据动态给B站用户打分，基于laupuz-xu的代码
// @author       urlz7
// @match        https://www.bilibili.com/video/*
// @match        https://space.bilibili.com/*/dynamic*
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451217/mrfz%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8%E5%8D%87%E7%BA%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/451217/mrfz%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8%E5%8D%87%E7%BA%A7%E7%89%88.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const cache = {}
    const keywords = {
        "粥畜": -8, // 米黑
        "粥p": -6,
        "硬核不媚宅": -6,
        "粥粥": -6,
        "鹰孝子": -6,
        "舟舟": -6,
        "zxz": -6,
        "粥粥人": -6,
        "粥÷": -6,
        "mxz": -6,
        "设定集": -4,
        "粥u": -3,
        "粥U": -3,
        "zvb": -3,
        "粥批": -2,
        "yj": 3, // 路人
        "明日方舟": 3,
        "来自星尘": 3,
        "乌萨斯": 5,
        "莱塔尼亚": 5,
        "方舟": 5,
        "谢拉格": 5,
        "萧然": 5,
        "zc": 5,
        "ZC":5,
        "十万大c": 5,
        "42": 5,
        "搓玉": 5,
        "卡西米尔": 5,
        "斯卡蒂": 5,
        "莱茵": 5,
        "赛爹": 5,
        "批脸陈": 5, // 米卫兵
        "水陈": 5,
        "仙家军": 5,
        "仙÷": 5,
        "主祭": 5,
        "危机合约#": 20,
        "首杀": 10,
        "公开招募": 10,
        "保全派驻": 10,
        "阿米驴": 10,
    } // 关键词与权重

    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    const get_pid = (c) => {
        if (is_new) return c.dataset.userId
        return c.children[0].href.replace(/[^\d]/g, "")
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
    let jiance = setInterval(()=>{
        let commentlist = get_comment_list()
        if (commentlist.length != 0){
            // clearInterval(jiance)
            commentlist.forEach(c => {
                let pid = get_pid(c)
                if (pid in cache) {
                    if (c.className == "user") {
                        c = c.firstChild;
                    }
                    if (c.textContent.endsWith("】") === false) {
                        c.append(cache[pid])
                    }
                    return
                }
                //console.log(pid)
                let blogurl = blog + pid
                let request = (calc, num_iter, more, off) => {
                    if (!more || num_iter == 0) {
                        if (!(pid in cache)) {
                            let normalize = x => 2*(1/(1+Math.exp(-x)) - 0.5) // 归一化
                            let normalize2 = x => 1/(1+Math.exp(-x)) // 归一化
                            let stars = (x, n) => "★".repeat(Math.ceil(x*n))+"☆".repeat(n-Math.ceil(x*n))
                            let yuan = normalize(5*calc.count1/calc.num_posts) || 0
                            let beng = normalize(5*calc.count2/calc.num_posts) || 0
                            let zonghepingfen = normalize2(calc.score/calc.num_posts || 0)
                            let elem = `【转发：${stars(yuan, 5)}蹲饼：${stars(beng, 5)} 综合评分：${Math.ceil(zonghepingfen*100)}】`
                            cache[pid] = elem
                        }
                        return
                    }
                    GM_xmlhttpRequest({
                        method: "get",
                        url: off ? blogurl + "&offset=" + off : blogurl,
                        data: '',
                        headers:  {
                            'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                        },
                        onload: function(res){
                            if (res.status === 200){
                                //console.log('成功')
                                let {data: {has_more, items, offset}} = JSON.parse(res.response)
                                let genshin_count = 0
                                let honkai3_count = 0
                                let post_score = 0
                                items.forEach(item => {
                                    let score = 0

                                    let st = ""
                                    let findStringsWithKey = (obj, key) => {
                                        if (obj instanceof Array) {
                                            for (let i = 0; i < obj.length; i++) {
                                                findStringsWithKey(obj[i], key)
                                            }
                                        } else if (obj instanceof Object) {
                                          for (let prop in obj) {
                                            if (prop == key && typeof obj[prop] == "string") {
                                                st += obj[prop]
                                            }
                                            if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
                                                findStringsWithKey(obj[prop], key)
                                            }
                                          }
                                        }
                                    }
                                    findStringsWithKey(item, "orig_text")

                                    if (st.includes("#明日方舟#")) genshin_count++
                                    if (st.includes("新增服饰")) honkai3_count++
                                    Object.keys(keywords).forEach(k => {
                                        if (st.includes(k)) score += keywords[k] // 乘以权重
                                    })
                                    post_score += score // 单条动态评分
                                })
                                request(
                                    {
                                        count1: calc.count1 + genshin_count,
                                        count2: calc.count2 + honkai3_count,
                                        score: calc.score + post_score,
                                        num_posts: calc.num_posts + items.length,
                                    },
                                    num_iter - 1,
                                    has_more,
                                    offset
                                )
                            } else{
                                console.log('失败')
                                console.log(res)
                            }
                        },
                    });
                }
                request({count1: 0, count2: 0, score: 0, num_posts: 0}, 5, true); // 翻5页动态，最多60条动态，不推荐设太高因为太慢
            });
        }
    }, 4000)
    })();