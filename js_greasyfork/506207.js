// ==UserScript==
// @name         神行百速
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  对网页提供变速功能
// @author       无语ccky
// @match        *://*.github.io/*
// @match        *://overlord.gg/*
// @match        *://*.g8hh.com.cn/*
// @match        *://html-classic.itch.zone/*
// @match        *://*.u77.games/*
// @match        *://*.mhhf.com/*
// @match        *://*.jntm.cool/*
// @match        *://web.idle-mmo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506207/%E7%A5%9E%E8%A1%8C%E7%99%BE%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/506207/%E7%A5%9E%E8%A1%8C%E7%99%BE%E9%80%9F.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://etherdream.com/jsgear/jsgear.js';
    //原版地址:
    //https://etherdream.com/jsgear/jsgear.js
    //https://github.com/LeeeeeeM/jsGear/blob/master/jsGear.js
    //https://gitee.com/ccmoke/najotest/raw/master/jsGear.js
    document.head.appendChild(script);

})();