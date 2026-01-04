// ==UserScript==
// @name         AliExpress hide search ads
// @namespace    https://www.aliexpress.com
// @version      2025-06-28
// @description  Hides ads in AliExpress search results
// @author       You
// @match        https://www.aliexpress.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546195/AliExpress%20hide%20search%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/546195/AliExpress%20hide%20search%20ads.meta.js
// ==/UserScript==


function hideAdCards() {
    if (document.getElementById('card-list') !== null) {
        let searchCardArr = document.getElementById('card-list').querySelectorAll('.search-item-card-wrapper-gallery');

        for (let i = 0; i < searchCardArr.length; i++) {
            if (searchCardArr[i].innerHTML.indexOf('>Ad</div>') !== -1) {
                //console.log(searchCardArr[i].innerHTML);
                searchCardArr[i].style.display = 'none';
            }
        }
    }
}

hideAdCards();

window.addEventListener("scroll", function(){
    hideAdCards();
});

window.addEventListener("click", function(){
    hideAdCards();
});