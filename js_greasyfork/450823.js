// ==UserScript==
// @name         104優化
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  優化求職者104體驗
// @author       Bee10301
// @match        https://www.104.com.tw/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=104.com.tw
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/450823/104%E5%84%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/450823/104%E5%84%AA%E5%8C%96.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(() => {
  $(() => {
    //css fix
    $("<style>")
      .text(".job-list-body .sticky { position: inherit !important; }")
      .appendTo("head");
    $("<style>")
      .text("#main-content > aside { display:none;}")
      .appendTo("head");
    //$("<style>").text(".b-block--top-bord { display:none;}").appendTo("head");
    $("<style>")
      .text(".b-btn--primary { background-color:#565656;}")
      .appendTo("head");
    $("<style>")
      .text(
        "#job-jobList > div.b-popup.b-hide.notice.js-notice { display:none !important;}"
      )
      .appendTo("head");
    $("<style>")
      .text(
        "#job-jobList > main > div.tool-area.b-fixed-right > ul.side-tools.poc-tools { display:none;}"
      )
      .appendTo("head");
    $("<style>")
      .text(
        "#js-job-content > article > div.b-block__right.b-pos-relative { display:none;}"
      )
      .appendTo("head");
    $("<style>").text(".left { display:none;}").appendTo("head");
    $("<style>").text("#main-content > div { width:100%;}").appendTo("head");
    $("<style>")
      .text("#js-job-content > article > div.b-block__left { width:100%;}")
      .appendTo("head");
    $("<style>").text("#main-content { width:90%;}").appendTo("head");

    //add preview window
    $("body").append(
      '<div class="bee_preview_wd" style="height: 100%;z-index: 10000;position: fixed; top: 1rem; right: 1%;transition: all 0.5s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s;"></div>'
    );
    //insert preivew html
    $(".bee_preview_wd").html(
      '<iframe id="bee_frame" title="bee_frame" src="" style="transition: all 0.5s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s; border: 1em solid rgb(170, 50, 220, 0);" width="100%" height="99%"></iframe>'
    );
    $(".bee_preview_wd").css({
      width: "0%",
    });
    //set default top bar transition
    $("#bar_m104").css({
      transition: "all 0.5s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s",
      height: "40px",
    });
    //disable frame by click
    var bee_able_frame = false;

    //new
    $(document).on("click", "#js-job-content > article", function () {
      // your code
      bee_able_frame = true;
      $("#bee_frame").attr(
        "src",
        `https:${$(this)
          .children("div")
          .children("h2")
          .children("a")
          .attr("href")}`
      );
      //open
      if ($("#bee_frame").attr("src") != "" && bee_able_frame) {
        $(".bee_preview_wd").css({
          width: "80%",
        });
        $("#bee_frame").contents().find("#globalbar").css({
          display: "none",
        });
      }
      //bigger top bar
      $("#bar_m104").css({
        height: "100%",
        "background-color": "#2a2a2aed",
      });
      //close
      $("#bar_m104").click(() => {
        console.log("test");
        bee_able_frame = false;
        $(".bee_preview_wd").css({
          width: "0%",
        });
        $("#bar_m104").css({
          height: "40px",
          "background-color": "#2a2a2aed",
        });
      });
    });
    //onload frame , show
    $("#bee_frame").on("load", () => {
      /*
      $("#bee_frame")
        .contents()
        .find(
          "#app > div > div.job-header > div.position-fixed.job-header__fixed.w-100.bg-white.job-header__cont > div > div > div.job-header__title > div > a:nth-child(1)"
        )
        .css({
          display: "none",
          //"max-width": "1287px"
        });*/
      //
      /*
      $("#bee_frame")
        .contents()
        .find("#app > div > div.job-header > div:nth-child(1)")
        .css({
          display: "none",
          //"max-width": "1287px"
        });
      $("#bee_frame")
        .contents()
        .find(
          "#app > div > div.job-header > div.position-fixed.job-header__fixed.w-100.bg-white.job-header__cont"
        )
        .css({
          top: "0px",
          //"max-width": "1287px"
        });*/
    });
  });
})();
