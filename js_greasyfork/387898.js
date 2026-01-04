// ==UserScript==
// @name         Always Show Product Images on Hapert
// @namespace    https://hapert.com/
// @version      0.2
// @description  Always show the product images, that are usually only shown on mouse hover
// @author       Mario Kahlhofer
// @match        https://hapert.com/bestelling_*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387898/Always%20Show%20Product%20Images%20on%20Hapert.user.js
// @updateURL https://update.greasyfork.org/scripts/387898/Always%20Show%20Product%20Images%20on%20Hapert.meta.js
// ==/UserScript==

// hapert.com has jQuery already installed, thus we do not need it
(function() {
    'use strict';

    // each <img> tag holds the image information in the "onmouseover" attribute
    // we extract that and directly set the src attribute to make the images visible
    $("div.content td img").each(function() {
        let url = $(this).attr("onmouseover").split("src=")[1].replace(/'/g, "");
        $(this).attr("src", url);

        $(this).removeAttr("onmouseout");
        $(this).removeAttr("onmouseover");
    });
})();