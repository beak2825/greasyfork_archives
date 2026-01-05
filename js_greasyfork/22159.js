// ==UserScript==
// @name         acfun2aixifan
// @namespace    http://zhihaofans.com
// @version      0.1.2
// @description  http://acfun.tv域名自动跳转到http://www.aixifan.com，网站出问题时可启动
// @author       zhihaofans
// @match        http://www.acfun.tv/*
// @match        http://www.aixifan.com/*
// @grant        none
// @note         本脚本已停止更新
// @note         Github开源地址:https://github.com/zhihaofans/Acfun/blob/master/acfun.tv/acfun2aixifan/acfun2aixifan.js
// @note         Greasyfork地址:https://greasyfork.org/zh-CN/scripts/22159
// @icon         http://cdn.aixifan.com/ico/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/22159/acfun2aixifan.user.js
// @updateURL https://update.greasyfork.org/scripts/22159/acfun2aixifan.meta.js
// ==/UserScript==
if(location.hostname=="www.acfun.tv")
{
    location.href="http://www.aixifan.com"+location.pathname;
}

window.onload=function()
{
    if(location.hostname=="www.aixifan.com")
    {
        var links=document.getElementsByTagName("a");
        var links_num=links.length;
        for(var aaaa=0;aaaa<links_num;aaaa++)
        {
            var link_temp=links[aaaa].href;
            var link_new=link_temp.replace("http://www.acfun.tv/","http://www.aixifan.com/");
            links[aaaa].href=link_new;
        }
    }

};
