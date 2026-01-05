// ==UserScript==
// @name         KokyakuGaHontouNiHitsuyoudattaMono
// @namespace    http://hitoriblog.com/
// @version      0.2
// @description  try to take over the world!
// @author       moyashi
// @include      https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26916/KokyakuGaHontouNiHitsuyoudattaMono.user.js
// @updateURL https://update.greasyfork.org/scripts/26916/KokyakuGaHontouNiHitsuyoudattaMono.meta.js
// ==/UserScript==
$(document).ready(function () {
    var currentUser = $(".current-user a").attr("href");
    var buttonMoments = $('.js-global-actions li.moments');
    buttonMoments.find("a").attr("href", currentUser + "/moments");
    buttonMoments.find("a span.text").text("マイモーメント");

    var buttonList = $('.js-global-actions li.moments').clone(true);
    buttonList.find("a").attr("href", "/lists");
    buttonList.find("a span.text").text("リスト");
    buttonList.find("[class^='Icon']").removeClass("Icon--lightning");
    buttonList.find("[class^='Icon']").addClass("Icon--list");

    buttonList.appendTo($('.js-global-actions'));
    buttonMoments.appendTo($('.js-global-actions'));

});
