// ==UserScript==
// @name         Open BBO hand movies in multiple tabs
// @namespace    https://github.com/kiat-huang
// @version      0.1
// @description  BBO returns a list of hands as Movies or LIN download - this button opens all Movies up in tabs at once so you can play through, then close moving on smoothly to the next one
// @author       Kiat Huang
// @license      https://spdx.org/licenses/GPL-3.0-or-later.html
// @match        *://www.bridgebase.com/myhands/hands.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/388214/Open%20BBO%20hand%20movies%20in%20multiple%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/388214/Open%20BBO%20hand%20movies%20in%20multiple%20tabs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert('Click the button to open all Movies in separate tabs');

    // create button
    var mybutton = document.createElement("button");
    mybutton.setAttribute("id", "mymovie");
    mybutton.innerHTML = "Open all Movies each in their own tab";

    // append button to the bottom of the page
    var mybody = document.getElementsByTagName("body")[0];
    mybody.appendChild(mybutton);

    // create an array of all the elements in the movie class
    var hrefs = new Array();
    var elements = $('.movie > a');
    elements.each(function() {
        var url = $(this).attr('href');
        // there are two URL, just open the handviewer ones and not the LIN as well which get downloaded as files
        if ( /handviewer/.test(url)) {
            hrefs.push(url);
        }
    });

    // when the button is clicked upon up all the movies in separate tabs
    $('#mymovie').click(function(){
        $.each(hrefs, function(index, value) {
            setTimeout(function(){
                var myWindow = window.open(value, '_blank');
            },1000);
        });
    });
})();