// ==UserScript==
// @name         B站评论区根据关注列表查成分
// @namespace    4pp13
// @version      0.3
// @description  B站评论区自动标注三相玩家，依据关注列表中可查看的部分（修改自三相之力）
// @author       xulaupuz&4pp13
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
// @downloadURL https://update.greasyfork.org/scripts/451291/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%A0%B9%E6%8D%AE%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E6%9F%A5%E6%88%90%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/451291/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%A0%B9%E6%8D%AE%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E6%9F%A5%E6%88%90%E5%88%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //保存成分
    const pid_dic = {}

    //关键词  标签  标签颜色 (可自定义扩展)
    const keyword_and_tag = {
        "隐藏": { tag: "【隐藏】", color: "#254680"},
        "纯良": { tag: " 【纯良】", color: "#11DD77"},
        //以下可增改
        "原神": { tag: " 【原】", color: "#6600CC"},
        "明日方舟": { tag: " 【舟】", color: "#6600CC"},
        "王者荣耀": {tag: " 【农】", color: "#6600CC"},
    }

    const follow = 'https://api.bilibili.com/x/relation/stat?vmid='
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

    const update_tag = (pid, st) => {
        for(var key in keyword_and_tag){
            if(key == "隐藏" || key == "纯良" || pid_dic[pid].tag.has(key.tag)) continue
            if(st.includes(key))
            {
                let s = "<b style='color: " + keyword_and_tag[key].color + "'>" + keyword_and_tag[key].tag + "</b>"
                pid_dic[pid].tag.add(s)
            }
        }
    }

    const show_tag = (pid, c) => {
        let string = pid_dic[pid].uname
        if(pid_dic[pid].tag.size == 0) c.innerHTML = string + "<b style='color: #000000'>【查找中:" + Math.floor(pid_dic[pid].pn * 100 / 14) + "%】</b>"
        else
        {
            pid_dic[pid].tag.forEach(t => {
                string += t
            })
            c.innerHTML = string
        }
    }

    console.log(is_new)
    console.log("正常加载")
    let jiance = setInterval(() => {
        let commentlist = get_comment_list()
        if (commentlist.length != 0) {
            commentlist.forEach(c => {
                let pid = get_pid(c)

                if(!pid_dic[pid]) pid_dic[pid] = { uname: c.innerHTML, pn: 0, tag: new Set()} //初始化

                let searchurl
                if(pid_dic[pid].pn == -1)
                {
                    show_tag(pid, c)
                    return;
                }
                if(pid_dic[pid].pn < 6) searchurl ='https://api.bilibili.com/x/relation/followings?vmid=' + pid + '&pn=' + (pid_dic[pid].pn++) + '&ps=50&order=desc&&jsonp=jsonp'
                else if(pid_dic[pid].pn < 13) searchurl ='https://api.bilibili.com/x/relation/followings?vmid=' + pid + '&pn=' + ((pid_dic[pid].pn++) % 6) + '&ps=50&order=asc&&jsonp=jsonp'
                else if(pid_dic[pid].pn >= 13 && pid_dic[pid].tag.size == 0)
                {
                    //查找完毕，标记为纯良
                    let s = "<b style='color: " + keyword_and_tag["纯良"].color + "'>" + keyword_and_tag["纯良"].tag + "</b>"
                    pid_dic[pid].tag.add(s)
                    pid_dic[pid].pn = -1
                    show_tag(pid, c)
                    return
                }
                GM_xmlhttpRequest({
                    method: "get",
                    url: searchurl,
                    data: '',
                    headers: {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                    },
                    onload: function (res) {
                        if (res.status === 200){
                            let r = JSON.parse(res.response)
                            if(r.code == 22115){
                                //隐藏关注列表
                                pid_dic[pid].pn = -1
                                let s = "<b style='color: " + keyword_and_tag["隐藏"].color + "'>" + keyword_and_tag["隐藏"].tag + "</b>"
                                pid_dic[pid].tag.clear()
                                pid_dic[pid].tag.add(s)
                                show_tag(pid, c)
                                return
                            }
                            /*
                            else if(r.code ==  22007){
                                //超页
                                pid_dic[pid].pn = 13
                            }
                            */
                            else{
                                let u = r.data.list

                                if(u.length < 50)
                                {
                                    pid_dic[pid].pn = 13
                                }
                                for(let j = 0; j < u.length; j++){
                                    let st = u[j].uname

                                    //更新标签
                                    update_tag(pid, st)
                                    /*
                                    //添加原神标签
                                    if (st.includes(keyword_yuan) && !yuanyou.has(pid)) {
                                        c.innerHTML += tag_yuan_Inner
                                        yuanyou.add(pid)
                                    }
                                    //添加方舟标签
                                    if (st.includes(keyword_zhou) && !zhouyou.has(pid)) {
                                        zhouyou.add(pid)
                                    }
                                    //添加农药标签
                                    if (st.includes(keyword_nong) && !nongyou.has(pid)) {
                                        nongyou.add(pid)
                                    }
                                    */
                                }
                                show_tag(pid, c)
                            }


                        } else {
                            console.log('失败')
                            //console.log(res)
                            c.innerHTML = pid_dic[pid].uname + "<b style='color: #000000'>【成分查太多了，B站暂时不准你查】</b>"
                            clearInterval(jiance)
                        }
                    }

            })
            });
        }
    }, 5000)
})();