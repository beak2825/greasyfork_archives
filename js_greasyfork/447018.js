// ==UserScript==
// @name         UB套图连读
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  UB套图连读!
// @author       You
// @match        https://www.6u1b.com/*.html
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.6u1b.com/wp-content/themes/Loostrive/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/447018/UB%E5%A5%97%E5%9B%BE%E8%BF%9E%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/447018/UB%E5%A5%97%E5%9B%BE%E8%BF%9E%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    function getData(strUrl) {
        $.ajax({
            type: "GET",
            url: strUrl,
            async: true,
            success: function(result) {
                var para = document.createElement("p");
                para.innerHTML = result;
                $("div#post_content").append(para.querySelector("div#post_content").children);
                var nextstr = para.querySelector("div.pagelist > span + a").href;
                if (nextstr != null ||
                    nextstr !== 'null' ||
                    nextstr !== '' ||
                    nextstr !== undefined ||
                    nextstr !== 'undefined' ||
                    nextstr !== 'unknown') {
                    getData(nextstr);
                }
                return;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("抓取失败：");
                console.log(XMLHttpRequest.status);
                console.log(XMLHttpRequest.readyState);
                console.log(textStatus);
            }
        });
    }

    //抓取下一页
    getData(document.querySelector("div.pagelist > span + a").href);

})();