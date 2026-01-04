// ==UserScript==
// @name 知乎隐藏侧边栏
// @namespace http://liudaqing.top
// @include *://zhihu.com
// @include *://www.zhihu.com/*
// @include *://zhuanlan.zhihu.com/*
// @include *://promotion.zhihu.com/*
// @description 隐藏知乎右侧固定侧边栏，显示全部回复
// @version 1.1
// @downloadURL https://update.greasyfork.org/scripts/38335/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/38335/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

// fork from others
function showAllReply(){
    var isall=document.querySelector(".QuestionMainAction");
    if(isall){
        isall.click();
    }
}
function handlePage(){
        var css,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
        css = `.Question-sideColumn,.Profile-sideColumn,.Layout-titleImage--normal .TitleImage{display:none!important;}
               .TitleImage-image--full{height:150px!important;background-position:bottom!important;}
               .Layout-main{width:80%!important;margin-left:10%!important;}
               .Question-main,.Question-mainColumn,.Topstory-container,.TopstoryMain,.Profile-mainColumn,.Topstory-mainColumn{width:92%!important;}
               .RichText img,.RichContent img{max-width:90%!important;}`;

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}
function startScript(){
    showAllReply();
    handlePage();
    var topscon=document.getElementsByClassName("Topstory-mainColumn");
    if(topscon){
        for ( idx = 0; idx < topscon.length; idx++) {
            if(topscon[idx].nextSibling){
                topscon[idx].nextSibling.style.display='none';
            }
        }
    }

}
startScript();