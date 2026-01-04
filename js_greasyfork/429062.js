// ==UserScript==
// @name         2048帖子高亮图片预览
// @description  帖子高亮，列表页面直接预览帖子内图片
// @version      0.0.6
// @author       bluebabes
// @namespace    hjd2048.com
// @match        https://*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_xmlhttpRequest
// @license 	 GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/429062/2048%E5%B8%96%E5%AD%90%E9%AB%98%E4%BA%AE%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/429062/2048%E5%B8%96%E5%AD%90%E9%AB%98%E4%BA%AE%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function () {
  "use strict";
  $("head").append($(`<style></style>`));

  var getCookies = function () {
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
    }
    return cookies;
  };

  var href = document.location.href;
  if (href.indexOf("/2048/") === -1) {
    return;
  }

  // 预览内容图片
  $(".tr3").each(function () {
    var that = $(this);
    var url =
      document.location.origin + "/2048/" + $(this).find("a").attr("href");

    var thattd = that.find("td:eq(1)");
    // thattd.append("<img object-fit='contain' style='width:200px;' src='" + "https://www.ressim.net/resimler/2021/12/20/18_10250321.jpg" + "' />")
    if (href.indexOf("search.php") >= 0) {
      thattd = that.find("th:eq(0)");
    }
    // console.log(url,url.indexOf("read.php") >= 0);
    if (url.indexOf("read.php") >= 0) {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
          "User-agent": window.navigator.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          cookie: document.cookie,
          referer: href,
        },
        onload: function (result) {
          var doc = result.responseText;
          console.log(doc);
          $(doc)
            .find(".att_img > img")
            .each(function (index) {
              if (index == 0) {
                thattd.append("<br />");
              }
              // console.log( index + ": " + $(this).attr('src'),thattd );
              var src = $(this).attr("src");
              src = src.replace("http://", "https://");

              thattd.append(
                "<img object-fit='contain' style='width:200px;' src='" +
                  src +
                  "' />"
              );
            });
        },
      });
    }
  });

  // 高亮回复数大于xx数的帖子
  var highlightCount = 5;
  var tr3s = document.querySelectorAll(".tr3");
  for (var i = 0; i < tr3s.length; i++) {
    var element = tr3s[i];
    var td = element.querySelectorAll("td");

    // 高亮
    if (td[3]) {
      if (td[3].textContent * 1 > highlightCount) {
        td[1].style.backgroundColor = "#baccd9";
        td[3].style.backgroundColor = "#baccd9";
      }
    }

    if (
      (td[1] && td[1].textContent.indexOf("澳门") > 0) ||
      (td[1] && td[1].textContent.indexOf("赌场") > 0) ||
      (td[1] && td[1].textContent.indexOf("浏览2048需要注意的点") > 0) ||
      (td[1] && td[1].textContent.indexOf("免费互约APP") > 0) ||
      (td[1] && td[1].textContent.indexOf("国产抖阴小视频") > 0) ||
      (td[1] && td[1].textContent.indexOf("区发贴教程详解") > 0) ||
      (td[1] && td[1].textContent.indexOf("自售区版规细则及发帖标准") > 0)
    ) {
      td[1].parentNode.remove();
    }
  }
})();
