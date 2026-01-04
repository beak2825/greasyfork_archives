// ==UserScript==
// @name     Yad2 hide realtors/ads
// @include  https://*.yad2.co.il/*
// @grant    GM_addStyle
// @description Hide annoying rows
// @run-at   document-start
// @version 0.0.1.20230919094359
// @namespace https://greasyfork.org/users/838639
// @downloadURL https://update.greasyfork.org/scripts/472358/Yad2%20hide%20realtorsads.user.js
// @updateURL https://update.greasyfork.org/scripts/472358/Yad2%20hide%20realtorsads.meta.js
// ==/UserScript==

GM_addStyle ( `
    .feeditem:has(.merchant_name) {
        background: red;
        display: none;
    }
    .feeditem:has(.project_name) {
        background: red;
        display: none;
    }
    .dfp_v2:has(.dfp-slot-container) {
        background: red;
        display: none;
    }
    .top_boxes_row:has(.dfp-slot-container) {
        background: red;
        display: none;
    }
    .plasma_row:has(.dfp-slot-container) {
        background: red;
        display: none;
    }
    .yad1_row:has(.ribbon) {
        background: red;
        display: none;
    }
    .neighborhood_survey {
        background: red;
        display: none;
    }
    .widget-floating {
        background: red;
        display: none;
    }
    .dominant_realtor {
        background: red;
        display: none;
    }
    .dfp-placeholder-stickyfooter {
        background: red;
        display: none;
    }
    .dfp-toaster {
        background: red;
        display: none;
    }

` );
