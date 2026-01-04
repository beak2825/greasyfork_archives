// ==UserScript==
// @name         wallhaven壁纸显示修复
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动修复wallhaven壁纸现实问题
// @author       zcy22606
// @include      *wallhaven.cc*
// @icon         https://www.google.com/s2/favicons?domain=wallhaven.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437838/wallhaven%E5%A3%81%E7%BA%B8%E6%98%BE%E7%A4%BA%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/437838/wallhaven%E5%A3%81%E7%BA%B8%E6%98%BE%E7%A4%BA%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
var list = document.getElementsByClassName('lazyload')
for(var i = 0; i<list.length; i++) {
list[i].src= list[i].getAttribute('data-src')
list[i].style.opacity = 1
}

})();