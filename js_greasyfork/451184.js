// ==UserScript==
// @name        4畜指示器
// @namespace    4cg
// @version      0.3
// @description  B站评论区自动标注4/，依据是动态里是否有麻尤米
// @match        https://*.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451184/4%E7%95%9C%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451184/4%E7%95%9C%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const unknown = new Set()
    const yuanyou = new Set()
    const no_yuanyou = new Set()

    const keyword = "麻尤米";"404ovo";"404";"米有麻" //可自由修改
    const tag = " |4/|"
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
                    if (c.textContent.includes(tag) === false) {
                        c.append(tag)
                    }
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
                            if (st.includes(keyword)){
                                c.append(tag)
                                yuanyou.add(pid)
                            } else {
                                no_yuanyou.add(pid)
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