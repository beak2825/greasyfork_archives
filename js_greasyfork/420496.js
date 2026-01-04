// ==UserScript==
// @name         手机百度展开
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  避免展开全文跳转百度app
// @author       Yui
// @match        *://*.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420496/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/420496/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
$('.mainContent')[0].style.height='20000px';window.onload=function(){setTimeout(onload=function(){$('.layer-item')[0].remove();$('.layer-itemTitle')[0].innerHTML='百度必死';$('.layer-capsule').remove()},500)}
})();