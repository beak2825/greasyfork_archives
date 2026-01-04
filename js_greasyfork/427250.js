// ==UserScript==
// @name 情趣楼连续看图
// @description 用于一整页显示所有分页的图片。
// @match *.uc12k.vip/*
// @version 0.0.1.20210531122523
// @namespace https://greasyfork.org/users/420865
// @downloadURL https://update.greasyfork.org/scripts/427250/%E6%83%85%E8%B6%A3%E6%A5%BC%E8%BF%9E%E7%BB%AD%E7%9C%8B%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/427250/%E6%83%85%E8%B6%A3%E6%A5%BC%E8%BF%9E%E7%BB%AD%E7%9C%8B%E5%9B%BE.meta.js
// ==/UserScript==
 
var i = 2;
function getData(strUrl) {
    $.ajax({
        type: "GET",
        url: strUrl,
        async: true,
        success: function(result) {
            var para = document.createElement("p");
            para.innerHTML = result;
            $("body > section > div > div > article").append(para.querySelectorAll("section > div > div > article > p"));

            if (para.querySelector("li.next-page")) {
                //存在
                //getData(window.location.href.replace(".html", '_') + i + ".html");
                getData(para.querySelector("li.next-page > a").href);
            }
            //console.log(i + ":" + para.querySelector("section > div > div > article").children.length);
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

getData(window.location.href.replace(".html", '_') + i + ".html");

/*
for (var i = 2; i < 14; i++) {
    getData(window.location.href.replace(".html", '_') + i + ".html");
}
*/
