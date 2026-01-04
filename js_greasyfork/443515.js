// ==UserScript==
// @name         PostPrime - Hide Marked Posts
// @namespace    https://github.com/y-muen
// @version      0.1.3
// @description  Hide Marked Posts in PostPrime timeline
// @author       Yoiduki <y-muen>
// @match        *://postprime.com/*
// @icon         https://www.google.com/s2/favicons?domain=postprime.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443515/PostPrime%20-%20Hide%20Marked%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/443515/PostPrime%20-%20Hide%20Marked%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideMarked_sub = (elem) => {
        if (elem.style.display =="" ){
            var res = elem.getElementsByClassName("PostReActions_icon___YvyJ")
            res = res[0].getElementsByTagName("img")
            if (res[1].src.match(/heart-on/)){
                elem.style.display="none";
            }
        }
    };

    const hideMarked = () => {
        var Post_postWrapper__XXhlo = document.getElementsByClassName("Post_postWrapper__XXhlo");
        Post_postWrapper__XXhlo = Array.from(Post_postWrapper__XXhlo);
        Post_postWrapper__XXhlo.forEach((elem) => hideMarked_sub(elem));
    };

    hideMarked();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            hideMarked()
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