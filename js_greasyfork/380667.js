// ==UserScript==
// @name         CSDN,CNBLOG博客阅读模式切换插件
// @version      3.15
// @description  CSDN 阅读模式和浏览模式切换，完美支持傲游、360、Chrome等浏览器
// @author       By Jackie http://csdn.admans.cn/
// @match        *://*.csdn.net/#/*
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://www.cnblogs.com/*/p/*.html
// @match        *://www.cnblogs.com/*/articles/*.html
// @match        *://www.cnblogs.com/*/archive/*/*/*/*.html
// @match        *://www.cnblogs.com/*/p/*
// @match        *://*.admans.net/
// @match        *://*.admans.cn/
// @match        *://*.csdn.net/*
// @match        *://wenku.csdn.net/column/*
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/164689
// @supportURL   https://github.com/JackieZheng/CsdnCnblogReader/issues
// @icon         https://www.google.cn/s2/favicons?domain=csdn.net
// @downloadURL https://update.greasyfork.org/scripts/380667/CSDN%2CCNBLOG%E5%8D%9A%E5%AE%A2%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/380667/CSDN%2CCNBLOG%E5%8D%9A%E5%AE%A2%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

GM_addStyle("#ReadBtn{position: absolute;float: right;right: 0px;width: auto;background: #0f962191;z-index: 9989;color: white;text-align: center;margin: 5px;padding: 5px;border-radius: 5px;cursor: pointer;font-size:14px  !important; line-height: 100% !important;}");
GM_addStyle(".html_body_readmodel{overflow: hidden;}");
GM_addStyle(".article_content_readmodel{position: fixed !important;top: 0px;left: 0px;width: 100%;z-index: 9989;overflow: auto !important;height: 100%;background: white;padding: 20px;border:10px solid #bce4cba8;margin: 0 !important;}");
GM_addStyle(".postBody{margin-top: 20px;}");
GM_addStyle(".readBtn_float{position: fixed !important;right: 40px !important;}");
GM_addStyle(".markdown_views{padding-top: 40px !important;}");
GM_addStyle(".htmledit_views{padding-top: 40px !important;}");
GM_addStyle(".markdown_views img{margin:24px auto !important;display: flow-root;}");
GM_addStyle(".htmledit_views img{margin:24px auto !important;display: flow-root;}");
GM_addStyle("#ReproduceBtn{right: 80px;font-size:14px;}");
GM_addStyle(".ReproduceBtn_float{position: fixed !important;right: 120px !important;}");
GM_addStyle(".adsbygoogle,.box-shadow,.hide-preCode-box{display: none !important;}");
GM_addStyle(".set-code-hide{height: auto !important;overflow-y:visible !important;}");
GM_addStyle("em[class='attention-content-title']{flex:none !important;}");

// 屏蔽 推荐下载资源
GM_addStyle("div[class*='-recommend-box'],.type_download,.common-nps-box{display:none !important}");

// 滚动条样式
GM_addStyle("::-webkit-scrollbar {width: 7px; height: 8px; }");
GM_addStyle("::-webkit-scrollbar-track,::-webkit-scrollbar-thumb {border-radius: 999px;border: 5px solid transparent;}");
GM_addStyle("::-webkit-scrollbar-track {box-shadow: 1px 1px 5px rgba(0,0,0,.2) inset; }");
GM_addStyle("::-webkit-scrollbar-thumb {min-height: 20px;background-clip: content-box;box-shadow: 0 0 0 5px rgba(0,0,0,.2) inset; border: 1px solid #999aaa69;}");
GM_addStyle("::-webkit-scrollbar-corner { background: transparent;}");


