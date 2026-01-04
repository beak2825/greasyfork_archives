// ==UserScript==
// @name         某论坛附件下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键下载附件
// @author       Shifter
// @match        *://*/thread-*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/428549/%E6%9F%90%E8%AE%BA%E5%9D%9B%E9%99%84%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/428549/%E6%9F%90%E8%AE%BA%E5%9D%9B%E9%99%84%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    $(function() {
        let target_host = location.protocol+"//"+location.host+"/"
        let origin_link  = $("tbody > tr:nth-child(1) > td.plc > div.pct > div > div.t_fsz > div.pattl > ignore_js_op > dl > dd > p.attnm >a").attr("href")
        var new_link = target_host+"forum.php?mod=attachment&"+origin_link.split("?")[1]

        $("tbody > tr:nth-child(1) > td.plc > div.pct > div > div.t_fsz > div.pattl > ignore_js_op > dl").remove()
        $("tbody > tr:nth-child(1) > td.plc > div.pct > div > div.t_fsz > div.pattl > ignore_js_op").append("<a href="+new_link+" style= 'color:red;font-size:60px'>-----------下载-----------</a>")


    })
})();