// ==UserScript==
// @name         CSDN,CNBLOG博客文章一键转载插件
// @version      7.0.0.Beta
// @description  CSDN博客文章转载插件 可以实现CSDN上的文章一键转载
// @author       By Jackie http://csdn.admans.cn/
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://mp.csdn.net/postedit*
// @match        *://mp.csdn.net/postedit?opt=1
// @match        *://mp.csdn.net/console/editor/html?opt=1
// @match        *://www.cnblogs.com/*/p/*.html
// @match        *://www.cnblogs.com/*/p/*
// @match        *://www.cnblogs.com/*/articles/*.html
// @match        *://www.cnblogs.com/*/archive/*/*/*/*.html
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://*.cnblogs.com/*/p/*.html
// @match        *://www.cnblogs.com/*/p/*.html
// @match        *://i.cnblogs.com/EditArticles.aspx?opt=1
// @match        *://i.cnblogs.com/EditPosts.aspx?opt=1
// @match        *://i-beta.cnblogs.com/posts/edit?opt=1
// @match        *://mp.csdn.net/mp_blog/creation/editor?opt=1
// @match        *://i.cnblogs.com/posts/edit?opt=1
// @match        *://editor.csdn.net/md/?not_checkout=1
// @match        *://mp.csdn.net/mp_blog/creation/editor?*
// @match        *://wenku.csdn.net/column/*
// @require      https://unpkg.com/turndown/dist/turndown.js
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/164689
// @supportURL   https://github.com/JackieZheng/CsdnCnblogReproduce/issues/
// @icon         https://www.google.cn/s2/favicons?domain=csdn.net
// @downloadURL https://update.greasyfork.org/scripts/381053/CSDN%2CCNBLOG%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0%E4%B8%80%E9%94%AE%E8%BD%AC%E8%BD%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/381053/CSDN%2CCNBLOG%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0%E4%B8%80%E9%94%AE%E8%BD%AC%E8%BD%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
GM_addStyle("#ReproduceBtn{position: absolute;float: right;right: 0px;width: auto;background: #0f962191;z-index: 9989;color: white;text-align: center;margin: 5px;padding: 5px;border-radius: 5px;cursor: pointer;line-height: 100%;}");

GM_addStyle(".tag__box{width: 100% !important;}");
GM_addStyle(".tag__box div.tag__options-list{width: 100% !important;max-height:300px !important;padding: 8px 8px 0 0;display: flex;flex-direction: row;align-content: flex-start;align-items: center;justify-content: space-between;flex-wrap: wrap;}");

GM_addStyle(".tag__box div .tag__options-list .tag__option-box:last-child {margin-right: auto;}");
GM_addStyle(".tag__box div .tag__options-list .tag__option-box:hover {color:#67c23a;}");
GM_addStyle(".tag__box div.tag__options-content{height: auto !important;}");

