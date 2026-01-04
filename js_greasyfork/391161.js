// ==UserScript==
// @name         图灵显示豆瓣链接，分数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       h3l
// @match        https://www.ituring.com.cn/book/*
// @connect      douban.com
// @grant        GM_xmlhttpRequest
// @run-at document-idle

// @downloadURL https://update.greasyfork.org/scripts/391161/%E5%9B%BE%E7%81%B5%E6%98%BE%E7%A4%BA%E8%B1%86%E7%93%A3%E9%93%BE%E6%8E%A5%EF%BC%8C%E5%88%86%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/391161/%E5%9B%BE%E7%81%B5%E6%98%BE%E7%A4%BA%E8%B1%86%E7%93%A3%E9%93%BE%E6%8E%A5%EF%BC%8C%E5%88%86%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var info = $(".publish-info")[0];
    var myre = /书\s*号(\d.*\d)/;
    var matches = myre.exec(info.innerText);
    var isbn = matches[1];
    var url = "https://book.douban.com/isbn/" + isbn

    GM_xmlhttpRequest({url:url, method: "GET", onload: function(response)
                       {
                           var dbRes= response;
                           var doubanHTML = dbRes.responseText
                           var doubanRE = /ll rating_num.*?>\s*(\d\.\d+)\s*<\/strong>/;
                           var dbMatches = doubanRE.exec(doubanHTML)
                           var scoreText
                           if(dbMatches === null && typeof dbMatches === "object"){
                               scoreText = "评分不足，暂时无法显示"
                           }else{
                               scoreText = "豆瓣评分: " + dbMatches[1]
                           }
                           console.log(url);
                           var title = $(".book-title")[0]
                           title.innerHTML = title.innerHTML + "<a href=" + url +" target=_blank>" + scoreText + "</a>"
                       }
                      })
})();