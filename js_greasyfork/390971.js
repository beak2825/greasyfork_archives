// ==UserScript==
// @name         Bilibili ad-video finder
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  基于弹幕分析规避营销号
// @author       765126614
// @match        https://www.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/390971/Bilibili%20ad-video%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/390971/Bilibili%20ad-video%20finder.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    var url = window.location.href;
    var avid = RegExp(/(?<=av)\d*/).exec(url)[0];

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.bilibili.com/x/player/pagelist?aid="+avid,
        onload: function(response) {
            var msg = response.responseText;
            var oid = RegExp(/(?<="cid":).*(?=,"page")/).exec(msg)[0].trim();
            console.log("advideo:"+oid);

            GM_xmlhttpRequest({
                method: "GET",
                url: "http://comment.bilibili.com/"+oid+".xml",
                onload: function(response) {
                    if(response!=null){
                        var msg = (new XMLSerializer()).serializeToString(response.responseXML);
                        if(msg.indexOf('营销号') != -1){
                            alert("营销号！");
                        }
                        if(msg.indexOf('awsl') != -1){
                            alert("awsl！");
                        }
                    }
                }
            });
        }
    });
})();




