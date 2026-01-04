// ==UserScript==
// @name         koalastothemax custom image
// @namespace    https://ianah.me
// @version      1.1.0
// @description  Custom image url
// @author       ianah.dev
// @match        *://koalastothemax.com/*
// @icon         https://koalastothemax.com/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490947/koalastothemax%20custom%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/490947/koalastothemax%20custom%20image.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('next').style.display = 'block';
    var input = document.querySelector('#next input');
    input.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) {
            var imageUrl = input.value.trim();
            if (/^https?:\/\//i.test(imageUrl)) {
                window.location.href = "http://koalastothemax.com?" + imageUrl;
            } else {
                alert("This is not a valid image URL. Please enter a URL starting with 'http://' or 'https://'.");
            }
        }
    });
})();