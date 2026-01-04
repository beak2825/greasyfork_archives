// ==UserScript==
// @name         Slider Revolution - put preview button in thumbnail for templates
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Slider Revolution - put preview button in thumbnail for templates in admin area
// @author       Benedict Harris
// @include      /.*\/wp-admin\/admin\.php\?page=revslider.*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/461269/Slider%20Revolution%20-%20put%20preview%20button%20in%20thumbnail%20for%20templates.user.js
// @updateURL https://update.greasyfork.org/scripts/461269/Slider%20Revolution%20-%20put%20preview%20button%20in%20thumbnail%20for%20templates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...








        jQuery(".rsle_tool.previewslider").each(function() {
        jQuery(this).closest(".rsle_tbar")
        .nextAll(".rsle_move_and_edit:first").append(jQuery(this)) //can use prepend if needed first child.
        });




})();