// ==UserScript==
// @name         查看是否有今天內留言
// @description  在文章很長的時候可以快速知道哪幾樓有今天的留言
// @namespace    CheckShortComment - cat412
// @version      0.3
// @author       cat412
// @match        https://forum.gamer.com.tw/C*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/377599/%E6%9F%A5%E7%9C%8B%E6%98%AF%E5%90%A6%E6%9C%89%E4%BB%8A%E5%A4%A9%E5%85%A7%E7%95%99%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/377599/%E6%9F%A5%E7%9C%8B%E6%98%AF%E5%90%A6%E6%9C%89%E4%BB%8A%E5%A4%A9%E5%85%A7%E7%95%99%E8%A8%80.meta.js
// ==/UserScript==

(function() {
    //// 在小板後面多加一個 div
    $(".BH-rbox").after('<div id="shortCommendCheck" class="BH-rbox FM-rbox14"></div>');

    var floorNum = parseInt($(".floor").first().attr("data-floor")); // 取得本頁最一開始的樓層數
    var floorList = "";

    $(".c-post__footer").each(function(){
        var shortCommend = $(this).children("[id*=Commendlist]");
        var idString = shortCommend.attr("id");
        var editTime = shortCommend.children(":last-child").find(".edittime").text();
        var timeStartString = editTime.substring(0, 4);

        if (editTime.indexOf("分") > -1)
        {
            floorList += '<a href="#' + idString + '">' + floorNum + ' 樓</a> ( ' + editTime + '的留言) <br />';

        }
        else if (timeStartString.indexOf("昨天") > -1 ||
                 timeStartString.indexOf("前天") > -1 ||
                 timeStartString <= 2019)
        {
            // 懶得寫反向了先放著
        }
        else{
            floorList += '<a href="#' + idString + '">' + floorNum + ' 樓</a> <br />';
        }

        floorNum++;
    })

    if (floorList.length > 0)
    {
        $("#shortCommendCheck").html(floorList + "有今天內的留言喔");
    }
    else
    {
        $("#shortCommendCheck").html("今天沒有新留言");
    }
})();