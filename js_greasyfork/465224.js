// ==UserScript==
// @name         编程猫辅助功能
// @namespace    https://shequ.codemao.cn/user/7928755
// @version      0.1
// @description  页面优化，批量清除收藏，消除消息框
// @author       Mornwind
// @match        *://shequ.codemao.cn/*
// @icon         https://static.codemao.cn/whitef/favicon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/465224/%E7%BC%96%E7%A8%8B%E7%8C%AB%E8%BE%85%E5%8A%A9%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/465224/%E7%BC%96%E7%A8%8B%E7%8C%AB%E8%BE%85%E5%8A%A9%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var id
    GM_xmlhttpRequest({
        method:"get",
        url:"https://api.codemao.cn/web/users/details",
        headers:{
            "cookie":document.cookie,
            "User_Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
        },
        async onload({ response }) {
            id=JSON.parse(response).id
            console.log(id)
        }
    })
    function changeTitle(content) {
        if (document.querySelector("title") && document.querySelector("title").innerHTML != content) {
            document.querySelector("title").innerHTML = content
        }
    }
    const board_dict={
        "-1":"论坛广场",
        "2":"积木编程乐园",
        "3":"神奇代码岛",
        "4":"通天塔",
        "5":"你问我答",
        "6":"图书馆",
        "7":"灌水池塘",
        "10":"工作室&师徒",
        "11":"Python",
        "13":"Noc AI创新编程",
        "17":"热门活动",
        "26":"源码精灵",
        "27":"CoCo",
        "28":"训练师小课堂",
        "":"",
    }
    var web_workshop_id=window.location.href.split("/").slice(-1).pop()
    var web_workshop_url="https://api.codemao.cn/web/shops/"+web_workshop_id
    var web_workshop_name=""
    GM_xmlhttpRequest({
        method:"get",
        url:web_workshop_url,
        async onload({ response }) {
            web_workshop_name=JSON.parse(response).name
        }
    })
    setInterval(() => {
        //改图标总是改不了···
        if("https://shequ.codemao.cn/work_shop"==window.location.href){
            changeTitle("工作室：首页")
        }
        if("https://shequ.codemao.cn/user"==window.location.href){
            changeTitle("个人主页")
        }
        if(window.location.href.indexOf("shequ.codemao.cn/work_shop/")!=-1){
            changeTitle("工作室："+web_workshop_name)
        }
        if("https://shequ.codemao.cn/community"==window.location.href){
            changeTitle("论坛：首页")
        }
        if(window.location.href.indexOf("https://shequ.codemao.cn/community?board=")!=-1){
            var board=window.location.href.split("=").slice(-1)[0]
            changeTitle("论坛："+board_dict[board])
        }
        if(window.location.href.indexOf("https://shequ.codemao.cn/user/")!=-1){
            changeTitle(document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--left-box > div.r-user-c-banner--info.r-user-c-banner--flex-box.r-user-c-banner--col-box > div > span.r-user-c-banner--name").innerHTML+"的主页")
        }
        if(window.location.href.indexOf("https://shequ.codemao.cn/community/")!=-1||window.location.href.indexOf("https://shequ.codemao.cn/wiki/forum/")!=-1){
            var article_title=document.querySelector("#root > div > div.r-index--main_cont > div > div.r-community-r-detail--forum_container > div.r-community-r-detail--forum_title").innerText.split("\n").slice(-1)[0]
            changeTitle("论坛:"+window.location.href.split("/").slice(-1).pop()+" "+article_title)
        }
    },100)

    function clear(lst){
        var url
        var url1="https://api.codemao.cn/nemo/v2/works/"
        var url2="/collection"
        for(var i=0;i<lst.length;i++){
            url=url1+lst.slice(i)[0].id+url2
            console.log(url)
            GM_xmlhttpRequest({
                url:url,
                method:"delete",
                headers:{
                    "cookie":document.cookie,
                    "User_Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
                },
            })
        }
    }
    function clean_collect(){
        var i
        GM_xmlhttpRequest({
            method:"get",
            url:"https://api.codemao.cn/creation-tools/v1/user/center/collect/list?user_id="+id+"&offset=0&limit=200",

            headers:{
                "cookie":document.cookie,
                "User_Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
            },
            async onload({ response }) {
                const dic=JSON.parse(response)
                var all=dic.total
                //console.log(all)
                clear(dic.items)
                //console.log(dic)
                if(all>200){
                    for(i=1;i<all/200+1;i+=1){
                        GM_xmlhttpRequest({
                            method:"get",
                            url:"https://api.codemao.cn/creation-tools/v1/user/center/collect/list?user_id="+id+"&offset="+i*200+"&limit=200",
                            async onload({ response }) {
                                clear(JSON.parse(response).items)
                            }
                        })
                    }
                }
            }
        })
    }
    function like(id,times){
        var url="https://api.codemao.cn/nemo/v2/works/"+id+"/like"
        if(times>0){
            GM_xmlhttpRequest({
                url:url,
                method:"post",
                headers:{
                    "cookie":document.cookie,
                    "User_Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
                },
                async onload({ response }) {
                    GM_xmlhttpRequest({
                        url:url,
                        method:"delete",
                        headers:{
                            "cookie":document.cookie,
                            "User_Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
                        },
                        async onload({ response }) {
                            like(id,times-1)
                        }
                    })
                }
            })
        }
    }
    function clear_message(method,offset=0){
        GM_xmlhttpRequest({
            url:"https://api.codemao.cn/web/message-record?query_type="+method+"&limit=200&offset="+offset.toString(),
            method:"get",
            headers:{
                "cookie":document.cookie,
                "User_Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
            },
            async onload({ response }) {
                console.log(JSON.parse(response).total)
                if(JSON.parse(response).items.slice(-1)[0].read_status=="UNREAD"){
                    clear_message(method,offset=offset+200)
                }
            }
        })
    }
    document.onclick = function(e) {
        if(e.ctrlKey && e.shiftKey&&window.location.href=="https://shequ.codemao.cn/user/"+id+"/collect"){
            clean_collect()
        }
    }
    if(window.location.href=="https://shequ.codemao.cn/message"){
        clear_message("COMMENT_REPLY")
        clear_message("LIKE_FORK")
        clear_message("SYSTEM")
    }
})();