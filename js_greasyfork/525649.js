// ==UserScript==
// @name         西电研究生自动评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一个西电研究生评教脚本
// @author       cccqauthor
// @match        https://yjspt.xidian.edu.cn/gsapp/sys/wspjapp/*
// @icon         https://res.xidian.edu.cn/images/user.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525649/%E8%A5%BF%E7%94%B5%E7%A0%94%E7%A9%B6%E7%94%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/525649/%E8%A5%BF%E7%94%B5%E7%A0%94%E7%A9%B6%E7%94%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let delay = 1000;
    /**
    *创建页面导航栏，内含一个自动评教按钮
    */
    // 创建大容器
    let box = document.createElement("div");
    box.className = "pj-box"
    document.body.appendChild(box);
    // 创建按钮组
    let section = document.createElement("section");
    section.className = "btns_section";
    section.innerHTML = `
             <p class="logo_tit">auto teaching assecement</p>
             <button class="btn-1">自动评教 😈</button>
         `;
    box.appendChild(section);
    // 添加隐藏/展示按钮
    // 隐藏【🙈】，展开【🐵】
    let hide_btn = document.createElement("p");
    hide_btn.className = "hide_btn_wk";
    hide_btn.textContent = "🐵";
    hide_btn.onclick = () => {
        // 显示 -> 隐藏
        if (getComputedStyle(section).display === "block") {
            section.style.display = "none";
            hide_btn.style.left = "20px";
            hide_btn.textContent = "🙈";
            // 隐藏 -> 显示
        } else {
            section.style.display = "block";
            hide_btn.style.left = "155px";
            hide_btn.textContent = "🐵";
        }
    };
    box.appendChild(hide_btn);
    let style = document.createElement("style");
    style.innerHTML = `
    .hide_btn_wk {
                     position: fixed;
                     left: 155px;
                     top: 36%;
                     user-select: none;
                     font-size: large;
                     z-index: 5001;
                 }
    .btns_section{
                 position: fixed;
                 width: 154px;
                 left: 10px;
                 top: 32%;
                 background: #E7F1FF;
                 border: 2px solid #1676FF;
                 padding: 0px 0px 10px 0px;
                 font-weight: 600;
                 border-radius: 2px;
                 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
                 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                 'Segoe UI Emoji', 'Segoe UI Symbol';
                 z-index: 5000;
             }
             .logo_tit{
                 width: 100%;
                 background: #1676FF;
                 text-align: center;
                 font-size:12px ;
                 color: #E7F1FF;
                 line-height: 40px;
                 height: 40px;
                 margin: 0 0 16px 0;
             }

             .btn-1{
                 display: block;
                 width: 128px;
                 height: 28px;
                 background: linear-gradient(180deg, #00E7F7 0%, #FEB800 0.01%, #FF8700 100%);
                 border-radius: 4px;
                 color: #fff;
                 font-size: 12px;
                 border: none;
                 outline: none;
                 margin: 8px auto;
                 font-weight: bold;
                 cursor: pointer;
                 opacity: .9;
             }
           .btn-1:hover{ opacity: .8;}
    `;
    document.head.appendChild(style);
    /**
         * 创建5个按钮：展开文档、导出图片、导出PDF、未设定4、未设定5；默认均为隐藏
         */

    // 创建大容器
    //             let box = document.createElement("div");
    //             box.className = "wk-box";
    //             document.body.appendChild(box);

    //             // 创建按钮组
    //             let section = document.createElement("section");
    //             section.className = "btns_section";
    //             section.innerHTML = `
    //             <p class="logo_tit">Wenku Doc Downloader</p>
    //             <button class="btn-1">自动评教 😈</button>
    //             <button class="btn-2">未设定2</button>
    //             <button class="btn-3">未设定3</button>
    //             <button class="btn-4">未设定4</button>
    //             <button class="btn-5">未设定5</button>
    //         `;
    //             box.appendChild(section);

    //             // 添加隐藏/展示按钮
    //             // 隐藏【🙈】，展开【🐵】
    //             let hide_btn = document.createElement("p");
    //             hide_btn.className = "hide_btn_wk";
    //             hide_btn.textContent = "🐵";
    //             hide_btn.onclick = () => {
    //                 // 显示 -> 隐藏
    //                 if (getComputedStyle(section).display === "block") {
    //                     section.style.display = "none";
    //                     hide_btn.style.left = "20px";
    //                     hide_btn.textContent = "🙈";
    //                     // 隐藏 -> 显示
    //                 } else {
    //                     section.style.display = "block";
    //                     hide_btn.style.left = "155px";
    //                     hide_btn.textContent = "🐵";
    //                 }
    //             };
    //             box.appendChild(hide_btn);

    //             // 设定样式
    //             let style = document.createElement("style");
    //             style.innerHTML = `
    //             .hide_btn_wk {
    //                 position: fixed;
    //                 left: 155px;
    //                 top: 36%;
    //                 user-select: none;
    //                 font-size: large;
    //                 z-index: 5001;
    //             }
    //             .btns_section{
    //                 position: fixed;
    //                 width: 154px;
    //                 left: 10px;
    //                 top: 32%;
    //                 background: #E7F1FF;
    //                 border: 2px solid #1676FF;
    //                 padding: 0px 0px 10px 0px;
    //                 font-weight: 600;
    //                 border-radius: 2px;
    //                 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    //                 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    //                 'Segoe UI Emoji', 'Segoe UI Symbol';
    //                 z-index: 5000;
    //             }
    //             .logo_tit{
    //                 width: 100%;
    //                 background: #1676FF;
    //                 text-align: center;
    //                 font-size:12px ;
    //                 color: #E7F1FF;
    //                 line-height: 40px;
    //                 height: 40px;
    //                 margin: 0 0 16px 0;
    //             }

    //             .btn-1{
    //                 display: block;
    //                 width: 128px;
    //                 height: 28px;
    //                 background: linear-gradient(180deg, #00E7F7 0%, #FEB800 0.01%, #FF8700 100%);
    //                 border-radius: 4px;
    //                 color: #fff;
    //                 font-size: 12px;
    //                 border: none;
    //                 outline: none;
    //                 margin: 8px auto;
    //                 font-weight: bold;
    //                 cursor: pointer;
    //                 opacity: .9;
    //             }
    //             .btn-2{
    //                 display: none;
    //                 width: 128px;
    //                 height: 28px;
    //                 background: #07C160;
    //                 border-radius: 4px;
    //                 color: #fff;
    //                 font-size: 12px;
    //                 border: none;
    //                 outline: none;
    //                 margin: 8px auto;
    //                 font-weight: bold;
    //                 cursor: pointer;
    //                 opacity: .9;
    //             }
    //             .btn-3{
    //                 display: none;
    //                 width: 128px;
    //                 height: 28px;
    //                 background:#FA5151;
    //                 border-radius: 4px;
    //                 color: #fff;
    //                 font-size: 12px;
    //                 border: none;
    //                 outline: none;
    //                 margin: 8px auto;
    //                 font-weight: bold;
    //                 cursor: pointer;
    //                 opacity: .9;
    //             }
    //             .btn-4{
    //                 display: none;
    //                 width: 128px;
    //                 height: 28px;
    //                 background: #1676FF;
    //                 border-radius: 4px;
    //                 color: #fff;
    //                 font-size: 12px;
    //                 border: none;
    //                 outline: none;
    //                 margin: 8px auto;
    //                 font-weight: bold;
    //                 cursor: pointer;
    //                 opacity: .9;
    //             }
    //             .btn-5{
    //                 display: none;
    //                 width: 128px;
    //                 height: 28px;
    //                 background: #ff6600;
    //                 border-radius: 4px;
    //                 color: #fff;
    //                 font-size: 12px;
    //                 border: none;
    //                 outline: none;
    //                 margin: 8px auto;
    //                 font-weight: bold;
    //                 cursor: pointer;
    //                 opacity: .9;
    //             }
    //             .btn-1:hover,.btn-2:hover,.btn-3:hover,.btn-4,.btn-5:hover{ opacity: .8;}
    //             .btn-1:active,.btn-2:active,.btn-3:active,.btn-4,.btn-5:active{ opacity: 1;}`;
    //             document.head.appendChild(style);

    // 根据配置选择：是否默认显示

    // hide_btn.click();

    var autoAccessBtn = document.querySelector(".btn-1");
    autoAccessBtn.addEventListener('click',main);
    function main(){
        var divs = document.querySelectorAll(".sc-panel-warning");
        var divArray = Array.from(divs);
        //console.log(divArray.length);
        setTimeout(() => {
            divArray[0].click();
            setTimeout(()=>{
                let labelDiv = document.querySelectorAll(".bh-radio.bh-radio-group-v");
                labelDiv.forEach((div,index)=>{
                    let labels = div.querySelectorAll('label');
                    labels[0].click();
                });
                //console.log(labelDiv);
                setTimeout(()=>{
                    let getBack = document.querySelector('#pjfooter');
                    let as = getBack.querySelectorAll('a');
                    as[1].click();
                },delay);
            },delay);
        }, delay);

    }


    //这里结束
}

)();