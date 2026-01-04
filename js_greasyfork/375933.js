// ==UserScript==
// @name         dstu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  remove baidu ads
// @author       babybing666
// @match        https://d.stulip.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375933/dstu.user.js
// @updateURL https://update.greasyfork.org/scripts/375933/dstu.meta.js
// ==/UserScript==
var timeout = 1000;
(function() {
    'use strict';
    var currentURL = window.location.href;
    var dstu = /dstu/;
    var stulip = /stulip/;
    if (stulip.test(currentURL)){
        setTimeout(function () {
            document.getElementById("cate").remove();
            document.getElementById("coolsite").remove();
            document.getElementById("keywords").remove();
            document.getElementById("banner").remove();
            document.querySelector('#notice').remove();
            console.log("removed");
        }, timeout);
    }
})();