// ==UserScript==
// @name         魅族社区审核区UBB代码解析
// @namespace    https://greasyfork.org/zh-CN/users/188666-gehongyan
// @version      1.2.2
// @description  to parse the UBB code to HTML code
// @author       gehongyan
// @grant        none
// @include      https://bbs.meizu.cn/forum.php?mod=modcp&action=moderate*
// @downloadURL https://update.greasyfork.org/scripts/368782/%E9%AD%85%E6%97%8F%E7%A4%BE%E5%8C%BA%E5%AE%A1%E6%A0%B8%E5%8C%BAUBB%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/368782/%E9%AD%85%E6%97%8F%E7%A4%BE%E5%8C%BA%E5%AE%A1%E6%A0%B8%E5%8C%BAUBB%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var allDivs, thisDiv;
    allDivs = document.evaluate(
        "//div[@style=\"overflow: auto; overflow-x: hidden; height:112px; word-break: break-all;\"]",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
    for (var i = 0; i < allDivs.snapshotLength; i++) {
        thisDiv = allDivs.snapshotItem(i);
        var altText = thisDiv.innerHTML;
        console.log(altText);
        // [img]$1[/img]
        var altHTML = altText.replace(/\[img\]((https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])\[\/img\]/ig,"<br><img src=$1 style=\"max-width:60%; max-height:60%;\" ><br>");
        // [img=255,255]$1[/img]
        altHTML = altHTML.replace(/\[img=\d+,\d+\]((https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])\[\/img\]/ig, "<br><img src=$1 style=\"max-width:60%; max-height:60%;\" ><br>")
        // [color=#$1]
        altHTML = altHTML.replace(/\[color=#([0-9a-fA-F]{6})\]/ig, "<span style=\"color:#$1;\">");
        // [color=rgb(255,255,255)]
        altHTML = altHTML.replace(/\[color=rgb\((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),\s(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9]),\s(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\)\]/ig, "<span style=\"color:rgb($1, $2, $3);\">");
        // [/color]
        altHTML = altHTML.replace(/\[\/color\]/ig, "</span>");
        // [b]
        altHTML = altHTML.replace(/\[b\]/ig, "<strong>");
        // [/b]
        altHTML = altHTML.replace(/\[\/b\]/ig, "</strong>");
        // [i]
        altHTML = altHTML.replace(/\[i\]/ig, "<em>");
        // [/i]
        altHTML = altHTML.replace(/\[\/i\]/ig, "</em>");
        // [u]
        altHTML = altHTML.replace(/\[u\]/ig, "<span style=\"text-decoration: underline\">");
        // [/u]
        altHTML = altHTML.replace(/\[\/u\]/ig, "</span>");
        // [font=$1]
        altHTML = altHTML.replace(/\[font=([0-9a-zA-Z ,&;]+)\]/ig, "<font face=\"$1\">");
        // [/font]
        altHTML = altHTML.replace(/\[\/font\]/ig, "</font>");
        // [size=$1px]
        altHTML = altHTML.replace(/\[size=(\d+)px\]/ig, ""); //"<font size=\"$1\">");
        // [/size]
        altHTML = altHTML.replace(/\[\/size\]/ig, ""); //"</font>");
        // [align=(left|right|center)]
        altHTML = altHTML.replace(/\[align=(left|right|center)\]/ig, "<div style=\"text-align: left\">");
        // [/align]
        altHTML = altHTML.replace(/\[\/align\]/ig, "</div>");
        // [url=$1]$2[/url]
        altHTML = altHTML.replace(/\[url=(.*)](.*)\[\/url\]/ig, "<a href=\"$1\" target=\"_blank\">$2</a>");
        // [url]$1[/url]
        altHTML = altHTML.replace(/\[url](.*)\[\/url\]/ig, "<a href=\"$1\" target=\"_blank\">$1</a>");
        // 裸露链接
        // altHTML = altHTML.replace(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/ig, "<a href=\"$1\" target=\"_blank\">$1</a>");
        // [email=$1]$2[/url]
        altHTML = altHTML.replace(/\[email=(.*)](.*)\[\/email\]/ig, "<a href=\"mailto:$1\">$2</a>");

        //console.log(altHTML);
        var newImgTag = document.createElement("div");
        newImgTag.innerHTML = altHTML;
        thisDiv.parentNode.replaceChild(newImgTag, thisDiv);
        //console.log("========================================================");
    }
    // 修复图片附件链接异常
    var imgLinks = document.getElementsByTagName('img');
    for (i = 0; i < imgLinks.length; i++) {
        var imgLink = imgLinks[i];
        var altImgLink = imgLink.src.replace(/https:\/\/bbs.meizu.cn\/data\/attachment\/forum\/(.+)/ig, "https://bbsimage.res.meizu.com/forum/$1");
        imgLink.src = altImgLink;
    }

})();

function parseToDOM(str){
   var div = document.createElement("div");
   if(typeof str == "string"){
       div.innerHTML = str;
   }
   return div.childNodes;
}
