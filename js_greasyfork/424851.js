// ==UserScript==
// @name         steam好友昵称更新
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  将你的steam好友昵称更改为其乐论坛id
// @author       duya12345
// @match        https://keylol.com/t*
// @match        https://steamcommunity.com/*/friends*
// @match        https://steamrepcn.com*
// @icon         https://keylol.com/favicon.ico
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/424851/steam%E5%A5%BD%E5%8F%8B%E6%98%B5%E7%A7%B0%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/424851/steam%E5%A5%BD%E5%8F%8B%E6%98%B5%E7%A7%B0%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

//用户配置区
var show_steamName = 0; //是否将steam名字也放入昵称
var name_prefix = "keylol_"; //昵称前缀
var name_suffix = "" //昵称后缀
var mode = 2; //程序运行模式


(async function() {
    'use strict';
    if(mode == 1){
        if(window.location.href.search("keylol.com") != -1){
            get_ql_info();
            goto_friend();
        }
        else if(window.location.href.search("steamcommunity.com") != -1){
            window.onload = function(){
                let post_steamId = GM_getValue("post_steamId");
                let post_qlName = GM_getValue("post_qlName");
                let friends_steamId = Array.from(document.getElementsByClassName("selectable friend_block_v2 persona")).map(a => a.getAttribute("data-steamid"));//读取拥有的好友steamid
                let friends_steamName = Array.from(document.getElementsByClassName("selectable friend_block_v2 persona")).map(a => a.getAttribute("data-search").split(" ;")[0])//读取拥有的好友steam昵称
                let sessionId = get_sessionid();
                let nickName;
                for(let i = 0; i < friends_steamId.length; i++){
                    for(let j = 0; j < post_steamId.length; j++){
                        if(friends_steamId[i] == post_steamId[j]){
                            nickName = name_prefix + post_qlName[j] + name_suffix;
                            if(show_steamName){
                                nickName += '/' + friends_steamName[i];
                            }
                            change_nick(sessionId, post_steamId[j], nickName);
                        }
                    }
                }
                console.log("done it all");
            }
        }
    }
    else if(mode == 2){
        var step = GM_getValue("step");
        if(step == 1 && window.location.href.search("steamcommunity.com") != -1){
            window.onload = function(){
                let friends_steamId = Array.from(document.getElementsByClassName("selectable friend_block_v2 persona")).map(a => a.getAttribute("data-steamid"));//读取拥有的好友steamid
                let re = new RegExp(name_prefix+".*?"+name_suffix);
                let skip = Array.from(document.getElementsByClassName("friend_block_content")).map(a => !a.innerText.split("\n")[0].replace("*", "").search(re))//如果名字同时包含前缀后缀，即为true
                GM_setValue("friends_steamId", friends_steamId);
                GM_setValue("step", ++step);
                GM_setValue("my_steamURL", window.location.href);
                GM_setValue("skip", skip);
                window.open("https://steamrepcn.com/");
            }
        }
        else if(step == 2 && window.location.href.search("steamrepcn.com") != -1){
            let friends_steamId = GM_getValue("friends_steamId");
            let qlName = new Array();
            let skip = GM_getValue("skip");
            for(let i = 0, j = 0, amount = skip.filter(a => a==false).length; i < friends_steamId.length; i++){
                if(skip[i]){
                    qlName.push("");
                }
                else{
                    qlName.push(await wait_qlName(friends_steamId[i]));
                    console.log("进度: %d/%d  获取到昵称:%s", ++j, amount, qlName[i]);
                }
            }
            GM_setValue("qlName", qlName);
            GM_setValue("step", ++step);
            window.open(GM_getValue("my_steamURL"));
        }
        else if(step == 3 && window.location.href.search("steamcommunity.com") != -1){
            window.onload = function(){
                let friends_steamName = Array.from(document.getElementsByClassName("selectable friend_block_v2 persona")).map(a => a.getAttribute("data-search").split(" ;")[0])//读取拥有的好友steam昵称
                let friends_steamId = GM_getValue("friends_steamId");
                let skip = GM_getValue("skip");
                let sessionId = get_sessionid();
                let nickName;
                let qlName = GM_getValue("qlName");
                let changed_amount = 0;
                for(let i = 0, amount = qlName.length; i < amount; i++){
                    if(skip[i]){
                        console.log("进度: %d/%d, 此用户昵称已符合格式，跳过", i+1, amount);
                        continue;
                    }
                    if(qlName[i] != "未绑定"){
                        nickName = name_prefix + qlName[i] + name_suffix;
                        if(show_steamName){
                            nickName += '/' + friends_steamName[i];
                        }
                        changed_amount++;
                        change_nick(sessionId, friends_steamId[i], nickName);
                    }
                    else{
                        nickName = "此用户没有keylol账号，跳过";
                    }
                    console.log("进度: %d/%d, 更改昵称:%s", i+1, amount, nickName);
                }
                console.log("程序已运行完毕，一共更改了%d个好友的昵称", changed_amount);
                GM_setValue("step", 4);
            }
        }
        else{
            GM_setValue("step", 1);
        }
    }
})();

