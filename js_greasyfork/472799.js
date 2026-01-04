// ==UserScript==
// @name         bLUE - Spoiler Blocks instead of Tags (w/ images and vids (kinda))
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Turn Spoiler tags into spoiler blocks instead
// @author       threeskimo
// @match        https://*.websight.blue/thread/*
// @icon         https://lore.delivery/static/blueshi.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472799/bLUE%20-%20Spoiler%20Blocks%20instead%20of%20Tags%20%28w%20images%20and%20vids%20%28kinda%29%29.user.js
// @updateURL https://update.greasyfork.org/scripts/472799/bLUE%20-%20Spoiler%20Blocks%20instead%20of%20Tags%20%28w%20images%20and%20vids%20%28kinda%29%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove the "</spoiler>" text, we dont need it anymore, skip on quoted posts since they mess up
    document.querySelectorAll('div.spoiler_closed').forEach(c => {
        if (c.closest('blockquote.msg-quote')) {
            return;
        }
        const d = c.querySelectorAll(`div.${'spoiler_on_close'}`);
        d.forEach(e => e.remove());
    });

    // Grab all zee spoiler divs on the page
    const spoilerDivs = document.querySelectorAll('div.spoiler_on_open');

    // where the magic happens
    spoilerDivs.forEach(div => {

        // Skip processing if inside a blockquote
        if (div.closest('blockquote')) {
            return;
        }

        // Remove the anchor tag w/ class "caption" that stays at the top after opening a spoiler
        document.querySelectorAll('div.spoiler_on_open').forEach(c => {
            const d = c.querySelectorAll(`a.${'caption'}`);
            d.forEach(e => e.remove());
        });

        // Grab all elements in the spoiler tag
        const paragraphs = div.querySelectorAll('*');

        // Create new spoiler container where everything will live
        const spoilerContainer = document.createElement('div');

        // Loop through all paragraphs (or whatever) and style them w/ spoiler block class (css will handle the rest)
        paragraphs.forEach(paragraph => {
            // First check to see if the paragraph (or whatever) is a youtube embed, if so, skip it
            if (!paragraph.classList.contains('embed-container')) {

                // Grab the innerHTML of each element, wrap it in a spoiler block span for css, append it to spoiler container
                var spoilerText = paragraph.innerHTML;
                var spoilerSpan = document.createElement('span');
                spoilerSpan.className = 'block-spoiler';
                var spoilerTextSpan = document.createElement('span');
                var pTag = document.createElement('p');
                spoilerTextSpan.className = 'spoiler-text';
                spoilerTextSpan.innerHTML = spoilerText;
                spoilerSpan.appendChild(spoilerTextSpan);
                pTag.appendChild(spoilerSpan);

                // for imgs in the paragraph (or whatever), add spoiler block class (css will do the rest)
                var images = spoilerTextSpan.querySelectorAll('img');
                images.forEach(image => {
                    image.className = 'spoiler-img';
                });

                // append this paragraph (or whatever) to the spoiler container
                spoilerContainer.appendChild(pTag);
            }
        });

        // sweet sweet replace
        div.parentNode.replaceChild(spoilerContainer, div);

        spoilerContainer.addEventListener('click', () => {
            var elementsInsideContainer = spoilerContainer.querySelectorAll("*");
            elementsInsideContainer.forEach(function (element) {
                element.classList.toggle("revealed");
            });
        });

    });

    // CSS for the new spoiler blocks
    const style = document.createElement('style');
    style.innerHTML = `
    .block-spoiler {
        background-color:#000;
        color:#000;
        cursor:pointer;
        padding-top: 2px;
        padding-bottom: 2px;
    }
    .spoiler-text {
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY0ACDAwAAA4AAXqxuTAAAAAASUVORK5CYII=');
        background-repeat: repeat;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .block-spoiler::selection {
        background-color:#000;
        color:#11111e;
    }
    .block-spoiler.revealed {
        background-color:initial;
        color:var(--Text);
    }
    .spoiler-text.revealed {
        background: none;
        color:var(--Text);
        -webkit-text-fill-color: unset;
    }
    .spoiler-img {
        filter: brightness(0%);
    }
    .spoiler-img.revealed {
        filter: brightness(100%);
    }
    `;
    // append new styling to the <head>
    document.head.appendChild(style);
})();
