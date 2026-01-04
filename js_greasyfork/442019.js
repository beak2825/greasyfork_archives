// ==UserScript==
// @name:pl UploadHEaven
// @description:pl Omiń restrykcję Uploadhaven za darmo!
// @name         UploadHEaven
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Bypasses Uploadhaven time restriction.
// @author       crapbass#8715
// @match      https://uploadhaven.com/download/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uploadhaven.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442019/UploadHEaven.user.js
// @updateURL https://update.greasyfork.org/scripts/442019/UploadHEaven.meta.js
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