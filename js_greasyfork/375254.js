// ==UserScript==
// @name         CSDN Cleaner
// @namespace    n/a
// @version      0.0.20211004
// @description  CSDN左右组件屏蔽和整理，初级广告屏蔽和初级界面美化
// @author       iotang
// @match        http://blog.csdn.net/*/article/details/*
// @match        https://blog.csdn.net/*/article/details/*
// @grant        GM_xmlhttpRequest
// @connect      cn.bing.com
// @downloadURL https://update.greasyfork.org/scripts/375254/CSDN%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/375254/CSDN%20Cleaner.meta.js
// ==/UserScript==

(function()
 {
    'use strict';

    var i;

    location.assign("javascript:(function(){csdn.copyright.textData = ''})()");

    var article = document.getElementsByClassName("article_content");

    for(i=0;i<article.length;i++)
    {
        article[i].style.height='auto';
        article[i].style.overflow='visible';
    }

    var box = document.getElementsByClassName("hide-article-box")[0];
    if(box)box.parentNode.removeChild(box);

    var banner = document.getElementsByClassName("pulllog-box")[0];
    if(banner)banner.parentNode.removeChild(banner);

    var toolBox = document.getElementsByClassName("tool-box")[0];
    if(toolBox)toolBox.parentNode.removeChild(toolBox);

    var recommendRight = document.getElementsByClassName("recommend-right")[0];
    if(recommendRight)recommendRight.parentNode.removeChild(recommendRight);

    var recommendBox = document.getElementsByClassName("recommend-box")[0];
    if(recommendBox)recommendBox.parentNode.removeChild(recommendBox)

    var t0Clearfix = document.getElementsByClassName("t0 clearfix")[0];
    if(t0Clearfix)t0Clearfix.parentNode.removeChild(t0Clearfix);

    var aside = document.getElementsByTagName("aside")[0];
    if(aside)aside.parentNode.removeChild(aside);

    var csdnToolBar = document.getElementById("csdn-toolbar");
    if(csdnToolBar)csdnToolBar.parentNode.removeChild(csdnToolBar);

    var indexSuperise = document.getElementsByClassName("indexSuperise")[0];
    if(indexSuperise)indexSuperise.parentNode.removeChild(indexSuperise);

    var templateBox = document.getElementsByClassName("template-box")[0];
    if(templateBox)templateBox.parentNode.removeChild(templateBox);

    var reportContent = document.getElementById("reportContent");
    if(reportContent)reportContent.parentNode.removeChild(reportContent);

    var fourthColumn = document.getElementsByClassName("fourth_column")[0];
    if(fourthColumn)fourthColumn.parentNode.removeChild(fourthColumn);

    var loginMark = document.getElementsByClassName("login-mark")[0];
    if(loginMark)loginMark.parentNode.removeChild(loginMark);

    var mediavAd = document.getElementsByClassName("mediav_ad");
    for(i=0;i<mediavAd.length;i++){mediavAd[i].parentNode.removeChild(mediavAd[i]);}

    var passportBox = document.getElementById("passportbox");
    if(passportBox)passportBox.parentNode.removeChild(passportBox);

    for(i=0;i<=100;i++)
    {
        var dmpAd = document.getElementById("dmp_ad_"+i);
        if(dmpAd)dmpAd.parentNode.removeChild(dmpAd);
    }
    var meauGotopBox = document.getElementsByClassName("meau-gotop-box")[0];
    if(meauGotopBox)meauGotopBox.parentNode.removeChild(meauGotopBox);

    var main = document.getElementsByTagName("main")[0];
    if(main)
    {
        main.style.width="90%";
        main.style.float="none";
        main.style.margin="auto";
        main.style.marginBottom="35px";
    }

    var mainBox = document.getElementById("mainBox");
    if(mainBox){mainBox.style.width="100%";}

    document.body.style.minWidth="0px";
    ///Bing Daily Picture
    GM_xmlhttpRequest({
        method: 'GET',
        url: "http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&pid=hp&video=1&n=1",
        onload: function(result)
        {
            var jsonData = null;
            try
            {
                jsonData = JSON.parse(result.responseText);
                var imgurl = jsonData.images[0].url;
                var bimg = "https://cn.bing.com"+imgurl;
                document.body.style.background = "url(\""+bimg+"\")";
                document.body.style.backgroundRepeat="no-repeat";
                document.body.style.backgroundSize="cover";
                document.body.style.backgroundAttachment="fixed";
                document.body.style.backgroundPosition="center center";
            }
            catch (e){console.log(e);}
        }
    });
    ///

    var blogContentBox = document.getElementsByClassName("blog-content-box")[0];
    if(blogContentBox)blogContentBox.style.backgroundColor="rgba(255,255,255,0.85)";

    var leftToolbox = document.getElementsByClassName("left-toolbox")[0];
    if(leftToolbox)leftToolbox.style.opacity="0.7";

    var recommendItemBox = document.getElementsByClassName("recommend-item-box");
    for(let a of recommendItemBox)
    {
        a.style.backgroundColor="rgba(255,255,255,0.85)";
    }

    var baiduSearch = document.getElementsByClassName("baiduSearch");
    for(let a of baiduSearch)
    {
        a.style.backgroundColor="rgba(255,255,255,0.85)";
    }

    var recommendEndBox = document.getElementsByClassName("recommend-end-box")[0];
    if(recommendEndBox)recommendEndBox.style.backgroundColor="rgba(255,255,255,0.85)";

    var articleInfoBox = document.getElementsByClassName("article-info-box")[0];
    if(articleInfoBox)articleInfoBox.style.backgroundColor="rgba(255,255,255,0)";

    var articleHeaderBox = document.getElementsByClassName("article-header-box")[0];
    if(articleHeaderBox)articleHeaderBox.style.backgroundColor="rgba(255,255,255,0)";

    var blogFooterBottom = document.getElementsByClassName("blog-footer-bottom")[0];
    if(blogFooterBottom)blogFooterBottom.style.backgroundColor="rgba(255,255,255,0.85)";

    var copyrightBox = document.getElementById("copyright-box");
    if(copyrightBox)copyrightBox.style.backgroundColor="rgba(255,255,255,0)";

    var csdnCopyrightFooter = document.getElementById("csdn-copyright-footer");
    if(csdnCopyrightFooter)csdnCopyrightFooter.style.backgroundColor="rgba(255,255,255,0)";

    var blockquote = document.getElementsByTagName("blockquote");
    for(i=0;i<blockquote.length;i++)
    {
        blockquote[i].style.background="#eef0f400";
        blockquote[i].style.borderLeft="8px solid #dddfe47f";
    }

    var prettyprint = document.getElementsByClassName("prettyprint");
    for(i=0;i<prettyprint.length;i++)
    {prettyprint[i].style.backgroundColor="rgba(255,255,255,0)";}
    prettyprint = document.getElementsByClassName("prettyprinted");
    for(i=0;i<prettyprint.length;i++)
    {prettyprint[i].style.backgroundColor="rgba(255,255,255,0.5)";}

    var hljs = document.getElementsByClassName("hljs");
    for(i=0;i<hljs.length;i++){hljs[i].style.opacity="0.7";}
    hljs = document.getElementsByClassName("has-numbering");
    for(i=0;i<hljs.length;i++){hljs[i].style.opacity="0.7";}
    hljs = document.getElementsByClassName("dp-cpp");
    for(i=0;i<hljs.length;i++){hljs[i].style.opacity="0.7";}
    hljs = document.getElementsByClassName("hljs.copyCode(event) prism");
    for(i=0;i<hljs.length;i++){hljs[i].style.opacity="1";}

    var preNumnbering = document.getElementsByClassName("pre-numbering");
    for(i=0;i<preNumnbering.length;i++)
    {preNumnbering[i].style.backgroundColor="rgba(255,255,255,0)";}

    var commentBox = document.getElementsByClassName("comment-box");
    for(i=0;i<commentBox.length;i++)
    {commentBox[i].style.backgroundColor="rgba(255,255,255,0.85)";}

    var commentContent = document.getElementsByClassName("comment-content");
    for(i=0;i<commentContent.length;i++)
    {commentContent[i].style.backgroundColor="rgba(255,255,255,0)";}

    var blogStarEnter = document.getElementsByClassName("blog_star_enter");
    if(blogStarEnter)blogStarEnter.style="display:none;";

})();