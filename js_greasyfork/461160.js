// ==UserScript==
// @name         风纪处理插件
// @namespace    https://shequ.codemao.cn/work_shop/1705
// @version      1.3.3
// @description  简化编程猫社区风纪委员的工作流程
// @author       Mornwind
// @match        *://shequ.codemao.cn/*
// @icon         https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfNzkyODc1NV81MTQ4MTNfMTY3NzkwMTk1NzM3Nl8zMjdkYmQ5MA.png
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/461160/%E9%A3%8E%E7%BA%AA%E5%A4%84%E7%90%86%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/461160/%E9%A3%8E%E7%BA%AA%E5%A4%84%E7%90%86%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function changeTitle(content) {
        if (document.querySelector("title") && document.querySelector("title").innerHTML != content) {
            document.querySelector("title").innerHTML = content
        }
    }

    let icon = 'https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfNzkyODc1NV81MTQ4MTNfMTY3NzkwMTk1NzM3Nl8zMjdkYmQ5MA.png';
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
    function fillIn_test(judgement_id,info,flag,reason,img_url,content,ab){
        var img_name=ab
        if(img_url=="无"){
            img_name=""
        }
        if(img_url==""){
            img_name=""
        }
        if(img_url==null){
            img_name=""
        }
        if(img_url=="text"){
            img_name=ab
            img_url=""
        }
        flag="other";
        if(reason.indexOf("互赞") != -1){
            flag="normal";
            reason="7UBpEH"
        }
        var web="https://shimo.im/api/newforms/forms/16q8MrOdnvHmjYk7/submit"
        var requests_text={
            "userFinger": "-1",
            "responseContent": [
                {"type": 0, "guid": "qM2CaHb1", "text": {"content": judgement_id.toString()}},
                {"type": 0, "guid": "0LEIOnGn", "text": {"content": info}},
                {"type": 1, "guid": "phCFddRF", "choice": {"type": flag,"value": reason}},
                {"type": 13, "guid": "61dp6QxK", "image": {"image": {"type": "shimofile","name": img_name,"size":0,"width":0,"height":0,"url": img_url}}},
                {"type": 0, "guid": "bIePoGGC", "text": {"content":content }}
            ]
        }
        console.log(JSON.stringify(requests_text))
        var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        var header = {"User-Agent": userAgent,"content-type": "application/json;charset=UTF-8"}
        GM_xmlhttpRequest({
            method:"post",
            data:JSON.stringify(requests_text),
            url:web,
            headers:header,
            async onload({ response }) {
                alert(response)
            }
        })
    }
    function fillIn(judgement_id,info,flag,reason,img_url,content,ab){
        var img_name=ab
        if(img_url=="无"){
            img_name=""
        }
        if(img_url==""){
            img_name=""
        }
        if(img_url==null){
            img_name=""
        }
        if(img_url=="text"){
            img_name=ab
            img_url=""
        }
        var web="https://shimo.im/api/newforms/forms/bAm0HDZe1EM0gqq0/submit"
        var requests_text={
            "userFinger": "-1",
            "responseContent": [
                {"type": 0, "guid": "9lusb2Nl", "text": {"content": judgement_id.toString()}},
                {"type": 0, "guid": "2U8sIp0V", "text": {"content": info}},
                {"type": 1, "guid": "SA4A1GUL", "choice": {"type": flag,"value": reason}},
                {"type": 13, "guid": "bSgPiSnW", "image": {"image": {"type": "shimofile","name": img_name,"size":0,"width":0,"height":0,"url": img_url}}},
                {"type": 0, "guid": "M1C1ZNM8", "text": {"content":content }}
            ]
        }
        console.log(JSON.stringify(requests_text))
        var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        var header = {"User-Agent": userAgent,"content-type": "application/json;charset=UTF-8"}
        GM_xmlhttpRequest({
            method:"post",
            data:JSON.stringify(requests_text),
            url:web,
            headers:header,
            async onload({ response }) {
                alert(response)
            }
        })
    }
    function warnCommunity(rm_url,remark){
        GM_xmlhttpRequest({
            method: "post",
            url:rm_url,
            data:JSON.stringify({"content":remark}),
            headers:{
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.76",
                "cookie": document.cookie,},})
    }
    function fillInCommunity(){
        //不知道为什么return不能用 就这样了
        //console.log(window.location.href.indexOf("shequ.codemao.cn/community/") == -1);
        //console.log(window.location.href.indexOf("shequ.codemao.cn/wiki/forum/") == -1)
        //console.log((window.location.href.indexOf("shequ.codemao.cn/community") == -1)&&(window.location.href.indexOf("shequ.codemao.cn/wiki/forum") == -1))
        GM_xmlhttpRequest({
            method: "get",
            url: "https://api.codemao.cn/web/users/details",
            data: document.cookie,
            async onload({ response }) {
                var judgement_id = JSON.parse(response).nickname.slice(-2);
                var article_id=window.location.href.split("/").slice(-1).pop();
                GM_xmlhttpRequest({
                    method: "get",
                    url: "https://api.codemao.cn/web/forums/posts/"+article_id+"/details",
                    async onload({ response }) {
                        var user_id=JSON.parse(response).user.id;
                        var user_name=JSON.parse(response).user.nickname;
                        console.log(user_id,user_name);
                        var reason= prompt("请输入违规行为（请注意登陆账号）：");
                        if(reason==null){
                            alert("已取消处理");
                        }
                        else{
                            if(reason==""){
                                alert("输入为空，已取消处理");
                            }
                            else{
                                var remark="训练师你好，你的发言涉及"+reason+",请及时删除";
                                var rm_url="https://api.codemao.cn/web/forums/posts/"+article_id+"/replies";
                                console.log(remark,rm_url);
                                var flag="other";
                                if(reason.indexOf("互赞") != -1){
                                    flag="normal";
                                    reason="oMnYH"
                                }
                                var pic=prompt("请提供图片url（没有填“无”或不填）：")
                                window.open("https://imgse.com/","_blank");
                                if(pic==null){
                                    pic=""
                                }
                                //remark="测试插件，请勿当真（）"
                                //console.log("警告",rm_url,remark)
                                //console.log("填表",judgement_id,user_id,user_name,flag,reason,pic,window.location.href)
                                warnCommunity(rm_url,remark);
                                fillIn(judgement_id,user_id+" "+user_name,flag,reason,pic,window.location.href,"图片")
                            }
                        }
                    }
                })
            }
        })
    }
    function searchCommunity(){
        GM_xmlhttpRequest({
            method: "get",
            url: "https://api.codemao.cn/web/users/details",
            data: document.cookie,
            async onload({ response }) {
                var judgement_id = JSON.parse(response).nickname.slice(-2);
                //"https://api.codemao.cn/web/forums/posts/search?title=（）&limit=30&page=（）"
                var search_content=prompt("请输入搜索（标题）关键词：")
                var search_reason=prompt("请输入违规行为：")
                var flag="other";
                if(search_reason.indexOf("互赞") != -1){
                    flag="normal";
                    search_reason="oMnYH"
                }
                if(search_content==""||search_content==null||search_reason==""||search_reason==null){
                    alert("已取消搜索");
                }
                else{
                    var url="https://api.codemao.cn/web/forums/posts/search?title="+search_content+"&limit=30&page=1";
                    GM_xmlhttpRequest({
                        method:"get",
                        url:url,
                        async onload({ response }) {
                            var i
                            var total=JSON.parse(response).total;
                            var pages=Math.floor(parseFloat(total)/30.0)+1;
                                    alert("正在整理数据···")
                            for(i=1;i<=pages;i++){
                                const lst=[]
                                url="https://api.codemao.cn/web/forums/posts/search?title="+search_content+"&limit=30&page="+i;
                                GM_xmlhttpRequest({
                                    method:"get",
                                    url:url,
                                    async onload({ response }) {
                                        const l=JSON.parse(response).items;
                                        //不知道为什么这里有点问题（）
                                        //好像是数组加载不够快
                                        //
                                        //console.log(lst)
                                        var j=0
                                        for(j=0;j<l.length;j++){
                                            var more_title=l[j].title
                                            var more_info=l[j].user.id+" "+l[j].user.nickname
                                            if(confirm("（一定看清楚啊！）\n是否处理？\n“"+more_title+"”\n来自：\n"+more_info)){
                                                fillIn(judgement_id,more_info,flag,search_reason,"text",window.location.href+l[j].id,"帖子标题："+more_title)
                                            }
                                        }
                                    }
                                })
                            }

                        }
                    })
                }
            }
        })
    }
    function fillInWorkshop(){
        GM_xmlhttpRequest({
            method: "get",
            url: "https://api.codemao.cn/web/users/details",
            data: document.cookie,
            async onload({ response }) {
                var judgement_id = JSON.parse(response).nickname.slice(-2);
                var workshop_id=window.location.href.split("/").slice(-1).pop();
                GM_xmlhttpRequest({
                    method: "get",
                    url:"https://api.codemao.cn/web/shops/"+workshop_id+"/users?limit=6&offset=0",
                    async onload({ response }) {
                        const members=JSON.parse(response).items
                        var info_workshop=""
                        if(members.slice(0)[0].position=="LEADER"){
                            info_workshop="工作室id："+workshop_id+"   "+"室长："+members.slice(0)[0].user_id+","+members.slice(0)[0].name
                        }
                        else{
                            info_workshop="工作室id："+workshop_id
                        }
                        console.log(info_workshop)
                        var reason= prompt("请输入违规行为（请注意登陆账号）：");
                        if(reason==null){
                            alert("已取消处理");
                        }
                        else{
                            if(reason==""){
                                alert("输入为空，已取消处理");
                            }
                            else{
                                var flag="other";
                                if(reason.indexOf("互赞") != -1){
                                    flag="normal";
                                    reason="oMnYH"
                                }
                                var pic=prompt("请提供图片url（没有填“无”或不填）：")
                                window.open("https://imgse.com/","_blank");
                                if(pic==null){
                                    pic=""
                                }
                                fillIn(judgement_id,info_workshop,flag,reason,pic,window.location.href,"图片")
                            }
                        }
                    }
                })
            }
        })
    }
    function fillInUser(){
        var user_name=document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--left-box > div.r-user-c-banner--info.r-user-c-banner--flex-box.r-user-c-banner--col-box > div > span.r-user-c-banner--name")
    }
    document.onclick = function (e) {
        if (e.ctrlKey && e.shiftKey){
            if(!(window.location.href.indexOf("shequ.codemao.cn/community/") == -1)&&(window.location.href.indexOf("shequ.codemao.cn/wiki/forum/") == -1)){
                fillInCommunity()
            }
            if(window.location.href=="https://shequ.codemao.cn/community"){
                searchCommunity()
            }
            if((window.location.href.indexOf("shequ.codemao.cn/work_shop/") != -1)){
                fillInWorkshop()
            }
        }
    }
})();