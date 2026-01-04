// ==UserScript==
// @name         Booker Gray Optimizations
// @namespace    http://tampermonkey.net/
// @version      2024-03-19
// @description  Various UI fixes for Booker Gray website
// @author       m435tr0d
// @match        https://www.bookergray.com/*/*/?page=*
// @match        https://www.bookergray.com/*/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bookergray.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490408/Booker%20Gray%20Optimizations.user.js
// @updateURL https://update.greasyfork.org/scripts/490408/Booker%20Gray%20Optimizations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove the darkness from "on vacation" escorts on the actual ad pages.
    document.getElementById("bo_v").firstElementChild.getElementsByTagName('section')[0].firstElementChild.firstElementChild.classList.remove("blackfilter");

    // Change the thumbnails to lightbox the original version of the image and make the linked image as large as possible.
    let $head = document.querySelector('head');
    let $link = document.createElement('link');
    $link.rel = 'stylesheet';
    $link.href = '//cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css';
    let $script = document.createElement('script');
    $script.type = 'text/javascript';
    $head.append($link);
    $head.append($script);

    $script.onload = () => {
        let dimension_pattern = /(thumb-)(.*)_(\d{2,4})x(\d{2,4})/i;
        let i = 0;

        document.querySelectorAll('#bo_v .images img').forEach(($img) => {
            var dimensions = $img.src.match(dimension_pattern);
            var is_thumb = (dimensions[1] === 'thumb-');

            // If we don't have dimensions then this may not be a proper thumbnail and we fallback to the width/height of the image.
            var width = (is_thumb) ? dimensions[3] : $img.width;
            var height = (is_thumb) ? dimensions[4] : $img.height;
            var width_scape = (width < height) ? 'auto' : '100vw';
            var height_scape = (width > height) ? 'auto' : '100vh';
            //console.log(i + ': ' + width + 'x' + height + ' : ' + width_scape + 'x' + height_scape);
            //i++;

            var a = document.createElement('a');
            if (is_thumb) {
                a.setAttribute('href', $img.src.replace(dimension_pattern, "$2"));
            }
            else { // Fallback to just the src of the img if the image dispayed is not a thumbnail.
                a.setAttribute('href', $img.src);
            }
            a.setAttribute('class', 'glightbox');
            a.setAttribute('data-height', height_scape);
            a.setAttribute('data-width', width_scape);
            $img.parentNode.insertBefore(a, $img);
            a.appendChild($img);
        })

        // init lightbox
        let lightbox = GLightbox({loop: true})
    }
    $script.src = '//cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js'
})();