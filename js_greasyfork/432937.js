// ==UserScript==
// @name         保种组统计
// @namespace    https://greasyfork.org/zh-CN/scripts/432937
// @version      0.5
// @description  count the size of the seeding HDSky torrents.
// @author       ccf2012
// @match        https://hdsky.me/userdetails.php?id=*
// @icon         https://hdsky.me/favicon.ico
// @grant        GM_addElement
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/432937/%E4%BF%9D%E7%A7%8D%E7%BB%84%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/432937/%E4%BF%9D%E7%A7%8D%E7%BB%84%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function getSeedList(seedHtml) {
  var seedList = seedHtml.querySelectorAll(
    "table > tbody > tr > td:nth-child(2) > a"
  );
  var seedListSize = seedHtml.querySelectorAll(
    "table > tbody > tr > td:nth-child(6)"
  );
  var summary = GM_addElement(
    document.querySelector(
      "table > tbody > tr > td > table > tbody > tr:nth-child(16) > td.rowfollow"
    ),
    // document.querySelector("#outer > table.main > tbody > tr > td > table > tbody > tr:nth-child(18) > td.rowhead.nowrap"),
    "span",
    {}
  );
  var countPTer = 0;
  var sizePTer = 0;
  var regex = /[+-]?\d+(\.\d+)?/g;

  for (var i = 0; i < seedList.length; i++) {
    var seedName = seedList[i].title;
    if (seedName.match(/[@-]\s?(HDS)/i)) {
      seedList[i].parentNode.style = "background-color: lightgreen;";
      // var pterTag = GM_addElement(seedList[i], "a", {
      //   class: "optiontag",
      //   style: "color: #fff;background-color: blue;",
      //   textContent: "官种",
      // });
      var seedSizeStr = seedListSize[i + 1].innerText;

      var num = seedSizeStr.match(regex).map(function (v) {
        return parseFloat(v);
      });
      var size = 0;
      if (seedSizeStr.indexOf("KB") > 0) {
        size = num * 1024;
      } else if (seedSizeStr.indexOf("MB") > 0) {
        size = num * 1024 * 1024;
      } else if (seedSizeStr.indexOf("GB") > 0) {
        size = num * 1024 * 1024 * 1024;
      } else if (seedSizeStr.indexOf("TB") > 0) {
        size = num * 1024 * 1024 * 1024 * 1024;
      } else {
        size = num;
      }
      countPTer++;
      sizePTer += size;
    }
  }

  summary.innerHTML =
    "<p>官种数量 " +
    countPTer +
    " 官种大小 " +
    formatBytes(sizePTer) +
    "<br></p>" +
    seedHtml.innerHTML;
}

(function () {
  "use strict";

  var sumOtBtn = GM_addElement(
    document.querySelector(
      "#outer > table > tbody > tr > td > table > tbody > tr:nth-child(16) > td.rowfollow"
    ),
    "button",
    {
      id: "sumary_ot",
    }
  );

  sumOtBtn.innerHTML = "官种统计";
  sumOtBtn.onclick = function () {
    var useridStr = window.location.href.match(
      /\/userdetails.php\?id=(\d+)/i
    )[1];
    var urlTorrentList =
      "https://hdsky.me/getusertorrentlistajax.php?userid=" +
      useridStr +
      "&type=seeding";

    GM.xmlHttpRequest({
      method: "GET",
      url: urlTorrentList,
      onload: function (response) {
        var responseHTML = document.createElement("html");
        responseHTML.innerHTML = response.response;
        getSeedList(responseHTML);
      },
    });
  };
})();
