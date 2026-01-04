// ==UserScript==
// @name         新新新·查成分小助手（个人自用版Plus,增加对觅长生水军的查询）
// @namespace    www.bilibili.com
// @version      1.12
// @description  鉴于最近修仙游戏下必有人提觅长生,特意修改并增加了该词条。
// @author       xulaupuz & nightswan & SnhAenIgseAl&laogouqi & Not_Exist
// @match        https://*.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/459117/%E6%96%B0%E6%96%B0%E6%96%B0%C2%B7%E6%9F%A5%E6%88%90%E5%88%86%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%E7%89%88Plus%2C%E5%A2%9E%E5%8A%A0%E5%AF%B9%E8%A7%85%E9%95%BF%E7%94%9F%E6%B0%B4%E5%86%9B%E7%9A%84%E6%9F%A5%E8%AF%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/459117/%E6%96%B0%E6%96%B0%E6%96%B0%C2%B7%E6%9F%A5%E6%88%90%E5%88%86%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%E7%89%88Plus%2C%E5%A2%9E%E5%8A%A0%E5%AF%B9%E8%A7%85%E9%95%BF%E7%94%9F%E6%B0%B4%E5%86%9B%E7%9A%84%E6%9F%A5%E8%AF%A2%EF%BC%89.meta.js
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
    const sc = new Set()
    const no_sc = new Set()
    const dwr = new Set()
    const no_dwr = new Set()
    const bjx = new Set()
    const no_bjx = new Set()
    const nql = new Set()
    const no_nql = new Set()
    const xxx = new Set()
    const no_xxx = new Set()
    const xhz = new Set()
    const no_xhz = new Set()
    const mcs = new Set()
    const no_mcs = new Set()

    //关键词，可自定义
    const keyword_yuan = "原神"
    const keyword_zhou = "明日方舟"
    const keyword_nong = "王者荣耀"
    const keyword_jxt = "嘉然"
    const keyword_ccj = "塔菲"
    const keyword_gcb = "東雪蓮"
    const keyword_jn = "七海"
    const keyword_mml = "猫雷"
    const keyword_sc = "小狗说"
    const keyword_dwr = "向晚"
    const keyword_bjx = "贝拉"
    const keyword_nql = "乃琳"
    const keyword_xxx = "星瞳"
    const keyword_xhz = "梓"
    const keyword_mcs = "觅长生"

    //贴上标签，可自定义
    const tag_nor = " 【 普通 |  纯良】"
    const tag_yuan = " 【 稀有 |  原批】"
    const tag_zhou = " 【 稀有 |  粥畜】"
    const tag_nong = " 【 稀有 |  农批】"
    const tag_yuanzhou = " 【 史诗 | 二次元双象限】"
    const tag_yuannong = " 【 史诗 |  双批齐聚】"
    const tag_zhounong = " 【 史诗 |  稀有的存在】"
    const tag_sanxiang = " 【 传奇 |  三相之力】"
    const tag_jxt = " 嘉心糖"
    const tag_ccj = " 雏草姬"
    const tag_gcb = " 棺材板"
    const tag_jn = " 杰尼"
    const tag_mml = " 喵喵露"
    const tag_sc = " 三畜"
    const tag_dwr = " 顶碗人"
    const tag_bjx = " 贝极星"
    const tag_nql = " 奶淇琳"
    const tag_xxx = " 小星星"
    const tag_xhz = " 小孩梓"
    const tag_mcs = "【 罕见 |  觅批】"


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

    const tag_jxt_Inner = "<b style='color: #E799B0'>" + tag_jxt + "</b>"
    const tag_ccj_Inner = "<b style='color: #FF00CC'>" + tag_ccj + "</b>"
    const tag_gcb_Inner = "<b style='color: #C0C0C0'>" + tag_gcb + "</b>"
    const tag_jn_Inner = "<b style='color: #947583'>" + tag_jn + "</b>"
    const tag_mml_Inner = "<b style='color: #00FF00'>" + tag_mml + "</b>"
    const tag_sc_Inner = "<b style='color: #B8A6D9'>" + tag_sc + "</b>"
    const tag_dwr_Inner = "<b style='color: #9AC8E2'>" + tag_dwr + "</b>"
    const tag_bjx_Inner = "<b style='color: #DB7D74'>" + tag_bjx + "</b>"
    const tag_nql_Inner = "<b style='color: #576690'>" + tag_nql + "</b>"
    const tag_xxx_Inner = "<b style='color: #E0E0E0'>" + tag_xxx + "</b>"
    const tag_xhz_Inner = "<b style='color: #9900FF'>" + tag_xhz + "</b>"
	const tag_mcs_Inner = "<b style='color: #11DD77'>" + tag_mcs + "</b>"

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
                if (sc.has(pid)) {
                    if (c.textContent.includes(tag_sc) === false) {
                        c.innerHTML += tag_sc_Inner
                    }
                    return
                } else if (no_sc.has(pid)) {
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
                if (bjx.has(pid)) {
                    if (c.textContent.includes(tag_bjx) === false) {
                        c.innerHTML += tag_bjx_Inner
                    }
                    return
                } else if (no_bjx.has(pid)) {
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
                if (xxx.has(pid)) {
                    if (c.textContent.includes(tag_xxx) === false) {
                        c.innerHTML += tag_xxx_Inner
                    }
                    return
                } else if (no_xxx.has(pid)) {
                    // do nothing
                    return
                }
                if (xhz.has(pid)) {
                    if (c.textContent.includes(tag_xhz) === false) {
                        c.innerHTML += tag_xhz_Inner
                    }
                    return
                } else if (no_xhz.has(pid)) {
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
                if (mcs.has(pid)) {
                    if (c.textContent.includes(tag_mcs) === false) {
                        c.innerHTML += tag_mcs_Inner
                    }
                    return
                } else if (no_mcs.has(pid)) {
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
                            //vtuber
                            if (bshow && (st.includes(keyword_jxt) || st.includes(keyword_ccj) || st.includes(keyword_gcb)||st.includes(keyword_jn)||st.includes(keyword_mml)||st.includes(keyword_sc)||st.includes(keyword_dwr)||st.includes(keyword_bjx)||st.includes(keyword_nql)||st.includes(keyword_xxx)||st.includes(keyword_xhz))) {
                                c.innerHTML += "<b style='color: #000000' >【 Vtuber |  </b>"
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
                                //添加猫雷标签
                                if (st.includes(keyword_mml)) {
                                    c.innerHTML += tag_mml_Inner
                                    mml.add(pid)
                                } else {
                                    no_mml.add(pid)
                                }
                                //添加三畜标签
                                if (st.includes(keyword_sc)) {
                                    c.innerHTML += tag_sc_Inner
                                    sc.add(pid)
                                } else {
                                    no_sc.add(pid)
                                }
                                //添加顶碗人标签
                                if (st.includes(keyword_dwr)) {
                                    c.innerHTML += tag_dwr_Inner
                                    dwr.add(pid)
                                } else {
                                    no_dwr.add(pid)
                                }
                                //添加贝极星标签
                                if (st.includes(keyword_bjx)) {
                                    c.innerHTML += tag_bjx_Inner
                                    bjx.add(pid)
                                } else {
                                    no_bjx.add(pid)
                                }
                                //添加奶淇琳标签
                                if (st.includes(keyword_nql)) {
                                    c.innerHTML += tag_nql_Inner
                                    nql.add(pid)
                                } else {
                                    no_nql.add(pid)
                                }
                                //添加小星星标签
                                if (st.includes(keyword_xxx)) {
                                    c.innerHTML += tag_xxx_Inner
                                    xxx.add(pid)
                                } else {
                                    no_xxx.add(pid)
                                }
                                //添加小孩梓标签
                                if (st.includes(keyword_xhz)) {
                                    c.innerHTML += tag_xhz_Inner
                                    xhz.add(pid)
                                } else {
                                    no_xhz.add(pid)
                                }
                                c.innerHTML += "<b style='color: #000000' >】</b>"
                            }

                            //添加三相标签
                            if (st.includes(keyword_nong) && st.includes(keyword_yuan) && st.includes(keyword_zhou)) {
                                c.innerHTML += tag_sanxiang_Inner
                                sanxiang.add(pid)
                                return
                            } else {
                                no_sanxiang.add(pid)
                            }
                            //添加二次元标签
                            if (st.includes(keyword_yuan) && st.includes(keyword_zhou) && !st.includes(keyword_nong)) {
                                c.innerHTML += tag_yuanzhou_Inner
                                yuanzhou.add(pid)
                                return
                            } else {
                                no_yuanzhou.add(pid)
                            }
                            //添加批批标签
                            if (st.includes(keyword_yuan) && !st.includes(keyword_zhou) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_yuannong_Inner
                                yuannong.add(pid)
                                return
                            } else {
                                no_yuannong.add(pid)
                            }
                            //添加稀有标签
                            if (!st.includes(keyword_yuan) && st.includes(keyword_zhou) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_nongzhou_Inner
                                nongzhou.add(pid)
                                return
                            } else {
                                no_nongzhou.add(pid)
                            }
                            //添加原神标签
                            if (st.includes(keyword_yuan) && !st.includes(keyword_zhou) && !st.includes(keyword_nong)) {
                                c.innerHTML += tag_yuan_Inner
                                yuanyou.add(pid)
                                return
                            } else {
                                no_yuanyou.add(pid)
                            }
                            //添加方舟标签
                            if (!st.includes(keyword_yuan) && st.includes(keyword_zhou) && !st.includes(keyword_nong)) {
                                c.innerHTML += tag_zhou_Inner
                                zhouyou.add(pid)
                                return
                            } else {
                                no_zhouyou.add(pid)
                            }
                            //添加农药标签
                            if (!st.includes(keyword_yuan) && !st.includes(keyword_zhou) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_nong_Inner
                                nongyou.add(pid)
                                return
                            } else {
                                no_nongyou.add(pid)
                            }
							//添加觅长生标签
                            if (st.includes(keyword_mcs)) {
                                c.innerHTML += tag_mcs_Inner
                                mcs.add(pid)
                                return
                            } else {
                                no_mcs.add(pid)
                            }
                            //添加纯良标签
                            c.innerHTML += tag_nor_Inner
                            nor.add(pid)
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