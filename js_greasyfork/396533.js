// ==UserScript==
// @name         Rule34 Direct Links
// @namespace    potato_potato
// @version      0.2.4
// @description  Provides direct links to Rule34 images in list view
// @author       potato_potato
// @match        https://rule34.xxx/index.php?page=post&s=list*
// @exclude      https://rule34.xxx/index.php?page=post&s=view*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/396533/Rule34%20Direct%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/396533/Rule34%20Direct%20Links.meta.js
// ==/UserScript==

const TEST_BANNER = false;

(() => {
    'use strict';
    let thumbs = Array.from(document.getElementsByClassName('thumb'));
    let errors = [];

    thumbs.forEach((thumb, index) => {
        try {
            // Just in case something changes, so we don't just flat out crash on our end.
            if (thumb.children.length > 0 && thumb.children[0].children.length > 0 && thumb.children[0].children[0].tagName == 'IMG') {
                // Guaranteed due to the above check.
                let img = thumb.children[0].children[0];
                let span = document.createElement('span');
                let link = img.src.replace("/thumbnails/", "/images/").replace("/thumbnail_", "/").replace(/\.jpg\?\d+$/, '');
                // TODO: Determine a better way to check for the `animated` tag, and potentially a way to determine if the
                // content is a gif or webm file.
                let tags = img.getAttribute('alt');
                if (tags.includes('video')) {
                    span.innerHTML = `<br><a href="${link}.mp4">mp4</a>`;
                } else if (tags.includes('webm')) {
                    span.innerHTML = `<br><a href="${link}.webm">webm</a>`;
                } else if (tags.includes('gif') || tags.includes('animated_gif')) {
                    span.innerHTML = `<br><a href="${link}.gif">gif</a>`;
                } else if (tags.includes('animated')) {
                    span.innerHTML = `<br><a href="${link}.gif">gif</a> &nbsp; <a href="${link}.webm">webm</a>`;
                } else {
                    // Unfortunately, there's no way to tell what the format of a given image is. Perhaps it would be worth requesting something like
                    // an automatic tag for the extension? `png`, `jpg`, `jpeg`, `gif`, etc as a meta tag?
                    span.innerHTML = `<br><a href="${link}.jpeg">jpeg</a> &nbsp; <a href="${link}.jpg">jpg</a> &nbsp; <a href="${link}.png">png</a>`;
                }
                thumb.append(span);
            } else {
                errors.push({
                    cause: 'Incorrect data structure for `thumb` instance',
                    link: null, // We don't HAVE a link, due to bad data structure
                    thumb_index: index,
                });
            }
        } catch (e) {
            errors.push({
                cause: 'Unknown cause. Page structure change?',
                link: null,
                thumb_index: index,
            });
        }
        index++;
    });

    // TODO: Look into making the banner less hacky.
    if (errors.length > 0 || TEST_BANNER) {
        console.log("One or more errors have occured while attaching direct links to thumbnail elements:");
        console.log(errors);
        try {
            let banner_container = document.createElement('div');
            let banner_text = document.createElement('span');
            banner_text.textContent = 'Errors have occured while attaching direct links to thumbnails! Please check the console output!';
            banner_text.style['padding-top'] = '1em';
            banner_text.style['padding-bottom'] = '1em';
            banner_text.style.display = 'block';
            banner_text.style['font-size'] = 'large';
            let banner_source_info = document.createElement('span');
            banner_source_info.textContent = 'Rule34 Direct Links Userscript';
            banner_source_info.style['font-size'] = 'x-small';
            banner_source_info.style.right = '0.5em';
            banner_source_info.style.bottom = '0.25em';
            banner_source_info.style.position = 'absolute';
            banner_container.style.position = 'relative';
            banner_container.style.width = '100%';
            banner_container.style['text-align'] = 'center';
            banner_container.style.backgroundColor = '#E0A0A0';
            banner_container.appendChild(banner_text);
            banner_container.appendChild(banner_source_info);
            document.getElementById('content').prepend(banner_container);
        } catch (e) {
            console.log("Unable to attach error banner!");
            console.log(e);
        }
    }
})();