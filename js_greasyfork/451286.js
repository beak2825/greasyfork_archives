// ==UserScript==
// @name         原神王者GTA玩家友好交流工具
// @namespace    NightSwan
// @version      1.7
// @description  b站交流工具
// @author       admin
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451286/%E5%8E%9F%E7%A5%9E%E7%8E%8B%E8%80%85GTA%E7%8E%A9%E5%AE%B6%E5%8F%8B%E5%A5%BD%E4%BA%A4%E6%B5%81%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/451286/%E5%8E%9F%E7%A5%9E%E7%8E%8B%E8%80%85GTA%E7%8E%A9%E5%AE%B6%E5%8F%8B%E5%A5%BD%E4%BA%A4%E6%B5%81%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const unknown = new Set()

    //成分，可自定义
    const yuanyou = new Set()
    const no_yuanyou = new Set()
    const nongyou = new Set()
    const no_nongyou = new Set()
    const gta = new Set()
    const no_gta = new Set()
    const gta_gp = new Set()
    const no_gta_gp = new Set()


    //关键词，可自定义
    const keyword_yuan = "原神"
    const keyword_nong = "王者荣耀"
    const keyword_gta_1 = "gta"
    const keyword_gta_2 = "GTA"
    const keyword_gta_3 = "CEHT"
    const keyword_gta_4 = "ceht"
    const keyword_gta_5 = "佩里克岛"
    const keyword_gta_6 = "佩里科岛"
    const keyword_gta_7 = "名钻赌场"
    const keyword_gp_1 = "小助手"
    const keyword_gp_2 = "2t"
    const keyword_gp_3 = "2T"
    const keyword_gp_4 = "Stand"
    const keyword_gp_5 = "stand"
    const keyword_gp_6 = "樱桃"
    const keyword_gp_7 = "表演者"
    const keyword_gp_8 = "屎蛋"
    const keyword_gp_9 = "暗星"
    const keyword_gp_10 = "毒液"
    const keyword_gp_11 = "幻影"



    //贴上标签，可自定义
    const tag_yuan = " 原批 "
    const tag_nong = " 农批 "
    const tag_gta = " GTA批 "
    const tag_gp = " 挂批 "

    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    //标签和背景颜色，可自定义，默认为B站会员色
    const color = "#ffffff"
    const bgColor = "#fb7299"
    const tag_Inner_left = "<div style='padding: 0px 10px;color:" + color + ";background:" + bgColor + ";float:left;border-radius:25px;font-size: 16px;font-weight: bold;font-style: italic;margin-right: 10px;height: 24px;line-height: 24px'>"
    const tag_Inner_right = "</div>"


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
                if (yuanyou.has(pid)) {
                    return
                } else if (no_yuanyou.has(pid)) {
                    // do nothing
                    return
                }
                if (nongyou.has(pid)) {
                    return
                } else if (no_nongyou.has(pid)) {
                    // do nothing
                    return
                }
                if (gta.has(pid)) {
                    return
                } else if (no_gta.has(pid)) {
                    // do nothing
                    return
                }
                if (gta_gp.has(pid)) {
                    return
                } else if (no_gta_gp.has(pid)) {
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
							// 判断原批
                            let is_yuan = st.includes(keyword_yuan)
							// 判断农批
                            let is_nong = st.includes(keyword_nong)
							// 判断GTA批
                            let is_gta = st.includes(keyword_gta_1) ||
										st.includes(keyword_gta_2) ||
										st.includes(keyword_gta_3) ||
										st.includes(keyword_gta_4) ||
										st.includes(keyword_gta_5) ||
										st.includes(keyword_gta_6) ||
										st.includes(keyword_gta_7)
							// 判断GTA挂批
                            let is_gta_gp = is_gta && (st.includes(keyword_gp_1) ||
											st.includes(keyword_gp_2) ||
											st.includes(keyword_gp_3) ||
											st.includes(keyword_gp_4) ||
											st.includes(keyword_gp_5) ||
											st.includes(keyword_gp_6) ||
											st.includes(keyword_gp_7) ||
											st.includes(keyword_gp_8) ||
											st.includes(keyword_gp_9) ||
											st.includes(keyword_gp_10) ||
											st.includes(keyword_gp_11))
                            let tag_Inner = tag_Inner_left
                            //添加标签
                            if (is_yuan || is_nong || is_gta || is_gta_gp) {
                                let num = 0
                                //检索原批
                                if (is_yuan && !yuanyou.has(pid)){
                                    tag_Inner += tag_yuan
                                    num++
                                    yuanyou.add(pid)
                                } else {
                                    no_yuanyou.add(pid)
                                }
                                //检索农批
                                if (is_nong && !nongyou.has(pid)){
                                    tag_Inner += tag_nong
                                    num++
                                    nongyou.add(pid)
                                } else {
                                    no_nongyou.add(pid)
                                }
                                //检索gta批
                                if (is_gta && !gta.has(pid)){
                                    tag_Inner += tag_gta
                                    num++
                                    gta.add(pid)
                                } else {
                                    no_gta.add(pid)
                                }
                                //检索gta挂批
                                if (is_gta_gp && !gta_gp.has(pid)){
                                    tag_Inner += tag_gp
                                    num++
                                    gta_gp.add(pid)
                                } else {
                                    no_gta_gp.add(pid)
                                }
                                //解决某些情况下重复显示标签的问题
                                if(num > 0){
                                    tag_Inner += tag_Inner_right
                                    c.innerHTML += tag_Inner
                                }
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