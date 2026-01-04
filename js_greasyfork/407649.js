// ==UserScript==
// @name         Loforo Plus
// @namespace    http://ikari.loforo.com/
// @version      0.4
// @description  adds j/k scroll to loforo
// @author       ikari
// @supportUrl   https://ikari.loforo.com/
// @match        https://*.loforo.com/*
// @grant        none
// @updateUrl    https://greasyfork.org/en/scripts/407649-loforo-plus
// @homepage     https://greasyfork.org/en/scripts/407649-loforo-plus
// @downloadURL https://update.greasyfork.org/scripts/407649/Loforo%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/407649/Loforo%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    return true; // hey, this functionality is now built in! i only keep this source for historical reasons now :D 

    // Your code here...
    function postsInView() {
        const result = [];
        const posts = document.querySelectorAll('.post');
        const winHeight = window.innerHeight;
        for (const post of posts) {
            const box = post.getBoundingClientRect();
            let dir = "?";
            let partInView;
            if (box.top < 0) {
                // begins above scrolling area
                dir = "up";
                if (box.bottom < 0) {
                    // ends above too
                    partInView = 0;
                } else {
                    partInView = (box.bottom / box.height);
                }
            } else {
                // begins in or below view
                if (box.top < winHeight) {
                    // ok, it's in view, at least partially.
                    if (box.bottom < winHeight) {
                        // fully in view
                        dir = "view";
                        partInView = 1;
                    } else {
                        // ends lower than screen edge
                        dir = "down";
                        partInView = (winHeight - box.top) / box.height;
                    }
                } else {
                    // down and beyond
                    dir = "down";
                    partInView = 0;
                }
            }
            result.push({
                dir,
                partInView,
                post
            });
        }
        return result;
    }

    function scrollOne(dir = "down") {
        const piv = postsInView();
        // let's pick the current post, as the first one most in view
        let max = 0;
        let current;
        let currIdx;
        for (const i in piv) {
            const item = piv[i];
            if (item.partInView > max) {
                max = item.partInView;
                current = item;
                currIdx = ~~i;
            }
        }
        const target = dir == 'down' ? piv[currIdx+1] : piv[currIdx-1];
        const where = (target.post.getBoundingClientRect().height < window.innerHeight) ? 'center' : 'start';
        target.post.scrollIntoView({ behavior: 'auto', block: where});
    }

    document.addEventListener('keydown', function(e) {
        if (['TEXTAREA', 'INPUT'].indexOf(e.originalTarget.tagName) != -1) {
            return;
        }
        if (e.key == 'j') {
            scrollOne("down");
        }
        if (e.key == 'k') {
            scrollOne("up");
        }
    });
})();