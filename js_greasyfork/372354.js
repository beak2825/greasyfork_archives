// ==UserScript==
// @name              阿狸磁链自动复制
// @namespace         https://alicili.co/
// @version           0.0.10
// @icon              http://alicili.co/static/images/favicon.ico
// @description       支持自动复制磁链
// @author            boxerw
// @match             *://alicili.co/cili/*
// @match             *://alicili.me/cili/*
// @match             *://alicili.ws/cili/*
// @match             *://alicili.xyz/cili/*
// @match             *://alicilibt.com/cili/*
// @match             *://aliciliba.org/cili/*
// @match             *://aliciliba.net/cili/*
// @match             *://alicilibt.xyz/cili/*
// @require           https://code.jquery.com/jquery-3.3.1.min.js
// @require           https://cdn.jsdelivr.net/npm/jquery-xpath@0.3.1/jquery.xpath.js
// @grant             GM_setClipboard
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/372354/%E9%98%BF%E7%8B%B8%E7%A3%81%E9%93%BE%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/372354/%E9%98%BF%E7%8B%B8%E7%A3%81%E9%93%BE%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function () {
    var magnetNode = $(document.body).xpath("/html/body/div[1]/div[2]/div/div/p[8]/a")[0]
    if (null == magnetNode)
    {
        return        
    }

    if ("" == magnetNode.href)
    {
        return
    }
    
    var magnetURL = magnetNode.href.trim()       
    magnetNode.parentNode.innerHTML = magnetURL
    
    //GM_setClipboard(magnetNode.href, 'text')
})();