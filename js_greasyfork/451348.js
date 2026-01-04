// ==UserScript==
// @name         蒸蒸日上·三相之力指示器
// @namespace    高贵乡公
// @version      0.3
// @description  B站评论区自动标注三国杀玩家，依据是动态里是否有三国杀相关内容,假如同时有卡宝或者出货则鉴定为杀批(检测到狗卡则取消贴杀批)（基于原神指示器和新三相一些小的修改）
// @author       xulaupuz&nightswan&高贵乡公
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451348/%E8%92%B8%E8%92%B8%E6%97%A5%E4%B8%8A%C2%B7%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451348/%E8%92%B8%E8%92%B8%E6%97%A5%E4%B8%8A%C2%B7%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const unknown = new Set()

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
    const sgs = new Set()
    const no_sgs = new Set()
    const zzrs = new Set()
    const no_zzrs = new Set()
    const gk = new Set()
    const no_gk = new Set()
    const sp = new Set()
    const no_sp = new Set()
    const kb = new Set()
    const no_kb = new Set()

    //关键词，可自定义
    const keyword_yuan = "原神"
    const keyword_zhou = "明日方舟"
    const keyword_nong = "王者荣耀"
    const keyword_cj = "抽奖"
    const keyword_sgs = "三国杀"
    const keyword_sp = "出货"
    const keyword_kb = "卡宝"
    const keyword_gk = "狗卡"
    const keyword_zzrs = "蒸蒸日上"
    //贴上标签，可自定义
    const tag_nor = " 【 普通 |  纯良】"
    const tag_yuan = " 【 稀有 |  原批】"
    const tag_zhou = " 【 稀有 |  粥畜】"
    const tag_nong = " 【 稀有 |  农批】"
    const tag_yuanzhou = " 【 史诗 | 二次元双象限】"
    const tag_yuannong = " 【 史诗 |  双批齐聚】"
    const tag_zhounong = " 【 史诗 |  稀有的存在】"
    const tag_sanxiang = " 【 传奇 |  三相之力】"
    const tag_sp = " 【 传奇 |  杀批】"
    const tag_cj = " 【 隐藏 |  动态抽奖】"
    const tag_sgs = " 【 三国杀 | 蒸蒸日上】"


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
    const tag_sp_Inner = "<b style='color: #FFD700'>" + tag_sp + "</b>"
    const tag_cj_Inner = "<b style='color: #254680'>" + tag_cj + "</b>"

    const tag_sgs_Inner = "<b style='color: #946845'>" + tag_sgs + "</b>"


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
                if (sgs.has(pid)) {
                    if (c.textContent.includes(tag_sgs) === false) {
                        c.innerHTML += tag_sgs_Inner
                    }
                    return
                } else if (no_sgs.has(pid)) {
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
                            //蒸蒸日上检测
                            if (st.includes(keyword_sgs)||st.includes(keyword_zzrs)||st.includes(keyword_gk)) {
                                //添加蒸蒸日上标签
                                if (st.includes(keyword_sgs)) {
                                    c.innerHTML += tag_sgs_Inner
                                    sgs.add(pid)
                                } else {
                                    no_sgs.add(pid)
                                }
                                var x =0
                                  //判断杀批标签
                                if ( st.includes(keyword_sp)||st.includes(keyword_kb)) {
                                     x=1
                                }
                                //取消判断杀批标签
                                if ( st.includes(keyword_gk)) {
                             x=0
                                }

                                //添加杀批标签
                            if( x==1){
                                c.innerHTML += tag_sp_Inner
                                sp.add(pid)
                            } else {
                                no_sp.add(pid)
                            }
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