// ==UserScript==
// @name         PostPrime - Hide Prime Post
// @namespace    https://github.com/y-muen
// @version      0.1.1
// @description  Hide Marked Posts in PostPrime timeline
// @author       Yoiduki <y-muen>
// @match        *://postprime.com/*
// @icon         https://www.google.com/s2/favicons?domain=postprime.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443524/PostPrime%20-%20Hide%20Prime%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/443524/PostPrime%20-%20Hide%20Prime%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hidePrime_sub = (elem) => {
        if (elem.style.display !="none" ){
            if (elem.getElementsByClassName("Post_paidLabel__fGM2T").length){
                elem.style.display="none";
            }
        }
    };

    const hidePrime = () => {
        var Post_postWrapper__XXhlo = document.getElementsByClassName("Post_postWrapper__XXhlo");
        Post_postWrapper__XXhlo = Array.from(Post_postWrapper__XXhlo);
        Post_postWrapper__XXhlo.forEach((elem) => hidePrime_sub(elem));
    };

    hidePrime();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            hidePrime()
        });
    });

    const config = {
        attributes: false,
        childList: true,
        characterData: false,
        subtree:true
    };

    observer.observe(document, config);
})();