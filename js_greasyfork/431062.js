// ==UserScript==
// @name         Boredpanda Nice&Clean
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Clean homepage & articles
// @author       Olli
// @match        https://www.boredpanda.com/*
// @icon         https://www.boredpanda.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431062/Boredpanda%20NiceClean.user.js
// @updateURL https://update.greasyfork.org/scripts/431062/Boredpanda%20NiceClean.meta.js
// ==/UserScript==

onload = (function(){
    var elements = [
        '[id="sharebar"]',
        '[id="categories-variation-new"]',
        'aside.sidebar',
        'footer.footer',
        'div.show-all-contributors',
        'div.post-recommendations',
        'div.post-comments',
        'div.post-bottom-recommendation-block',
        'div.ml-subscribe-form',
        'div.post-tags',
        'div.footer',
        'div.open-list-comments',
    ];
    let count = {
        total: elements.length,
        removed: 0
    };
    elements.forEach(function(item){
        let element = document.querySelectorAll(item);
        element.forEach(function(elem){
            elem.remove();
            count.removed++;
        });
    });
    console.log(`Boredpanda Nice&Clean: ${count.removed} elements removed`);
    //fixing content-width for better reading
    function fixWidth(element, width)
    {
        var item = document.querySelector(element);
        if(item) item.style.marginRight = width;
    }
    fixWidth("div.left-content-column","5px");
    fixWidth("section.posts","5px");
})();