// ==UserScript==
// @name        CSDN优化
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.3
// @description  CSDN Green
// @match       https://*.csdn.net/*/article/details/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/405971/CSDN%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/405971/CSDN%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    //获取当前所有cookie
    var strCookies = document.cookie;    
    if(strCookies.indexOf("whiteTheme")==-1){
        document.cookie="showTip=false;domain=blog.csdn.net;path=/;";
        document.cookie="scr-sm=true;domain=blog.csdn.net;path=/;";
        document.cookie="scr-md=false;domain=blog.csdn.net;path=/;";
        document.cookie="scr-lg=false;domain=blog.csdn.net;path=/;";
        document.cookie="scr-fo=false;domain=blog.csdn.net;path=/;";
        document.cookie="recommend=false;domain=blog.csdn.net;path=/;";
        document.cookie="shop=false;domain=blog.csdn.net;path=/;";
        document.cookie="authorCard=false;domain=blog.csdn.net;path=/;";
        document.cookie="whiteTheme=false;domain=blog.csdn.net;path=/;";
        document.cookie="searchBlog=false;domain=blog.csdn.net;path=/;";
        document.cookie="newArticle=false;domain=blog.csdn.net;path=/;";
        document.cookie="hotArticle=false;domain=blog.csdn.net;path=/;";
        document.cookie="newComments=false;domain=blog.csdn.net;path=/;";
        document.cookie="kindPerson=false;domain=blog.csdn.net;path=/;";
        document.cookie="content=true;domain=blog.csdn.net;path=/;";
        document.cookie="recommendArticle=false;domain=blog.csdn.net;path=/;";
        document.cookie="archive=false;domain=blog.csdn.net;path=/;";
        document.cookie="autoSize=true;domain=blog.csdn.net;path=/;";
        document.cookie="autoHideToolbar=true;domain=blog.csdn.net;path=/;";
        document.cookie="autoHideBottomBar=true;domain=blog.csdn.net;path=/;";
        document.cookie="writeBlog=false;domain=blog.csdn.net;path=/;";
        document.cookie="ad=false;domain=blog.csdn.net;path=/;";
        location.reload();
    }
}) ();