// ==UserScript==
// @name         原批原友指南针
// @namespace    zzhp
// @version      25.68
// @description  自动标注原批原友，依据是动态里是否有原神相关内容
// @author       zzhp
// @match        https://www.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451232/%E5%8E%9F%E6%89%B9%E5%8E%9F%E5%8F%8B%E6%8C%87%E5%8D%97%E9%92%88.user.js
// @updateURL https://update.greasyfork.org/scripts/451232/%E5%8E%9F%E6%89%B9%E5%8E%9F%E5%8F%8B%E6%8C%87%E5%8D%97%E9%92%88.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
    const unknown = new Set()
    const yuanyou = new Set()
    const no_yuanyou = new Set()
 
    const keyword = "原神" // 可以自行修改，如"#原神","明日方舟"
    const tag = " ~原批~"
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