// ==UserScript==
// @name       Pawoo: display NSFW Img
// @namespace  namespace
// @version    0.2
// @description  display NSFW imgs for Pawoo / クリックしないと閲覧できない画像を表示する
// @include      https://pawoo.net/users/*
// @include    https://pawoo.net/*
// @copyright  2014+, qa2
// @downloadURL https://update.greasyfork.org/scripts/32119/Pawoo%3A%20display%20NSFW%20Img.user.js
// @updateURL https://update.greasyfork.org/scripts/32119/Pawoo%3A%20display%20NSFW%20Img.meta.js
// ==/UserScript==

// $(function() {
//   $(".media-spoiler-wrapper").addClass("media-spoiler-wrapper__visible")
// });

(() => {
  e = document.getElementsByClassName("media-spoiler-wrapper")
  for (var i = 0; i < e.length; i++) {
    e[i].classList.add("media-spoiler-wrapper__visible")
  };
})();
