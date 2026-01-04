// ==UserScript==
// @name         Steam - Wider Content
// @namespace    https://store.steampowered.com
// @version      0.2
// @description  Makes the Steam app pages wider, meaning you can actually see the video player contents without having to make it full screen!
// @license      MIT
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?domain=steampowered.com
// @grant        none
// @require https://greasyfork.org/scripts/35370-add-css/code/Add_CSS.js?version=598682
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/435053/Steam%20-%20Wider%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/435053/Steam%20-%20Wider%20Content.meta.js
// ==/UserScript==

(function() {
    'use strict';
    AddCss (`
        .page_content, .queue_ctn, div#store_header .content, div#global_header .content {
            width: 80% !important;
        }
        .leftcol, .review_box .rightcol {
            width: 70% !important;
        }
        .rightcol, .review_box .leftcol {
            width: 25% !important;
        }
        .apphub_HomeHeaderContent {
            max-width: none;
        }
    `);
})();