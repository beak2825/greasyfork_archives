// ==UserScript==
// @name         BlogsMarks - Convert URL text to Link
// @namespace    https://blogmarks.net
// @version      0.3
// @description  In Mark description, convert plain text URLs to links (URLs into HTML hyperlinks that are clickable)
// @author       Decembre
// @icon         https://icons.iconarchive.com/icons/sicons/basic-round-social/48/blogmarks-icon.png
// @match        https://blogmarks.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533606/BlogsMarks%20-%20Convert%20URL%20text%20to%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/533606/BlogsMarks%20-%20Convert%20URL%20text%20to%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    var elements = document.querySelectorAll('.b .description');

    elements.forEach(function(element) {
        element.innerHTML = element.innerHTML.replace(urlRegex, function(url) {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        });
    });
})();
