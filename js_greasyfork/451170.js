// ==UserScript==
// @name         原神玩家指示器升级版
// @namespace    www.cber.ltd
// @version      0.8.2
// @description  B站评论区自动标注米哈游玩家，依据动态给B站用户打分，基于laupuz-xu的代码
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
// @downloadURL https://update.greasyfork.org/scripts/451170/%E5%8E%9F%E7%A5%9E%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8%E5%8D%87%E7%BA%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/451170/%E5%8E%9F%E7%A5%9E%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8%E5%8D%87%E7%BA%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sensitivity = 15 // 灵敏度
    const debug = 0
    const npost_threshold = 15
    const nmatch_threshold = 2
    const show_all = 0

    const patterns_other = [
        [/(o|原)(p|批)|叩|(欧|哦)泡(果奶)?|糇|贱长|米孝子|mxz/g, -3],
        [/数一数二|烧鸡|米(学长|卫兵)|m(xz|wb|vb)/g, -2],
        [/绝区零|#miHoYo/g, 1],
        [/米黑|魔怔人|(猴|🐒)吧?|mzr/g, 2],
        [/(赛|单机)(批|p|孝子)|百万塞尔达/g, 3]
    ]

    const patterns_beng = [
        [/崩坏3|舰长|律者/g, 1]
    ]

    const patterns_yuan = [
        [/原神|须弥|稻妻|雷电将军|钟离|神子|刻晴|万叶|可莉|提瓦特/g, 1]
    ]

    const patterns = [...patterns_other, ...patterns_beng, ...patterns_yuan]

    const cache = {}

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
    let _ = setInterval(()=>{
        let commentlist = get_comment_list()
        if (commentlist.length != 0){
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
                            let normalize = x => 1/(1+Math.exp(-x)) // 归一化
                            let round = x => Math.ceil(x * 100)
                            let nmatch = calc.match.size
                            console.log(nmatch)
                            let denom = Math.max(npost_threshold, calc.count[3])
                            let stars = (x, n) => "★".repeat(Math.ceil(x*n))+"☆".repeat(n-Math.ceil(x*n))
                            let yuan = (2*normalize(sensitivity*calc.count[0]/denom) - 1) || 0
                            let beng = (2*normalize(sensitivity*calc.count[1]/denom) - 1) || 0
                            let zonghepingfen = normalize(sensitivity*calc.count[2]/denom || 0)
                            let elem = ((show_all || (zonghepingfen> 0.5 && (yuan >= 0.5 || beng >= 0.5))) && nmatch >= nmatch_threshold) ? `【原：${stars(yuan, 5)} 崩：${stars(beng, 5)} 综合评分：${Math.ceil(zonghepingfen*100)} ${debug ? JSON.stringify(calc): ""}】` : ""
                            //let elem = `【${round(yuan)} ${round(beng)} ${round(zonghepingfen)}】`
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
                                items.forEach(item => {
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
                                    const pll = [patterns_yuan, patterns_beng, patterns]
                                    for (let i = 0; i < 3; ++i) {
                                        pll[i].forEach(pl => {
                                            let [pattern, weight] = pl
                                            let match = st.match(pattern)
                                            if (match) {
                                                calc.count[i] += weight
                                                calc.match = new Set([...calc.match, ...match])
                                            }
                                        })
                                    }
                                    calc.count[3]++
                                })
                                request(calc, num_iter - 1, has_more, offset)
                            } else{
                                console.log('失败')
                                console.log(res)
                            }
                        },
                    });
                }
                request({count: [0, 0, 0, 0], match: new Set()}, 6, true);
            });
        }
    }, 4000)
    })();