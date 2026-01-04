// ==UserScript==
// @name         Better Comments for Drive PDF Viewer
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Hides every comment in 'comments column' which has no text inside. Makes comments with text inside simpler by hiding author and other data.
// @author       Balint Sotanyi
// @match        https://drive.google.com/file/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403245/Better%20Comments%20for%20Drive%20PDF%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/403245/Better%20Comments%20for%20Drive%20PDF%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.onload = function() {
        var style = document.createElement('style'), parent_found = false, comments;
        style.innerText = 'div { transition: opacity .8s; }';
        document.head.appendChild(style);
        var check_interval = setInterval(function() {
            var comment_collection = document.getElementsByClassName('dcs-a-dcs-bd dcs-a dcs-a-dcs-u-dcs-v dcs-a-dcs-u-dcs-v-dcs-pf dcs-a-dcs-u-dcs-v-dcs-w-dcs-pf dcs-a-dcs-lg-dcs-ah dcs-a-dcs-lg-dcs-mg');
            if (comment_collection !== undefined && comment_collection[0] !== undefined) {
                comments = [].slice.call(comment_collection[0].children);
                if (comments !== undefined && comments.length > 0) {
                    clearInterval(check_interval);
                    comments.forEach(function(c){
                        try {
                            var b1 = c.firstElementChild.innerText == "",
                                b2 = c.firstElementChild.firstElementChild.firstElementChild.firstElementChild.children[1].innerText == "";
                        } catch (e) { /* omegalul */ }
                        if (b1 || b2) {
                            c.style.opacity = '0';
                            c.style.cursor = 'default';
                        } else {
                            var parent = c.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
                            parent.innerHTML = parent.children[1].innerText;
                            c.click();
                        }
                    });
                }
            }
        }, 1000);
    }
})();