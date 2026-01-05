// ==UserScript==
// @name       PirateBay Search Enhancer
// @namespace  http://thepiratebay.se
// @version    0.1
// @description  Color codes search results based on size
// @match      http://thepiratebay.se/search/*
// @copyright  2012+, You
// @require	   http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/3668/PirateBay%20Search%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/3668/PirateBay%20Search%20Enhancer.meta.js
// ==/UserScript==

var elements = $('.detDesc');
elements.each(function() { 
    // Uploaded 08-20 2013, Size 1.95 GiB, ULed by 

    $(this).html($(this).html().replace(/Size ([\d\.]+)\&nbsp\;GiB,/, "Size <span style='color:green !important;font-weight:bold;'>$1&nbsp;GiB</span>"));
    $(this).html($(this).html().replace(/Size ([\d\.]+)\&nbsp\;MiB,/, "Size <span style='color:rgb(194, 132, 0) !important;font-weight:bold;'>$1&nbsp;MiB</span>"));
    $(this).html($(this).html().replace(/Size ([\d\.]+)\&nbsp\;KiB,/, "Size <span style='color:rgb(34, 122, 255) !important;font-weight:bold;'>$1&nbsp;KiB</span>"));
});
