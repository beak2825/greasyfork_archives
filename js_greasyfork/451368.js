// ==UserScript==
// @name         三相之力指示器 - 改
// @namespace    KAJIYAKISCRIPT
// @version      1.0
// @description  随便写点东西
// @author       kajiyaki
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451368/%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8%20-%20%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/451368/%E4%B8%89%E7%9B%B8%E4%B9%8B%E5%8A%9B%E6%8C%87%E7%A4%BA%E5%99%A8%20-%20%E6%94%B9.meta.js
// ==/UserScript==
let bShow = true;
const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=';
//未测试过旧版环境，懒得测
let is_new = true;
//适配番剧页面
let is_bangumi = false;
let userlist = [];
let resloved_userList = [];
let commentBar = null;
//在此添加标签即可.当然,还是关键字判断,只能图个乐（我是用标签作为关键字判断，也可在check_data中修改判断逻辑）
const tag_text_list = ["原神","明日方舟","王者荣耀","嘉然","塔菲","雪蓮","七海","猫雷"];
(
    function () {
        'use strict';
        console.log("enter")
        addEventListener("load",function(){
            is_new = document.getElementsByClassName('item goback').length == 0; // 检测是不是新版
            is_bangumi = document.location.href.includes("/bangumi/play/");
        })
        let jiance = setInterval(()=>{
            if(!bShow) return;
            get_comment_list()
            for(let user of userlist){
                let pid = get_pid(user)
                let blogurl = blog + pid
                GM_xmlhttpRequest({
                    method:"get",
                    url: blogurl,
                    data: '',
                    headers:{
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                    },
                    onload: (res)=>{
                        if(res.status == 200){
                            let content = JSON.stringify(JSON.parse(res.response).data)
                            if(content == null) return;
                            let tags = check_data(user, content)
                            let newData = {user:user,tags:tags}
                            update_resolve(newData)
                        }
                    }
                })
            }
        }, 4000)
    }
)();
function get_pid(c){
    if(is_bangumi){
        return c.dataset["usercardMid"]
    }
    if(is_new){
        return c.dataset["userId"]
    }
    else{
        return c.children[0]["href"].replace(/[^\d]/g,"")
    }
}
function get_comment_list(){
    userlist = []
    resloved_userList = []
    if(is_new){
        for (let c of document.getElementsByClassName('user-name')){
            userlist.push(c)
        }
        for (let c of document.getElementsByClassName(('sub-user-name'))){
            userlist.push(c)
        }
    }else{
        for (let c of document.getElementsByClassName('user')){
            userlist.push(c)
        }
    }
    if(is_bangumi){
        for (let c of document.getElementsByClassName('name')){
            userlist.push(c)
        }
    }
}
function add_tag(comment, tag, bkGround){
    var bkg = bkGround || "#11DD77"
    let tag_inner = "<b style= 'color:" + bkg + "; border:1px; padding:3px; margin: 3px; background:#dddddd; border-radius:10px; '>" + tag + "</b>";
    if(comment.textContent.includes(tag) === false)
        comment.innerHTML += tag_inner
}
function check_data(user, data){
    var taglist = [];
    for(let i = 0 ;i < tag_text_list.length; i++){
        //归一化RGB中的G值
        var color_green_lowlimit = 50
        var color_green = Math.floor(i / tag_text_list.length * (256 - color_green_lowlimit)) + color_green_lowlimit
        if(data.includes(tag_text_list[i])){
            taglist.push({tag:tag_text_list[i], user:user})
            add_tag(user, tag_text_list[i], "rgb(" + 0 + "," + color_green + "," + 0 + ")")
        }
    }
    // if(data.includes(tag_text_yuanshen)){
    //     taglist.push({tag:tag_text_yuanshen, user:user})
    //     add_tag(user, tag_text_yuanshen, "#66CDAA")
    // }
    // if(data.includes(tag_text_fangzhou)){
    //     taglist.push({tag:tag_text_fangzhou, user:user})
    //     add_tag(user, tag_text_fangzhou, "#458B00")
    // }
    // if(data.includes(tag_text_wangzhe)){
    //     taglist.push({tag:tag_text_wangzhe, user:user})
    //     add_tag(user, tag_text_wangzhe, "#FFFF00")
    // }
    return taglist;
}
function update_resolve(newData){
    var taglist = []
    resloved_userList.push(newData)
    //取出所有用户的所有tag
    for(let user of resloved_userList){
        //取出一个用户的所有tag
        for(let tag of user.tags){
            taglist.push(tag)
        }
    }
    //将所有tag分组
    let groupData = getGroup(taglist,'tag')
    commentBar = document.getElementsByClassName("nav-bar")[0];
    if(is_bangumi){
        commentBar = document.getElementsByClassName("b-head")[0]
    }
    let customDiv = document.getElementsByClassName("nav-sort div custom")[0]
    if(customDiv == null){
        customDiv = document.createElement('div');
        customDiv.className = "nav-sort div custom"
        customDiv.setAttribute("style","border:1px; border-style:solid; border-color:black");
        commentBar.appendChild(customDiv)
    }

    let liObj = document.getElementsByClassName("nav-sort total_number")[0]
    if(liObj == null){
        liObj = document.createElement('li');
        liObj.className = "nav-sort total_number";
        customDiv.appendChild(liObj);
    }
    liObj.innerText = "当前页面共" + resloved_userList.length + "个评论";
    //遍历分组后的对象，创建与Tag对应的Element
    Object.keys(groupData).forEach(key => {
        let tagObj = document.getElementsByClassName("nav-sort " + key)[0]
        if(tagObj == null){
            tagObj = document.createElement('li');
            tagObj.className = "nav-sort " + key;
            customDiv.appendChild(tagObj);
        }
        //获取该Tag组下包含多少个用户
        tagObj.innerText = groupData[key][0].tag + " " + groupData[key].length;
    })
}
///////////////////
//将List按照属性分组
//data: List
//key: 属性
//references: https://blog.csdn.net/weixin_36339245/article/details/103522998
//////////////////
let getGroup=(data,key)=>{
    let groups={};
    data.forEach(c=>{
        let value=c[key];
        groups[value]=groups[value]||[];
        groups[value].push(c);
    });
    return groups;
}