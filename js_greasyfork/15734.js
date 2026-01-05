// ==UserScript==
// @id          fefes_blog_nav
// @name        Fefes Blog Navigator
// @author      Johannes Pfrang <johannespfrang@gmail.com>
// @namespace   https://github.com/johnp
// @description Navigate blog.fefe.de using post anchors and url hash identifiers
// @domain      blog.fefe.de
// @include     /^https?://blog\.fefe\.de/((\?|#).*)?$/
// @version     2.0.2
// @grant       GM_addStyle
// @run-at      document-idle
// @homepage    https://github.com/johnp/userscripts
// @supportURL  https://github.com/johnp/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/15734/Fefes%20Blog%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/15734/Fefes%20Blog%20Navigator.meta.js
// ==/UserScript==
"use strict";

// add style for active post and enable smooth auto-scrolling
//noinspection JSUnresolvedFunction,JSHint
GM_addStyle("html{scroll-behavior:smooth;} .active{background-color:#dedede;}");

/// --- MAIN ---
{
    let onClick = function () {
        // post is bound below to `this`
        if (!this.classList.contains('active')) {
            window.location.hash = this.id;
        }
    };

    // add page anchors and onClick handlers to all posts
    let posts = document.getElementsByTagName('li');
    for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        // find permalink
        for (let j = 0; j < post.children.length; j++) {
            let link = post.children.item(j);
            if (link.href && link.href.includes('?ts=')) {
                post.id = link.href.split('=').pop();
                post.addEventListener('click', onClick.bind(post));
                break; // inner
            }
        }
    }

    if (window.location.hash) {
        // trigger anchor movement event by rebinding hash
        let hash = window.location.hash.slice(1);
        if (hash) {
            window.location.hash = hash;
            let current = document.getElementById(hash);
            if (current) {
                current.classList.add('active');
            } else {
                // element not found -> must be in previous month -> scroll to page bottom
                window.scrollTo(0, document.body.scrollHeight);
            }
        }
    }
}
/// ---- BINDING ----

// listen to changes to the url anchor hash
window.onhashchange = function (event) {
    let old_hash = event.oldURL.split('#').pop();
    if (old_hash) {
        let previous = document.getElementById(old_hash);
        if (previous) {
            previous.classList.remove('active');
        }
    }

    let new_hash = window.location.hash.slice(1);
    if (new_hash) {
        let current = document.getElementById(new_hash);
        if (current) {
            current.classList.add('active');
        }
    }
};
