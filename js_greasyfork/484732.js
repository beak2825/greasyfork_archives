// ==UserScript==
// @name         Random Prompt from Related Tags.
// @namespace    https://www6.notion.site/dc99953d5f04405c893fba95dace0722
// @version      1
// @description  Press Ctrl+Y to create a random prompt from the results of Danbooru's RelatedTags and copy it to the clipboard. If you press Alt, it will be 20, if you press Shift, it will be 30, and if you press both Alt and Shift, it will be 50.
// @author       SenY
// @match        https://danbooru.donmai.us/related_tag*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484732/Random%20Prompt%20from%20Related%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/484732/Random%20Prompt%20from%20Related%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const generateTags = (tagsLimit) => {
        let tags = document.getElementById("search_query").value.split(" ").map(x => x.trim().replace(/_/g, " "));
        let order = document.getElementById("search_order")
        if(order && order.value){
            order = order.value.toLowerCase();
            while (tags.length < tagsLimit){
                document.querySelectorAll('[href^="/posts?tags="]').forEach(a => {
                    let tr = a.closest("tr");
                    let tag = a.textContent.trim().replace(/_/g, " ");
                    let num = tr.querySelector("."+order+"-column span").textContent.replace("%", "") - 0;
                    let randomNum = Math.floor(Math.random() * 101);
                    if (num > randomNum && tags.length < tagsLimit && !tags.includes(tag) ) {
                        tags.push(tag);
                    }
                })
            }
            console.log(tags.join(", "));
            navigator.clipboard.writeText(tags.join(", "));
        }else{
            alert("Please select any value on Order property.");
        }
    }
    document.addEventListener("keyup", (e) => {
        if (e.ctrlKey && e.code === 'KeyY') {
            if (!e.altKey && !e.shiftKey) {
                generateTags(10);
            } else if (e.altKey && !e.shiftKey) {
                generateTags(20);
            } else if (!e.altKey && e.shiftKey) {
                generateTags(30);
            } else if (e.altKey && e.shiftKey) {
                generateTags(50);
            }
        }
    });
})();