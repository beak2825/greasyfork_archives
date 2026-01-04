// ==UserScript==
// @name         au成分指示器
// @namespace    枝江的芥鱼
// @version      0.21
// @description  B站评论区自动标注网友，依据是动态里是否有相关内容（基于新·三相之力指示器的一些au特色的修改）
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
// @downloadURL https://update.greasyfork.org/scripts/451320/au%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451320/au%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const unknown = new Set()

    //是否显示au
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
    const scg = new Set()
    const no_scg = new Set()
    const jxt = new Set()
    const no_jxt = new Set()
    const dwr = new Set()
    const no_dwr = new Set()
    const nql = new Set()
    const no_nql = new Set()
    const bjx = new Set()
    const no_bjx = new Set()
    const asoul = new Set()
    const no_asoul = new Set()

    //关键词，可自定义
    const keyword_yuan = "原神"
    const keyword_zhou = "明日方舟"
    const keyword_nong = "王者荣耀"
    const keyword_scg = "小狗说"
    const keyword_jxt = "嘉然"
    const keyword_dwr = "向晚"
    const keyword_nql = "乃琳"
    const keyword_bjx = "贝拉"
    const keyword_asoul = "羊驼"

    //贴上标签，可自定义
    const tag_nor = "【网友】"
    const tag_yuan = "【原友】"
    const tag_zhou = "【粥友】"
    const tag_nong = "【农友】"
    const tag_yuanzhou = "【原粥】"
    const tag_yuannong = "【原农】"
    const tag_nongzhou = "【农粥】"
    const tag_sanxiang = "【原粥农】"
    const tag_scg = "【三畜】"
    const tag_jxt = " 嘉心糖"
    const tag_dwr = " 顶碗人"
    const tag_nql = " 奶淇琳"
    const tag_bjx = " 贝极星"
    const tag_asoul = " 一个魂"


    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    //标签颜色，可自定义，默认为B站会员色
    const tag_nor_Inner = "<b style='color: #11DD77'>" + tag_nor + "</b>"
    const tag_yuan_Inner = "<b style='color: #6600CC'>" + tag_yuan + "</b>"
    const tag_zhou_Inner = "<b style='color: #6600CC'>" + tag_zhou + "</b>"
    const tag_nong_Inner = "<b style='color: #6600CC'>" + tag_nong + "</b>"
    const tag_yuanzhou_Inner = "<b style='color: #0066CC'>" + tag_yuanzhou + "</b>"
    const tag_yuannong_Inner = "<b style='color: #0066CC'>" + tag_yuannong + "</b>"
    const tag_nongzhou_Inner = "<b style='color: #0066CC'>" + tag_nongzhou + "</b>"
    const tag_sanxiang_Inner = "<b style='color: #FFD700'>" + tag_sanxiang + "</b>"
    const tag_scg_Inner = "<b style='color: #CC0000'>" + tag_scg + "</b>"

    const tag_jxt_Inner = "<b style='color: #E799B0'>" + tag_jxt + "</b>"
    const tag_dwr_Inner = "<b style='color: #9AC8E2'>" + tag_dwr + "</b>"
    const tag_nql_Inner = "<b style='color: #576690'>" + tag_nql + "</b>"
    const tag_bjx_Inner = "<b style='color: #DB7D75'>" + tag_bjx + "</b>"
    const tag_asoul_Inner = "<b style='color: #FC966E'>" + tag_asoul + "</b>"


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
                if (scg.has(pid)) {
                    if (c.textContent.includes(tag_scg) === false) {
                        c.innerHTML += tag_scg_Inner
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
                if (dwr.has(pid)) {
                    if (c.textContent.includes(tag_dwr) === false) {
                        c.innerHTML += tag_dwr_Inner
                    }
                    return
                } else if (no_dwr.has(pid)) {
                    // do nothing
                    return
                }
                if (nql.has(pid)) {
                    if (c.textContent.includes(tag_nql) === false) {
                        c.innerHTML += tag_nql_Inner
                    }
                    return
                } else if (no_nql.has(pid)) {
                    // do nothing
                    return
                }
                if (bjx.has(pid)) {
                    if (c.textContent.includes(tag_bjx) === false) {
                        c.innerHTML += tag_bjx_Inner
                    }
                    return
                } else if (no_bjx.has(pid)) {
                    // do nothing
                    return
                }
                if (asoul.has(pid)) {
                    if (c.textContent.includes(tag_asoul) === false) {
                        c.innerHTML += tag_asoul_Inner
                    }
                    return
                } else if (no_asoul.has(pid)) {
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
                            //au
                            if (bshow && (st.includes(keyword_jxt) || st.includes(keyword_dwr) || st.includes(keyword_nal) || st.includes(keyword_bjx))) {
                                c.innerHTML += "<b style='color: #FC966E' >【 au |  "
                                //添加嘉心糖标签
                                if (st.includes(keyword_jxt)) {
                                    c.innerHTML += tag_jxt_Inner
                                    jxt.add(pid)
                                } else {
                                    no_jxt.add(pid)
                                }
                                //添加顶碗人标签
                                if (st.includes(keyword_dwr)) {
                                    c.innerHTML += tag_dwr_Inner
                                    dwr.add(pid)
                                } else {
                                    no_dwr.add(pid)
                                }
                                //添加奶淇琳标签
                                if (st.includes(keyword_nql)) {
                                    c.innerHTML += tag_nql_Inner
                                    nql.add(pid)
                                } else {
                                    no_nql.add(pid)
                                }
                                //添加贝极星标签
                                if (st.includes(keyword_bjx)) {
                                    c.innerHTML += tag_bjx_Inner
                                    bjx.add(pid)
                                } else {
                                    no_bjx.add(pid)
                                }
                                //添加一个魂标签
                                if (st.includes(keyword_asoul)) {
                                    c.innerHTML += tag_asoul_Inner
                                    asoul.add(pid)
                                } else {
                                    no_asoul.add(pid)
                                }
                                c.innerHTML += "<b style='color: #FC966E' >】</b>"
                            }

                            //添加原粥农标签
                            if (st.includes(keyword_nong) && st.includes(keyword_yuan) && st.includes(keyword_zhou)) {
                                c.innerHTML += tag_sanxiang_Inner
                                sanxiang.add(pid)
                            } else {
                                no_sanxiang.add(pid)
                            }
                            //添加原粥标签
                            if (st.includes(keyword_yuan) && st.includes(keyword_zhou) && !st.includes(keyword_nong)) {
                                c.innerHTML += tag_yuanzhou_Inner
                                yuanzhou.add(pid)
                            } else {
                                no_yuanzhou.add(pid)
                            }
                            //添加原农标签
                            if (st.includes(keyword_yuan) && !st.includes(keyword_zhou) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_yuannong_Inner
                                yuannong.add(pid)
                            } else {
                                no_yuannong.add(pid)
                            }
                            //添加农粥标签
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
                            //添加三畜标签
                            if (st.includes(keyword_scg)) {
                                c.innerHTML += tag_scg_Inner
                                scg.add(pid)
                                return
                            } else {
                                no_scg.add(pid)
                            }
                            //添加网友标签
                            if (st.includes(keyword_nng) && !st.includes(keyword_yuan) && !st.includes(keyword_zhou)) {
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