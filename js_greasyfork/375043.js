// ==UserScript==
// @name         批量提取人人影视专链
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  打开人人影视分享页时复制页面内所有人人专链到粘贴板
// @author       Loyle
// @include      http://zmz*.com/*
// @include      http://got*.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/375043/%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%E4%B8%93%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/375043/%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%E4%B8%93%E9%93%BE.meta.js
// ==/UserScript==

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
var code = getQueryVariable("code")
var urlStr = "";
if (code) {
    GM_xmlhttpRequest({
        url: "/api/v1/static/resource/detail?code=" + code,
        method: "GET",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        onload: function (response) {
            var json = eval('(' + response.responseText + ')');
            var list = json.data.list;
            if(list){
				list.forEach(element => {
					var urls = element.items.APP;
                    if(urls){
						urls.forEach(ele => {
							urlStr += (ele.name + '\n')
						});
					}
				});
			}
            if (urlStr) {
                GM_setClipboard(urlStr, 'text')
                alert("已复制到粘贴板");
            }
        }
    });

}