// ==UserScript==
// @name        BlueCat Address Manager Highlight Rows on Hover
// @namespace   *
// @description Highlight the respective table row while hovering over it in BlueCat Address Manager
// @include     */app*
// @version     2
// @grant       none
// @author      Marius Galm
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/40274/BlueCat%20Address%20Manager%20Highlight%20Rows%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/40274/BlueCat%20Address%20Manager%20Highlight%20Rows%20on%20Hover.meta.js
// ==/UserScript==

//jQuery fix - is now broken or not necessary any more
//this.$ = this.jQuery = jQuery.noConflict(true);

$("#outerTable tr").not(':first').hover(
    function () {
        $(this).css("border","solid thin");
        $(this).css("border-color","#9FB5C5");

    },
    function () {
        $(this).css("border-color","");
        $(this).css("border","");

    }
);