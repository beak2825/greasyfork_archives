// ==UserScript==
// @name         Achewood Mobile-Optimized
// @namespace    https://cliambrown.com/
// @version      0.2.3
// @description  Make achewood.com easier to use on a phone
// @author       C. Liam Brown
// @match        *://achewood.com
// @match        *://www.achewood.com
// @match        *://achewood.com/*
// @match        *://www.achewood.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=achewood.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456682/Achewood%20Mobile-Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/456682/Achewood%20Mobile-Optimized.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set viewport
    var meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1";
    document.getElementsByTagName('head')[0].appendChild(meta);

    // Add various styles
    var styles = `
        /* Comic */
        #comic_body {
            overflow-x: auto;
        }

        /* Ads */
        #banner {
            height: auto;
        }
        #banner img,
        #comic_footer img {
            max-width: 100%;
            height: auto;
            vertical-align: bottom;
        }
        #comic_header {
            width: 700px;
            max-width: 100%;
        }

        /* Navigation */
        #comic_navigation {
            width: 700px;
            max-width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            font-size: 12px;
        }
        #comic_navigation > * {
            position: static !important;
            margin: 0 !important;
        }
        #comic_navigation .left,
        #comic_navigation .right,
        #comic_navigation .dateNav {
            width: 40px;
            height: 40px;
            text-align: center;
            line-height: 40px;
            font-size: 14px;
        }
        #comic_navigation .dateNav {
            display: inline-block;
            vertical-align: bottom;
            background: #004400;
            border-radius: 6px;
            color: #FFF !important;
        }
        #comic_navigation .date {
            flex-grow: 1;
            min-width: 0;
            color: #6e6e6e;
        }
        #alt-text {
            padding: 6px 0 0;
            width: 100%;
            color: #000;
            max-height: 150px;
            overflow-y: auto;
            white-space: normal;
        }
        @media (max-width: 1023px) {
            #body {
                padding-left: 8px;
                padding-right: 8px;
            }
            #comic_navigation {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                margin: 0;
                width: auto;
                padding: 10px 4px;
                background: white;
                box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1);
                z-index: 1000;
            }
            #footer {
                padding-bottom: 100px;
            }
        }

        /* Footer */
        #home_footer {
            box-sizing: border-box;
            width: 700px;
            max-width: 100%;
            margin: 0 auto;
            padding-left: 0;
            padding-right: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
            align-items: flex-start;
        }
        @media (max-width: 720px) {
            #home_footer {
                padding-left: 10px;
                padding-right: 10px;
            }
        }
        #home_footer .column {
            float: none;
            margin: 0;
            max-width: 100%;
        }
        select[name="date"] {
            max-width: 100%;
        }
    `;
    var styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Remove comic link
    var cbEl = document.getElementById('comic_body');
    var comicA = cbEl.getElementsByTagName('a').item(0);
    comicA.replaceWith(...comicA.childNodes);

    // Add alt text
    var comicImg = cbEl.getElementsByClassName('comic').item(0);
    var altText = comicImg.getAttribute('title');
    if (!altText.trim().length) {
        altText = '[no alt text]';
    }
    var altTextEl = document.createElement('div');
    altTextEl.id = 'alt-text';
    var altTextNode = document.createTextNode(altText);
    altTextEl.appendChild(altTextNode);
    var dateSpanEl = document.querySelector('#comic_navigation .date');
    dateSpanEl.append(altTextEl);

})();