// ==UserScript==
// @name             手機版維基百科自動切換至電腦版
// @namespace        http://tampermonkey.net/
// @version          0.1
// @description      當訪問 m.wikipedia.org 時切換至電腦版
// @author           Rabbit1345
// @license          MIT
// @match            https://*.m.wikipedia.org/*
// @icon             https://wikipedia.org/static/favicon/wikipedia.ico
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/445040/%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%AD%E5%9F%BA%E7%99%BE%E7%A7%91%E8%87%AA%E5%8B%95%E5%88%87%E6%8F%9B%E8%87%B3%E9%9B%BB%E8%85%A6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/445040/%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%AD%E5%9F%BA%E7%99%BE%E7%A7%91%E8%87%AA%E5%8B%95%E5%88%87%E6%8F%9B%E8%87%B3%E9%9B%BB%E8%85%A6%E7%89%88.meta.js
// ==/UserScript==


(function() {
    document.getElementById("mw-mf-display-toggle").click();

})();