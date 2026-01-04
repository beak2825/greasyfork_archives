// ==UserScript==
// @name        BWIKI免登录查看源码
// @namespace   peasoft.github.io
// @match       https://wiki.biligame.com/*
// @grant       none
// @version     1.0
// @author      陆鎏澄
// @description 此脚本允许您在未登录的情况下在BWIKI中免登录查看WikiText源代码。
// @icon        https://patchwiki.biligame.com/images/sssj/5/50/4hsasrwq5dvuakdzsi1ga8b9zcm5e9x.jpg
// @license     CC BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/459256/BWIKI%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E6%BA%90%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/459256/BWIKI%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E6%BA%90%E7%A0%81.meta.js
// ==/UserScript==
(function(){
    let link = document.getElementById('ca-viewsource').childNodes[0];
    link.onclick = "";
    let pageNameSplit = document.location.pathname.split('/');
    pageNameSplit.shift();
    let wikiName = pageNameSplit.shift();
    let pageName = undefined;
    if (pageNameSplit[0] == "index.php"){
        pageNameSplit = document.location.search.replace('?','').split('&');
        for (let i = 0; i < pageNameSplit.length; i++){
            if (pageNameSplit[i].startsWith("title=")){
                pageName = pageNameSplit[i].split('=')[1];
                break;
            }
        }
    }
    else {
        pageName = pageNameSplit.join('/');
    }
    if (!pageName){
        console.log("[BWIKI NoLogin] 页面名称解析失败！");
        return;
    }
    link.href = '/'+wikiName+"/index.php?title="+pageName+"&action=edit";
})();