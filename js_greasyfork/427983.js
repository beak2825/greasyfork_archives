// ==UserScript==
// @name        this is chat
// @author      author
// @description description
// @namespace   http://tampermonkey.net/
// @license     GPL version 3
// @encoding    utf-8
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at      document-end
// @version     1.0.1
// @match        *e.dianping.com/app/merchant-platform/*
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/427983/this%20is%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/427983/this%20is%20chat.meta.js
// ==/UserScript==

(function() {
    $.get("https://e.dianping.com/merchant/portal/common/accountinfo", function(result){
        if(result.error != null){
            return alert("请登录")
        }
        $.get("https://e.dianping.com/merchant/portal/menutag/sharkparams",function(res){
            var cookie = document.cookie + "; " + "edper=" + res["data"]["edper"]
            GM_xmlhttpRequest({
                method: "GET",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                url: "https://e-api.huaji.com/v1/mei-tuan-plugin/dp-cookie-import?username="+result["data"]["accountName"]+"&cookie="+encodeURIComponent(cookie),
                onload: function(res) {
                    if (res.status == 200) {
                        var text = res.responseText;
                        alert("点评管家登录信息保存完成，请等待插件同步")
                    }
                },
                onerror: function(response){
                    alert("请求失败");
                }
            });
        })
    });
})();