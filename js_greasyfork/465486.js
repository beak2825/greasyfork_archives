// ==UserScript==
// @name         哔哩哔哩评论区年龄与屏蔽算法——@_Bluem_的毕业设计的一部分
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       bilibili @_Bluem_
// @match        *://*.bilibili.com/*
// @grant        none
// @license      MIT
// @description  哔哩哔哩的信息收集系统，bluem的毕业设计的一部分
// @downloadURL https://update.greasyfork.org/scripts/465486/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%B9%B4%E9%BE%84%E4%B8%8E%E5%B1%8F%E8%94%BD%E7%AE%97%E6%B3%95%E2%80%94%E2%80%94%40_Bluem_%E7%9A%84%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A1%E7%9A%84%E4%B8%80%E9%83%A8%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/465486/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%B9%B4%E9%BE%84%E4%B8%8E%E5%B1%8F%E8%94%BD%E7%AE%97%E6%B3%95%E2%80%94%E2%80%94%40_Bluem_%E7%9A%84%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A1%E7%9A%84%E4%B8%80%E9%83%A8%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let replyNum = 0;
    let thisBV = "";
    let thisUserName = "";
    let thisUserUID = "";

    let replyItemArr = [];//评论块列表
    let replyUserNameArr = [];//评论的用户的名字
    let replyUIDArr = [];//评论的用户的uid
    let replyContentArr = [];//评论的具体内容
    let replyLikeArr = [];//评论点赞的数量
    let replyAgreeBtnArr = [];//评论对应的认同按钮
    let replyDisagreeBtnArr = [];//评论对应的反对按钮
    let replyHateBtnArr = [];//评论对应的不想看到按钮

    let hideReplyUIDArr = [];//隐藏起来的评论的用户的uid
    let hideReplyContentArr = [];//隐藏起来的评论的详情

    thisBV = window.location.href.substr(window.location.href.indexOf("BV"), 12);//获取BV号
    if(thisBV.length != 12){
        thisBV = "";
    }
    if(thisBV == ""){return}
    setInterval(update, 2000);
    start();

    function start(){
        let ageBoardHtml = `
<div id="bluemAgeBoard" style="position:fixed;left:10px;top:48px;background-color: rgb(99, 191, 253);box-shadow:1px 1px 2px gray;border-radius:5px;padding-left:10px;padding-right:10px;z-index:1010;">
<div id="bluemAgeShowBoard" style="text-shadow:1px 1px 1px rgb(0, 0, 0);text-align: center;width:100%;height:20px;font-weight:bold;padding-top:10px;padding-bottom:10px;">
<a id="bluemAgeLabel" style="color:white;">年龄: 18</a>
<div style="width:10px;height:10px;display:inline-block"></div>
<div id="bluemShowAgeHiddenBoardBtn" style="width:10px;height:10px;border:5px solid rgb(255, 255, 255);border-bottom:0;border-right:0;float:right;cursor: pointer;border-radius:5px;transform:rotate(225deg);"></div>
</div>
<div id="bluemAgeHiddenBoard" hidden="true">
<textarea id="bluemAgeTextarea" style="resize:none;height:21px;width:28px;text-align:center;margin-left:-5px;overflow:hidden;background-color:rgb(240,240,255);border:1px solid black;border-radius:5px;" wrap="off">18</textarea>
<button id="bluemAgeChangeBtn" style="width:75px;height:21px;margin-right:5px;transform:translate(0,-5px);cursor: pointer;font-weight:bold;">更新年龄</button>
<button id="bluemResetBtn" style="width:50px;height:21px;margin-left:5px;margin-right:-5px;transform:translate(0,-5px);cursor: pointer;font-weight:bold;">重置</button>
<div style="color:white;font-weight:bold;">帮帮bluem做毕设吧亲(˃ ⌑ ˂ഃ )</div>
</div>
</div>
`;
        let newDiv = document.createElement("div")
        newDiv.innerHTML = ageBoardHtml;
        //document.getElementsByClassName("left-container")[0].innerHTML += ageBoardHtml;
        document.getElementById("video-page-app").append(newDiv);
        //document.body.innerHTML = ageBoardHtml + document.body.innerHTML;
        let showBtn = document.getElementById("bluemShowAgeHiddenBoardBtn");
        showBtn.onclick = ()=>{
            let showBoard = document.getElementById("bluemAgeHiddenBoard");
            if(showBoard.hidden){
                showBoard.hidden = false;
                showBtn.style.transform = "rotate(45deg) translate(3px, 3px)";
            }
            else{
                showBoard.hidden = true;
                showBtn.style.transform = "rotate(225deg)";
            }
        }
        startAddClickEvent();
        startPOST();
    }//初始化
    function update(){
        let replyItem = document.getElementsByClassName("reply-item");
        for(let item of replyItem){
            let replyInfo = item.querySelector(".reply-info");
            if(!checkIfAddMyBtns(replyInfo)){
                addMyBtns(replyInfo);
                replyItemArr.push(item);
                replyUserNameArr.push(item.querySelector(".user-name").innerHTML);
                replyUIDArr.push(item.querySelector(".user-name").getAttribute('data-user-id'));
                replyContentArr.push(changeReplyContentInner(item.querySelector(".reply-content").innerHTML));
                let likeItem = item.querySelector(".reply-like").querySelector('span[data-v-7592db79]')
                replyLikeArr.push(likeItem? likeItem.innerHTML :"0");
                replyAgreeBtnArr.push(item.querySelector(".bluem-agree-btn"));
                replyDisagreeBtnArr.push(item.querySelector(".bluem-disagree-btn"));
                replyHateBtnArr.push(item.querySelector(".bluem-hate-btn"));
                addClickEvent(replyNum);
                replyNum += 1;
            }//主评论
            let subReplyItemArr = item.querySelectorAll(".sub-reply-item");
            for(let subItem of subReplyItemArr){
                replyInfo = subItem.querySelector(".sub-reply-info");
                if(!checkIfAddMyBtns(replyInfo)){
                    addMyBtns(replyInfo);
                    replyItemArr.push(subItem);
                    replyUserNameArr.push(subItem.querySelector(".sub-user-name").innerHTML);
                    replyUIDArr.push(subItem.querySelector(".sub-user-name").getAttribute('data-user-id'));
                    replyContentArr.push(changeReplyContentInner(subItem.querySelector(".reply-content").innerHTML));
                    let likeItem = subItem.querySelector(".sub-reply-like").querySelector('span[data-v-15f04a69]')
                    replyLikeArr.push(likeItem? likeItem.innerHTML :"0");
                    replyAgreeBtnArr.push(subItem.querySelector(".bluem-agree-btn"));
                    replyDisagreeBtnArr.push(subItem.querySelector(".bluem-disagree-btn"));
                    replyHateBtnArr.push(subItem.querySelector(".bluem-hate-btn"));
                    addClickEvent(replyNum);
                    replyNum += 1;
                }
            }//小评论
        }//遍历评论
        let newBV = window.location.href.substr(window.location.href.indexOf("BV"), 12);//获取BV号
        if(newBV.length == 12 && newBV != thisBV){
            thisBV = newBV;
            startPOST();
        }
        updateHide();
    }//更新

    function startPOST(){
        if(!document.getElementsByClassName("header-entry-mini")[0]){
            setTimeout(()=>{startPOST()}, 100);
            return
        }
        setName();
        thisUserUID = document.getElementsByClassName("header-entry-mini")[0].href.split("https://space.bilibili.com/")[1];
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = () => {
            if(ajax.readyState === 4 && ajax.status === 200){
                let json = JSON.parse(ajax.responseText);
                document.getElementById("bluemAgeLabel").innerHTML = "年龄: " + json.age.toString();
                document.getElementById("bluemAgeTextarea").value = json.age.toString();
                hideListReply(json.hideList);
            }
        }
        ajax.open("POST", "https://bluem.top/biliReply/", true);
        ajax.setRequestHeader("content-type","application/x-www-form-urlencoded");
        ajax.send("type=start&userUID=" + thisUserUID + "&BV=" + thisBV);
    }//开始的POST请求
    function startAddClickEvent(){
        let label = document.getElementById("bluemAgeLabel");
        let ageTextarea = document.getElementById("bluemAgeTextarea");
        let setAgeBtn = document.getElementById("bluemAgeChangeBtn");
        let resetBtn = document.getElementById("bluemResetBtn");

        setAgeBtn.onclick = ()=>{
            if(!thisUserUID){return}
            let age = parseInt(ageTextarea.value);
            if(age <= 0){return}
            let ajax = new XMLHttpRequest();
            ajax.onreadystatechange = () => {
                if(ajax.readyState === 4 && ajax.status === 200){
                    let json = JSON.parse(ajax.responseText);
                    label.innerHTML = "年龄: " + age.toString();
                    hideListReply(json.hideList);
                }
            }
            ajax.open("POST", "https://bluem.top/biliReply/", true);
            ajax.setRequestHeader("content-type","application/x-www-form-urlencoded");
            ajax.send("type=setAge&userUID=" + thisUserUID + "&age=" + age.toString() + "&BV=" + thisBV);
        }
        resetBtn.onclick = ()=>{
            if(!thisUserUID){return}
            let age = parseInt(label.innerHTML.slice(4));
            let ajax = new XMLHttpRequest();
            ajax.onreadystatechange = () => {
                if(ajax.readyState === 4 && ajax.status === 200){
                    let json = JSON.parse(ajax.responseText);
                    hideListReply(json.hideList);
                }
            }
            ajax.open("POST", "https://bluem.top/biliReply/", true);
            ajax.setRequestHeader("content-type","application/x-www-form-urlencoded");
            ajax.send("type=restart&userUID=" + thisUserUID + "&age=" + age.toString() + "&BV=" + thisBV);
        }
    }//在start中添加点击事件
    function setName(){
        if(thisUserName){return}
        if(!document.getElementsByClassName("nickname-item")[0]){
            setTimeout(()=>{setName()}, 2000);
            return
        }
        thisUserName = document.getElementsByClassName("nickname-item")[0].innerHTML;
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = () => {
            if(ajax.readyState === 4 && ajax.status === 200){
                let json = JSON.parse(ajax.responseText);
            }
        }
        ajax.open("POST", "https://bluem.top/biliReply/", true);
        ajax.setRequestHeader("content-type","application/x-www-form-urlencoded");
        ajax.send("type=setName&userUID=" + thisUserUID + "&userName=" + thisUserName);
    }//设置名字
    function hideListReply(list){
        hideReplyUIDArr = [];
        hideReplyContentArr = [];
        for(let each of list){
            let uid = each.uid;
            let content = each.content;
            hideReplyUIDArr.push(uid);
            hideReplyContentArr.push(content);
            for(let i = 0; i < replyItemArr.length; i += 1){
                if(replyUIDArr[i] == uid && replyContentArr[i] == content){
                    replyItemArr[i].hidden = true;
                }
            }
        }
    }//隐藏列表对应的评论

    function updateHide(){
        for(let i = 0; i < hideReplyUIDArr.length; i += 1){
            let uid = hideReplyUIDArr[i];
            let content = hideReplyContentArr[i];
            for(let i = 0; i < replyItemArr.length; i += 1){
                if(replyUIDArr[i] == uid && replyContentArr[i] == content){
                    replyItemArr[i].hidden = true;
                }
            }
        }
    }
    function addMyBtns(replyInfo){
        let innerHTML =
`
<div class = "bluem-reply-add-board" style = "margin-left: 50px;">
<button class = "bluem-agree-btn" style=
"
background-color: white;
border-radius:5px;
border:2px solid skyblue;
margin-left:20px;
height:25px;
width:40px;
user-select:none;
cursor: pointer;
text-align:center;
font-weight:bold;
color:skyblue;
box-shadow:1px 1px 1px gray;
">
认同
</button>
<button class = "bluem-disagree-btn" style=
"
background-color: white;
border-radius:5px;
border:2px solid red;
margin-left:20px;
height:25px;
width:40px;
user-select:none;
cursor: pointer;
text-align:center;
font-weight:bold;
color:red;
box-shadow:1px 1px 1px gray;
">
反对
</button>
<button class = "bluem-hate-btn" style=
"
background-color: rgb(250,250,250);
border-radius:5px;
margin-left:20px;
height:25px;
border:2px solid white;
padding-left:10px;
padding-right:10px;
user-select:none;
cursor: pointer;
font-weight:bold;
text-align:center;
color:lightgray;
">
不想看到
</button>
</div>
<bluem></bluem>
`
        let newDiv = document.createElement("bluem")
        newDiv.setAttribute("class", "bluemNemReplyBlock");
        newDiv.innerHTML = innerHTML;
        replyInfo.append(newDiv);
    }//添加自定义按钮
    function addClickEvent(id){
        replyAgreeBtnArr[replyNum].onclick = ()=>{clickAgree(id)};
        replyDisagreeBtnArr[replyNum].onclick = ()=>{clickDisagree(id)};
        replyHateBtnArr[replyNum].onclick = ()=>{clickHate(id)};
    }//添加点击事件
    function clickAgree(id){
        let flagNum = "1";
        if(replyAgreeBtnArr[id].style.color == "white"){
            flagNum = "-1";
            replyAgreeBtnArr[id].style.color = "skyblue";
            replyAgreeBtnArr[id].style.backgroundColor = "white";
        }
        else{
            if(replyDisagreeBtnArr[id].style.color == "white"){
                clickDisagree(id);
            }
            replyAgreeBtnArr[id].style.color = "white";
            replyAgreeBtnArr[id].style.backgroundColor = "skyblue";
        }

        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = () => {
            if(ajax.readyState === 4 && ajax.status === 200){
                let json = JSON.parse(ajax.responseText);
            }
        }
        ajax.open("POST", "https://bluem.top/biliReply/", true);
        ajax.setRequestHeader("content-type","application/x-www-form-urlencoded");
        ajax.send("type=agree" +
                  "&BV=" + thisBV +
                  "&replyUID=" + replyUIDArr[id] +
                  "&replyUserName=" + replyUserNameArr[id] +
                  "&replyContent=" + replyContentArr[id] +
                  "&biliLike=" + replyLikeArr[id] +
                  "&num=" + flagNum +
                  "&userUID=" + thisUserUID
                 );
    }//点击认同
    function clickDisagree(id){
        let flagNum = "1";
        if(replyDisagreeBtnArr[id].style.color == "white"){
            flagNum = "-1";
            replyDisagreeBtnArr[id].style.color = "red";
            replyDisagreeBtnArr[id].style.backgroundColor = "white";
        }
        else{
            if(replyAgreeBtnArr[id].style.color == "white"){
                clickAgree(id);
            }
            replyDisagreeBtnArr[id].style.color = "white";
            replyDisagreeBtnArr[id].style.backgroundColor = "red";
        }

        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = () => {
            if(ajax.readyState === 4 && ajax.status === 200){
                let json = JSON.parse(ajax.responseText);
            }
        }
        ajax.open("POST", "https://bluem.top/biliReply/", true);
        ajax.setRequestHeader("content-type","application/x-www-form-urlencoded");
        ajax.send("type=disagree" +
                  "&BV=" + thisBV +
                  "&replyUID=" + replyUIDArr[id] +
                  "&replyUserName=" + replyUserNameArr[id] +
                  "&replyContent=" + replyContentArr[id] +
                  "&biliLike=" + replyLikeArr[id] +
                  "&num=" + flagNum +
                  "&userUID=" + thisUserUID
                 );
    }//点击反对
    function clickHate(id){
        replyItemArr[id].hidden = true;
        if(thisUserName){return}
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = () => {
            if(ajax.readyState === 4 && ajax.status === 200){
                let json = JSON.parse(ajax.responseText);
            }
        }
        ajax.open("POST", "https://bluem.top/biliReply/", true);
        ajax.setRequestHeader("content-type","application/x-www-form-urlencoded");
        ajax.send("type=hate" +
                  "&BV=" + thisBV +
                  "&replyUID=" + replyUIDArr[id] +
                  "&replyUserName=" + replyUserNameArr[id] +
                  "&replyContent=" + replyContentArr[id] +
                  "&biliLike=" + replyLikeArr[id] +
                  "&userUID=" + thisUserUID
                 );
    }//点击不想看到
    function changeReplyContentInner(txt){
        let ans = txt
        .replace("</a>", "")
        .replace(/<img[^[]*\[/g, "[")
        .replace(/<img.*.webp">/g, "")
        .replace(/<i class="icon.*"><\/i>/g, "")
        .replace("<i class=\"top-icon\">置顶</i>", "")
        .replace(/]\">/g, "]")
        .replace(/<a class="jump-link.*">/g, "")
        .replace(/回复 @.* :/g, "回复 :");
        return ans;
    }//缩减回复的具体内容
    function checkIfAddMyBtns(replyInfo){
        return replyInfo.innerHTML.substr(replyInfo.innerHTML.lastIndexOf("</") + 2,5) == "bluem";
    }//检测是否添加过自定义按钮
    function clickBtnShowTable(){
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = () => {
            if(ajax.readyState === 4 && ajax.status === 200){
                let json = JSON.parse(ajax.responseText)
                console.log(json);
            }
        }
        ajax.open("POST", "https://bluem.top/biliReply/", true);
        ajax.setRequestHeader("content-type","application/x-www-form-urlencoded");
        ajax.send("type=showTable");
    }//获取现有表格


})();