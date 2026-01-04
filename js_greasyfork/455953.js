// ==UserScript==
// @name         Select image id support
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  select
// @author       Huy
// @include      https://www.pixtastock.com/tags/*
// @match        https://www.pixtastock.com/tags/*
// @include      https://pixta.jp/tags/*
// @match        https://pixta.jp/tags/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixtastock.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455953/Select%20image%20id%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/455953/Select%20image%20id%20support.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var list_select = [];
    function initSelect() {
        let lst_img = document.querySelectorAll(".item-list--large__wrap");
        lst_img.forEach(function(item) {
            item.addEventListener("click", function(event) {
                let idClick = this.firstChild.id;
                console.log(idClick);
                if (list_select.includes(idClick)) {
                    list_select = list_select.filter((e) => e !== idClick);
                    this.setAttribute("style", "opacity:1");
                } else {
                    list_select.push(idClick);
                    this.setAttribute("style", "opacity:0.2");
                }
                navigator.clipboard.writeText(list_select.toString());
                event.preventDefault(); // this line prevents changing to the URL of the link href
                event.stopPropagation();
                event.stopImmediatePropagation();
            });
        });
    }
        initSelect();
        let targetNode = document.querySelector(".footer-pagination .prev").firstChild;
        // Options for the observer (which mutations to observe)
        const config = { attributes: true };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "attributes") {
                    console.log(`The ${mutation.attributeName} attribute was modified.`);
                    initSelect();
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
})();