//其乐帖子页面的操作
function get_ql_info(){
    var post_steamId = Array.from(document.getElementsByClassName("steam_connect_user_bar_link steam_connect_user_bar_link_profile")).map(a => a.getAttribute("href")).map(b => b.replace(/\D+/g, ''))//读取一页帖子中的steamid
    var post_qlName = Array.from(document.getElementsByClassName("pls favatar")).map(a => a.getElementsByClassName("pi")[0]).map(a => a.getElementsByClassName("authi")[0]).map(a => a.getElementsByClassName("xw1")[0]).map(a => a.innerText)//读取一页帖子中的论坛账号
    GM_setValue("post_steamId", post_steamId);
    GM_setValue("post_qlName", post_qlName);
}

//进入自己的steam好友界面
async function goto_friend(){
    var ql_profile_url = document.getElementsByClassName("dropdown")[1].firstChild.href
    let ql_profile_xml = await goto_qlProfife(ql_profile_url)
    console.log(ql_profile_xml)
    var my_steamId = ql_profile_xml.getElementsByClassName("pbm mbm bbda cl")[ql_profile_xml.getElementsByClassName("pbm mbm bbda cl").length-1].getElementsByClassName("pf_l")[0].children[3].lastChild.href.replace(/\D+/g, "");
    window.open("https://steamcommunity.com/profiles/" + my_steamId + "/friends/", "_blank");
}

//进入自己的其乐个人资料界面
function goto_qlProfife(get_url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", get_url, true);
        xhr.onload = () => resolve(string2XML(xhr.responseText))
        xhr.send();
    });
}

//steam好友页面的操作
//发送更改昵称请求
function change_nick(sessionid, steamId, nickname){
    var formData = new FormData()
    formData.append("nickname", nickname);
    formData.append("sessionid", sessionid);
    var post_url = "https://steamcommunity.com/profiles/" + steamId +"/ajaxsetnickname/";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", post_url, true);
    xhr.send(formData);
}

//下面那个函数的同步封装
function wait_qlName(steamId){
    return new Promise(resolve => {
        setTimeout(() => {
            setTimeout(async function(){
                resolve(await steamId2qlName(steamId));
            }, random_num(500,1500));
        })
    })
}

//从steamcnrep获取steamid对应的其乐用户名
function steamId2qlName(steamId){
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://steamrepcn.com/profiles/"+steamId+"/content", true);
        xhr.onload = () => resolve(string2XML(JSON.parse(xhr.responseText).html).getElementsByClassName("profile_other")[0].getElementsByClassName("col")[0].getElementsByClassName("btn btn-v")[0].innerText.split("\n")[2].replace(/\s+/g, ""));
        xhr.send();
    });
}

//读取seesionid
function get_sessionid(){
    let sessionid = 0;
    let steam_cookie = document.cookie.split("; ").map(a => a.split("="))
    steam_cookie.forEach(element => {
        if(element[0] == "sessionid"){
            sessionid = element[1];
        }
    });
    return sessionid;
}

//通用函数
//将字符串转换成xml对象
function string2XML(xmlString) {
    var parser = new DOMParser();
    var xmlObject = parser.parseFromString(xmlString, "text/html");
    return xmlObject;
}

//生成范围内随机整数
function random_num(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}