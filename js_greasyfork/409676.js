// ==UserScript==
// @name         iTuringSubtitles
// @namespace    https://github.com/arrayJY/iTuringSubtitles
// @version      0.2.1
// @description  Add subtitles in ituring.com.cn.
// @author       arrayJY
// @match        https://www.ituring.com.cn/book/tupubarticle/*
// @grant        none
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/409676/iTuringSubtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/409676/iTuringSubtitles.meta.js
// ==/UserScript==

(function () {
  "use strict";
  $(document).ready(() => {
    const getIndex = (title) => title.split("　")[0];

    $("div.article-detail h2,h3").each(function () {
      $(this).attr("id", getIndex($.trim($(this).text())));
    });

    const subtitles = $("div.article-detail h2")
      .map(function () {
        const thirdSubtitles = $(this)
          .nextUntil("div.article-detail h2", "h3")
          .map(function () {
            return $.trim($(this).text());
          })
          .get();
        const subtitle = {
          secondSubtitles: $.trim($(this).text()),
          thirdSubtitles,
        };
        return subtitle;
      })
      .get();

    subtitles.shift();

    const makeList = (s, t) => {
      return $("<li></li>")
        .append(
          $("<a></a>")
            .text(s)
            .attr("href", `#${getIndex(s)}`)
            .css("font-size", "13px"),
          t ? $("<ul></ul").append(t.map((ts) => makeList(ts))).css("margin", "0px") : null
        )
        .css("padding", "2px 0px 2px 12px");
    };

    const title = $("span[style*='font-weight:bold']");
    const subtitleElements = subtitles.map((v) =>
      makeList(v.secondSubtitles, v.thirdSubtitles)
    );
    subtitleElements.forEach((v) => title.append(v));
  });
})();
