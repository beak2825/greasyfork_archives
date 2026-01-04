// ==UserScript==
// @name         9gag Auto Comment Section
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  anarka84
// @license MIT
// @author       Marc
// @match        https://9gag.com/gag/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458354/9gag%20Auto%20Comment%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/458354/9gag%20Auto%20Comment%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var commentSection = document.getElementsByClassName("post-comment");
    var buttons = document.getElementsByClassName("post-tab-bar__tab");
    var commentButton = buttons[0];
    var relatedButton = buttons[1];
    commentSection[0].style.display = 'block';
    relatedButton.classList.remove('selected');
    commentButton.classList.add('selected');
    relatedButton.onclick = () => hideComments()
    function hideComments() {
        commentSection[0].style.display = 'none'
    }
})();