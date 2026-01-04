// ==UserScript==
// @name         Askfm only images
// @version      1
// @description  Only show images on askfm
// @author       Benjababe
// @match        https://ask.fm/*
// @grant        none
// @namespace https://greasyfork.org/users/476679
// @downloadURL https://update.greasyfork.org/scripts/412154/Askfm%20only%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/412154/Askfm%20only%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = () => {
        console.log("Askfm images running...");

        //gets latest loaded page on change
        let cb = (mutationList) => {
            let newTarget = document.querySelector(".item-pager"),
                newPages = newTarget.getElementsByClassName("item-page"),
                lastItemPage = newPages.item(newPages.length - 1);
            onlyShowImages(lastItemPage);
        }

        //looks for any changes in answers page
        let observer = new MutationObserver(cb);
        let target = document.querySelector(".item-pager");
        observer.observe(target, { attributes: true });

        let itemPages = Array.from(target.getElementsByClassName("item-page"));
        itemPages.forEach((itemPage) => onlyShowImages(itemPage));
    }
})();

let onlyShowImages = (itemPage) => {
    let answers = Array.from(itemPage.getElementsByClassName("item"));
    answers.forEach((answer) => {
        //image element in the answer
        let img = answer.querySelector(".streamItem_visual");
        //hide if doesn't exist
        if (img == null) {
            answer.style.display = "none";
        }
    });
}