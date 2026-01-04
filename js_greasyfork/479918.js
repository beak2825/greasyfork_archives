// ==UserScript==
// @name         MT论坛-无效信息过滤
// @namespace    http://tampermonkey.net/
// @version      0.5 - 新增对手机端的支持
// @description  该脚本会排除MT论坛中的无效评论
// @author       lqzlike
// @match        https://bbs.binmt.cc/thread-*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=binmt.cc
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479918/MT%E8%AE%BA%E5%9D%9B-%E6%97%A0%E6%95%88%E4%BF%A1%E6%81%AF%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/479918/MT%E8%AE%BA%E5%9D%9B-%E6%97%A0%E6%95%88%E4%BF%A1%E6%81%AF%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

// 设置需要排除的信息
const excludeInfo = {
    // 是否处理回复评论
    replyFlag: false,
    // 是否处理作者评论
    avatarFlag: false,
    // 是否处理从"搜索页面"或"我的帖子提醒页面"进入的网站
    viewthreadFlag: false,
    // 排除小于此长度的评论
    minLength: 5,
    // 大于此长度的评论就算关键字匹配成功了也不会被排除
    keywordLength: 8,
    // 带有指定关键字的评论将被排除
    keywords: ["看看","隐藏","分享"],
    // 黑名单用户
    userBlackList: ["示例用户ABC"],
    // 白名单用户
    userWhiteList: ["admin","喵喵猫","wfh132","mczihan","BinTorrt","2564212427"]
};
const sessionStorage = window.sessionStorage;
(function() {
    'use strict';
    // 判断是否处理当前页面
    if(!excludeInfo.viewthreadFlag && window.location.href.includes("viewthread")){
       return;
    }
    // 判断是否是移动端
    var isMobileFlag = isMobileDevice();
    if(isMobileFlag){
        mobileFilter();
        return;
    }
    // 创建并添加无效信息箱按钮
    var invalidMsgButton = createInvalidMsgButton();
    document.getElementsByClassName("z kmfz")[0].appendChild(invalidMsgButton);
    // 创建存储无效信息的容器
    var tableElement = createInvalidMsgContext();
    // 获取当前页数
    var currentPage = getCurrentPage();
    // 开始处理用户评论
    var commentArray = document.getElementsByClassName("t_f");
    // 第一页的第一条评论是楼主
    if(currentPage == 1 && !excludeInfo.avatarFlag){
       // 将打开的所有帖子中的楼主id放到缓存中
       setAuthorIdsCache(commentArray);
    }else{
       currentPage = 0;
    }
    for (var i = currentPage; i <= commentArray.length - 1; i++) {
        var userId = commentArray[i].id.split("_")[1];
        var userName = document.getElementById("userinfo" + userId).querySelectorAll('strong')[0].innerText.trim();
        // 白名单用户和楼主的评论不进行处理
        if(excludeInfo.userWhiteList.includes(userName) || (!excludeInfo.avatarFlag && getAuthorIdsCache().authorIds.includes(userId))){
            continue;
        }
        var commentData = commentArray[i].innerHTML.trim();
        // 如果是回复评论则去除别人的回复
        if(commentData.includes('<div class="quote">')){
            if(!excludeInfo.replyFlag){
                continue;
            }
            commentData = commentData.replace(/<div class="quote">[\s\S]*<\/div>(<br>)?/g,'');
        }
        // 如果评论中带有HTML标签则去除
        if(commentData.match(/<[^>]+>/g) != null){
            commentData = commentData.replace(/<[^>]+>/g,'');
        }
        commentData = commentData.replaceAll('&nbsp;','').trim();
        // console.log(commentData + "-" + commentData.length+"-"+userId+"-"+userName);
        // 过滤无效信息
        if(filterByKeyword(commentData) || excludeInfo.userBlackList.includes(userName) || commentData.length < excludeInfo.minLength){
            // 获取当前评论的父类容器然后隐藏该容器
            var currentDiy = commentArray[i].closest('.comiis_vrx');
            currentDiy.style.display ="none";
            // 存储无效信息的容器的添加上用户名
            var trItem = document.createElement("tr");
            var userNameTdItem = document.createElement("td");
            userNameTdItem.innerText = userName;
            trItem.appendChild(userNameTdItem);
            // 存储无效信息的容器的添加上用户评论
            var userCommentTdItem = document.createElement("td");
            userCommentTdItem.innerText = commentData;
            trItem.appendChild(userCommentTdItem);
            tableElement.appendChild(trItem);
        }
    }
    // 添加无效信息的容器到页面上
    document.getElementById("append_parent").appendChild(tableElement);
})();

