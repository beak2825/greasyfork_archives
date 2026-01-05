// ==UserScript==
// @name         [Box] Show Tag at sidebar
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  try to take over the world!
// @author       SSARCandy
// @match        https://app.box.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27808/%5BBox%5D%20Show%20Tag%20at%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/27808/%5BBox%5D%20Show%20Tag%20at%20sidebar.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let cache_tags = '';

    $( document ).ajaxComplete(function( event, xhr, settings ) {
        if (xhr.responseText.match('popup-heading')) {
            setTimeout(()=> {
                const html = `<span class="item-tags" style="white-space: pre-wrap;">${cache_tags.map(t => `<span class="auto-fill item-tag">${t}</span>`).join(' ')}</span>`;
                $('.tags-autocomplete').append(html);
                $('.auto-fill').click(function() {
                    $('textarea.pill-selector-input').val( $(this).text() ).keyup();
                    return false;
                });
            }, 200);
            //console.log(html)
        }
    });

    $.ajax({
        url: "https://app.box.com/index.php?rm=box_tag_get_tags",
    }).done(function (res) {
        let tags = res.nodes;
        cache_tags = Object.keys(tags).map((key, index) => tags[key].name);

        const html =
              `<ul><li class="tags tag_container last-child" id="tag-cloud">
${cache_tags.map(t => `<span class="badge upgrade mrs" style="margin-bottom: 5px;"><a href="/folder/0/search?tags=${t.replace('#', '%23')}&view=list" id="t_${t}" class="tag_name" data-type="tag-btn">${t}</a></span>`).join(' ')}
</li></ul>`;
        $('#left-nav').append(html);

    });

})();