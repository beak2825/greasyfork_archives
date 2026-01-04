// ==UserScript==
// @name         b站ip开盒和首页屏蔽视频、up主
// @namespace    http://quhou-ip-kaihe.top/
// @version      1.0.7
// @description  显示b站评论的ip地址（所有页面）和屏蔽首页特定视频或up主
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/518283/b%E7%AB%99ip%E5%BC%80%E7%9B%92%E5%92%8C%E9%A6%96%E9%A1%B5%E5%B1%8F%E8%94%BD%E8%A7%86%E9%A2%91%E3%80%81up%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/518283/b%E7%AB%99ip%E5%BC%80%E7%9B%92%E5%92%8C%E9%A6%96%E9%A1%B5%E5%B1%8F%E8%94%BD%E8%A7%86%E9%A2%91%E3%80%81up%E4%B8%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("b站ip开盒脚本已注入!，如果脚本失效请联系作者：https://greasyfork.org/zh-CN/users/1083212-xygodcyx！")

    function getIPText(reply){
        return reply.reply_control?.location || "IP属地：未显示"
    }

    function handleIP(replies){
        if (!Array.isArray(replies)) return replies
        return replies.map(reply=>{
            if(reply.member){
                reply.member.uname += ` (${getIPText(reply)})`
            }
            if (Array.isArray(reply.replies)) {
                reply.replies = reply.replies.map(sub=>{
                    if(sub.member){
                        sub.member.uname += ` (${getIPText(sub)})`
                    }
                    return sub
                })
            }
            return reply
        })
    }

    function handleTopIP(reply){
        if(reply.member){
            reply.member.uname += ` (${getIPText(reply)})`
        }
        if (Array.isArray(reply.replies)) {
            reply.replies = reply.replies.map(sub=>{
                if(sub.member){
                    sub.member.uname += ` (${getIPText(sub)})`
                }
                return sub
            })
        }
        return reply
    }

    function handleTopRepliesIP(replies){
        if (!Array.isArray(replies)) return replies
        return replies.map(reply=>{
            if(reply.member){
                reply.member.uname += ` (${getIPText(reply)})`
            }
            if (Array.isArray(reply.replies)) {
                reply.replies = reply.replies.map(sub=>{
                    if(sub.member){
                        sub.member.uname += ` (${getIPText(sub)})`
                    }
                    return sub
                })
            }
            return reply
        })
    }



    //自己修改时注意：
    //数组的格式为:[123,456] 或 ["关键词1","关键词2"]，注意：数字不要加引号，字符串要加引号，每一个由英文逗号","分割的数据都是独立的

    const filterTitleKey = ["大型纪录片","纪录片传奇","为您播出","已成艺术"] //屏蔽视频标题
    const filterUpNameKey = ["话题"] //屏蔽up主的名字或类似名字
    const whiteUpMid = [1308065752] //这里填要加入白名单中的up的uid/mid，这里是我的uid/mid，pc端在个人资料查看，app端在个人简介下方查看

    //处理首页的推荐
    function handleItem(data){
        return data.filter(r=>r.goto === "ad" ? false : (filterTitleKey.every(fk=>!r.title.includes(fk)) && filterUpNameKey.every(fu=>!r.owner.name.includes(fu))) || whiteUpMid.includes(r.owner.mid) )
    }
    const _fetch = window.fetch
    window.fetch = function(...params){
        const url = params[0]
        if(url.includes("//api.bilibili.com/x/v2/reply/wbi/main")){
            return new Promise(async (reslove,reject)=>{
                _fetch(...params).then(async response=>{
                    try{
                        const originalData = await response.json();
                        const processedData = {
                            ...originalData,
                        };
                        if(processedData.data.top && processedData.data.top.upper){
                            processedData.data.top.upper = handleTopIP(processedData.data.top.upper)
                            processedData.data.top_replies = handleTopRepliesIP(processedData.data.top_replies)
                        }
                        processedData.data.replies = handleIP(processedData.data.replies)

                        const newResponse = new Response(JSON.stringify(processedData), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                        return reslove(newResponse)
                    }catch(err){
                        return reject(err)
                    }
                })
            })
        }
        else if(url.includes("//api.bilibili.com/x/v2/reply/reply")){
            return new Promise(async (reslove,reject)=>{
                _fetch(...params).then(async response=>{
                    try{
                        const originalData = await response.json();
                        const processedData = {
                            ...originalData,
                        };
                        processedData.data.replies = handleIP(processedData.data.replies)
                        const newResponse = new Response(JSON.stringify(processedData), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                        return reslove(newResponse)
                    }catch(err){
                        return reject(err)
                    }
                })
            })
        }
        else if(url.includes("//api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd")){
            return new Promise(async (reslove,reject)=>{
                _fetch(...params).then(async response=>{
                    try{
                        const originalData = await response.json();
                        const processedData = {
                            ...originalData,
                        };
                        processedData.data.item = handleItem(processedData.data.item)
                        const newResponse = new Response(JSON.stringify(processedData), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                        return reslove(newResponse)
                    }catch(err){
                        return reject(err)
                    }
                })
            })
        }
        else{
            return _fetch(...params)
        }

    }
    // Your code here...
})();