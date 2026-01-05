// ==UserScript==
// @name         Hide Gab post preview images
// @namespace    https://gab.ai/Jeremy20_9
// @version      0.1
// @description  remove preview images from posts
// @author       Jeremiah 20:9
// @match        https://gab.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23352/Hide%20Gab%20post%20preview%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/23352/Hide%20Gab%20post%20preview%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        $("#home-post-list,#user-post-list").on('DOMSubtreeModified', function () {
            $(".post__embed__body__image").hide();
        });
    });
})();