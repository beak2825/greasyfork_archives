// ==UserScript==
// @name         Daimayuan Online Judge++
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  增强Daimayuan OJ的功能
// @author       Chen
// @match        *://oj.daimayuan.top/*
// @icon         <$ICON$>
// @grant        none
// @license      MIT
// @run-at       document-idle

// @compatible firefox
// @compatible chrome
// @compatible safari
// @compatible edge 需要新版 Edge
// @incompatible opera

// @downloadURL https://update.greasyfork.org/scripts/470244/Daimayuan%20Online%20Judge%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/470244/Daimayuan%20Online%20Judge%2B%2B.meta.js
// ==/UserScript==

(function() {
    // 'use strict';
    console.log("Daimayuan Online Judge++ 脚本开始加载! ");
    console.log("0%");
    setTimeout(void(0), 600);
    console.log("100%");
    setTimeout(void(0), 200);
    console.info("Daimayuan Online Judge++ 脚本加载完成! ");

    console.log("进度条动画效果注入中...")
    var elements = document.getElementsByClassName("progress-bar");
    for (var i=0;i<elements.length;i++) {
        let element = elements[i];
        console.log("找到一个进度条元素! ",element);
        if (element.style.width.replace("%","") <= 25) {element.classList.add("bg-danger");continue;}
        if (element.style.width.replace("%","") >= 80) {element.classList.add("bg-success");continue;}
        element.classList.add("progress-bar-striped");
        console.log("已添加progress-bar-striped属性! ");
        element.classList.add("progress-bar-animated");
        console.log("已添加progress-bar-aniamated属性! ");
    }
    console.log("进度条动画效果注入完成! ")

    console.log("100变AC效果注入中...")
    elements = document.getElementsByClassName("uoj-score");
    console.log("找到"+elements.length+"个uoj-score元素! ");
    for (i=0;i<elements.length;i++) {
        let element = elements[i];
        if (element.innerHTML==="100") {
            if (element.style.color!=="rgb(0, 204, 0)") {
                continue;
            }
            console.log("找到一个为100分的uoj-score元素! ",element);
            // element.innerHTML = "AC";
            element.innerHTML = `<svg style="flex: none;width: 1em;text-align: center;" data-v-1b44b3e6="" data-v-beeebc6e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon svg-inline--fa fa-check fa-w-16" data-v-0640126c=""><path data-v-1b44b3e6="" fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" class=""></path>
</svg>`;
            element.title = "100, Accepted";
            //
            console.log("已将innerHTML改为'AC'! ");
        } else {
            if (element.innerHTML > 100) {
                continue;
            }
            console.log("找到一个不为100分的uoj-score元素! ",element);
          	if (element.innerHTML !== "0") {
                continue;
            }
            // element.innerHTML = "ERR";
          	element.innerHTML = `<svg data-v-1b44b3e6="" data-v-beeebc6e="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="icon svg-inline--fa fa-times fa-w-11" data-v-0640126c="" style="flex: none;width: 0.75em;text-align: center;transform: scale(1.2); "><path data-v-1b44b3e6="" fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>`;
            console.log("已将innerHTML改为'ERR'! ");
        }
    }
    console.log("100变AC效果效果注入完成! ")

    let username = "chenziang"; // change it
    console.log("自己名字("+username+")变绿色效果注入中...")
    elements = document.getElementsByClassName("uoj-username");
    console.log("找到"+elements.length+"个uoj-username元素! ");
    for (i=0;i<elements.length;i++) {
        let element = elements[i];
        if (element.innerHTML===username) {
            console.log("找到一个用户名为 "+username+" 的uoj-username元素! ",element);
            // element.innerHTML = username;
            element.title = "You ("+username+")";
            element.style.color = "rgb(0, 204, 0)";
            console.log("已修改! ");
        }
    }
    console.log("自己名字("+username+")变绿色效果注入中...")
  
  

    
    console.log("比赛确认效果注入中...")
    elements = document.getElementsByTagName("a");
    console.log("找到"+elements.length+"个a元素! ");
    for (i=0;i<elements.length;i++) {
        let element = elements[i];
        if (element.href != "http://oj.daimayuan.top/contests" && /\/contest\/*/.test(element.href)) {
            continue;
            console.log("找到一个跳转到比赛的a元素! ",element);
            // element.innerHTML = username;
            element.title = "跳转到比赛页面";
            element.onclick = function() {const r = confirm("确认进入比赛? ");
            if(r){window.location = element.href }}
            element.href = `javascript:void(0);`
            console.log("已将颜色改为'green'! ");
        }
    }
  
  

    
    console.log("ABC简写效果注入中...")
    elements = document.getElementsByTagName("a");
    console.log("找到"+elements.length+"个a元素! ");
    for (i=0;i<elements.length;i++) {
        let element = elements[i];
        element.innerHTML = element.innerHTML.replaceAll("AtCoder Beginner Contest ","<abbr title=\"AtCoder Beginner Contest\">ABC</abbr>");
    }
  
  
  
    document.getElementsByClassName("container")[0].style.maxWidth = "1440px"
    // Your code here...
})();