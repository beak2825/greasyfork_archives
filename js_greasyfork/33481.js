// ==UserScript==
// @name        GoogleRes
// @version     1.0
// @author      (σ｀д′)σ
// @description 在谷歌搜索结果页面添加底部搜索框，并修改搜索结果打开方式为新窗口打开
// @description:en Add another search input at the bottom of result page & change the redirect way from "current tab" to "new tab"
// @namespace   https://greasyfork.org/zh-CN/scripts/33481
// @license     GPL-3.0-or-later
// @include     *://www.google.com*/search*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.slim.min.js
// @grant       none
// @run-at      document-body
// @supportURL   https://github.com/Xli33/fun-script
// @homepageURL  https://github.com/Xli33/fun-script
// @downloadURL https://update.greasyfork.org/scripts/33481/GoogleRes.user.js
// @updateURL https://update.greasyfork.org/scripts/33481/GoogleRes.meta.js
// ==/UserScript==

$(function () {
  "use strict";

  var $as = $("#rso").children().children().find("a"),
    $fas = $("#fbar").find("a"),
    $tsf = $("#tsf"),
    $resul = $("sbtc").children(".gstl_0.sbdd_a"),
    $lst = $("#lst-ib"),
    $cloneForm = $tsf.clone(true);
  $as.each(function (i, e) {
    e.target = "_blank";
  });
  $fas.each(function (i, e) {
    e.target = "_blank";
  });
  $cloneForm
    .attr("id", "_cloneForm")
    .find("#gs_st0")
    .attr("id", "_cloneGs_st0")
    .next()
    .find("#lst-ib")
    .attr("id", "_cloneLst-ib")
    .on({
      click: function (e) {
        e.stopPropagation();
      },
      focus: function () {
        $tsf.css("position", "fixed");
      },
      input: function () {
        $lst.val(this.value); //.trigger('input');
      },
      blur: function () {
        $resul.hide();
      },
    });
  $cloneForm.css("marginBottom", "25px");
  $cloneForm
    .find("#_cloneGs_st0")
    .children("a")
    .on("click", function () {
      $("#gs_st0").children("a").click();
    });
  $("#rcnt")
    .on("click", function () {
      $tsf.css("position", "");
    })
    .append($cloneForm);
});