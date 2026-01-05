// ==UserScript==
// @name         Anonymizer for Scratch
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Makes all users on scratch anonymous.
// @author       CodingGamerHD
// @match        https://scratch.mit.edu/discuss/*
// @match        https://scratch.mit.edu/projects/*
// @grant        none
// @include      https://scratch.mit.edu/discuss/*
// @downloadURL https://update.greasyfork.org/scripts/21817/Anonymizer%20for%20Scratch.user.js
// @updateURL https://update.greasyfork.org/scripts/21817/Anonymizer%20for%20Scratch.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".postleft").replaceWith('<div class="postleft"><dl><dt><p class="black username">Anonymous</p></dt><dd class="postavatar"><img src="//cdn2.scratch.mit.edu/get_image/user/default_90x90.png" width="90" height="90"></dd>Anonymous<br>??? posts<br><p style="color:#cccccc">Anonymized by CodingGamerHD\'s Anonymizer for Scratch Fourms.</p></dl></div>');
    $("div.name").replaceWith('<b>Anonymous</b>');
    $("img.avatar").replaceWith('<img class="avatar" src="//cdn2.scratch.mit.edu/get_image/user/default_60x60.png" width="45" height="45">');
})();