// ==UserScript==
// @name         QQ群成员信息获取
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  获取qq群中用户id 群昵称 qq号
// @author       ShuSheng Li
// @match        *://qun.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/465889/QQ%E7%BE%A4%E6%88%90%E5%91%98%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/465889/QQ%E7%BE%A4%E6%88%90%E5%91%98%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

function addStyle() {
            let css = `
            .getStar {
                background-color: aqua;
                color: black;
                margin-left: 10px;
                border: 1px solid white;
                border-radius: 10px;
            }

            .infoBox {
            border-radius: 5px;
            margin-left: 5px;
            text-align: center;
            width: 700px;
            height: 350px;
            float: left;
            border: 1px solid skyblue;
            z-index: 999;
            overflow: auto;
        }
        .PrintTitle {
            color: red;
        }

        .PrintContent {
            color: black;
        }

        .userInfoList {
            color: darkorchid;
        }

        .author {
            /* font: bold */
            margin-left: 10px;
            font: italic bold 12px;
            color: gold;
        }
            `
            GM_addStyle(css)
        }
(function() {
    'use strict';
        let key = 0;
        let groupTools = document.querySelector('.group-tools');
        let example = document.createElement("div");
        example.classList.add("infoBox");
        example.innerHTML += `<button class="getStar">开始</button><span class="author">Author:李树生</span><br>`;
        groupTools.appendChild(example);
        let button = document.querySelector(".getStar");
        addStyle();
        button.addEventListener('click', function(){
        let clock = setTimeout(function(){
        let groupMemberNum = parseInt(document.querySelector("#groupMemberNum").innerText);
        /*
            设置控制台中文字颜色
         */

        // 定义占位字符
        var e = '%c';
        // 定义文字样式
        var OutPutStyle = "color: deeppink; font-weight:bolder; font-size:24px";
         /*
            核心代码
          */
        let userList = document.getElementsByClassName('mb');
        let usernameBox = document.getElementsByClassName('td-user-nick');
        // 定义用于存储用户名的数组
        let username = [];
        // 定义用于存储用户真实姓名或数据的数组
        let userRealName = [];
        // 定义用于存储用户qq号的数组
        let userIdNumbers = [];
        // 向数组中存储用户名
        for(let i=0; i < usernameBox.length; i++)
        {
           username[i] =  usernameBox[i].children[2].innerText;
        }
        // 循环遍历，将用户qq号存入数组
        for(let i = 0; i < userList.length; i++)
        {
            userRealName[i] = userList[i].children[3].children[0].innerText;
            userIdNumbers[i] = userList[i].children[4].innerText;

        }
        example.innerHTML += `<span class="PrintTitle"><========打印username & userRealInfo=========></span><br>`;
        example.innerHTML += `<span class="PrintContent">` + "共有: " + groupMemberNum + "个成员" + "," + "当前已获取：" + username.length + "个成员信息";`</span>`
        example.innerHTML += `<br>`;
        console.log(e + '<========打印username & userRealInfo=========>', OutPutStyle);
        console.log("共有: " + groupMemberNum + "个成员" + "当前已获取：" + username.length + "个成员信息");
        for(let j = 0; j < userRealName.length; j++)
        {
            key++;
            example.innerHTML += `<span class="userInfoList">` + "用户名:" + username[j] + "<===========>" + "用户真实信息：" + userRealName[j] + "<===========>" + "QQ号:" + userIdNumbers[j];`</span>`
            example.innerHTML += `<br>`;
            console.log("用户名:" + username[j] + "<===========>" + "用户真实信息：" + userRealName[j] + "<===========>" + "QQ号:" + userIdNumbers[j]);
        }
            if(key == groupMemberNum)
            {alert("已获取全部成员信息");}
            else if(key < groupMemberNum )
            {alert("未获取全部成员信息，请刷新页面，并滚动鼠标至最底端再运行脚本！")}
            else
            {alert("出错");}
        }, 10000)
        });
})();