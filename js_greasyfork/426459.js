// ==UserScript==
// @name         Utar Pastyear Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple script for Utar students to download all past year papers by one-click
// @author       LX-See
// @match        http://portal.utar.edu.my/stuIntranet/examination/pastPaper/pastPaperSearch.jsp
// @match        http://portal.utar.edu.my/stuIntranet/examination/pastPaper/downloadFile.jsp
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @resource     http://cdn.bootcss.com/bootstrap/3.3.0/js/bootstrap.min.js
// @require      http://code.jquery.com/jquery-1.11.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/426459/Utar%20Pastyear%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/426459/Utar%20Pastyear%20Downloader.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */


(function() {
    'use strict';
    //$("head").append($(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css">`));

    // Your code here...

    var courseCode = document.getElementsByName("reqKey");
    var cCode = courseCode[0].value;
    //alert(cCode);

    if(!(Object.keys(cCode).length === 0)){
        downloadAllPapers(cCode);
    }

})();

function downloadAllPapers(cCode){
    //Download all pastyear papers according to the course code

    var files = $(".tblblue a:not('a:first')");
    if(files.size()==0)return;

    //Confirm download all or not
    var con = confirm("Confirm to download all " + files.size() + " papers?");
    if(con==true){
        for (var i=0;i<files.size();i++){
            $(files[i]).trigger("click");
            window.close();
        }
    }

}

