$('select>option:eq(1)').attr('selected', true);
$('textarea#tag6').val("No Issues");

// ==UserScript==
// @name       Helper Script
// @namespace  https://greasyfork.org/users/2388-anomous
// @version    0.2
// @description  DRTV-HLS Script
// @match      http://www.dr.dk/tv/se/*
// @match      http://www.dr.dk/tv-beta/se/*
// @require    http://code.jquery.com/jquery-latest.min.js
// @copyright  Anomous
// @downloadURL https://update.greasyfork.org/scripts/1959/Helper%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/1959/Helper%20Script.meta.js
// ==/UserScript==

$('ul').each(function () {
    $(this).remove();
});
$('h3').each(function () {
    $(this).remove();
});

var isLink = false;

$('p').each(function () {
    console.log($(this).text().indexOf("Website URL"));
    console.log(isLink);
    if ($(this).text().indexOf("Website URL") != -1)
        isLink = true;
    else if ($(this).text().indexOf("Website URL") == -1 && !isLink)
        $(this).remove();
});