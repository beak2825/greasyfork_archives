// ==UserScript==
// @name         shouts recent
// @namespace    taringa.net/needrom
// @version      0.1.1
// @description  recargar shout sin actualizar nuevamente la pagina.
// @author       needrom
// @match        *://*.taringa.net/shouts/recent
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23806/shouts%20recent.user.js
// @updateURL https://update.greasyfork.org/scripts/23806/shouts%20recent.meta.js
// ==/UserScript==

$("#page > div:nth-child(4) > div > main > section > ul > li.active").remove();
$(".shouts-nav").append("<li class=active><a class=wewe title=Recargar>Recientes</a></li>");
$(document).on("click",".wewe", function () {
    $(".shouts-list").load("http://www.taringa.net/serv/more/recent .shout-item_simple");
    window.scrollTo(0,0);
});
    $("#page > div:nth-child(4) > div > main > div.header.header-sticky.active > div > ul > li:nth-child(3)").css("display","none");

$(document).on("scroll", function () {
    $("#page > div:nth-child(4) > div > main > div.header.header-sticky.active > div > ul > li:nth-child(3)").css("display","none");
});
