// ==UserScript==
// @name        no-yandex-ads
// @namespace   yandex
// @description Removes ads on *.yandex.ru
// @description:ru Убирает рекламу на Яндексе
// @include     *://*.yandex.ru/*, *://yandex.ru/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11269/no-yandex-ads.user.js
// @updateURL https://update.greasyfork.org/scripts/11269/no-yandex-ads.meta.js
// ==/UserScript==

var
  emptyAds = '{"ads":{"ids":[],"inquire":{"dtype":"stred","path":"0"}}}';

[].forEach.call(document.querySelectorAll(".ads"), function(ad) {
  ad.setAttribute("data-bem", emptyAds);
});

var
  target = document.querySelector('.b-page__inner');

var
  observer = new MutationObserver(function(mutations) {
    [].forEach.call(document.querySelectorAll(".ads"), function(ad) {
      var data = JSON.parse(ad.getAttribute("data-bem")).ads;
      data.ids.forEach(function(id, index) { data.ids[index] = "#" + id });
      var selector = data.ids.join(",");
      [].forEach.call(document.querySelectorAll(selector), function(n) {
        n.remove();
      });
    });
  });
 
var
  config = { childList: true, subtree: true };

observer.observe(target, config);