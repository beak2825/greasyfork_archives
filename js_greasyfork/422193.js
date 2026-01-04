// ==UserScript==
// @name         luogu-background-css-loader
// @namespace    luogu-background-css-loader
// @version      1.0
// @description  洛谷主题背景修改
// @author       Zhetengtiao
// @match        *://www.luogu.com.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/422193/luogu-background-css-loader.user.js
// @updateURL https://update.greasyfork.org/scripts/422193/luogu-background-css-loader.meta.js
// ==/UserScript==

function payload()
{
    var css = GM_getValue("css");
    document.querySelector('main[style="background-color: rgb(239, 239, 239);"]').style=css;//新版原生方法
}
window.onload=function(){
    var config = GM_getValue("config");
    if(GM_getValue("config")==null) {
        config=1
        alert("感谢使用！第一次运行请打开Tampermonkey菜单，点击“设置背景CSS”以设置背景CSS");
        GM_setValue("config",config);
        GM_setValue("css","background-color: rgb(239, 239, 239);");
    }
    GM_registerMenuCommand("设置背景CSS",function(){
        var css = GM_getValue("css");
        css=prompt("设置背景CSS：","");
        GM_setValue("css",css);
        alert("设置成功！请刷新页面");
    });
    payload();//页面加载完毕运行一次
    setTimeout(function(){
        payload();
    }, 2000);//运行后2秒后再运行一次
};