// ==UserScript==
// @name       newenglandmoves.com Housing Search Helper
// @namespace  harry
// @version    0.1.2
// @description  stuff to make browsing houses easier, show all full size images at the bottom of the page
// @match      http://www.newenglandmoves.com/property/details*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @copyright  2014+, You
// @downloadURL https://update.greasyfork.org/scripts/2934/newenglandmovescom%20Housing%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/2934/newenglandmovescom%20Housing%20Search%20Helper.meta.js
// ==/UserScript==

$(document).ready(function() {
    var imgs = '';
    NRT.Controls.PhotoViewer.data.forEach(function(one) {
        var ind = one.src.indexOf('&');
        if (ind > 0) {
            imgs += '<img src="'+one.src.substring(0, ind)+'" style="margin:20px;"/>';
        }
    });
    $('body').append($('<div style="text-align: center; background-color: #fff;">'+imgs+'</div>'));
});