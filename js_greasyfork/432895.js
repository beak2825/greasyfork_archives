// ==UserScript==
// @name         我在看Moodle
// @namespace    https://github.com/H3XDaemon
// @version      0.0001
// @description  一直提示不覺得煩嗎
// @author       H3XDaemon
// @match        https://md.just.edu.tw/mod/videos/view.php?id=*
// @downloadURL https://update.greasyfork.org/scripts/432895/%E6%88%91%E5%9C%A8%E7%9C%8BMoodle.user.js
// @updateURL https://update.greasyfork.org/scripts/432895/%E6%88%91%E5%9C%A8%E7%9C%8BMoodle.meta.js
// ==/UserScript==

var count = 0
var annoy = document.getElementsByClassName("vjs-afk-button afk-button ")

setInterval(function(){if($(annoy).is(':visible')){
    $("button:contains('是的, 請繼續')").click()
    count++
    console.log("已自動點了",count,"次")
}},100);