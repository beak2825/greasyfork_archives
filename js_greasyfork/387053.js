// ==UserScript==
// @name         邢帅采集VID
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  批量采集vid
// @author       逍遥一仙
// @match        https://www.xsteach.com/course/*/playing*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387053/%E9%82%A2%E5%B8%85%E9%87%87%E9%9B%86VID.user.js
// @updateURL https://update.greasyfork.org/scripts/387053/%E9%82%A2%E5%B8%85%E9%87%87%E9%9B%86VID.meta.js
// ==/UserScript==

window.funDownload = function(content, filename) {
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
};
window.getfile = function() {
    var output = "";
    $(".name").each(function(index, element) {
        var data = $(element).attr("learn-src");
        if (data.indexOf("?") !== -1) {
            var data_index = data.lastIndexOf("?");
            data = data.substring(data_index + 1, data.length);
        } else {
            var data_index = data.lastIndexOf("/");
            data = data.substring(data_index + 1, data.length);
            data_index = data.lastIndexOf(".");
            data = "vid=" + data.substring(0, data_index);
        }
        output = output + String(index + 1) + " " + $(element).attr("title") + ",xsteach://data?" + data + "\r\n";
    });
    funDownload(output, "data.txt");
}
$(".feedback").find("span").html("下载配置");
$(".feedback").find("a").removeAttr("href");
$(".feedback").find("a").attr("onclick", "getfile()");