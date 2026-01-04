// ==UserScript==
// @name         komica Remove Tag
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description 移除Tag,對應展開,對應https
// @match        https://sora.komica.org/00/*
// @match        http://sora.komica.org/00/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386777/komica%20Remove%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/386777/komica%20Remove%20Tag.meta.js
// ==/UserScript==

   $(".category").remove();

   $("span:contains('展開')").on('click', function () {
         setTimeout(function(){$(".category").remove()},1000);
  });

