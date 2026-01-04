// ==UserScript==
// @name        Annoying Ad blocker 18+
// @description Prevents annoying ads from displaying 18+
// @version     2017.09.43
// @include     *://*.thepiratebay.org/*
// @include     *://*.pornhub.com/*
// @include     *://*.camwhores.tv/*
// @include     *://*.chaturbate.com/*
// @include     *://chaturbate.com/*
// @include     *://*.vporn.com/*
// @include     *://*.cam4.com/*
// @include     *://*.bongacams.com/*
// @namespace   https://openuserjs.org/users/nonedude
// @require     http://code.jquery.com/jquery-1.11.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/412712/Annoying%20Ad%20blocker%2018%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/412712/Annoying%20Ad%20blocker%2018%2B.meta.js
// ==/UserScript==

var counter = 0;

String.prototype.contains = function (it) {
  return this.indexOf(it) != -1;
};

var ssss = location.href;

function pornhub() {
  $("iframe").each(function () {
    $(this).remove();
  });

  $(".streamatesModelsContainer").remove();
  $(".js_adblockPremium").remove();
  $(".premiumPromoBanner").remove();
  $(".js-abContainterMain").remove();
}

function camwhores() {
  delete window.TotemToolsObject;

  loadTool = function () {};
  e = function () {};
  t = function () {};
  o = function () {};
  t = function () {};
  $("iframe").remove();
  $(".topad").remove();
  $(".row-models").remove();
  $(".list-live-models").remove();
  $("#videos-ad").remove();

  d9g = "";
  p9b0g = "";
  r3H4 = "";
  _0x9f02 = [];
  f = function () {};
  i = function () {};
  a = function () {};
  u = function () {};
  v = function () {};
  n = function () {};
  h = function () {};
  l = function () {};
  d = function () {};
  H = function () {};
  k = function () {};
  g = function () {};

  $(".fp-ui div:first-child").remove();
  $("div.adv").remove();
  $("canvas").each(function () {
    $(this).remove();
  });
  $("script").each(function () {
    $(this).html("vvvvvvv");
    $(this).attr("src", "localhost");
  });
  //$("input[namee='q']").prop('disabled', true);

}

function chaturbate() {
  $(".adsbyxa").remove();
  $(".ad").remove();
  $(".banner").remove();
  $(".content, #tabs_content_container, .chat-holder, .bio-container").css("background-color", "gray");
  $('.bio-container').css("max-height", "500px").css("overflow-y", "scroll");
}

function vporn() {
  $("#red-adv").remove();
  $("#video-fivesec-banner").remove();
  $("#video-advert").remove();
  $(".adholder").remove();

  $("iframe").each(function () {
    $(this).remove();
  });
}

function spankbang() {
  $(".ttaa").remove();
  $(".user_panel_guest").remove();
}

function cam4() {
    $(".acceptCookieConsent").click();
    $("input[id$='cookieConsent_consentCookieBtn']")
    $("#PrimaryDialogContainer").delete();
    $("#videoBannerMidrollAdWrapper").delete();
    $("#boost").delete();

}


function bongacams() {
    console.log("Running bongacams");
    $(".__give_away").click();
    //$("input[id$='cookieConsent_consentCookieBtn']")
    //$("#PrimaryDialogContainer").delete();
    //$("#videoBannerMidrollAdWrapper").delete();
    $(".boost").delete();

}


if (ssss.contains("pornhub") || ssss.contains("redtube") || ssss.contains("youporn")) {
  pornhub();
  window.setInterval(function () {
    if (counter < 10)
      pornhub();
    counter++;
  }, 500);

}
if (ssss.contains("camwhores")) {
  camwhores();
  window.setInterval(function () {
    if (counter < 10)
      camwhores();
    counter++;
  }, 500);
}

if (ssss.contains("spankbang")) {
  spankbang();
  window.setInterval(function () {
    if (counter < 10)
      spankbang();
    counter++;
  }, 500);
}

if (ssss.contains("chaturbate")) {
  chaturbate();
  window.setInterval(function () {
    if (counter < 10)
      chaturbate();
    counter++;
  }, 500);
}

if (ssss.contains("vporn")) {
  vporn();
  window.setInterval(function () {
    if (counter < 10)
      vporn();
    counter++;
  }, 500);
}

if (ssss.contains("cam4")) {
  cam4();
  window.setInterval(function () {
    //if (counter < 10)
      cam4();
    //counter++;
  }, 1500);
}


if (ssss.contains("bongacams")) {
  bongacams();
  window.setInterval(function () {
    //if (counter < 10)
      bongacams();
    //counter++;
  }, 1500);
}
