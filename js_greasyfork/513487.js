// ==UserScript==
// @name         First Impressions
// @namespace    https://ejew.in/
// @version      2024-10-21-2
// @description  Help you keep track of new people.
// @author       EntranceJew
// @match        https://bsky.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bsky.app
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513487/First%20Impressions.user.js
// @updateURL https://update.greasyfork.org/scripts/513487/First%20Impressions.meta.js
// ==/UserScript==

// thanks to:
// Starburst by Julynn B. from <a href="https://thenounproject.com/browse/icons/term/starburst/" target="_blank" title="Starburst Icons">Noun Project</a> (CC BY 3.0)

(function() {
    'use strict';
    let size = '0.25em';
    GM_addStyle(`
.new-skeeter {
    
}

.new-skeeter::after {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='gold' viewBox='0 0 100 100'%3E%3Cpath d='M57.8 99c1.6 1.7 4 1.1 4.8-1l4.2-11.6c-.2.6-.9.9-1.4.7l11.3 4.6c2.1.9 4.1-.7 4-2.9l-.8-12.3c0 .7-.4 1.2-1.1 1.2l12.2-.5c2.2-.1 3.6-2.3 2.4-4.3L87.8 62c.3.6.1 1.2-.4 1.6l11-5.4c2-1 2.2-3.6.6-4.9l-9.7-7.7c.4.4.6 1.1.2 1.7l7.9-9.4c1.4-1.8.7-4.1-1.6-4.7l-11.9-3c.6.1 1 .8.8 1.4l3.3-12c.6-2.1-1.1-4.1-3.3-3.7l-12.1 1.9c.7-.1 1.2.3 1.3 1L72.1 6.6c-.3-2.2-2.7-3.2-4.4-2l-10.2 6.9c.6-.3 1.2-.2 1.6.3L52.6 1.4c-1.2-1.9-3.8-1.9-4.9 0l-6.6 10.5c.3-.6 1-.7 1.6-.3l-10.3-7c-1.9-1.2-4.2-.2-4.4 2l-1.8 12.2c.1-.7.7-1.1 1.3-1l-12.1-2.1c-2.2-.3-3.9 1.6-3.3 3.7l3.3 11.9c-.2-.6.2-1.2.8-1.4L4.3 33c-2.2.6-3 3-1.6 4.7l7.9 9.4c-.4-.4-.3-1.2.2-1.7l-9.7 7.7C-.6 54.6-.3 57 1.7 58l11 5.4c-.6-.3-.8-1-.4-1.6l-5.7 11c-1.2 2.1.1 4.3 2.3 4.4l12.2.4c-.7 0-1.1-.6-1.1-1.2l-.8 12.3c-.1 2.2 1.9 3.8 4 2.9L34.5 87c-.6.2-1.2-.1-1.4-.7L37.4 98c.8 2.1 3.2 2.7 4.8 1l8.6-8.8c-.4.4-1.2.4-1.7 0l8.7 8.8zM47.7 87.1l-8.6 8.8c.7-.8 2.1-.4 2.4.6l-4.2-11.6c-.7-1.8-2.6-2.7-4.3-1.9l-11.3 4.6c.9-.3 2.1.4 2.1 1.6l.8-12.3c.1-1.9-1.3-3.4-3.1-3.6l-12.3-.5c1 0 1.8 1.3 1.2 2.2l5.7-10.9c.9-1.7.2-3.7-1.4-4.6l-11-5.4c.9.4 1.1 1.9.2 2.6l9.7-7.7c1.4-1.1 1.7-3.3.4-4.7l-7.8-9.4c.7.8.2 2.2-.8 2.4l11.9-3c1.8-.4 2.9-2.3 2.3-4.1l-3.3-11.9c.2 1-.7 2.1-1.7 1.9l12.1 2.1c1.8.3 3.6-.9 3.8-2.8l1.8-12.2c-.1 1-1.4 1.6-2.3 1l10.2 6.9c1.6 1 3.7.6 4.7-1l6.4-10.5c-.6.9-2 .9-2.6 0l6.6 10.5c1 1.6 3.1 2 4.7 1l10.2-6.9c-.9.6-2.2 0-2.3-1l1.8 12.2c.2 1.9 2 3.1 3.8 2.8l12.1-2.1c-1 .2-2-.9-1.7-1.9l-3.3 11.9c-.6 1.8.6 3.7 2.3 4.1l11.9 3c-1-.2-1.4-1.7-.8-2.4l-7.9 9.4c-1.2 1.4-1 3.6.4 4.7l9.7 7.7c-.8-.7-.7-2.1.2-2.6l-11 5.4c-1.7.8-2.3 2.9-1.4 4.6L89.7 75c-.4-.9.2-2.2 1.2-2.2l-12.2.4c-1.9.1-3.3 1.7-3.1 3.6l.8 12.3c-.1-1 1.1-1.9 2.1-1.6L67 83c-1.8-.7-3.7.2-4.3 1.9l-4.2 11.6c.3-1 1.8-1.2 2.4-.6l-8.4-8.8c-1.4-1.3-3.5-1.3-4.8 0z'/%3E%3C/svg%3E");
    position: absolute;
    border-width: ${size};
    left: -${size};
    top: -${size};
    height: calc(100% + ${size} + ${size});
    width: calc(100% + ${size} + ${size});
    z-index: -1;
    animation: rotate-center 30s linear infinite both;
}

@keyframes rotate-center {
  0% {
            transform: rotate(0) scale(1);
  }
  25% {
            transform: rotate(90deg) scale(1.1);
  }
  50% {
            transform: rotate(180deg) scale(1);
  }
  75% {
            transform: rotate(270deg) scale(1.1);
  }
  100% {
            transform: rotate(360deg) scale(1);
  }
}
    `);

    function isElementInViewport(el) {
        let rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function isElementVisible(el) {
        return el.checkVisibility({
            contentVisibilityAuto: true,
            opacityProperty: true,
            visibilityProperty: true,
        }) && isElementInViewport(el);
    }

    //:not(:has(div[aria-label^="Post by"]))

    function getSkeetLikeThings() {
        let skeet_likes = document.querySelectorAll('[data-testid*="-by-"]');
        return skeet_likes;
    }

    function getSkeetLikeThingAvatar(skeetLikeThing){
        return skeetLikeThing.querySelector('a[aria-label$="\'s avatar"]');
    }

    function getSkeetLikeThingHandle(skeetLikeThing){
        let elm = skeetLikeThing.parentElement.querySelector('[data-testid*="-by-"]');

        if(elm && elm.dataset && elm.dataset.testid){
            return elm.dataset.testid.replace(/^.*-by-/,"");
        }
    }

    function skeetAvatarSweeper(){
        let visible_skeets = [...getSkeetLikeThings()].filter(n => isElementVisible(getSkeetLikeThingAvatar(n)));
        let seen_skeeters = GM_getValue("seen_skeeters", []);
        visible_skeets.forEach((skeetLikeThing) => {
            let handle = getSkeetLikeThingHandle(skeetLikeThing);
            let avatar = getSkeetLikeThingAvatar(skeetLikeThing);
            if( handle && !seen_skeeters.includes(handle) ){
                if( !avatar.classList.contains('new-skeeter') ){
                    avatar.classList.add('new-skeeter');
                    seen_skeeters.push(handle);
                }
            }
        });
        GM_setValue("seen_skeeters", seen_skeeters);
    }

    setInterval(skeetAvatarSweeper, 1000);
})();