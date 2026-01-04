// ==UserScript==
// @name         网络成分指示器
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  B站视频评论区自动标记其常互动的游戏和皮套人，依据是动态里是否有相关内容
// @author       SD
// @match        https://www.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451253/%E7%BD%91%E7%BB%9C%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451253/%E7%BD%91%E7%BB%9C%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const unknown = new Set()


    //可以自行修改，在编辑页面按Ctrl+S即可立即保存并应用
    const yuanyou = new Set()
    const no_yuanyou = new Set()
    const keyword = "#原神"
    const tag = " ★原神玩家 "

    const mrfz = new Set()
    const no_mrfz = new Set()
    const mrfzKeyword = "方舟"
    const mrfzTag = " ★粥友 "

    const wzry = new Set()
    const no_wzry = new Set()
    const wzryKeyword = "王者荣耀"
    const wzryTag = " ★农友 "

    const sanchu = new Set()
    const no_sanchu = new Set()
    const sanchuKeyword = "小狗说"
    const sanchuTag = " ★3畜 "

    const jiaxt = new Set()
    const no_jiaxt = new Set()
    const jiaxtKeyword = "嘉然"
    const jiaxtTag = " ★嘉心糖 "

    const ava = new Set()
    const no_ava = new Set()
    const avaKeyword = "向晚大魔王"
    const avaTag = " ★顶晚人 "

    const eileen = new Set()
    const no_eileen = new Set()
    const eileenKeyword = "乃琳Queen"
    const eileenTag = " ★奶淇琳 "

    const kira = new Set()
    const no_kira = new Set()
    const kiraKeyword = "贝拉"
    const kiraTag = " ★贝极星 "

    const carol = new Set()
    const no_carol = new Set()
    const carolKeyword = "珈乐Carol"
    const carolTag = " ★皇家小丑 "

    const ccj = new Set()
    const no_ccj = new Set()
    const ccjKeyword = "塔菲"
    const ccjTag = " ★雏草姬 "

    const tongxj = new Set()
    const no_tongxj = new Set()
    const tongxjKeyword = "星瞳"
    const tongxjTag = " ★小星星 "

    const cuicuisha = new Set()
    const no_cuicuisha = new Set()
    const cuicuishaKeyword = "七海Nana"
    const cuicuishaTag = " ★脆脆鲨 "

    const eoe = new Set()
    const no_eoe = new Set()
    const eoeKeyw1 = "米诺"
    const eoeKeyw2 = "露早"
    const eoeKeyw3 = "莞儿"
    const eoeKeyw4 = "柚恩"
    const eoeKeyw5 = "虞莫"
    const eoeKeyw6 = "GOGO"
    const eoeTag = " ★EOE粉 "


    const rtc = new Set()
    const no_rtc = new Set()
    const rtcKeyw1 = "衿儿"
    const rtcKeyw2 = "结衿"
    const rtcKeyw3 = "小粒q"
    const rtcKeyw4 = "衿粒"
    const rtcKeyw5 = "奕伍"
    const rtcKeyw6 = "鑫儿"
    const rtcKeyw7 = "任玥"
    const rtcTag = " ★肉体厨"

    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

    const get_pid = (c) => {
        if (is_new) {
            return c.dataset.userId
        } else {
            return c.children[0].href.replace(/[^\d]/g, "")
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

                //如果要增加这里也要改
                if (yuanyou.has(pid)) {
                    if (c.textContent.includes(tag) === false) { c.append(tag) }
                    return
                } else if (no_yuanyou.has(pid)) {
                    return
                }

                if (mrfz.has(pid)) {
                    if (c.textContent.includes(mrfzTag) === false) { c.append(mrfzTag) }
                    return
                } else if (no_mrfz.has(pid)) {
                    return
                }

                if (wzry.has(pid)) {
                    if (c.textContent.includes(wzryTag) === false) { c.append(wzryTag) }
                    return
                } else if (no_wzry.has(pid)) {
                    return
                }

                if (sanchu.has(pid)) {
                    if (c.textContent.includes(sanchuTag) === false && !pid.includes(33605910)) { c.append(sanchuTag) }
                    return
                } else if (no_sanchu.has(pid)) {
                    return
                }

                if (jiaxt.has(pid)) {
                    if (c.textContent.includes(jiaxtTag) === false) { c.append(jiaxtTag) }
                    return
                } else if (no_jiaxt.has(pid)) {
                    return
                }

                if (ava.has(pid)) {
                    if (c.textContent.includes(avaTag) === false) { c.append(avaTag) }
                    return
                } else if (no_ava.has(pid)) {
                    return
                }

                if (eileen.has(pid)) {
                    if (c.textContent.includes(eileenTag) === false) { c.append(eileenTag) }
                    return
                } else if (no_eileen.has(pid)) {
                    return
                }

                if (kira.has(pid)) {
                    if (c.textContent.includes(kiraTag) === false) { c.append(kiraTag) }
                    return
                } else if (no_kira.has(pid)) {
                    return
                }

                if (carol.has(pid)) {
                    if (c.textContent.includes(carolTag) === false) { c.append(carolTag) }
                    return
                } else if (no_carol.has(pid)) {
                    return
                }

                if (ccj.has(pid)) {
                    if (c.textContent.includes(ccjTag) === false) { c.append(ccjTag) }
                    return
                } else if (no_ccj.has(pid)) {
                    return
                }

                if (tongxj.has(pid)) {
                    if (c.textContent.includes(tongxjTag) === false) { c.append(tongxjTag) }
                    return
                } else if (no_tongxj.has(pid)) {
                    return
                }

                if (cuicuisha.has(pid)) {
                    if (c.textContent.includes(cuicuishaTag) === false) { c.append(cuicuishaTag) }
                    return
                } else if (no_cuicuisha.has(pid)) {
                    return
                }

                if (eoe.has(pid)) {
                    if (c.textContent.includes(eoeTag) === false) { c.append(eoeTag) }
                    return
                } else if (no_eoe.has(pid)) {
                    return
                }

                if (rtc.has(pid)) {
                    if (c.textContent.includes(rtcTag) === false) { c.append(rtcTag) }
                    return
                } else if (no_rtc.has(pid)) {
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
                            //判断成分
                            if (st.includes(keyword)){
                                c.append(tag)
                                yuanyou.add(pid)
                            } else { no_yuanyou.add(pid) }

                            if (st.includes(mrfzKeyword)){
                                c.append(mrfzTag)
                                mrfz.add(pid)
                            } else { no_mrfz.add(pid) }

                            if (st.includes(wzryKeyword)){
                                c.append(wzryTag)
                                wzry.add(pid)
                            } else { no_wzry.add(pid) }

                            if (st.includes(sanchuKeyword)){
                                if(pid.includes(33605910)){
                                    c.append(' 😈恶魔啵刚')
                                }
                                else{
                                    c.append(sanchuTag)
                                }
                                sanchu.add(pid)
                            } else { no_sanchu.add(pid) }

                            if (st.includes(jiaxtKeyword)){
                                c.append(jiaxtTag)
                                jiaxt.add(pid)
                            } else { no_jiaxt.add(pid) }

                            if (st.includes(avaKeyword)){
                                c.append(avaTag)
                                ava.add(pid)
                            } else { no_ava.add(pid) }

                            if (st.includes(eileenKeyword)){
                                c.append(eileenTag)
                                eileen.add(pid)
                            } else { no_eileen.add(pid) }

                            if (st.includes(kiraKeyword)){
                                c.append(kiraTag)
                                kira.add(pid)
                            } else { no_kira.add(pid) }

                            if (st.includes(carolKeyword)){
                                c.append(carolTag)
                                carol.add(pid)
                            } else { no_carol.add(pid) }

                            if (st.includes(ccjKeyword)){
                                c.append(ccjTag)
                                ccj.add(pid)
                            } else { no_ccj.add(pid) }

                            if (st.includes(tongxjKeyword)){
                                c.append(tongxjTag)
                                tongxj.add(pid)
                            } else { no_tongxj.add(pid) }

                            if (st.includes(cuicuishaKeyword)){
                                c.append(cuicuishaTag)
                                cuicuisha.add(pid)
                            } else { no_cuicuisha.add(pid) }

                            if (st.includes(eoeKeyw1) || st.includes(eoeKeyw2) || st.includes(eoeKeyw3) || st.includes(eoeKeyw4) || st.includes(eoeKeyw5) || st.includes(eoeKeyw6)){
                                c.append(eoeTag)
                                eoe.add(pid)
                            } else { no_eoe.add(pid) }

                            if (st.includes(rtcKeyw1) || st.includes(rtcKeyw2) || st.includes(rtcKeyw3) || st.includes(rtcKeyw4) || st.includes(rtcKeyw5) || st.includes(rtcKeyw6) ||
                               c.includes(rtcKeyw1) || c.includes(rtcKeyw2) || c.includes(rtcKeyw4) || c.includes(rtcKeyw5) || c.includes(rtcKeyw6)){
                                c.append(rtcTag)
                                rtc.add(pid)
                            } else { no_rtc.add(pid) }

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