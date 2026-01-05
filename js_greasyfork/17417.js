// ==UserScript==
// @name         Get CSV of linked in group members
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Gets a CSV file of basic linked in group memebers info.
// @author       MM
// @match        https://www.linkedin.com/groups/*/members
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/17417/Get%20CSV%20of%20linked%20in%20group%20members.user.js
// @updateURL https://update.greasyfork.org/scripts/17417/Get%20CSV%20of%20linked%20in%20group%20members.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
$('<button id="tampermonkey-get-csv">Get CSV</button>').insertAfter(".banner-logo-container");
// Your code here...
$("#tampermonkey-get-csv").click(function () {
list = "";
$( ".entity-info" ).each(function( index ) {
    var org='', title='';
    var info = $(this).children(".entity-headline").text().split(/,| at |@/);
    if (info.length > 0)
        org = info[0].replace(/”|,/gm, "");
    if (info.length > 1)
        title = info[1].replace(/”|,/gm, "");
    list = list+($(this).children(".entity-name").text()) + ',' + org + ',' + title + ',' + $(this).parent().attr("href").split('&')[0] + '\r\n';
});
    
       var blob = new Blob([list], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "memeber_list.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
});