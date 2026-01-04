// ==UserScript==
// @name         TagCopy for NovelAI
// @namespace    https://pickuse2013.github.io/
// @version      0.1
// @description  copy tags for NovelAI
// @author       pickuse2013
// @license      MIT
// @match        https://danbooru.donmai.us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard

// @downloadURL https://update.greasyfork.org/scripts/453110/TagCopy%20for%20NovelAI.user.js
// @updateURL https://update.greasyfork.org/scripts/453110/TagCopy%20for%20NovelAI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let copyTags = [];

    $('h3.general-tag-list').append('<a href="#" class="copy-tags">Copy Tags</a>');
    $(document).on('click', '.copy-tags', function() {
        copyTags = [];
        $(".search-tag").each(function(index, item) {
            let tag = $(item).text();
            copyTags.push(tag);
        });

        GM_setClipboard(copyTags.join(", "));
    });
})();