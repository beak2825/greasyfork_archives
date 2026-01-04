// ==UserScript==
// @name         danbooru Extract Tags Button
// @namespace    danbooru Extract Tags Button!
// @version      0.1
// @description  Add a button to extract all tags from current danbooru page!
// @author       FetchTheMoon
// @match        https://danbooru.donmai.us/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452894/danbooru%20Extract%20Tags%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/452894/danbooru%20Extract%20Tags%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';


    $("h3.general-tag-list").append("<button id='extract-all-tags'>Extract All Tags</button>")
    $("#extract-all-tags").on("click", function(){
        let all_tags = [];
        for (const tag of $("ul.general-tag-list>li>.search-tag")) {
            all_tags.push(tag.textContent);
        }
        prompt("All tags:", all_tags.join(","))
    })
})();