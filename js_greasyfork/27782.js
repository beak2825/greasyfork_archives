// ==UserScript==
// @name        Portraitify - Hentai-Foundry
// @namespace   lazi3b0y
// @description Hentai-foundry portait resolution fix
// @include     *hentai-foundry.com*
// @version     1.2
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/27782/Portraitify%20-%20Hentai-Foundry.user.js
// @updateURL https://update.greasyfork.org/scripts/27782/Portraitify%20-%20Hentai-Foundry.meta.js
// ==/UserScript==

GM_addStyle('.thumb.portraitify {max-width: 13vw;}');

var target = document.getElementsByTagName('body')[0];

console.log('Portait script: Creating observer.');
var observer = new MutationObserver(function () {
    console.log('Portait script: Mutation observed.');
    portaitify();
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};

observer.observe(target, config);
console.log('Portait script: Observer initialized.');

console.log('Portait script: Checking for objects to modify.');
portaitify();

window.onresize = function () {
    console.log('Portait script: Window resize occurred.');
    portaitify();
}
console.log('Portait script: Listening for window resize events.');

function portaitify() {
    if (window.outerWidth < window.outerHeight) {
        var thumbs = document.getElementsByClassName('thumb');

        console.log('Portait script: Portrait mode.');

        if (thumbs !== undefined && thumbs !== null) {
            console.log('Portait script: Squeezing thumbnails together.');
            for (i = 0; i < thumbs.length; i++) {
                thumbs[i].classList.add('portraitify');
            }
        }
    } else {
        revertChanges();
    }
}

function revertChanges() {
    
}