(function(){
    'use strict';
    var divView = document.createElement("div");
    divView.setAttribute("id", "ReadBtn");
    divView.innerHTML ='阅读模式';
    //var cnblog=document.getElementById('cnblogs_post_body')?true:false;
    var cnblog = location.href.indexOf("cnblogs.com") > -1 ? true: false;
    var article=document.getElementsByClassName('article_content')[0]||document.getElementsByClassName('postBody')[0]||document.getElementsByClassName('blogpost-body')[0]||document.getElementsByClassName('content-view')[0];
    if(cnblog){
        divView.style.marginTop="-40px";
        divView.style.position="relative";
    }
    if(article)article.insertBefore(divView,article.childNodes[0]);
    //自动展开文章内容
    var readMoreBtn=document.getElementsByClassName('btn-readmore')[0];
    if(readMoreBtn){readMoreBtn.click(); }

    var reproduceBtn=document.getElementById('ReproduceBtn')
    setTimeout(function(){
        reproduceBtn=document.getElementById('ReproduceBtn')
        if(reproduceBtn){reproduceBtn.style.right="80px";}
        let loadingBtn=document.querySelector('.loading-btn');
        if(loadingBtn){loadingBtn.click();}
    },500);

    divView.onclick=function()
    {
        reproduceBtn=document.getElementById('ReproduceBtn')
        if(divView.innerHTML=='阅读模式')
        {
            divView.innerHTML ='浏览模式';
            addClass(article,"article_content_readmodel");
            addClass(document.body,"html_body_readmodel");
            addClass(divView,"readBtn_float");
            if(reproduceBtn){addClass(reproduceBtn,"ReproduceBtn_float");}
            if(cnblog){
                article.style.width="calc(100% - 60px)";
                article.style.height="calc(100% - 60px)";
                divView.style.marginTop="5px";
                reproduceBtn.style.marginTop="5px";
            }


        }
        else
        {
            divView.innerHTML ='阅读模式';
            removeClass(article,"article_content_readmodel");
            removeClass(document.body,"html_body_readmodel");
            removeClass(divView,"readBtn_float");
            if(reproduceBtn){removeClass(reproduceBtn,"ReproduceBtn_float");}
            if(cnblog){
                divView.style.marginTop="-40px";
                divView.style.position="relative";
                reproduceBtn.style.marginTop="-40px";
                reproduceBtn.style.position="relative";
                article.style.width="";
                article.style.height="";
            }
        }
    }




    //检测样式
    function hasClass(ele, cls) {
        return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
    }
    //添加样式
    function addClass(ele, cls) {
        if (!hasClass(ele, cls)) ele.className += " " + cls;
    }
    //删除样式
    function removeClass(ele, cls) {
        if (hasClass(ele, cls)) {
            var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
            ele.className = ele.className.replace(reg, " ");
        }
    }
    if(location.href=="http://csdn.admans.net/"||location.href=="http://csdn.admans.cn/")
    {
        Array.prototype.forEach.call(document.body.querySelectorAll("div"), function(ele) {
            if (ele) {
                ele.parentNode.removeChild(ele);
            }
        });
    }

    /* 消息全部已读功能 */
    let subMenu=document.querySelector('.toolbar-subMenu')
    let redMsg=document.querySelector('#redMsgBtn')
    if(subMenu&&!redMsg){
        redMsg = document.createElement("a")
        redMsg.setAttribute("id", "redMsgBtn")
        redMsg.innerHTML ='全部已读'
        subMenu.appendChild(redMsg)
        var redFrame = document.createElement("iframe")
        redFrame.setAttribute("src", "https://i.csdn.net/#/msg/attention")
        redFrame.setAttribute("id", "redFrame")
        redFrame.setAttribute("style", "display:none;")
        subMenu.appendChild(redFrame)
        var redFrame1 = document.createElement("iframe")
        redFrame1.setAttribute("src", "https://i.csdn.net/#/msg/like")
        redFrame1.setAttribute("id", "redFrame1")
        redFrame1.setAttribute("style", "display:none;")
        subMenu.appendChild(redFrame1)
    }
    if(redMsg){
        redMsg.onclick=()=>{
            // redFrame.setAttribute("src", "https://i.csdn.net/#/msg/attention")
            redFrame.contentWindow.location.reload(true)
            // redFrame1.setAttribute("src", "https://i.csdn.net/#/msg/like")
            redFrame1.contentWindow.location.reload(true)
            // alert('操作完成')
            window.location.reload()
        }
    }
})();
