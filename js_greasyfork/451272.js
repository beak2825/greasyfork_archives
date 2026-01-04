// ==UserScript==
// @name         小星星指示器
// @namespace    NightSwan
// @version      0.37
// @description  B站评论区自动标注三相玩家，依据是动态里是否有三相相关内容（增加了星瞳）
// @author       xulaupuz&nightswan
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
// @downloadURL https://update.greasyfork.org/scripts/451272/%E5%B0%8F%E6%98%9F%E6%98%9F%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451272/%E5%B0%8F%E6%98%9F%E6%98%9F%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const unknown = new Set()

    //是否显示vtuber
    let bshow = true

    //成分，可自定义
    const yuanyou = new Set()
    const no_yuanyou = new Set()
    const zhouyou = new Set()
    const no_zhouyou = new Set()
    const nongyou = new Set()
    const no_nongyou = new Set()
    const sanxiang = new Set()
    const no_sanxiang = new Set()
    const yuanzhou = new Set()
    const no_yuanzhou = new Set()
    const yuannong = new Set()
    const no_yuannong = new Set()
    const nongzhou = new Set()
    const no_nongzhou = new Set()
    const nor = new Set()
    const no_nor = new Set()
    const cj = new Set()
    const no_cj = new Set()
    const jxt = new Set()
    const no_jxt = new Set()
    const ccj = new Set()
    const no_ccj = new Set()
    const gcb = new Set()
    const no_gcb = new Set()
    const jn = new Set()
    const no_jn = new Set()
    const mml = new Set()
    const no_mml = new Set()
    const xxx = new Set()
    const no_xxx = new Set()

    //关键词，可自定义
    const keyword_yuan = "原神"
    const keyword_zhou = "明日方舟"
    const keyword_nong = "王者荣耀"
    const keyword_cj = "抽奖"
    const keyword_jxt = "嘉然"
    const keyword_ccj = "塔菲"
    const keyword_gcb = "雪蓮"
    const keyword_jn = "七海"
    const keyword_mml = "猫雷"
    const keyword_xxx = "星瞳"

    //贴上标签，可自定义
    const tag_nor = " 【 普通 |  纯良】"
    const tag_yuan = " 【 稀有 |  原批】"
    const tag_zhou = " 【 稀有 |  粥畜】"
    const tag_nong = " 【 稀有 |  农批】"
    const tag_yuanzhou = " 【 史诗 | 二次元双象限】"
    const tag_yuannong = " 【 史诗 |  双批齐聚】"
    const tag_zhounong = " 【 史诗 |  稀有的存在】"
    const tag_sanxiang = " 【 传奇 |  三相之力】"
    const tag_cj = " 【 隐藏 |  动态抽奖】"
    const tag_jxt = " 嘉心糖"
    const tag_ccj = " 雏草姬"
    const tag_gcb = " 棺材板"
    const tag_jn = " 杰尼"
    const tag_mml = " 喵喵露"
    const tag_xxx = " 小星星"


    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    //标签颜色，可自定义，默认为B站会员色
    const tag_nor_Inner = "<b style='color: #11DD77'>" + tag_nor + "</b>"
    const tag_yuan_Inner = "<b style='color: #6600CC'>" + tag_yuan + "</b>"
    const tag_zhou_Inner = "<b style='color: #6600CC'>" + tag_zhou + "</b>"
    const tag_nong_Inner = "<b style='color: #6600CC'>" + tag_nong + "</b>"
    const tag_yuanzhou_Inner = "<b style='color: #FF0000'>" + tag_yuanzhou + "</b>"
    const tag_yuannong_Inner = "<b style='color: #FF0000'>" + tag_yuannong + "</b>"
    const tag_nongzhou_Inner = "<b style='color: #FF0000'>" + tag_zhounong + "</b>"
    const tag_sanxiang_Inner = "<b style='color: #FFD700'>" + tag_sanxiang + "</b>"
    const tag_cj_Inner = "<b style='color: #254680'>" + tag_cj + "</b>"

    const tag_jxt_Inner = "<b style='color: #946845'>" + tag_jxt + "</b>"
    const tag_ccj_Inner = "<b style='color: #946845'>" + tag_ccj + "</b>"
    const tag_gcb_Inner = "<b style='color: #946845'>" + tag_gcb + "</b>"
    const tag_jn_Inner = "<b style='color: #946845'>" + tag_jn + "</b>"
    const tag_mml_Inner = "<b style='color: #946845'>" + tag_mml + "</b>"
    const tag_xxx_Inner = "<b style='color: #946845'>" + tag_xxx + "</b>"


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
                if (cj.has(pid)) {
                    if (c.textContent.includes(tag_cj) === false) {
                        c.innerHTML += tag_cj_Inner
                    }
                    return
                } else if (no_sanxiang.has(pid)) {
                    // do nothing
                    return
                }
                if (jxt.has(pid)) {
                    if (c.textContent.includes(tag_jxt) === false) {
                        c.innerHTML += tag_jxt_Inner
                    }
                    return
                } else if (no_jxt.has(pid)) {
                    // do nothing
                    return
                }
                if (ccj.has(pid)) {
                    if (c.textContent.includes(tag_ccj) === false) {
                        c.innerHTML += tag_ccj_Inner
                    }
                    return
                } else if (no_ccj.has(pid)) {
                    // do nothing
                    return
                }
                if (gcb.has(pid)) {
                    if (c.textContent.includes(tag_gcb) === false) {
                        c.innerHTML += tag_gcb_Inner
                    }
                    return
                } else if (no_gcb.has(pid)) {
                    // do nothing
                    return
                }
                if (jn.has(pid)) {
                    if (c.textContent.includes(tag_jn) === false) {
                        c.innerHTML += tag_jn_Inner
                    }
                    return
                } else if (no_jn.has(pid)) {
                    // do nothing
                    return
                }
                if (mml.has(pid)) {
                    if (c.textContent.includes(tag_mml) === false) {
                        c.innerHTML += tag_mml_Inner
                    }
                    return
                } else if (no_mml.has(pid)) {
                    // do nothing
                    return
                }
                if (sanxiang.has(pid)) {
                    if (c.textContent.includes(tag_sanxiang) === false) {
                        c.innerHTML += tag_sanxiang_Inner
                    }
                    return
                } else if (no_sanxiang.has(pid)) {
                    // do nothing
                    return
                }
                if (yuannong.has(pid)) {
                    if (c.textContent.includes(tag_yuannong) === false) {
                        c.innerHTML += tag_yuannong_Inner
                    }
                    return
                } else if (no_yuanzhou.has(pid)) {
                    // do nothing
                    return
                }
                if (nongzhou.has(pid)) {
                    if (c.textContent.includes(tag_nongzhou) === false) {
                        c.innerHTML += tag_nongzhou_Inner
                    }
                    return
                } else if (no_sanxiang.has(pid)) {
                    // do nothing
                    return
                }
                if (yuanzhou.has(pid)) {
                    if (c.textContent.includes(tag_yuanzhou) === false) {
                        c.innerHTML += tag_yuanzhou_Inner
                    }
                    return
                } else if (no_yuanzhou.has(pid)) {
                    // do nothing
                    return
                }
                if (yuanyou.has(pid)) {
                    if (c.textContent.includes(tag_yuan) === false) {
                        c.innerHTML += tag_yuan_Inner
                    }
                    return
                } else if (no_yuanyou.has(pid)) {
                    // do nothing
                    return
                }

                if (zhouyou.has(pid)) {
                    if (c.textContent.includes(tag_zhou) === false) {
                        c.innerHTML += tag_zhou_Inner
                    }
                    return
                } else if (no_zhouyou.has(pid)) {
                    // do nothing
                    return
                }

                if (nongyou.has(pid)) {
                    if (c.textContent.includes(tag_nong) === false) {
                        c.innerHTML += tag_nong_Inner
                    }
                    return
                } else if (no_nongyou.has(pid)) {
                    // do nothing
                    return
                }
                if (nor.has(pid)) {
                    if (c.textContent.includes(tag_nor) === false) {
                        c.innerHTML += tag_nor_Inner
                    }
                    return
                } else if (no_nor.has(pid)) {
                    // do nothing
                    return
                }
                 if (nor.has(pid)) {
                    if (c.textContent.includes(tag_xxx) === false) {
                        c.innerHTML += tag_xxx_Inner
                    }
                    return
                } else if (no_nor.has(pid)) {
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
                            //vtuber
                            if (bshow && (st.includes(keyword_jxt) || st.includes(keyword_ccj) || st.includes(keyword_xxx) || st.includes(keyword_gcb))) {
                                c.innerHTML += "<b style='color: #946845' >【 Vtuber |  "
                                //添加嘉然标签
                                if (st.includes(keyword_jxt)) {
                                    c.innerHTML += tag_jxt_Inner
                                    jxt.add(pid)
                                } else {
                                    no_jxt.add(pid)
                                }
                                //添加塔菲标签
                                if (st.includes(keyword_ccj)) {
                                    c.innerHTML += tag_ccj_Inner
                                    ccj.add(pid)
                                } else {
                                    no_ccj.add(pid)
                                }
                                //添加東雪莲标签
                                if (st.includes(keyword_gcb)) {
                                    c.innerHTML += tag_gcb_Inner
                                    gcb.add(pid)
                                } else {
                                    no_gcb.add(pid)
                                }
                                //添加七海标签
                                if (st.includes(keyword_jn)) {
                                    c.innerHTML += tag_jn_Inner
                                    jn.add(pid)
                                } else {
                                    no_jn.add(pid)
                                }
                                //添加猫雷！标签
                                if (st.includes(keyword_mml)) {
                                    c.innerHTML += tag_mml_Inner
                                    mml.add(pid)
                                } else {
                                    no_mml.add(pid)
                                }
                                 //添加星瞳！标签
                                if (st.includes(keyword_xxx)) {
                                    c.innerHTML += tag_xxx_Inner
                                    mml.add(pid)
                                } else {
                                    no_mml.add(pid)
                                }
                                c.innerHTML += "<b style='color: #946845' >】</b>"
                            }

                            //添加三相标签
                            if (st.includes(keyword_nong) && st.includes(keyword_yuan) && st.includes(keyword_zhou)) {
                                c.innerHTML += tag_sanxiang_Inner
                                sanxiang.add(pid)
                            } else {
                                no_sanxiang.add(pid)
                            }
                            //添加二次元标签
                            if (st.includes(keyword_yuan) && st.includes(keyword_zhou) && !st.includes(keyword_nong)) {
                                c.innerHTML += tag_yuanzhou_Inner
                                yuanzhou.add(pid)
                            } else {
                                no_yuanzhou.add(pid)
                            }
                            //添加批批标签
                            if (st.includes(keyword_yuan) && !st.includes(keyword_zhou) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_yuannong_Inner
                                yuannong.add(pid)
                            } else {
                                no_yuannong.add(pid)
                            }
                            //添加稀有标签
                            if (!st.includes(keyword_yuan) && st.includes(keyword_zhou) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_nongzhou_Inner
                                nongzhou.add(pid)
                            } else {
                                no_nongzhou.add(pid)
                            }
                            //添加原神标签
                            if (st.includes(keyword_yuan) && !st.includes(keyword_zhou) && !st.includes(keyword_nong)) {
                                c.innerHTML += tag_yuan_Inner
                                yuanyou.add(pid)
                            } else {
                                no_yuanyou.add(pid)
                            }
                            //添加方舟标签
                            if (!st.includes(keyword_yuan) && st.includes(keyword_zhou) && !st.includes(keyword_nong)) {
                                c.innerHTML += tag_zhou_Inner
                                zhouyou.add(pid)
                            } else {
                                no_zhouyou.add(pid)
                            }
                            //添加农药标签
                            if (!st.includes(keyword_yuan) && !st.includes(keyword_zhou) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_nong_Inner
                                nongyou.add(pid)
                            } else {
                                no_nongyou.add(pid)
                            }
                            //添加隐藏标签
                            if (st.includes(keyword_cj)) {
                                c.innerHTML += tag_cj_Inner
                                cj.add(pid)
                                return
                            } else {
                                no_cj.add(pid)
                            }
                            //添加纯良标签
                            if (!st.includes(keyword_nong) && !st.includes(keyword_yuan) && !st.includes(keyword_zhou)) {
                                c.innerHTML += tag_nor_Inner
                                nor.add(pid)
                            } else {
                                no_nor.add(pid)
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