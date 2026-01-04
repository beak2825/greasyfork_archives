// ==UserScript==
// @name             Google搜尋手機版維基百科改為桌面版網址
// @namespace        http://tampermonkey.net/
// @version          0.1
// @description      若Google搜尋結果為手機版的維基百科就改為桌面版網址
// @author           Rabbit1345
// @license          MIT
// @match            https://www.google.com/*
// @match            https://www.google.com.tw/*
// @icon             https://favicon.yandex.net/favicon/google.com
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/445533/Google%E6%90%9C%E5%B0%8B%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%AD%E5%9F%BA%E7%99%BE%E7%A7%91%E6%94%B9%E7%82%BA%E6%A1%8C%E9%9D%A2%E7%89%88%E7%B6%B2%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/445533/Google%E6%90%9C%E5%B0%8B%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%AD%E5%9F%BA%E7%99%BE%E7%A7%91%E6%94%B9%E7%82%BA%E6%A1%8C%E9%9D%A2%E7%89%88%E7%B6%B2%E5%9D%80.meta.js
// ==/UserScript==


(function() {

    var yuRUbf_length = document.querySelectorAll('.yuRUbf').length;
    var tjvcx_length = document.querySelectorAll('.tjvcx').length;

    for (var i = 0; i < yuRUbf_length; i++)
    {
      if (document.querySelectorAll('.yuRUbf')[i].innerHTML.includes("m.wikipedia.org"))
      {
        document.querySelectorAll('.yuRUbf')[i].innerHTML = document.querySelectorAll('.yuRUbf')[i].innerHTML.replace("m.wikipedia.org","wikipedia.org"); //change URL
      }
    }

    for (var j = 0; j < tjvcx_length; j++)
    {
      document.querySelectorAll('.tjvcx')[j].innerHTML = document.querySelectorAll('.tjvcx')[j].innerHTML.replace("m.wikipedia.org","wikipedia.org"); //change text
    }

})();
