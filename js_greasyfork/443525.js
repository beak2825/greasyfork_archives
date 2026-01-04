// ==UserScript==
// @name         PostPrime - Make Video Controllable
// @namespace    https://github.com/y-muen
// @version      0.1.1
// @description  Hide Marked Posts in PostPrime timeline
// @author       Yoiduki <y-muen>
// @match        *://postprime.com/*
// @icon         https://www.google.com/s2/favicons?domain=postprime.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443525/PostPrime%20-%20Make%20Video%20Controllable.user.js
// @updateURL https://update.greasyfork.org/scripts/443525/PostPrime%20-%20Make%20Video%20Controllable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videoControllable_sub = (elem) => {
        if (!elem.classList.contains('videoControllable')){
            var res=elem.getElementsByTagName("video");
            if (res.length){
                var video = res[0];
                video.controls=true;
                var over = elem.getElementsByClassName("VideoPlayer_playerOverlay__b8HZ_")[0];
                over.remove();
                elem.classList.add('videoControllable');
            }
        }
    };

    const videoControllable = () => {
        var Post_postWrapper__XXhlo = document.getElementsByClassName("Post_postWrapper__XXhlo");
        Post_postWrapper__XXhlo = Array.from(Post_postWrapper__XXhlo);
        Post_postWrapper__XXhlo.forEach((elem) => videoControllable_sub(elem));
    };

    videoControllable();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            videoControllable()
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