// ==UserScript==
// @name         E621: Why is this blacklisted
// @namespace    http://voxem.ga/y
// @version      0.1
// @description  try to take over the world!
// @author       Voxem
// @match        https://e621.net/post/show/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370699/E621%3A%20Why%20is%20this%20blacklisted.user.js
// @updateURL https://update.greasyfork.org/scripts/370699/E621%3A%20Why%20is%20this%20blacklisted.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var tags = (document.querySelectorAll("#tag-sidebar > li > a:nth-child(2)"))
    var blacklist = (Post.blacklists)
     for (var tag of tags) {
         for (var blacklistedTag of blacklist) {
             for (var textTag of blacklistedTag.tags) {
                 if (textTag.replace("_"," ") == (tag.innerText)) {
                     tag.style.color = "#F00"
                 }
             }
         }
     }
})();