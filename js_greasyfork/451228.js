// ==UserScript==
// @name         成分查看器简易配置版 指示器
// @namespace    checkchecku
// @version      0.343
// @description  基于b站修改版修改
// @author       xulaupuz&nightswan&chaoes
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
// @downloadURL https://update.greasyfork.org/scripts/451228/%E6%88%90%E5%88%86%E6%9F%A5%E7%9C%8B%E5%99%A8%E7%AE%80%E6%98%93%E9%85%8D%E7%BD%AE%E7%89%88%20%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451228/%E6%88%90%E5%88%86%E6%9F%A5%E7%9C%8B%E5%99%A8%E7%AE%80%E6%98%93%E9%85%8D%E7%BD%AE%E7%89%88%20%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';

    //配置这三行 一一对应
    const keyword = ["原神","明日方舟","王者荣耀","抽奖","哔哩哔哩会员试炼","七海","阿梓","東雪蓮","猫雷","塔菲","嘉然"]

    const tagword = ["原批","粥批","农批","转发抽奖","答题小号","杰尼龟","妙蛙种子","罕见","晶晶露","热水器","嘉心糖"]

    const tagColer = ["red","red","red","blue","blue","pink","pink","pink","pink","pink","pink"]
    //配置这三行 一一对应


    var tag = getTags(tagword)

    function getTags(tagword){
        var newTag = []
        tagword.forEach((item,index)=>{
            newTag.push("<span style='color:black'>|</span><span style='color:"+tagColer[index]+"' >"+tagword[index]+"</span>")
        })
        return newTag
    }

    var arrays = new Set()

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

    function job() {
        let commentlist = get_comment_list()
        if (commentlist.length != 0) {
            // clearInterval(jiance)
            commentlist.forEach(c => {
                let pid = get_pid(c)

                arrays.forEach((item,index)=>{
                    if(item[1]==pid){
                        if (c.textContent.includes(tagword[item[0]]) === false) {
                            c.innerHTML += tag[item[0]]
                        }
                    }
                })
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
                            console.log('pid:'+pid+' api成功')
                            let st = JSON.stringify(JSON.parse(res.response).data)
                            keyword.forEach((item,index)=>{
                                if (st.includes(item)) {
                                    //c.innerHTML += tag[index]
                                    arrays.add([index,pid])
                                    console.log('arrays:'+arrays)
                                } 
                            })
                        } else {
                            console.log('失败')
                            console.log(res)
                        }
                    },
                });
            });
        }
    }
    job()
    let jiance = setInterval(job, 4000)
})();
