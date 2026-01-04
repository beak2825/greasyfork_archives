// ==UserScript==
// @name         Drive PDF Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables downloading view-only PDF files from Google Drive.
// @author       Irushia
// @license      MIT
// @match        *://drive.google.com/drive/*
// @match        *://drive.google.com/file/d/*/view
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/518434/Drive%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/518434/Drive%20PDF%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Register a new menu command
    GM_registerMenuCommand('Download', function() {
        let jspdf = document.createElement("script");
        jspdf.onload = function () {
            let pdf = new jsPDF();
            let elements = document.getElementsByTagName("img");
            for ( let i in elements) {
                let img = elements[i];
                if (!/^blob:/.test(img.src)) {
                    continue ;
                }
                let canvasElement = document.createElement('canvas');
                let con = canvasElement.getContext("2d");
                canvasElement.width = img.width;
                canvasElement.height = img.height;
                con.drawImage(img, 0, 0,img.width, img.height);
                let imgData = canvasElement.toDataURL("image/jpeg" , 1.0);
                pdf.addImage(imgData, 'JPEG' , 0, 0);
                pdf.addPage();
            }
            pdf.save( "download.pdf" );
        };
        jspdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js' ;
        document.body.appendChild(jspdf);

    });
})();