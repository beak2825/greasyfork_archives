// ==UserScript==
// @name         百度logo-hqf
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  这是一个hello world 类似的程序。
// @author       hqf
// @match       https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402981/%E7%99%BE%E5%BA%A6logo-hqf.user.js
// @updateURL https://update.greasyfork.org/scripts/402981/%E7%99%BE%E5%BA%A6logo-hqf.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById("lg").innerHTML = "胡青丰的百度"
    var lgStyle = document.getElementById("lg").style;
    lgStyle.setProperty("font-size","70px");
    lgStyle.setProperty("position","relative");
    lgStyle.setProperty("top","70px");
})();