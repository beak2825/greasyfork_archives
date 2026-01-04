// ==UserScript==
// @name         新·三相之力指示器
// @namespace    www.cber.ltd
// @version      0.3.1
// @description  B站评论区自动标注三相玩家，依据是动态里是否有三相相关内容（基于原神指示器和原三相一些小的修改）
// @author       xulaupuz & nightswan & SnhAenIgseAl
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451239/%E6%96%B0%C2%B7%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451239/%E6%96%B0%C2%B7%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const unknown = new Set()

    //成分，可自定义
    const nor = new Set()
    const no_nor = new Set()
    const cj = new Set()
    const no_cj = new Set()
    const yuanyou = new Set()
    const no_yuanyou = new Set()
    const zhouyou = new Set()
    const no_zhouyou = new Set()
    const nongyou = new Set()
    const no_nongyou = new Set()
    const yuanzhou = new Set()
    const no_yuanzhou = new Set()
    const yuannong = new Set()
    const no_yuannong = new Set()
    const nongzhou = new Set()
    const no_nongzhou = new Set()
    const yuanbeng = new Set()
    const no_yuanbeng = new Set()
    const sanxiang = new Set()
    const no_sanxiang = new Set()

    //关键词，可自定义
    const keyword_cj = "#抽奖#"
    const keyword_yuan = "原神"
    const keyword_zhou = "#明日方舟#"
    const keyword_nong = "#王者荣耀#"
    const keyword_bh3 = "#崩坏3#"

    //贴上标签，可自定义
    const tag_nor = " 【 普通丨纯良 】"
    const tag_cj = " 【 隐藏丨动态抽奖 】"
    const tag_yuan = " 【 稀有丨我超，原！】"
    const tag_zhou = " 【 稀有丨我超，粥！】"
    const tag_nong = " 【 稀有丨我超，农！】"
    const tag_yuanzhou = " 【 史诗丨原 & 粥！】"
    const tag_yuannong = " 【 史诗丨原 & 农！】"
    const tag_zhounong = " 【 史诗丨粥 & 农！】"
    const tag_yuanbeng = " 【 提纯丨原 & 崩！】"
    const tag_sanxiang = " 【 传奇丨三相之力】"

    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    //标签颜色，可自定义，默认为B站会员色
    const tag_nor_Inner="<b style='color: #778899'>" + tag_nor + "</b>"
    const tag_cj_Inner="<b style='color: #43A047'>" + tag_cj + "</b>"
    const tag_yuan_Inner="<b style='color: #1976D2'>" + tag_yuan + "</b>"
    const tag_zhou_Inner="<b style='color: #1976D2'>" + tag_zhou + "</b>"
    const tag_nong_Inner="<b style='color: #1976D2'>" + tag_nong + "</b>"
    const tag_yuanzhou_Inner="<b style='color: #BA55D3'>" + tag_yuanzhou + "</b>"
    const tag_yuannong_Inner="<b style='color: #BA55D3'>" + tag_yuannong + "</b>"
    const tag_nongzhou_Inner="<b style='color: #BA55D3'>" + tag_zhounong + "</b>"
    const tag_yuanbeng_Inner="<b style='color: #FF0000'>" + tag_yuanbeng + "</b>"
    const tag_sanxiang_Inner="<b style='color: #FF8C00'>" + tag_sanxiang + "</b>"

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
    let jiance = setInterval(()=>{
        let commentlist = get_comment_list()
        if (commentlist.length != 0){
            // clearInterval(jiance)
            commentlist.forEach(c => {
                let pid = get_pid(c)
                
                if (sanxiang.has(pid)) {
                    if (c.textContent.includes(tag_sanxiang) === false) {
                        c.innerHTML += tag_sanxiang_Inner
                    }
                    return
                } else if (no_sanxiang.has(pid)) {
                    // do nothing
                    return
                }
                if (yuanbeng.has(pid)) {
                    if (c.textContent.includes(tag_yuanbeng) === false) {
                        c.innerHTML += tag_yuanbeng_Inner
                    }
                    return
                } else if (no_yuanbeng.has(pid)) {
                    // do nothing
                    return
                }
                if (yuannong.has(pid)) {
                    if (c.textContent.includes(tag_yuannong) === false) {
                        c.innerHTML += tag_yuannong_Inner
                    }
                    return
                } else if (no_yuannong.has(pid)) {
                    // do nothing
                    return
                }
                if (nongzhou.has(pid)) {
                    if (c.textContent.includes(tag_nongzhou) === false) {
                        c.innerHTML += tag_nongzhou_Inner
                    }
                    return
                } else if (no_nongzhou.has(pid)) {
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

                if (cj.has(pid)) {
                    if (c.textContent.includes(tag_cj) === false) {
                        c.innerHTML += tag_cj_Inner
                    }
                    return
                } else if (no_cj.has(pid)) {
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
                    headers:  {
                        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                    },
                    onload: function(res){
                        if(res.status === 200){
                            //console.log('成功')
                            let st = JSON.stringify(JSON.parse(res.response).data)
                            unknown.delete(pid)
                            
                            //添加三相标签
                            if (st.includes(keyword_nong) && st.includes(keyword_yuan) && st.includes(keyword_zhou)){
                                c.innerHTML += tag_sanxiang_Inner
                                sanxiang.add(pid)
                                return
                            } else {
                                no_sanxiang.add(pid)
                            }
                            //添加原崩标签
                            if (st.includes(keyword_yuan) && st.includes(keyword_bh3)){
                                c.innerHTML += tag_yuanbeng_Inner
                                yuanbeng.add(pid)
                                return
                            } else {
                                no_yuanbeng.add(pid)
                            }
                            //添加原粥标签
                            if (st.includes(keyword_yuan) && st.includes(keyword_zhou)){
                                c.innerHTML += tag_yuanzhou_Inner
                                yuanzhou.add(pid)
                                return
                            } else {
                                no_yuanzhou.add(pid)
                            }
                            //添加原农标签
                            if (st.includes(keyword_yuan) && st.includes(keyword_nong)){
                                c.innerHTML += tag_yuannong_Inner
                                yuannong.add(pid)
                                return
                            } else {
                                no_yuannong.add(pid)
                            }
                            //添加粥农标签
                            if (st.includes(keyword_zhou) && st.includes(keyword_nong)){
                                c.innerHTML += tag_nongzhou_Inner
                                nongzhou.add(pid)
                                return
                            } else {
                                no_nongzhou.add(pid)
                            }
                            //添加原神标签
                            if (st.includes(keyword_yuan)){
                                c.innerHTML += tag_yuan_Inner
                                yuanyou.add(pid)
                                return
                            } else {
                                no_yuanyou.add(pid)
                            }
                            //添加方舟标签
                            if (st.includes(keyword_zhou)){
                                c.innerHTML += tag_zhou_Inner
                                zhouyou.add(pid)
                                return
                            } else {
                                no_zhouyou.add(pid)
                            }
                            //添加农药标签
                            if (st.includes(keyword_nong)){
                                c.innerHTML += tag_nong_Inner
                                nongyou.add(pid)
                                return
                            } else {
                                no_nongyou.add(pid)
                            }
                            //添加隐藏标签，有动态抽奖不再纯良
                            if (st.includes(keyword_cj)){
                                c.innerHTML += tag_cj_Inner
                                cj.add(pid)
                            } else {
                                //添加纯良标签
                                no_cj.add(pid)
                                c.innerHTML += tag_nor_Inner
                                nor.add(pid)
                            }
                        }else{
                            console.log('失败')
                            console.log(res)
                        }
                    },
                });
            });
        }
    }, 4000)
})();