// ==UserScript==
// @name              JavLib搜索番号
// @namespace         http://www.javlibrary.com    
// @version           0.0.15
// @icon              http://www.d21b.com/favicon.ico
// @description       支持点击识别码搜寻番号
// @author            boxerw
// @match             *://www.d21b.com/*
// @match             *://www.javlibrary.com/*
// @match             *://www.w24j.com/*
// @match             *://www.k25m.com/*
// @match             *://www.p26y.com/*
// @match             *://www.d28k.com/*
// @match             *://www.v27f.com/*
// @match             *://www.u29k.com/*
// @match             *://www.q30x.com/*
// @match             *://www.t33r.com/*
// @match             *://www.m34z.com/*
// @match             *://www.w35p.com/*
// @match             *://www.f37b.com/*
// @require           https://cdn.jsdelivr.net/npm/jquery-xpath@0.3.1/jquery.xpath.js
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/372353/JavLib%E6%90%9C%E7%B4%A2%E7%95%AA%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/372353/JavLib%E6%90%9C%E7%B4%A2%E7%95%AA%E5%8F%B7.meta.js
// ==/UserScript==
(function () {
    var videoIDNode = $(document.body).xpath("//*[@id='video_id']/table/tbody/tr/td[2]")[0]
    if (null == videoIDNode)
    {
        return
    }

    if (null == videoIDNode.innerHTML || "" == videoIDNode.innerHTML)
    {
        return
    }
        
    var videoIDText = videoIDNode.innerHTML.trim()
  
    videoIDNode.innerHTML = "<a href='https://aliciliba.org/list/" + videoIDText + "/1-0-0' target='_blank'>" + videoIDText + "</a>"
    
})();