// ==UserScript==
// @name         Danbooru tags buttons
// @namespace    danbooru
// @version      0.2
// @description  Return +/- buttons to Danbooru
// @author       Jallot
// @include      http*://*danbooru.donmai.us/posts*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484162/Danbooru%20tags%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/484162/Danbooru%20tags%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentTags = document.getElementById("tags").value.split(" ").filter(String);

    function addTagToSearch(tag, negative=false){
        var newTags = [...currentTags]
        if (negative){
            tag = "-" + tag;
        }
        newTags.push(tag);
        return newTags.join("+");
    };


    const tagList = document.querySelectorAll('ul li[class*="tag-type-"]');
    for (const tag of tagList) {
        const tagLinks = tag.querySelectorAll("a");
        const tagNameNode = tagLinks[1];
        const tagUrl = new URLSearchParams(tagNameNode.href.split('?')[1]);
        const tagName = tagUrl.get("tags");
        var plusLink = document.createElement('a');
        plusLink.href = '/posts?tags=' + addTagToSearch(tagName);
        plusLink.textContent = '+';
        var minusLink = document.createElement('a');
        minusLink.href = '/posts?tags=' + addTagToSearch(tagName, true);
        minusLink.textContent = '-';
        tagNameNode.parentNode.insertBefore(plusLink, tagNameNode);
        tagNameNode.parentNode.insertBefore(document.createTextNode(" "), tagNameNode);
        tagNameNode.parentNode.insertBefore(minusLink, tagNameNode);
        tagNameNode.parentNode.insertBefore(document.createTextNode(" "), tagNameNode);
    };
})();