(function() {
    'use strict';
    var cnblog = location.href.indexOf("cnblogs.com") > -1 ? true: false;


    const messageListener = (event) => {
        if (event.origin.indexOf("csdn.net") > -1) {
            // console.log(event.data);
            let intput_editor = document.getElementsByTagName("iframe")[0] == undefined ? null: document.getElementsByTagName("iframe")[0].contentDocument.body;
            let input_title = (document.getElementById('post-title') ||document.getElementById('txtTitle') || document.getElementById('Editor_Edit_txbTitle') || document.querySelector('input.cnb-input'))||document.getElementsByClassName("article-bar__title")[0];

            if(intput_editor&&input_title){

                const article=event.data

                input_title.value = article.title;
                event.source.postMessage("Get", event.origin);

                intput_editor.innerHTML=article.content;
                if (intput_editor.children.ReadBtn) intput_editor.children.ReadBtn.remove();
                if (intput_editor.children.ReproduceBtn) intput_editor.children.ReproduceBtn.remove();
                let mathspace=intput_editor.querySelectorAll("[width*='thickmathspace']");
                mathspace.forEach(function(ele){
                    ele.outerHTML=" ";
                });
                let mathspan=intput_editor.querySelectorAll("[class*='MathJax']");
                mathspan.forEach(function(ele){
                    let innerText= ele.innerText;
                    ele.outerHTML="<span>"+innerText+"</span>";
                });

                let origin_input= document.querySelector("input[placeholder=请填写原文链接]");

                if (origin_input) origin_input.value = article.url;
                if(document.querySelector("[class^='el-checkbox__original'][value]"))document.querySelector("[class^='el-checkbox__original'][value]").click();
                if (document.querySelector("[class^='el-checkbox__input']"))document.querySelector("[class^='el-checkbox__input']").className= 'el-checkbox__input is-checked';
                if(document.querySelector("[class^='el-radio__original'][value='repost']"))document.querySelector("[class^='el-radio__original'][value='repost']").click();
                if(document.querySelector("[class^='el-radio__original'][value='0']"))document.querySelector("[class^='el-radio__original'][value='0']").click()
                if(document.querySelector("[class^='el-radio__original'][value='1']"))document.querySelectorAll("[class^='el-radio__original'][value='1']")[1].click()

                if(document.querySelectorAll("[class*='copyright-box']"))
                {
                    document.querySelectorAll("[class*='copyright-box']")[0].style.display="";
                    document.querySelectorAll("[class*='copyright-box']")[1].style.display="";
                }

                removeMsgListener();
            }


        }

    };

    const removeMsgListener=()=>{
        window.removeEventListener('message', messageListener);
    }

    window.addEventListener('message', messageListener);

    // 原始文章窗口
    if (location.href.indexOf("article/details") > -1 || location.href.indexOf("wenku.csdn.net") > -1 || location.href.indexOf("www.cnblogs.com") > -1) {
        var divBtn = document.createElement("div");
        divBtn.setAttribute("id", "ReproduceBtn");
        divBtn.innerHTML = '引用';
        if (cnblog) {
            divBtn.style.marginTop = "-40px";
            divBtn.style.position = "relative";
        }
        var article = document.getElementsByClassName('article_content')[0] || document.getElementsByClassName('postBody')[0] || document.getElementsByClassName('blogpost-body')[0]||document.getElementsByClassName('content-view')[0];
        article.insertBefore(divBtn, article.childNodes[0]);
        var posteditUrl = cnblog ? "https://i-beta.cnblogs.com/posts/edit?opt=1": "https://mp.csdn.net/mp_blog/creation/editor?opt=1";
        console.log(location.href)
        divBtn.onclick = function() {
            var writeWin=window.open(posteditUrl);
            var timer=setInterval(() => {
                //writeWin.postMessage(document.getElementsByTagName('html')[0].innerHTML, posteditUrl)

                var aTitle = "[转]" + document.title.split('_')[0] + "(转载请删除括号里的内容)";
                var aUrl=window.location.href.split('?')[0]+'  ';
                var authorName = "";
                if (document.getElementsByClassName('follow-nickName').length > 0) {
                    authorName = document.getElementsByClassName('follow-nickName')[0].innerText;
                } else if (document.getElementById('profile_block')) {
                    authorName = document.getElementById('profile_block').childNodes[1].innerText;
                } else if (document.getElementById('author_profile_detail')) {
                    authorName = document.getElementById('author_profile_detail').childNodes[1].innerText;
                }
                else if(document.getElementsByClassName('author-name'))
                {
                    authorName = document.getElementsByClassName('author-name')[0]?.innerText;
                }
                var blogContent = (document.getElementById('content_views') ||document.getElementById('cnblogs_post_body')|| document.getElementsByClassName('content-view')[0]).innerHTML + "<br>---------------------" + "<br>作者：" + authorName + "<br>来源：" + (cnblog == true ? "CNBLOGS": "CSDN") + "<br>原文：" + aUrl + "<br>版权声明：本文为作者原创文章，转载请附上博文链接！" + "<br>内容解析By：<a href=https://greasyfork.org/zh-CN/scripts/381053-csdn-cnblog%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0%E4%B8%80%E9%94%AE%E8%BD%AC%E8%BD%BD%E6%8F%92%E4%BB%B6 target=_blank>CSDN,CNBLOG博客文章一键转载插件</a>";
                var aContent = blogContent.replace(/<ul class=\"pre-numbering\"[^>]*>(.*?)<\/ul>/g, '').replace(/<div class=\"hljs-ln-line hljs-ln-n\"[^>]*>(.*?)<\/div>/g, '').replace(/<div class=\"hljs-ln-numbers\"[^>]*>(.*?)<\/div>/g, '').replace(/<div class=\"cnblogs_code_toolbar\"[\s\S].*?<\/div>/g, '').replace(/<a[\s\S].*class=\"toolbar_item[\s\S].*>?<\/a>/g, '').replace(/\n/g, '').replace(/<nobr aria-hidden=\"true\">(.*?)<\/nobr>/g, '').replace(/<script type=\"math\/tex\"[^>]*>(.*?)<\/script>/g, '');
                if (cnblog) {
                    aContent = "(转载请删除括号里的内容)" + aContent;
                } else {
                    /*处理csdn代码*/
                    var rePre = /<pre[^>]*>(.*?)<\/pre>/gi;
                    //aContent=aContent.replace(/\n/g,'');
                    var arrMactches = aContent.match(rePre);
                    if (arrMactches != null && arrMactches.length > 0) {

                        for (var i = 0; i < arrMactches.length; i++) {

                            var preText = '';
                            var codeTag = document.getElementsByTagName('pre')[i];
                            if(codeTag){
                                if(codeTag.querySelector("ul[class*='pre-numbering']")){
                                    codeTag.querySelector("ul[class*='pre-numbering']").remove();
                                }
                                var eles = codeTag.getElementsByTagName('li');
                                if (eles.length > 0) {
                                    for (var j = 0; j < eles.length; j++) {
                                        preText += eles[j].innerText+"\n";
                                    }
                                } else {
                                    preText += codeTag.innerText;
                                }
                            }
                            var preCodeHtml = "<pre><code class=\"hljs\">" + preText.replace(/</g, '&lt;').replace(/>/g, '&gt;') + "</code></pre>";

                            aContent = aContent.replace(arrMactches[i], preCodeHtml);
                        }
                    }
                    aContent="(转载请删除括号里的内容)" + aContent;
                }

                let article_title=aTitle;
                let article_content=aContent;
                let article_url=aUrl;

                let article = { title: article_title,content:article_content,url:article_url};
                writeWin.postMessage(article, posteditUrl)
            },500);
            window.addEventListener('message', (e) => {
                // console.log(e)
                if(e.data=='Get'){
                    console.log('Send over.')
                    clearInterval(timer);
                }
            });
        }
    }
})();
