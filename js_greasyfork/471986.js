// ==UserScript==
// @name         Twitter not 𝕏
// @namespace    http://tampermonkey.net/
// @description  Twitter  not 𝕏 
// @author       You
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @version 0.0.1.20230729144102
// @downloadURL https://update.greasyfork.org/scripts/471986/Twitter%20not%20%F0%9D%95%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/471986/Twitter%20not%20%F0%9D%95%8F.meta.js
// ==/UserScript==

(function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '//abs.twimg.com/favicons/twitter.2.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
})();