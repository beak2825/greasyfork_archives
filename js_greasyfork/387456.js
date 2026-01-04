// ==UserScript==
// @name         Discogs/Listings/Ratio Emphasis
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.discogs.com/seller/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387456/DiscogsListingsRatio%20Emphasis.user.js
// @updateURL https://update.greasyfork.org/scripts/387456/DiscogsListingsRatio%20Emphasis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var list = document.getElementsByClassName("table_block mpitems push_down table_responsive")[0];
    var children = list.children[1].children;

    for (var i = 0; i < children.length; i++) {
        var nums = children[i].getElementsByClassName("community_number");
        if (nums.length > 1){
            var ratio = nums[1].innerText/nums[0].innerText;
            if (ratio > 1){
                console.log("item");
                children[i].style.backgroundColor = "#FECCCC";
            }
        }
    }
    console.log(children.length);
    // Your code here...
})();