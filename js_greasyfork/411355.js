// ==UserScript==
// @name         javaweb download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        *://*.javaweb.shop/article/*
// @description 去广告
// @downloadURL https://update.greasyfork.org/scripts/411355/javaweb%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/411355/javaweb%20download.meta.js
// ==/UserScript==

(function() {
    var p = /article\/(?<id>.*?).html/
    var requestUrl = window.location.href
    var groups = p.exec(requestUrl).groups
    if(groups.id){
        var downloadCacheStr = localStorage.getItem("_ARTICLE_DOWNLOAD_INFO_CACHE_")
        console.debug("origin [_ARTICLE_DOWNLOAD_INFO_CACHE_= "+downloadCacheStr+" ]")
        var newCahce = "{\""+groups.id+"\":true}"
        localStorage.setItem("_ARTICLE_DOWNLOAD_INFO_CACHE_",newCahce)
        console.info("success replace _ARTICLE_DOWNLOAD_INFO_CACHE_"+newCahce)
    }else{
        console.warn("error get article id from ["+requestUrl+"]")
    }
})();