// ==UserScript==
// @name         CSDN博客刷积分刷等级助手
// @namespace    http://tampermonkey.net/
// @version      1.1.9
// @description  打开任意一个CSDN博客页面,就可以进行自动点赞评论,可以涨积分升级,可以自定义策略与评论内容,高度可定制化
// @author       ZainCheung
// @match        *://blog.csdn.net/*/article/details/*
// @grant        GM.xmlHttpRequest
// @connect      csdn.net
// @resource html      https://cdn.jsdelivr.net/gh/ZainCheung/CSDN-helper@master/dist/app@1.0.html
// @resource css      https://cdn.jsdelivr.net/gh/ZainCheung/CSDN-helper/dist/app@1.0.css
// @resource js      https://cdn.jsdelivr.net/gh/ZainCheung/CSDN-helper/dist/app@1.0.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        unsafeWindow
// @grant  GM_getResourceText
// @icon         https://cdn.jsdelivr.net/gh/ZainCheung/CDN/img/20200428232059.png
// @downloadURL https://update.greasyfork.org/scripts/401373/CSDN%E5%8D%9A%E5%AE%A2%E5%88%B7%E7%A7%AF%E5%88%86%E5%88%B7%E7%AD%89%E7%BA%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/401373/CSDN%E5%8D%9A%E5%AE%A2%E5%88%B7%E7%A7%AF%E5%88%86%E5%88%B7%E7%AD%89%E7%BA%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
        
        // 获取网页的网址
        var articalUrl = window.location.href;
        var host = articalUrl.split("article/details/")[0]; // 域名
        var artId = articalUrl.split("article/details/")[1].split("?")[0];
        // 组装评论请求
        var getCommentUrl = host + "phoenix/comment/list/" + artId + "?page=1&size=1000&tree_type=1";
        // 当前登陆用户的账号
        var myName = document.querySelector("#csdn-toolbar > div > div > div.toolbar-container-right > div > div.toolbar-btn.toolbar-btn-login.csdn-toolbar-fl.toolbar-subMenu-box > a").href.split("blog.csdn.net/")[1];
        // 文章的作者账号
        var UserName = document.querySelector("#mainBox > main > div.blog-content-box > div > div > div.article-info-box > div.article-bar-top > div > a.follow-nickName").href.split("csdn.net/")[1];
        // 文章全文字数
        var blogLength = document.querySelector("#article_content").innerText.replace(/\ +/g,"").replace(/[\r\n]/g,"").length;
        // 文章阅读量
        var blogRead = document.querySelector("#mainBox > main > div.blog-content-box > div > div > div.article-info-box > div.article-bar-top > div > span.read-count").innerText;
        // 文章最后发布日期
        var blogDate = document.querySelector("#mainBox > main > div.blog-content-box > div > div > div.article-info-box > div.article-bar-top > div > span.time").innerText.slice(0,10);
        // 评论文本框
        var commentArea = document.querySelector("#comment_content");
        // 评论按钮
        var commentBtn = document.querySelector("#commentform > div > div.right-box > a > input");
        // 是否评论,默认评论
        var toComment = true;

    function init(){
        // 新的一天会自动打开点赞开关
        if(localStorage.today){
            var today = new Date();
            if(localStorage.today != today.getDate()){
                localStorage.likeSwitch = 100;
                localStorage.likeCustom = 100;
                localStorage.today = today.getDate();
            }
        }

        if(localStorage.likeSwitch == 100){
            if(localStorage.likeCustom == 100){
                if((parseInt(blogLength) >= parseInt(localStorage.likeWordNumber)) && (parseInt(blogRead) >= parseInt(localStorage.likeReadNumber))){
                    if((new Date(blogDate).getTime()) >= (new Date(localStorage.likeDate).getTime())){
                        likeEvent();
                    }
                }
            }else{
                likeEvent();
            }
        }

        if(localStorage.commentSwitch == 100){
            if(localStorage.commentCustom == 100){
                if((parseInt(blogLength) >= parseInt(localStorage.commentWordNumber)) && (parseInt(blogRead) >= parseInt(localStorage.commentReadNumber))){
                    if((new Date(blogDate).getTime()) >= (new Date(localStorage.commentDate).getTime())){
                        commentEvent();
                    }
                }
            }else{
                commentEvent();
            }
        }

    }
    // 点赞事件
    function likeEvent(){
        //没有点赞才自动点赞并且延迟100毫秒后进行评论
        var zhan = document.querySelector("#is-like > a");

        if(document.querySelector("#is-like-img").style.display == "block"){
            zhan.click();
            var checkFull = window.setInterval(function(){
                if(document.querySelector("body > div.skin-boxshadow").style.display == "block"){localStorage.likeSwitch = 0}
            },100);
            setTimeout(function(){
                window.clearInterval(checkFull);
            },1000);
        }else{ console.warn("已经点过赞了");}
    }

    // 评论事件
    function commentEvent(){
        var commentTextList = JSON.parse(localStorage.commentList);
        var commentText;
        if(localStorage.commentRangeSwitch==0){
            commentText = commentTextList.R[Math.floor(Math.random()*commentTextList.R.length)].text;
        }else{
            var count_S = localStorage.commentRange.split(",")[0];
            var count_L = localStorage.commentRange.split(",")[1];
            if(blogLength<count_S){
                commentText = commentTextList.S[Math.floor(Math.random()*commentTextList.S.length)].text;
            }else if(blogLength>count_L){
                commentText = commentTextList.L[Math.floor(Math.random()*commentTextList.L.length)].text;
            }
        }

         setTimeout(function(){
             if(myName!=UserName){
                 // 从页面获取评论列表,但是只能获取第一页
                 var commentList = document.querySelector('#mainBox > main > div.comment-box > div.comment-list-container > div.comment-list-box');
                     if(commentList==null){
                             console.log(commentText);
                             document.querySelector("#comment_content").value= commentText;
                             document.querySelector("#commentform > div > div.right-box > a > input").click();
                             console.log("评论成功!");
                     }else{
                         var Imgs = commentList.getElementsByClassName("avatar");
                         for (let i=0; i<commentList.getElementsByTagName("li").length; i++){
                             // 在页面的评论列表找到当前登陆用户账号
                             if(Imgs[i].alt==myName){
                                 toComment = false;
                                 console.log("已经评论过,无需重复评论");
                                 break;
                             }
                         }
                         if(toComment ){
                             console.log(commentText);
                             document.querySelector("#comment_content").value= commentText;
                             document.querySelector("#commentform > div > div.right-box > a > input").click();
                             console.log("评论成功!");
                         }
                     }
             }
       },500);
    }

