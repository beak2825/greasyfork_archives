// ==UserScript==
// @name     IT blog Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  对部分论坛网站实现 自动展开隐藏内容 / 免登陆复制 / 去除遮掩内容 Lite，持续更新中
// @author       You
// @match        *.it1352.com/*
// @match        *.qianduanheidong.com/*
// @match        https://blog.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require           https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/451346/IT%20blog%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/451346/IT%20blog%20Helper.meta.js
// ==/UserScript==

// console.log("===============>>>>>>>>>>自动展开隐藏内容 / 去除遮掩内容 脚本触发");

// console.log($.cookie)

var map = {}
map['^https?:\/\/.*?\.it1352.com.*?'] = ()=>{
    var cookies = document.cookie.split('; ');
    //if(!cookies.some(cookie => cookie==='olduser=1')){ // compatible backup
    if(!cookies.includes('olduser=1')){
        document.cookie = 'olduser=1';
        window.location.reload();
    }
}
// const regx = /^https?:\/\/.*?\.qianduanheidong\.com.*?/g
map['^https?:\/\/.*?\.qianduanheidong\.com.*?'] = ()=>{
    $("#layui-layer1").css('display','none');
    $("#layui-layer-shade1").css('display','none');
    $("body").append("<script> if(user_login) {user_login = true} else {var user_login = true;}</script>");
    $("html").removeAttr("style");
}

// https://blog.csdn.net/chengqiuming/article/details/109958407
map['^https?:\/\/blog\.csdn\.net.*?'] = ()=>{

    // 免登录复制
    var cookies = document.cookie.split('; ');
    //if(!cookies.some(cookie => cookie==='olduser=1')){ // compatible backup
    if(!cookies.includes('hide_login=1')){
        document.cookie = 'hide_login=1;path=/';
        window.location.reload();
    }

    $('#content_views pre').attr("style","-webkit-touch-callout: inherit; -webkit-user-select: inherit; -khtml-user-select: inherit; -moz-user-select: inherit; -ms-user-select: inherit; user-select: inherit;");
    $('#content_views pre code').attr("style","-webkit-touch-callout: inherit; -webkit-user-select: inherit; -khtml-user-select: inherit; -moz-user-select: inherit; -ms-user-select: inherit; user-select: inherit;");


    // 非登录展开所有内容
    $('#article_content').removeAttr('style')
    $('div.hide-article-box').attr("style","display: none;")

}



const url = window.location.href
Object.keys(map).forEach( regxStr => {

    const regx = new RegExp(regxStr);
    if(regx.test(url)){
        map[regxStr]()
    }
});