// 判断是pc端还是pe端
function isMobileDevice() {
    let agentInfo = navigator.userAgent;
    return /mobile/i.test(agentInfo);;
}

// 通过关键字过滤
function filterByKeyword(commentData){
    if(commentData.length > excludeInfo.keywordLength){
        return false;
    }
    return excludeInfo.keywords.some(function (keyword){
        return commentData.includes(keyword);
    });
}

// 获取当前页数
function getCurrentPage(){
    let currentPageElement = document.getElementsByClassName("pg")[0];
    // 如果是空说明只有1页
    if(currentPageElement == undefined){
       return 1;
    }
    return currentPageElement.querySelectorAll('strong')[0].innerText;
}

// 设置作者信息到缓存中
function setAuthorIdsCache(commentArray){
   let authorId = commentArray[0].id.split("_")[1];
   let authorJSON = getAuthorIdsCache();
   authorJSON.authorIds.push(authorId);
   sessionStorage.setItem("authorIds",JSON.stringify(authorJSON));
}

// 读取作者信息
function getAuthorIdsCache(){
   let authorJSONStr = sessionStorage.getItem("authorIds");
   if(authorJSONStr == null){
      authorJSONStr = '{authorIds:[]}';
   }
   authorJSONStr = JSON.stringify(authorJSONStr);
   //return JSON.parse(authorJSONStr);
   //return eval("("+authorJSONStr+")");
   return eval("("+JSON.parse(authorJSONStr)+")");
}

// 创建无效信息箱按钮
function createInvalidMsgButton(){
    let aElement = document.createElement("a");
    aElement.id = "invalidMsgDiy";
    aElement.className = "kmcopy";
    aElement.innerText = "[无效信息箱]";
    aElement.setAttribute('onclick',"showMenu({'ctrlid':'invalidMsgDiy'})");
    return aElement;
}

// 创建存储无效信息的容器
function createInvalidMsgContext(){
    let tableElement = document.createElement("table");
    tableElement.id = "invalidMsgDiy_menu";
    tableElement.style.display ="none";
    tableElement.style.zindex = "999";
    tableElement.style.background ="#333";
    tableElement.style.color ="#F3F3F3";
    return tableElement;
}

// 移动版处理
function mobileFilter(){
    var currentPagePhone = document.getElementById("dumppage").value;
    if(currentPagePhone != 1){
        currentPagePhone = 0;
    }
    var commentArrayPhone = document.getElementsByClassName("comiis_a");
    for (var m = currentPagePhone; m <= commentArrayPhone.length - 1; m++) {
         // 白名单用户不进行处理
        var userNamePhone = commentArrayPhone[m].parentNode.parentNode.previousElementSibling.querySelectorAll('.top_user')[0].innerText.trim();
        if(excludeInfo.userWhiteList.includes(userNamePhone)){
            continue;
        }
        var commentDataPhone = commentArrayPhone[m].innerHTML.trim();
        // 如果是回复评论则去除别人的回复
        if(commentDataPhone.includes('<div class="comiis_quote bg_h b_dashed f_c">')){
           if(!excludeInfo.replyFlag){
               continue;
           }
           commentDataPhone = commentDataPhone.replace(/<div class="comiis_quote bg_h b_dashed f_c">[\s\S]*<\/div>(<br>)?/g,'');
        }
        // 如果评论中带有HTML标签则去除
        if(commentDataPhone.match(/<[^>]+>/g) != null){
           commentDataPhone = commentDataPhone.replace(/<[^>]+>/g,'');
        }
        commentDataPhone = commentDataPhone.replaceAll('&nbsp;','').trim();
        console.log(commentDataPhone + "-" + commentDataPhone.length+"-"+userNamePhone);
        if(filterByKeyword(commentDataPhone) || excludeInfo.userBlackList.includes(userNamePhone) || commentDataPhone.length < excludeInfo.minLength){
            // 获取当前评论的父类容器然后隐藏该容器
            var currentDiyPhone = commentArrayPhone[m].closest('.comiis_postli');
            currentDiyPhone.style.display ="none";
        }
    }
}