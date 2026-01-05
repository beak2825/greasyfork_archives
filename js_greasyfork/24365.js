// ==UserScript==
// @name        八度点击标题下载种子
// @namespace   
// @author      qq8933-trotsky
// @description 八度点击标题下载种子脚本
// @include     http://172.18.72.18/badu/torrents.php*
// @include     http://172.18.72.18/badu/HD.php*
// @include     http://172.18.72.18/badu/index.php
// @include     http://172.18.72.18/badu/forums.php*
// @version     0.0.132
// @icon      http://172.18.72.18/badu/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/24365/%E5%85%AB%E5%BA%A6%E7%82%B9%E5%87%BB%E6%A0%87%E9%A2%98%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/24365/%E5%85%AB%E5%BA%A6%E7%82%B9%E5%87%BB%E6%A0%87%E9%A2%98%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function(){
    var strHTML=window.document.body.innerHTML;

    //用于匹配的正则表达式
    var strMatch={
        xz:/download\.php/g,
        bd:/details\.php/g,
        tm:/download\.ph1p/g,
        tb:/img class="download/g,
        pl:/img class="comments/g,
        dx:/下载本种/g,
        dc:/userdownload/g,
        de:/padding-bottom: 2px/g,
        pn:/欢迎来到八度空间校内PT站。/g
    };

    //用于替换的链接
    var strURL=[]; 
    strURL.xz="download.ph1p";
    strURL.bd="download.php";
    strURL.tm="details.php"; 
    strURL.tb="img class=\"comments";
    strURL.pl="img class=\"ments";
    strURL.dx="查看详情";
    strURL.de="padding-top: 20px; padding-bottom: 20px";
    strURL.pn="欢迎使用八度空间助手脚本。<\/br>您的版本是0.0.12 _有问题请私信_qq8933<\/br>欢迎来到八度空间校内PT站。";
    strURL.dc="userdetails";
    
    

  
     strHTML = strHTML.replace(strMatch.pn,strURL.pn);
    strHTML = strHTML.replace(strMatch.dx,strURL.dx);
    strHTML = strHTML.replace(strMatch.pl,strURL.pl);
    strHTML = strHTML.replace(strMatch.xz,strURL.xz);
    strHTML = strHTML.replace(strMatch.bd,strURL.bd);
    strHTML = strHTML.replace(strMatch.tm,strURL.tm);
     strHTML = strHTML.replace(strMatch.tb,strURL.tb);
     strHTML = strHTML.replace(strMatch.dc,strURL.dc);
    window.document.body.innerHTML=strHTML;
})();

