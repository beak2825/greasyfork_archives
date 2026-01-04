// ==UserScript==
// @name         Peak-Peek
// @namespace    https://github.com/StuffBySpencer/Steem-Scripts/tree/master/Peak-Peek
// @version      1.5
// @description  Peak-Peek brings collapsible comments to SteemPeak
// @author       Stuff By Spencer
// @match        https://steempeak.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372508/Peak-Peek.user.js
// @updateURL https://update.greasyfork.org/scripts/372508/Peak-Peek.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = () => {

        console.log('Peak-Peek: Creating Collapse Links...');

        // GRAB ALL COMMENTS FROM POST
        let comments = document.querySelectorAll('.comment-media');

        comments.forEach(comment => {
            // SET UP INITIAL STYLES AND PLACEMENT
            let collapse_text = document.createElement('div');
            collapse_text.innerText = '[ - ]';
            collapse_text.style.fontWeight = 'bold';
            collapse_text.style.display = 'inline';
            collapse_text.style.float = 'right';
            collapse_text.style.paddingRight = '5px';

            collapse_text.onmouseenter = () => {
                collapse_text.style.textShadow = '1px 1px 0px tomato';
                collapse_text.style.cursor = 'pointer';
            };

            collapse_text.onmouseleave = () => {
                collapse_text.style.textShadow = '0px 0px 0px transparent';
                collapse_text.style.cursor = 'normal';
            };

            collapse_text.onclick = () => {
                if (comment.style.height != '45px') {
                    // COLLAPSE COMMENT THREAD
                    comment.style.height = '45px';
                    comment.style.overflowY = 'hidden';
                    comment.style.boxShadow = '0px -2px 2px 0px inset rgba(0, 0, 0, 0.42)';

                    // BACKGROUND ADAPTED FROM: http://lea.verou.me/css3patterns/#diagonal-stripes
                    comment.style.backgroundColor = 'rgba(222, 222, 222, 0.5)';
                    comment.style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.25) 35px, rgba(255,255,255,.25) 70px)';

                    collapse_text.innerText = '[ + ]';
                }
                else {
                    // OPEN UP COMMENT THREAD
                    comment.style.height = '100%';
                    comment.style.overflowY = 'visible';
                    comment.style.boxShadow = '0px 0px 0px 0px transparent';

                    comment.style.backgroundColor = 'transparent';
                    comment.style.backgroundImage = '';

                    collapse_text.innerText = '[ - ]';
                }
            };

            // ATTACH COLLAPSE LINK TO THE COMMENT HEADER SECTION
            comment.getElementsByClassName('media-heading')[0].appendChild(collapse_text);
        });

    };
})();