// ==UserScript==
// @name         Google Classroom Complete Name
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  STOP MAKING THE CLASS NAMES 999999999999999999999 letters long teachers!!1!11!!
// @author       Ex
// @match        https://classroom.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440777/Google%20Classroom%20Complete%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/440777/Google%20Classroom%20Complete%20Name.meta.js
// ==/UserScript==



(function() {
    'use strict';

    var target = document.querySelectorAll("span.YVvGBb");

    var observer = new MutationObserver(function (mutations) {
        var target = document.querySelectorAll("div.QRiHXd > div.YVvGBb, a.YVvGBb.onkcGd.eDfb1d.Vx8Sxd > div.YVvGBb, span.YVvGBb, h1.YVvGBb, p.YVvGBb, div.kXvNXe > div.YVvGBb, a.apFsO");
        if (target.length > 0) {
            // observer.disconnect();
            target.forEach(function (element) { element.style.overflow = "auto" });
            // return;
        }
    });
    observer.observe(document.body, {subtree: true, childList: true});
})();