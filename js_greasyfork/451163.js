// ==UserScript==
// @name         b站用户成分指示器
// @namespace    Dengdads
// @version      0.7
// @description  B站评论区自动标注相关关键词，依据是动态里是否有相关内容（0.7加了在b站动态里查看）
// @author       Dengdads
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @original-script https://greasyfork.org/zh-CN/scripts/450720
// @original-author laupuz xu
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/451163/b%E7%AB%99%E7%94%A8%E6%88%B7%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451163/b%E7%AB%99%E7%94%A8%E6%88%B7%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const unknown = new Set()
    const yuanyou = new Set()
    const no_yuanyou = new Set()

    const keywords = ["原神", "明日方舟", "王者荣耀", "A-SOUL"]//可自行添加
    var tags = new Array()
    var i = 0
    var markf = " ||##"
    var markb = "##||"
    var tag=""
    while(keywords[i]){
        tag=markf + keywords[i] + markb
        tags.push(tag)
        i++
    }
    const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const is_new = document.getElementsByClassName('item goback').length != 0 // 检测是不是新版

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
                    return
                } else if (no_yuanyou.has(pid)) {
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
                            i = 0
                            while(keywords[i]){
                                if(st.includes(keywords[i])){
                                    c.append(tags[i])
                                    yuanyou.add(pid)
                                }
                                else {
                                    no_yuanyou.add(pid)
                                }
                                i++
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