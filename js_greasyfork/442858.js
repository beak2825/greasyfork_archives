// ==UserScript==
// @name         sehuatang
// @description  直接把帖子列表转成图片浏览,点击图片可以进入帖子.
// @version      0.0.4
// @author       bluebabes
// @namespace    https://www.sehuatang.net/forum-103-1.html
// @include      https://www.sehuatang.net/forum-*
// @include      https://www.sehuatang.net/forum.php?mod=forumdisplay&fid=103&page=*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_xmlhttpRequest
// @license 	 GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/442858/sehuatang.user.js
// @updateURL https://update.greasyfork.org/scripts/442858/sehuatang.meta.js
// ==/UserScript==
$(document).ready(function () {
  $(".icn").each(function () {
    var urls = "https://www.sehuatang.net/";
    urls += $(this).find("a").attr("href");
    var imgg = $(this).find("img");
    var icn_td = $(this);
    console.log(urls);

    var href = document.location.href;

    GM_xmlhttpRequest({
      method: "GET",
      url: urls,
      headers: {
        "User-agent": window.navigator.userAgent,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        cookie: document.cookie,
        referer: href,
      },
      onerror: function (e) {
        console.log(e);
      },
      onload: function (result) {
        var doc = result.responseText;
        console.log(doc);
        var img01 = $(doc).find(".zoom").attr("file");
        $(imgg).attr("src", img01);
        var dvi01 = $(doc).find(".blockcode");
        var dvi02 = $(doc).find("#thread_subject");
        //console.log($(dvi02).html());
        var magnet = $(dvi01).find("li").text();
        //console.log(magnet);
        $(icn_td).css("width", "100%");
        $(icn_td).append(
          "<p style='margin-top: 20px;font-size: 2em;'>" +
            $(dvi02).html() +
            "</p><br/>"
        );
        $(icn_td).append(
          "<p style='margin-top: 20px;font-size: 2em;'>" + magnet + "</p><br/>"
        );
      },
    });
  });
  $(".common").each(function () {
    $(this).remove();
  });
  $(".by").each(function () {
    $(this).remove();
  });
  $(".num").each(function () {
    $(this).remove();
  });
});