(function() {
    init();
})();

// 添加Link
function addGlobalLink(rel,href) {
	var head, link;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	link = document.createElement('link');
    link.rel = rel;
    link.href = href;
	head.appendChild(link);
}
// 添加Script
function addGlobalScript(src) {
	var body, script;
	body = document.getElementsByTagName('body')[0];
	if (!body) { return; }
	script = document.createElement('script');
    script.src = src;
	body.appendChild(script);
}

addGlobalLink('stylesheet','https://cdn.jsdelivr.net/gh/ZainCheung/CDN/css/element-ui-index.css');
addGlobalLink('stylesheet','https://at.alicdn.com/t/font_1776564_biuc05tmt1k.css');
addGlobalLink('stylesheet','https://cdn.jsdelivr.net/gh/ZainCheung/CSDN-helper/dist/app@1.0.css');
addGlobalScript("https://cdn.jsdelivr.net/gh/ZainCheung/CDN/js/element-ui-index.js");
addGlobalScript("https://cdn.jsdelivr.net/npm/vue");
addGlobalScript("https://unpkg.com/axios/dist/axios.min.js");

  window.addEventListener(
	'load', 
	function(){
        var appMenu = document.createElement("div");
        var vueScript = document.createElement("script");
        appMenu.innerHTML = GM_getResourceText("html");
        vueScript.innerHTML = GM_getResourceText("js");
        var navbar,body;
        navbar = document.getElementById('csdn-toolbar');
        body = document.getElementsByTagName('body')[0];
        if (navbar && body) {
            navbar.parentNode.insertBefore(appMenu, navbar.nextSibling);
            body.parentNode.insertBefore(vueScript, body.nextSibling);
        }
    },true);
