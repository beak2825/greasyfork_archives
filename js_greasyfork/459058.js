// ==UserScript==
// @name         魔改版·三相之力指示器
// @namespace    www.bilibili.com
// @version      1.14514
// @description  B站评论区自动标注三相玩家，依据是动态里是否有三相相关内容（基于原神指示器和原三相和新三向一些小的修改）（本人魔改，侵权删）
// @author       xulaupuz&nightswan&kikiler
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
// @downloadURL https://update.greasyfork.org/scripts/459058/%E9%AD%94%E6%94%B9%E7%89%88%C2%B7%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/459058/%E9%AD%94%E6%94%B9%E7%89%88%C2%B7%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
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
    const vtb_152 = new Set()
    const no_vtb_152 = new Set()
    const jys = new Set()
    const no_jys = new Set()
    const gugubird =new Set()
    const no_gugubird =new Set()
    const bwc =new Set()
    const no_bwc =new Set()
    const haya = new Set()
    const no_haya = new Set()
    const bottle = new Set()
    const no_bottle = new Set()
    const sh = new Set()

    //关键词，可自定义
    const keyword_yuan = "原神"
    const keyword_zhou2 = "方舟"
    const keyword_nong = "王者"
    const keyword_cj = "抽奖"
    const keyword_cj2 = "中奖"
    const keyword_cj3 = "分母"
    const keyword_jxt = "嘉然"
    const keyword_jxt2 = "然然"
    const keyword_ccj = "塔菲"
    const keyword_ccj2 = "塔爹"
    const keyword_ccj3 = "塔叠"
    const keyword_ccj4 = "雏草姬"
    const keyword_gcb = "雪莲"
    const keyword_jn = "七海"
    const keyword_mml = "草莓猫"
    const keyword_152 = "小阳"
    const keyword_jys = "我们结缘深"
    const keyword_jys2 = "我不结晶,也不入脑";
    const keyword_jys3 = "结缘深"
    const keyword_jys4 = "原深"
    const keyword_gugubird1 = "两千两千"
    const keyword_gugubird2 = "20002000"
    const keyword_gugubird3 = "群星与愤怒"
    const keyword_gugubird4 = "咕咕鸟"
    const keyword_bwc1 = "大白猫"
    const keyword_bwc2 = "艾尔莎"
    const keyword_bwc3 = "艾薯条"
    const keyword_haya = "花花"
    const keyword_sh = "哈哈哈哈"
    const keyword_haya2 = "花门"
    const keyword_bottle = "牛子豪"
    const keyword_bottle2 = "我们燃烧瓶"
    const keyword_bottle3 = "子君"
    const keyword_bottle4 = "瓶皇"
    const keyword_bottle5 = "包头"



    //贴上标签，可自定义
    const tag_nor = " 【 普通 |  纯良】"
    const tag_yuan = " 【 稀有 |  原友】"
    const tag_zhou = " 【 稀有 |  粥厨】"
    const tag_nong = " 【 稀有 |  农人】"
    const tag_yuanzhou = " 【 史诗 | 二次元双象限】"
    const tag_yuannong = " 【 史诗 |  双批齐聚】"
    const tag_zhounong = " 【 史诗 |  稀有的存在】"
    const tag_sanxiang = " 【 传奇 |  三相之力】"
    const tag_cj = " 【 隐藏 |  动态抽奖】"
    const tag_152 = " 【 超隐 | 小阳】"
    const tag_jxt = " 嘉心糖"
    const tag_ccj = " 雏草姬"
    const tag_gcb = " 棺材板"
    const tag_jn = " 杰尼"
    const tag_mml = " 梅梅露"
    const tag_jys = " 结缘深"
    const tag_gugubird = "鸟不灭"
    const tag_bwc = "艾薯条"
    const tag_haya = "花儿呀"
    const tag_bottle = "燃烧瓶"


    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    //标签颜色，可自定义，默认为B站会员色
    const tag_nor_Inner = "<b style='color: #11DD77'>" + tag_nor + "</b>"
    const tag_yuan_Inner = "<b style='color: #009900'>" + tag_yuan + "</b>"//绿色
    const tag_zhou_Inner = "<b style='color: #3366FF'>" + tag_zhou + "</b>"//蓝色
    const tag_nong_Inner = "<b style='color: #FF0000'>" + tag_nong + "</b>"//红色
    const tag_yuanzhou_Inner = "<b style='color: #FF00FF'>" + tag_yuanzhou + "</b>"//粉色
    const tag_yuannong_Inner = "<b style='color: #330000'>" + tag_yuannong + "</b>"//shit
    const tag_nongzhou_Inner = "<b style='color: #0000FF'>" + tag_zhounong + "</b>"//小罕见
    const tag_sanxiang_Inner = "<b style='color: #FFD700'>" + tag_sanxiang + "</b>"//金色
    const tag_cj_Inner = "<b style='color: #000000'>" + tag_cj + "</b>"
    const tag_152_Inner = "<b style='color: #254680'>" + tag_152 + "</b>"
    const tag_gugubird_Inner = "<b style='color:#FF4500'>" + tag_gugubird + "</b>"//橙红色

    const tag_jxt_Inner = "<b style='color: #FF69B4'>" + tag_jxt + "</b>"//软粉
    const tag_ccj_Inner = "<b style='color: #FFBBFF'>" + tag_ccj + "</b>"//骚粉
    const tag_gcb_Inner = "<b style='color: #D1EEEE'>" + tag_gcb + "</b>"//罕见
    const tag_jn_Inner = "<b style='color: #3300FF'>" + tag_jn + "</b>"//杰尼蓝
    const tag_mml_Inner = "<b style='color: #660099'>" + tag_mml + "</b>"//转生
    const tag_jys_Inner = "<b style='color: #ff9900'>" + tag_jys + "</b>"//结缘深
    const tag_bwc_Inner = "<b style='color: #2E8B57'>" + tag_bwc + "</b>"//艾薯条
    const tag_haya_Inner = "<b style='color: #9400D3'>" + tag_haya + "</b>"//花儿呀
    const tag_bottle_Inner = "<b style='color: #4682B4'>" + tag_bottle + "</b>"//燃烧瓶




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
                    if (c.textContent.includes(tag_zhounong) === false) {
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
                if (vtb_152.has(pid)) {
                    if (c.textContent.includes(tag_152) === false) {
                        c.innerHTML += tag_152_Inner
                    }
                    return
                } else if (no_vtb_152.has(pid)) {
                    // do nothing
                    return
                }//施工

                if (jys.has(pid)) {
                    if (c.textContent.includes(tag_jys) === false) {
                        c.innerHTML += tag_jys_Inner
                    }
                    return
                } else if (no_jys.has(pid)) {
                    // do nothing
                    return
                }

                if (gugubird.has(pid)) {
                    if (c.textContent.includes(tag_gugubird) === false) {
                        c.innerHTML += tag_gugubird_Inner
                    }
                    return
                } else if (no_gugubird.has(pid)) {
                    // do nothing
                    return
                }
                 if (haya.has(pid)) {
                    if (c.textContent.includes(tag_haya) === false) {
                        c.innerHTML += tag_haya_Inner
                    }
                    return
                } else if (no_haya.has(pid)) {
                    // do nothing
                    return
                }
                 if (bottle.has(pid)) {
                    if (c.textContent.includes(tag_bottle) === false) {
                        c.innerHTML += tag_bottle_Inner
                    }
                    return
                } else if (no_bottle.has(pid)) {
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
                            if (bshow && (st.includes(keyword_jxt) ||st.includes(keyword_jxt2)|| st.includes(keyword_ccj)||st.includes(keyword_ccj2)||st.includes(keyword_ccj3)||st.includes(keyword_ccj4) || st.includes(keyword_gcb)|| st.includes(keyword_jn)|| st.includes(keyword_jys)|| st.includes(keyword_mml)||st.includes(keyword_jys2)||st.includes(keyword_jys3)||st.includes(keyword_jys4)||st.includes(keyword_gugubird1)||st.includes(keyword_gugubird2)||st.includes(keyword_gugubird3)||st.includes(keyword_gugubird4)||st.includes(keyword_bwc1)||st.includes(keyword_bwc2)||st.includes(keyword_bwc3))) {
                                c.innerHTML += "<b style='color: #946845' >【 Vtuber |  "
                                //添加嘉然标签
                                if (st.includes(keyword_jxt)||st.includes(keyword_jxt2)) {
                                    c.innerHTML += tag_jxt_Inner
                                    jxt.add(pid)
                                } else {
                                    no_jxt.add(pid)
                                }
                                //添加塔菲标签
                                if (st.includes(keyword_ccj)||st.includes(keyword_ccj2)||st.includes(keyword_ccj3)||st.includes(keyword_ccj4)) {
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
                                //添加绿塔菲！标签
                                if (st.includes(keyword_mml)) {
                                    c.innerHTML += tag_mml_Inner
                                    mml.add(pid)
                                } else {
                                    no_mml.add(pid)
                                }
                                //添加结缘深标签
                                if (st.includes(keyword_jys)||st.includes(keyword_jys2)||st.includes(keyword_jys3)||st.includes(keyword_jys4)) {
                                    c.innerHTML += tag_jys_Inner
                                    jys.add(pid)
                                } else {
                                    no_jys.add(pid)
                                }

                                //添加鸟不灭标签
                                if (st.includes(keyword_gugubird1)||st.includes(keyword_gugubird2)||st.includes(keyword_gugubird3)||st.includes(keyword_gugubird4)) {
                                    c.innerHTML += tag_gugubird_Inner
                                    gugubird.add(pid)
                                } else {
                                    no_gugubird.add(pid)
                                }
                                //添加艾薯条标签
                                if (st.includes(keyword_bwc1)||st.includes(keyword_bwc2)||st.includes(keyword_bwc3)) {
                                    c.innerHTML += tag_bwc_Inner
                                    bwc.add(pid)
                                } else {
                                    no_bwc.add(pid)
                                }
                                c.innerHTML += "<b style='color: #946845' >】</b>"
                            }

                            //添加三相标签
                            if (st.includes(keyword_nong) && st.includes(keyword_yuan) && st.includes(keyword_zhou2)) {
                                c.innerHTML += tag_sanxiang_Inner
                                sanxiang.add(pid)
                            } else {
                                no_sanxiang.add(pid)
                            }
                            //添加二次元标签
                            if (st.includes(keyword_yuan) && st.includes(keyword_zhou2) && !st.includes(keyword_nong)) {
                                c.innerHTML += tag_yuanzhou_Inner
                                yuanzhou.add(pid)
                            } else {
                                no_yuanzhou.add(pid)
                            }
                            //添加粥批标签
                            if (st.includes(keyword_yuan) && !st.includes(keyword_zhou2) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_yuannong_Inner
                                yuannong.add(pid)
                            } else {
                                no_yuannong.add(pid)
                            }
                            //添加稀有标签
                            if (!st.includes(keyword_yuan) && st.includes(keyword_zhou2) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_nongzhou_Inner
                                nongzhou.add(pid)
                            } else {
                                no_nongzhou.add(pid)
                            }
                            //添加原神标签
                            if (st.includes(keyword_yuan) && !st.includes(keyword_zhou2) && !st.includes(keyword_nong)) {
                                c.innerHTML += tag_yuan_Inner
                                yuanyou.add(pid)
                            } else {
                                no_yuanyou.add(pid)
                            }
                            //添加方舟标签
                            if (!st.includes(keyword_yuan) && st.includes(keyword_zhou2) && !st.includes(keyword_nong)) {
                                c.innerHTML += tag_zhou_Inner
                                zhouyou.add(pid)
                            } else {
                                no_zhouyou.add(pid)
                            }
                            //添加农药标签
                            if (!st.includes(keyword_yuan) && !st.includes(keyword_zhou2) && st.includes(keyword_nong)) {
                                c.innerHTML += tag_nong_Inner
                                nongyou.add(pid)
                            } else {
                                no_nongyou.add(pid)
                            }
                            //添加隐藏标签
                            if (st.includes(keyword_cj)||st.includes(keyword_cj2)||st.includes(keyword_cj3)) {
                                c.innerHTML += tag_cj_Inner
                                cj.add(pid)
                                return
                            } else {
                                no_cj.add(pid)
                            }
                            //添加小阳标签
                            if (st.includes(keyword_152)) {
                                c.innerHTML += tag_152_Inner
                                vtb_152.add(pid)
                                return
                            } else {
                                no_vtb_152.add(pid)
                            }
                            //包头
                            if (st.includes(keyword_bottle)||st.includes(keyword_bottle2)||st.includes(keyword_bottle3)||st.includes(keyword_bottle4)||st.includes(keyword_bottle5)||st.includes(keyword_sh)) {
                                c.innerHTML += tag_bottle_Inner
                                bottle.add(pid)
                                return
                            } else {
                                no_bottle.add(pid)
                            }
                            //花花
                                if (st.includes(keyword_haya)||st.includes(keyword_haya2)||st.includes(keyword_sh)) {
                                c.innerHTML += tag_haya_Inner
                                haya.add(pid)
                                return
                            } else {
                                no_haya.add(pid)
                            }
                            //添加纯良标签
                            if (!st.includes(keyword_nong) && !st.includes(keyword_yuan) && !st.includes(keyword_zhou2)) {
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