// ==UserScript==
// @name        Display anti-hotlinking images
// @version      1
// @description  just copy and paste
// @match        http*://meipin4.wordpress.com/*
// @namespace https://greasyfork.org/users/977228
// @downloadURL https://update.greasyfork.org/scripts/453989/Display%20anti-hotlinking%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/453989/Display%20anti-hotlinking%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var meta = document.createElement('meta');
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.getElementsByTagName('head')[0].appendChild(meta);
    var img_list = document.getElementsByTagName('img')
    for (var i = 0; i < img_list.length; i++) {
        img_list[i].setAttribute('referrerPolicy', 'same-origin')
            }
    // Your code here...
})();