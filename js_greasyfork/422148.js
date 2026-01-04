// ==UserScript==
// @name         Luogu-Blue&Green
// @homepage     https://greasyfork.org/zh-CN/scripts/422148-luogu-blue-green
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  洛谷主题全局应用-绿与蓝
// @author       Zhetengtiao
// @match        *://www.luogu.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422148/Luogu-BlueGreen.user.js
// @updateURL https://update.greasyfork.org/scripts/422148/Luogu-BlueGreen.meta.js
// ==/UserScript==

function payload()//将背景为白色的main变为绿与蓝的渐变 与https://www.luogu.com.cn/theme/design/39543主题一致
{
    document.querySelector('main[style="background-color: rgb(239, 239, 239);"]').style="background: linear-gradient(270deg, rgb(54, 173, 221), rgb(60, 215, 137));";//新版原生方法
    //$('main[style="background-color: rgb(239, 239, 239);"]').css({"background":"linear-gradient(270deg, rgb(54, 173, 221), rgb(60, 215, 137))"});//旧版jquery方法
}
window.onload=function(){
    payload();//页面加载完毕运行一次
    setTimeout(function(){
        payload();
    }, 2000);//运行后2秒后再运行一次
};