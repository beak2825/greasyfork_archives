// ==UserScript==
// @name            哔哩哔哩（B站）番剧短评区筛选非满分评价
// @description     快速地找出那些低分评价！
// @author          Tinhone
// @namespace       screen and report
// @license         GPL-3.0
// @version         1.2.2
// @icon            https://app.bilibili.com/favicon.ico
// @grant           GM_addStyle
// @run-at          document-start
// @match           *://www.bilibili.com/bangumi/media/*
// @compatible      firefox V70+
// @compatible      edge V70+
// @compatible      chrome V70+
// @downloadURL https://update.greasyfork.org/scripts/446552/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E7%95%AA%E5%89%A7%E7%9F%AD%E8%AF%84%E5%8C%BA%E7%AD%9B%E9%80%89%E9%9D%9E%E6%BB%A1%E5%88%86%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/446552/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88B%E7%AB%99%EF%BC%89%E7%95%AA%E5%89%A7%E7%9F%AD%E8%AF%84%E5%8C%BA%E7%AD%9B%E9%80%89%E9%9D%9E%E6%BB%A1%E5%88%86%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict'
    GM_addStyle(`
        div#app.media-detail-wrp > div.media-tab-wrp > div.media-tab-content > div.media-tab-detail-wrp > div.nav-tools > button{
            position: static !important;
            box-sizing: content-box !important;
            width: 45px !important;
            height: 45px !important;
            cursor: pointer;
            background: #f7f9fa;
            color: #999;
            border: 1px solid #e5e9ef;
            border-radius: 3px;
            font-weight: 900;
            -webkit-transition: all .3s;
            -o-transition: all .3s;
            transition: all .3s;
        }
        div#app.media-detail-wrp > div.media-tab-wrp > div.media-tab-content > div.media-tab-detail-wrp > div.nav-tools > button:hover{
            background: #00a1d6;
            color: #fff;
            border: 1px solid #00a1d6;
            -webkit-transition: all .3s;
            -o-transition: all .3s;
            transition: all .3s;
        }
        div#app.media-detail-wrp > div.media-tab-wrp > div.media-tab-content > div.media-tab-detail-wrp > div.nav-tools{
            display: inherit !important;
            opacity: inherit !important;
        }
    `)
    function go(){
        if (window.location.hash!="#short") return
        let button1=document.createElement("button")
        button1.innerHTML="筛选"
        const a=setInterval(()=>{
            if (document.querySelector("div#app.media-detail-wrp > div.media-tab-wrp > div.media-tab-content > div.media-tab-detail-wrp > div.media-tab-detail-l-wrp > div.media-tab-detail-l > div.media-tab-module-wrp > div.media-tab-module-content > div.mtlr-list-wrp > div.review-list-wrp.type-short > ul > li.clearfix > div.review-author-info > div.review-author-star > span.review-stars > i.icon-star.icon-star-light")){
                if (!document.querySelector("div#app.media-detail-wrp > div.media-tab-wrp > div.media-tab-content > div.media-tab-detail-wrp > div.nav-tools > button")){
                    button1.addEventListener("click",(()=>{ //点击事件
                        for (let i of document.querySelectorAll("div#app.media-detail-wrp > div.media-tab-wrp > div.media-tab-content > div.media-tab-detail-wrp > div.media-tab-detail-l-wrp > div.media-tab-detail-l > div.media-tab-module-wrp > div.media-tab-module-content > div.mtlr-list-wrp > div.review-list-wrp.type-short > ul > li.clearfix")){
                            if (i.querySelectorAll("div.review-author-info > div.review-author-star > span.review-stars > i.icon-star.icon-star-light")[4]){
                                i.remove()
                            }
                        }
                        document.querySelector("html").scrollTop=document.querySelector("html").scrollTop-1
                        document.querySelector("html").scrollTop=document.querySelector("html").scrollTop+1
                    }))
                    document.querySelector("div#app.media-detail-wrp > div.media-tab-wrp > div.media-tab-content > div.media-tab-detail-wrp > div.nav-tools").appendChild(button1)
                    clearInterval(a)
                }
            }
        },200)
    }
    go()
    window.onhashchange=function(){
        go()
    }
})()