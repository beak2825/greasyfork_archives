// ==UserScript==
// @name         esaの記事ページのtitleのパス部分を後ろに移動するやつ
// @namespace    https://bengo4com.esa.io/
// @version      0.1
// @description  try to take over the world!
// @author       kuma
// @match        https://*.esa.io/posts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26674/esa%E3%81%AE%E8%A8%98%E4%BA%8B%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AEtitle%E3%81%AE%E3%83%91%E3%82%B9%E9%83%A8%E5%88%86%E3%82%92%E5%BE%8C%E3%82%8D%E3%81%AB%E7%A7%BB%E5%8B%95%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/26674/esa%E3%81%AE%E8%A8%98%E4%BA%8B%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AEtitle%E3%81%AE%E3%83%91%E3%82%B9%E9%83%A8%E5%88%86%E3%82%92%E5%BE%8C%E3%82%8D%E3%81%AB%E7%A7%BB%E5%8B%95%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var orgTitle = document.title;
    var result = orgTitle.replace(/(^.*\/)(.*$)/, '$2/$1');
    document.title = result;
})();