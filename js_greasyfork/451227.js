// ==UserScript==
// @name         B站原神评论标注
// @namespace    wenhaohao
// @version      1.1
// @description  评论区原神成分自动标注
// @author       wenhaohao
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @license MIT
// @grant        GM_xmlhttpRequest
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451227/B%E7%AB%99%E5%8E%9F%E7%A5%9E%E8%AF%84%E8%AE%BA%E6%A0%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451227/B%E7%AB%99%E5%8E%9F%E7%A5%9E%E8%AF%84%E8%AE%BA%E6%A0%87%E6%B3%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const unknown = new Set()
    var userPidTag = {}
    //关键字，标签
    const tags = {"原神":'[原批]',
                 "王者荣耀":'[农批]',
                  "互动抽奖":'[抽奖哥]',
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
                //console.log(c)
                let pid = get_pid(c)
                if (pid in userPidTag) {
                    if (c.textContent.includes(userPidTag[pid]) === false) {
                        let tagElement = document.createElement("span");
                        //带样式的标签
                        tagElement.innerHTML = `<span style='background-color:#F03;padding:3px;border-radius:5px;color:white;font-weight:bold'>${userPidTag[pid]}</span>`;
                        c.appendChild(tagElement);
                    }
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
                            userPidTag[pid]=""
                            var flag=false
                            Object.keys(tags).forEach(keyword => {
                                console.log(keyword)
                                if(st.includes(keyword)){
                                    //console.log("用户标签："+userPidTag[pid])
                                    //console.log("匹配到关键字:"+keyword)
                                    //console.log("关键字标签是否存在："+!(userPidTag[pid].search(tags[keyword])===-1))
                                    if((userPidTag[pid].search(tags[keyword])===-1)){
                                        //console.log("不存在更新")
                                        userPidTag[pid]+=tags[keyword]
                                        //console.log("用户标签更新："+userPidTag[pid])

                                    }
                                   flag=true
                                }
                                //console.log("最终用户标签:"+userPidTag[pid])
                            })

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