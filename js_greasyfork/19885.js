// ==UserScript==
// @name         asphr.de certificate download.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download perfectly named HR reports from sage portal.
// @author       TechnischNichtMoeglich
// @match        https://*.asphr.de/mportal/content/Mitarbeiterbereich/Stammdaten/Bescheinigungen.aspx
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/19885/asphrde%20certificate%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/19885/asphrde%20certificate%20download.meta.js
// ==/UserScript==


// Load report from given URL and save with given filename.
// Just providing a link with download attribute does not work
// since Content-Disposition http header overrules the proposed
// file name.
function DownloadReport(url, fname) {
    window.URL = window.URL || window.webkitURL;

    var xhr = new XMLHttpRequest(),
        a = document.createElement('a'), file;

    xhr.open('GET', '../../' + url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        file = new Blob([xhr.response], { type : 'application/octet-stream' });
        a.href = window.URL.createObjectURL(file);
        a.download = fname;  // Set to whatever file name you want
        // Now just click the link you created
        // Note that you may have to append the a element to the body somewhere
        // for this to work in Firefox
        a.click();
    };
    xhr.send();
}


unsafeWindow.DownloadReport = DownloadReport;

// Extract table data, compile an DownloadReport link, and inject it right next
// to the existing OpenReport image.
(function() {
    'use strict';
    var $url, $date, $name, $fname, $tds;
    var $trs = $( "tr[id ^= 'ctl00_cphContent_gridBescheinigungen_DXDataRow']" );
    $.each($trs, function() {
        $date = $(this).find("td:nth-child(2)").text().trim();
        $name = $(this).find("td:nth-child(1)").text().trim();
        $fname = $date + "_" + $name + ".pdf";
        $url = $(this).find("td:nth-child(4)").find("img").attr("onclick").replace("OpenReport('","").replace("');","");
        $(this).find("td:nth-child(4)").append('<a style="cursor: pointer" onclick="DownloadReport(\'' + $url + '\',\'' + $fname + '\');">SAVE</a>' );
    });
})();
