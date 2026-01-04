// ==UserScript==
// @name         osu-website-rework
// @namespace    http://kai-huang.com/
// @version      1.2
// @description  no offense but this web rework looks awful
// @author       ThunderBird2678
// @match        https://osu.ppy.sh/*
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     customCSS   https://raw.githubusercontent.com/k74huang/osu-website-rework/main/additionalstyles.css
// @downloadURL https://update.greasyfork.org/scripts/440807/osu-website-rework.user.js
// @updateURL https://update.greasyfork.org/scripts/440807/osu-website-rework.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

$.fn.exists = function () {
  return this.length !== 0;
};

$(window).on("load", function () {
  var cssTxt  = GM_getResourceText("customCSS");
  GM_addStyle (cssTxt);
  // move where the global / country ranks are
  $(".profile-detail__chart-numbers")
    .has('div:contains("Global Ranking")')
    .detach()
    .appendTo("div .profile-info__details")
    .css("padding-right", "20px");

  console.log($(".profile-detail__chart-numbers").exists());

  // add more padding to badges display and add bottom border
  $(".profile-badges").css("padding", "10px 0 20px 0");
  $(".profile-badges").css("border-bottom", "2px solid hsl(var(--hsl-b6))");

  $(".profile-stats").css("margin-left", "30px").css("margin-top", "10px");
  $(".profile-detail__separator").detach();

  $(".profile-detail__stats").css("gap", "0px");
  $(".profile-detail").css("gap", "0px");
  $(".profile-detail").css("padding-bottom", "20px");
  $(".profile-detail").css("display", "flex");

  $(".profile-detail__chart-numbers")
    .has('div:contains("Medals")')
    .after($(".profile-detail__chart"))
    .css("padding-top", "20px")
    .css("padding-bottom", "20px");

  $(".profile-detail__values")
    .has('div:contains("Medals")')
    .css("transform", "scale(1.1, 1.1)")
    .css("padding-left", "15px");

  $('dt:contains("Replays Watched by Others")').text("Replays Watched");

  var wrapper = $(document.createElement("div"));
  $(".profile-badges").detach().appendTo(wrapper);
  $(".profile-detail__stats").detach().appendTo(wrapper);
  wrapper.css("display", "flex");
  wrapper.css("flex-direction", "column");
  wrapper.css("flex-grow", "1");
  wrapper.css("max-width", "74%");

  wrapper.appendTo(".profile-detail");
  $(".profile-stats")
    .detach()
    .appendTo(".profile-detail")
    .css("display", "flex")
    .css("flex-direction", "column")
    .css("gap", "0");
  $(".profile-stats__entry").css("display", "flex").css("margin-bottom", "5px");

  $("dt").css("flex-grow", "1");
  $("dd").css("margin-left", "revert").css("text-align", "end");
});
