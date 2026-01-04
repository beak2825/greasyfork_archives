// ==UserScript==
// @name         MAL bigger images
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.3.3
// @description  bigger thumbnails on MAL
// @author       Alistair1231
// @match        https://myanimelist.net/*
// @icon         https://icons.duckduckgo.com/ip2/myanimelist.net.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437619/MAL%20bigger%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/437619/MAL%20bigger%20images.meta.js
// ==/UserScript==

(function () {
  "use strict";

  setInterval(() => {
    jQuery(document).ready(
      jQuery("#content table .picSurround img").each(bigger)
    );
    jQuery(document).ready(
      jQuery("#content table .ranking-list img").each(bigger)
    );

    // make animelist/mangalist images bigger
    var checkExist = setInterval(function () {
      //first element in list
      if (location.href.split("/")[3] == "animelist") {
        if (
          $(
            "#list-container > div.list-block > div > table > tbody:nth-child(2) > tr.list-table-data > td.data.title.clearfix > a"
          ).length
        ) {
          jQuery(document).ready(
            jQuery(".list-table-data .data.image img").each(bigger)
          );
          clearInterval(checkExist);
        }
      }
      if (location.href.split("/")[3] == "mangalist") {
        if (
          $(
            "#list-container > div.list-block > div > table > tbody:nth-child(2) > tr.list-table-data > td.data.image > a"
          ).length
        ) {
          jQuery(document).ready(
            jQuery(".list-table-data .data.image img").each(bigger)
          );
          clearInterval(checkExist);
        }
      }
    }, 100); // check every 100ms
  }, 500);

  function bigger() {
    var el = $(this)[0];
    var imgTemp = el.src.match(/(\/images\/\w+\/\d+\/\d+)(?=t?\.\w{3,4})/);
    if (imgTemp != null) {
      var img = "https://cdn.myanimelist.net" + imgTemp[0] + ".jpg";
      // el.src = el.src.replace(/https:\/\/cdn\.myanimelist\.net\/r\/\d+x\d+(\/images\/anime\/\d+\/\d+).*$/g,"https://cdn.myanimelist.net/$1.jpg")
      if (img.match("/anime") != null || img.match("/manga") != null) {
        el.height = 252;
        el.width = 180;
        jQuery(el).attr("srcset", img);
        jQuery(el).css("object-fit", "contain");
        // jQuery(el).attr('src',img)
        // jQuery(el).attr('data-srcset',img)
        // jQuery(el).attr('data-src',img)
        if (
          location.href.split("/")[3] == "animelist" ||
          location.href.split("/")[3] == "mangalist"
        )
          biggerList();
      }
    }
  }

  function biggerList() {
    jQuery(".list-table .list-table-data .data.image .image").css(
      "height",
      "252"
    );
    jQuery(".list-table .list-table-data .data.image .image").css(
      "width",
      "180"
    );
  }
})();
