// ==UserScript==
// @name         copy danbooru tags
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy danbooru tags to clipboard for novelai inputs
// @author       default
// @match        https://danbooru.donmai.us/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453032/copy%20danbooru%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/453032/copy%20danbooru%20tags.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function() {
        var new_button = "<button id='tags-str'>copy</button>";
        $("#tag-list > div > h3.general-tag-list").after(new_button);

        // var new_check_box = "<input class='new-checkbox' type='checkbox' checked=true></input>";
        var new_check_box = $("<input></input>");
        new_check_box.prop({
            "type": "checkbox",
            "checked": true,
        });

        var wiki_link_list = $("#tag-list > div > ul.general-tag-list > li > a.wiki-link");
        for (var i=0;i<wiki_link_list.length;i++){
            wiki_link_list[i].before(new_check_box);
        }

        $(".new-checkbox").css("margin-right", "50px");

        $("#tags-str").click(function() {
            var tags = $("#tag-list > div > ul.general-tag-list > li > a.search-tag");
            var tag_list = [];
            for (var i = 0; i < tags.length; i++) {
                tag_list.push(tags[i].text);
            }
            var tag_str = tag_list.join(",");
            // alert(tag_str);
            navigator.clipboard.writeText(tag_str);
            alert("copy to clipboard: \n" + tag_str);
        });
    });
})();