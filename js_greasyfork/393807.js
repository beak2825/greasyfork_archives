// ==UserScript==
// @name         Make Note
// @namespace    ricroon
// @version      0.0.29
// @description  Make note for you!
// @author       ricroon
// @include      *//*.csdn.net/*
// @include      *//*.cnblogs.com/*
// @include      *//*.52pojie.cn/*
// @include      *//*.jb51.net/*
// @include      *//*.jianshu.com/*
// @include      *//mmda.booru.org/*page=forum&*
// @include      *//eveaz.com/*
// @include      *//*.runoob.com/*
// @include      *//segmentfault.com/*
// @include      *//*.wikipedia.org/*
// @include      *//bbs.pediy.com/thread-*.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393807/Make%20Note.user.js
// @updateURL https://update.greasyfork.org/scripts/393807/Make%20Note.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location !== window.top.location) {return;}
    let url=window.location.href
    const W52POJIE_REG=/52pojie\./;
    const CNBLOGS_REG=/cnblogs\./;
    const CSDN_REG=/csdn\./;
    const JB51_REG=/jb51\./;
    const MMDA_REG=/mmda\.booru\.org/;
    const JIANSHU_REG=/jianshu\./;
    const EVEAZ_REG=/eveaz\.com/;
    const RUNOOB_REG=/runoob\.com/;
    const SEGFAU_REG=/segmentfault\.com/;
    const WIKI_REG=/wikipedia\.org/;
    const PEDIY_REG=/bbs\.pediy\.com/;
    let btn=document.createElement("div");
    btn.onmouseover=function(){this.style.opacity="1";this.style.cursor="pointer";};
    btn.onmouseout=function(){this.style.opacity="0.7";this.style.cursor="default";};
    let content,appendStyleUrls,replace=true;
    function replaceBody(docu,content,apStyUrls){
        function addStyle(url){
            let styl=document.createElement("style");
            styl.type="text/css";
            let cssFileRequest=new XMLHttpRequest();
            cssFileRequest.open("get",url,"true");
            cssFileRequest.send();
            cssFileRequest.onreadystatechange = function(){
                if(cssFileRequest.readyState == 4){
                    if(cssFileRequest.status == 200){
                        styl.innerHTML=cssFileRequest.responseText.replace(/@charset[^\r\n]+?";/g,"").replace(/\/\*[^\r\n]+?\*\//g,"");
                        document.head.appendChild(styl);
                    }else{
                        console.log("get "+url+" failed!");
                    }
                }
            };
        }
        let styleUrls=[];
        styleUrls.push.apply(styleUrls,apStyUrls);
        let styls=document.getElementsByTagName("link");
        for(let i=styls.length-1;i>-1;--i){
            if(styls[i].type=="text/css"||styls[i].rel=="stylesheet"){
                styleUrls.push(styls[i].href);
                styls[i].outerHTML="";
            }
        }
        for(let i=0;i<styleUrls.length;++i){
            addStyle(styleUrls[i]);
        }
        let backgroundColor="";
        if(content.style){
            backgroundColor=content.style.backgroundColor;
        }
        let width=content.clientWidth;
        docu.body.style.backgroundImage="none";
        if(backgroundColor!=""){
            docu.body.style.backgroundColor=backgroundColor;
        }
        docu.body.style.width=width+50;
        docu.body.innerHTML=content.outerHTML;
    }
    function prePure(){
        if(JIANSHU_REG.test(url)){
            let imgContainers=document.querySelectorAll(".image-container");
            for(let i=0;i<imgContainers.length;++i){
                let imgContainer=imgContainers[i];
                let img=imgContainer.querySelector("img");
                let orgSrc="https:"+img.getAttribute("data-original-src");
                if(orgSrc!=""){
                    img.setAttribute("src",orgSrc);
                }
                let orgWidth=img.getAttribute("data-original-width");
                let orgHeight=img.getAttribute("data-original-height");
                let width=1700 >= orgWidth ? orgWidth : 1700;
                let height=width == 1700 ? orgHeight*width/orgWidth: orgHeight;
                imgContainer.setAttribute("style","max-width: "+width+"px; max-height: "+height+"px;");
            }
        }
    }
    prePure();
    btn.onclick=function(){
        if(W52POJIE_REG.test(url)){
            (function () {
                let postlist = document.getElementById("postlist");
                let posts = postlist.children;
                let title = posts[0];
                let ts = title.getElementsByTagName("td");
                let tdcs = ts[1].children;
                let date;
                for (let j = 0; j < tdcs.length; ++j) {
                    if (tdcs[j].tagName.toLowerCase().lastIndexOf("h1") > -1) {
                        date = tdcs[j];
                    }
                }
                ts[1].innerHTML = date.outerHTML;
                ts[0].outerHTML = "";
                let contents = posts[2].firstElementChild.firstElementChild.children;
                for (let i = 1; i < contents.length; ++i) {
                    contents[i].outerHTML = "";
                }
                let cs = contents[0].children; //first tr element's children
                let article = cs[1].getElementsByClassName("t_fsz")[0];
                let da = cs[1].getElementsByClassName("pti")[0];
                let dap = da.children[1];
                dap.innerHTML = dap.getElementsByClassName("poston")[0].parentNode.textContent;
                da.parentNode.innerHTML = da.outerHTML;
                cs[0].outerHTML = ""; //td avater at left
                article.parentNode.innerHTML = article.outerHTML;
                postlist.innerHTML = title.outerHTML + posts[2].outerHTML;
                let imgs=document.getElementsByTagName("img");
                for(let i=0;i<imgs.length;++i){
                    imgs[i].onmouseover="javascript:void(0);";
                }
                content=postlist;
            })();

        }else if(CNBLOGS_REG.test(url)){
            (function(){
                let mainContent=document.getElementById("mainContent");
                let centerContent=document.getElementById("centercontent");
                let postDetail=document.getElementById("post_detail");
                let leftContent=document.getElementById("left_content");
                if(mainContent){
                    content=mainContent;
                }else if(centerContent){
                    content=centerContent;
                }else if(postDetail){
                    content=postDetail;
                }else if(leftContent){
                    content=leftContent;
                }
                if(content){
                    let commentForm=document.getElementById("comment_form");
                    const COUNT=6;
                    if(commentForm){
                        let preEle=commentForm.previousElementSibling;
                        let curEle=commentForm;
                        for(let i=0;i<COUNT;++i){
                            curEle.outerHTML="";
                            curEle=preEle;
                            preEle=preEle.previousElementSibling;
                        }
                    }
                    let postInfo=document.getElementById("blog_post_info");
                    let postDate=document.getElementById("post-date");
                    let divDigg=document.getElementById("div_digg");
                    if(postDate) postDate.parentNode.innerHTML=postDate.outerHTML;
                    if(postInfo) postInfo.outerHTML="";
                    if(divDigg) divDigg.outerHTML="";
                    let imgs=content.getElementsByTagName("img");
                    for(let i=0;i<imgs.length;++i){
                        let imgStyle="";
                        if(imgs[i].getAttribute("style")) imgStyle=imgs[i].getAttribute("style");
                        imgs[i].setAttribute("style","max-width: "+document.defaultView.getComputedStyle(imgs[i], null).width+" !important;"+imgStyle);
                    }
                }else{
                    console.log(url+" : 没有找到关键元素！");
                }
            })();
        }else if(CSDN_REG.test(url)){
            (function () {
                let blogColumnPay=document.querySelectorAll(".blog-column-pay");
                if(blogColumnPay.length>0){
                    blogColumnPay[0].outerHTML="";
                }
                let clickMores=document.querySelectorAll(".btn-readmore");
                if(clickMores.length>0){
                    clickMores[0].click();
                }
                content = document.querySelector(".blog-content-box");
                let toolb = document.querySelector(".more-toolbox");
                let pm = document.querySelector(".person-messagebox");
                let bartop = document.querySelector(".article-bar-top");
                if(pm) pm.outerHTML="";
                if(toolb) toolb.outerHTML = "";
                if(bartop) bartop.innerHTML="<br><br>";
                let btns=document.querySelectorAll(".hljs-button signin");
                for(let i=btns.length-1;i>-1;--i){
                    btns[i].outerHTML="";
                }
            })();
        }else if(JB51_REG.test(url)){
            (function(){
                let wzlist=document.getElementsByClassName("wzlist")[0];
                let article=document.getElementById("article");
                if(wzlist){
                    content=wzlist;
                }else if(article){
                    let title=document.getElementsByClassName("title")[0].outerHTML;
                    let info=document.getElementsByClassName("info")[0].outerHTML;
                    let summary=document.getElementsByClassName("summary")[0].outerHTML;
                    let art_xg=document.getElementsByClassName("art_xg")[0];
                    let tails=[];
                    while(art_xg=art_xg.nextElementSibling){
                        tails.push(art_xg);
                    }
                    for(let i=tails.length-1;i>-1;--i){
                        tails[i].outerHTML="";
                    }
                    let ctnt=document.getElementById("content").outerHTML;
                    article.innerHTML=title+info+summary+ctnt;
                    content=article;
                }
            })();
        }else if(MMDA_REG.test(url)){
            function getPosts(ele){
                let forum=ele.getElementsByClassName("response-list")[0];
                let rms=forum.getElementsByClassName("paginator");
                for(let i=0;i<rms.length;++i){
                    rms[i].outerHTML="";
                }
                return forum;
            }
            const PAGE_COUNT=20;
            let pagesContent="",lastPage,urlPart,paginator=document.getElementById("paginator");
            let nextUrls=paginator.getElementsByTagName("a");
            for(let i=0;i<nextUrls.length;++i){
                let alt=nextUrls[i].getAttribute("alt");
                if(alt=="last page"){
                    lastPage=nextUrls[i].href.match(/pid=([\d]+)+?/)[1]*1;
                    urlPart=nextUrls[i].href.match(/(.*)pid=/)[1];
                }
            }
            if(lastPage){
                replace=false;
                let index=1;
                function getNextPage(){
                    let url=urlPart+"pid="+PAGE_COUNT*index;
                    let page=new XMLHttpRequest();
                    page.open("get",url,"true");
                    page.send();
                    page.onreadystatechange = function(){
                        if(page.readyState == 4){
                            if(page.status == 200){
                                let frame=document.createElement("frame");
                                frame.innerHTML=page.responseText;
                                pagesContent+=getPosts(frame).innerHTML;
                                ++index;
                                console.log("get "+url+" successfully!");
                                page=null;
                                if(PAGE_COUNT*index<=lastPage){
                                    getNextPage();
                                }else{
                                    console.log("get "+(index-1)+" pages!");
                                    content=getPosts(document);
                                    content.innerHTML+=pagesContent;
                                    replaceBody(document,content,appendStyleUrls);
                                }
                            }else{
                                console.log("get "+url+" failed!");
                            }
                        }
                    };
                }
                getNextPage();
            }else{
                content=getPosts(document);
                console.log("Only one page!");
            }
        }else if(JIANSHU_REG.test(url)){
            let ouvJEz=document.getElementsByClassName("ouvJEz");
            if(ouvJEz.length>0){
                let rEsl9f=document.getElementsByClassName("rEsl9f");
                if(rEsl9f.length>0){
                    rEsl9f[0].outerHTML="";
                }
                let c_1kCBjS=document.getElementsByClassName("_1kCBjS");
                if(c_1kCBjS.length>0){
                    c_1kCBjS[0].outerHTML="";
                }
                let c_13lIbp=document.getElementsByClassName("_13lIbp");
                if(c_13lIbp.length>0){
                    c_13lIbp[0].outerHTML="";
                }
                let d0hShY=document.getElementsByClassName("d0hShY");
                if(d0hShY.length>0){
                    d0hShY[0].outerHTML="";
                }
                content=ouvJEz[0];
            }
        }else if(EVEAZ_REG.test(url)){
            let entry__content=document.getElementsByClassName("entry__content");
            if(entry__content.length>0){
                let entry__info=document.getElementsByClassName("entry__info");
                if(entry__info.length>0){
                    entry__content[0].innerHTML=entry__info[0].innerHTML+entry__content[0].innerHTML;
                }
                content=entry__content[0];
            }
        }else if(RUNOOB_REG.test(url)){
            let article=document.getElementsByClassName("article");
            if(article.length>0){
                let comments=document.getElementById("comments");
                if(comments) comments.outerHTML="";
                let postcomments=document.getElementById("postcomments");
                if(postcomments) postcomments.outerHTML="";
                let respond=document.getElementById("respond");
                if(respond) respond.outerHTML="";
                let sidebar_box=article[0].getElementsByClassName("sidebar-box");
                if(sidebar_box.length>0) sidebar_box[0].outerHTML="";
                content=article[0];
            }
        }else if(SEGFAU_REG.test(url)){
            let rticle_title=document.getElementById("sf-article_title");
            rticle_title.style.backgroundColor=document.defaultView.getComputedStyle(rticle_title, null).backgroundColor;
            let article_tags=document.getElementById("sf-article_tags");
            article_tags.style.backgroundColor=document.defaultView.getComputedStyle(article_tags, null).backgroundColor;
            let article_content=document.getElementsByClassName("article fmt article-content");
            if(article_content.length>0){
                article_content[0].style.backgroundColor=document.defaultView.getComputedStyle(article_content[0], null).backgroundColor;
                let div=document.createElement("div");
                rticle_title.parentNode.appendChild(div);
                div.style.width=article_content.clientWidth;
                div.style.backgroundColor=document.defaultView.getComputedStyle(article_content[0], null).backgroundColor;
                div.innerHTML=rticle_title.outerHTML+article_tags.outerHTML+article_content[0].outerHTML;
                content=div;
            }
        }else if(WIKI_REG.test(url)){
            content=document.getElementById("content");
        }else if(PEDIY_REG.test(url)){
            content=document.querySelector(".card.message_card");
            let cb=document.querySelector("#collection_thumb");
            cb.parentNode.removeChild(cb);
        }

        if(!content){
            console.log("Content not found!");
            return;
        }
        //replace为true的时候默认执行body内容的替换，否则由前面的规则自行选择是否替换body的内容
        if(replace&&content){
            replaceBody(document,content,appendStyleUrls);
        }
        //destory itself
        this.outerHTML="";
    };
    btn.style='background-color:rgb(44,44,199);opacity:0.7;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;width:28px;height:28px;background-size:100% 100%;position:fixed;top:3em;right:3em;z-index: 2147483647 !important;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF3WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOS0xMi0xNlQyMDoxNzo1NyswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTktMTItMTZUMjI6MTc6NDYrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMTItMTZUMjI6MTc6NDYrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OGQ1Nzk3ZTgtNmNkMS01MjQ4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")';
    document.body.appendChild(btn);
})();