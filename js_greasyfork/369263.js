// ==UserScript==
// @name         速卖通卖家后台直接打开产品详情页
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在速卖通后台，点击产品图片，可以直接打开宝贝详情页。
// @author       kinrt
// @match        *://posting.aliexpress.com/*
// @match        *://trade.aliexpress.com/*
// @match        *://offerbundle.aliexpress.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369263/%E9%80%9F%E5%8D%96%E9%80%9A%E5%8D%96%E5%AE%B6%E5%90%8E%E5%8F%B0%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E4%BA%A7%E5%93%81%E8%AF%A6%E6%83%85%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/369263/%E9%80%9F%E5%8D%96%E9%80%9A%E5%8D%96%E5%AE%B6%E5%90%8E%E5%8F%B0%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E4%BA%A7%E5%93%81%E8%AF%A6%E6%83%85%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    function GetRequest(url) {
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var strs = url.split("?")[1].split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var cssSelector = new Array(".ui-image-viewer-thumb-frame",".pic.s50",".item-desc-display a",".item-search-row-subject a")
    for(var cssI=0;cssI<cssSelector.length;cssI++){
        var elements = document.querySelectorAll(cssSelector[cssI]);
        for(var i=0;i<elements.length;i++){
            var oldUrl = elements[i].getAttribute("href");
            var oldUrlDict = GetRequest(oldUrl);
            console.log(oldUrlDict);
            var newUrl = "http://www.aliexpress.com/item//" + oldUrlDict["productId"] + ".html";
            elements[i].setAttribute("href",newUrl);
        }
    }
})();