// ==UserScript==
// @name  知乎(zhihu)隐藏头部标题和侧边栏
// @namespace  vince.zhihu
// @include *://zhihu.com
// @include *://www.zhihu.com/*
// @include *://zhuanlan.zhihu.com/*
// @include *://promotion.zhihu.com/*
// @description:zh-cn 隐藏知乎(zhihu)的头部固定标题和右侧固定侧边栏，显示全部回复
// @version 2.2.7
// @description 隐藏知乎(zhihu)的头部固定标题和右侧固定侧边栏，显示全部回复
// @downloadURL https://update.greasyfork.org/scripts/38008/%E7%9F%A5%E4%B9%8E%28zhihu%29%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8%E6%A0%87%E9%A2%98%E5%92%8C%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/38008/%E7%9F%A5%E4%B9%8E%28zhihu%29%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8%E6%A0%87%E9%A2%98%E5%92%8C%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

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
        css = `.AppHeader{ position: unset!important; }
               .Question-sideColumn,.Profile-sideColumn,.Layout-titleImage--normal .TitleImage{display:none!important;}
               .TitleImage-image--full{height:150px!important;background-position:bottom!important;}
               .Layout-main{width:98%!important;margin-left:15px!important;}
               .Question-main,.Question-mainColumn,.Topstory-container,.TopstoryMain,.Profile-mainColumn,.Topstory-mainColumn{width:95%!important;margin: 10 px auto;}
               .Question-main{ display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: justify; -ms-flex-pack: justify; justify-content: space-between; -webkit-box-align: start; -ms-flex-align: start; align-items: flex-start; margin: 10px auto; padding: 5px 0px; width: 1000px; min-height: 100vh; } 
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
        for (var idx = 0; idx < topscon.length; idx++) {
            if(topscon[idx].nextSibling){
                topscon[idx].nextSibling.style.display='none';
            }
        }
    }

}
startScript();