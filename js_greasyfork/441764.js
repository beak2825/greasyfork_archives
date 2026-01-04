// ==UserScript==
// @name         学习通pdf下载工具
// @namespace    http://www.mahua-a.top/
// @version      0.1
// @description  自动下载学习通pdf
// @author       Michael Xiao
// @match        https://mooc1.chaoxing.com/coursedata/toPreview*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441764/%E5%AD%A6%E4%B9%A0%E9%80%9Apdf%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/441764/%E5%AD%A6%E4%B9%A0%E9%80%9Apdf%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("ChaoXing downloader.")
    var base_url = "https://mooc1.chaoxing.com/ananas/status/"

    // 鑾峰彇 objectid

    var objectid = $('iframe').attr("objectid")
    $.get(base_url + objectid,function (data){
        var dataObj = data

        downloadFile(dataObj.pdf,dataObj.filename)

    })

     function downloadFile(url,name)
    {
        var a = document.createElement('a');

        var filename = name;
        a.href = url;
        a.download = filename;
        a.click();
    }

    // Your code here...
})();