// ==UserScript==
// @name:pl UploadHEaven
// @description:pl Omiń restrykcję Uploadhaven za darmo!
// @name         UploadHEaven (Unlimited Download Speed) + (Countdown to 2 seconds)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Bypasses Uploadhaven time restriction.
// @author       crapbass#8715
// @match      https://uploadhaven.com/download/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uploadhaven.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523514/UploadHEaven%20%28Unlimited%20Download%20Speed%29%20%2B%20%28Countdown%20to%202%20seconds%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523514/UploadHEaven%20%28Unlimited%20Download%20Speed%29%20%2B%20%28Countdown%20to%202%20seconds%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', function() {
        function inject(func) {
            var source = func.toString();
            var script = document.createElement('script');
            // Put parenthesis after source so that it will be invoked.
            script.innerHTML = "("+ source +")()";
            document.body.appendChild(script);
        }
        function bypass_time() {
            seconds = 2;
        }
        inject(bypass_time);
        setTimeout(() => document.querySelector("#submitFree").click(), 4000);
    }, false);
})();