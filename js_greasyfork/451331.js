// ==UserScript==
// @name         三畜粉丝牌指示器
// @namespace    3cg
// @version      0.5
// @description  查粉丝牌有无33S1和小狗说话题
// @author       XiaoMiku01 && rfiop
// @match        https://*.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451331/%E4%B8%89%E7%95%9C%E7%B2%89%E4%B8%9D%E7%89%8C%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451331/%E4%B8%89%E7%95%9C%E7%B2%89%E4%B8%9D%E7%89%8C%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const unknown = new Set()
    const yuanyou = new Set()
    const no_yuanyou = new Set()
        const yuanyou1 = new Set()
    const no_yuanyou1 = new Set()

    const keyword = "33S1"
    const tag = " 【有粉丝牌的3/】"
    const tag1 = "【3/】"
    const keyword1 = "name\":\"小狗说\""

    const blog = 'https://api.live.bilibili.com/xlive/web-ucenter/user/MedalWall?target_id='
    const blog1 = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='

    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版
    const tag_Inner = "<b style='color: #F40002'>" + tag + "</b>"
    const tag_Inne = "<b style='color: #F40002'>" + tag1 + "</b>"

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
                if (yuanyou.has(pid)) {
                    if (c.textContent.includes(tag) === false) {
                        c.innerHTML += tag_Inner
                    }
                   return
                } else if (no_yuanyou.has(pid)) {
                    // do nothing
                    return
                }
                 if (yuanyou1.has(pid)) {
                    if (c.textContent.includes(tag1) === false) {
                        c.innerHTML += tag_Inne
                    }
                   return
                } else if (no_yuanyou1.has(pid)) {
                    // do nothing
                    return
                }

                unknown.add(pid)
                //console.log(pid)
                let blogurl = blog + pid
                let blogur2 = blog1 + pid
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
                           GM_xmlhttpRequest({
                    method: "get",
                    url: blogur2,
                    data: '',
                    headers:  {
                        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                    },
                    onload: function(res1){
                        if(res1.status === 200){

                            //console.log('成功')
                            let st = JSON.stringify(JSON.parse(res.response).data)
                            let st1 = JSON.stringify(JSON.parse(res1.response).data)
                            unknown.delete(pid)
                            if (st.includes(keyword)){
                                c.innerHTML += tag_Inner
                                yuanyou.add(pid)
                            } else {
                                no_yuanyou.add(pid)
                            }
                            if (st1.includes(keyword1)){
                                c.innerHTML += tag_Inne
                                yuanyou1.add(pid)
                            } else {
                                no_yuanyou1.add(pid)
                            }
                             }
                         else{
                            console.log('失败')
                            console.log(res)
                        }
                          },
                        });
                        }
                        else{
                            console.log('失败')
                            console.log(res)
                        }
                    },
                });
            });
        }
    }, 4000)
})();