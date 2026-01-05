// ==UserScript==
// @name        Fastpic block Ads
// @description Блокировка рекламы на fastpic.ru . Как дополнение к блокировке с помощью CSS: https://userstyles.org/styles/121886/
// @namespace   FastpicAds
// @include     http://fastpic.ru/*
// @grant       none
// @version 0.0.1.20160502022555
// @downloadURL https://update.greasyfork.org/scripts/19300/Fastpic%20block%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/19300/Fastpic%20block%20Ads.meta.js
// ==/UserScript==

$(document).ready(function () {
  $('html,body,#fff,#picContainer').click(function (e) {
    if (e.target === this) {
      window.location = '';
    }
  })
})
