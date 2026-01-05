// ==UserScript==
// @name        Jump to AliWangWang in 64bit Browser
// @name:zh-CN	64位浏览器跳转到阿里旺旺
// @namespace   http://www.mapaler.com/
// @description Fix AliWangWang link can't jump in 64bit browser
// @description:zh-CN	解决阿里旺旺无法连接在64位浏览器跳转的问题
// @include     *://*.taobao.com/*
// @include     *://*.tmall.com/*
// @include     *://*.jiyoujia.com/*
// @include     *://*.juhuasuan.com/*
// @include     *://*.1688.com/*
// @version     1.0.1
// @copyright	2017+, Mapaler <mapaler@163.com>
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/29531/64%E4%BD%8D%E6%B5%8F%E8%A7%88%E5%99%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E9%98%BF%E9%87%8C%E6%97%BA%E6%97%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/29531/64%E4%BD%8D%E6%B5%8F%E8%A7%88%E5%99%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E9%98%BF%E9%87%8C%E6%97%BA%E6%97%BA.meta.js
// ==/UserScript==

var findAliWangWangLink = function(e) {
    var t = null,otar = e.target;
    if (otar.tagName == "A")
    {
        t = otar;
    }else if(t = e.target.querySelector("a"))
    { //寻找是否有链接
        //什么都不做
    }else if(otar.classList.contains("tb-toolbar-item-icon"))
    { //侧边栏上的
        var nlnk = otar.parentElement.previousElementSibling; //父级的上一个兄弟
        if (nlnk.classList.contains("ww-light"))
        {
            var t = nlnk.querySelector("a");
        }
    }else if(otar.parentElement.tagName == "A")
    { //图片链接类
        var t = otar.parentElement;
    }

    if (t && t.href.indexOf("amos.alicdn.com") > 0) //判断链接是否是链接到阿里旺旺
    {
        //console.log("找到对象", t);
        convHttpToAliim(t,otar);
    }
};
//给文档添加寻找事件
document.addEventListener("click", findAliWangWangLink);
//把链接转换为阿里旺旺的链接
function convHttpToAliim(link,otar) {
    function idToAliim(a1) {
        return "aliim:sendmsg?touid=" + a1.site + a1.touid + "&site=" + a1.site + "&status=1";
    }
    GM_xmlhttpRequest({
        method: "get",
        url: link.href,
        onload: function(response) {
            var _link=link;
            var html = response.responseText;
            var siteReg = /window\.site\s*=\s*('|")(.+?)\1/ig;
            var touidReg = /window\.touid\s*=\s*('|")(.+?)\1/ig;
            var siteRegResult = siteReg.exec(html);
            var touidRegResult = touidReg.exec(html);
            var a = { site: siteRegResult[2], touid: touidRegResult[2] };
            _link.href = idToAliim(a);
            _link.onclick = function() {return false;}
            otar.onclick = function() {location = _link.href;}
            location = _link.href;
        },
        onerror: function(response) {
            console.error(response);
        }
    })

}