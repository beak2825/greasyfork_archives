// ==UserScript==
// @name         FXP pastebin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  מוסיף iframe של pastebin לתוך הפוסטים
// @author       You
// @match        https://www.fxp.co.il/showthread.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fxp.co.il
// @downloadURL https://update.greasyfork.org/scripts/452066/FXP%20pastebin.user.js
// @updateURL https://update.greasyfork.org/scripts/452066/FXP%20pastebin.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const regex = /https?:\/\/pastebin\.com\/([\w+]*)/g;
    const posts = document.querySelectorAll('#posts .postbody a[href*="pastebin.com"]');
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function({isIntersecting, target}) {
            if (isIntersecting) {
                const pastebin_id = target.text.replace(regex, '$1')
                console.log(pastebin_id);
                target.replaceWith(Object.assign(document.createElement('iframe'), {
                    src: 'https://pastebin.com/embed_iframe.php?i=' + pastebin_id,
                    style: 'border:none;width:100%;height:200px'
                }));
                observer.unobserve(target);
            }
        })
    })
    posts.forEach(function(post) {
        observer.observe(post);
    })
})();