// ==UserScript==
// @name       KAT home page + search customizer
// @namespace  https://kickass.to/usearch/iron%20man%203/
// @version    0.1
// @description  color codes the file sizes for table lists of results
// @match      https://kickass.to/usearch/*
// @include    https://kickass.to/
// @copyright  2012+, You
// @require	   http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/3669/KAT%20home%20page%20%2B%20search%20customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/3669/KAT%20home%20page%20%2B%20search%20customizer.meta.js
// ==/UserScript==

$('td.nobr.center').each(function() { 
    $(this).html($(this).html().replace(/([\d\.]+).<span>GB<\/span>/, "<span style='color:green !important;font-weight:bold;'>$1 GB</span>"));
    $(this).html($(this).html().replace(/([\d\.]+).<span>MB<\/span>/, "<span style='color:rgb(194, 132, 0) !important;font-weight:bold;'>$1 MB</span>"));
    $(this).html($(this).html().replace(/([\d\.]+).<span>KB<\/span>/, "<span style='color:rgb(34, 122, 255) !important;font-weight:bold;'>$1 KB</span>"));
});
