// ==UserScript==
// @name         Thieme eRef Ripper
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Download all PDF from an eBook
// @author       You
// @include      https://eref.thieme.de/ebooks/*
// @include      */ebooks/*
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.js
// @require      https://unpkg.com/notiflix@2.1.3/dist/AIO/notiflix-aio-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/393734/Thieme%20eRef%20Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/393734/Thieme%20eRef%20Ripper.meta.js
// ==/UserScript==

(function() {
    'use strict';

var pdfs = [];
let name = document.getElementsByClassName("ct-ebook")[0].parentNode.textContent;
var indx = 0;

    document.arrive(".toc-tree", function() {
    // 'this' refers to the newly created element
        let downAllLi = document.createElement("li");
let downAll = document.createElement("input");
downAll.type = 'button';
downAll.value = "Download All";
downAll.addEventListener('click', function() {
    var elements = document.getElementsByClassName("tocPdfContainer");
    indx = 0;
    pdfs = [];
    for (var ie = 0; ie < elements.length; ie++) {

        if (elements[ie].getAttribute("data-pdf-link").indexOf(".pdf") !== -1) {
					indx++;

          pdfs.push({ download: getBaseUrl() + elements[ie].getAttribute("data-pdf-link"), filename: indx + "_" + name + ".pdf"});

        };



    };

 download_files(pdfs);
 
}, false);

        //append to document
downAllLi.appendChild(downAll);
this.insertBefore(downAllLi, this.firstChild);

});



function download_files(files) {

    var i = 0;

    let interval = setInterval(function () {
        if (i<files.length) {
            GM_download(files[i].download, name+ "/" + files[i].filename);
            i++;
        } else {
            clearInterval(interval);
            Notiflix.Loading.Remove();
           // You also can get your parameters as a Variable declared before. (The values have to be in String format)
            Notiflix.Report.Success( 'Success', "All downloaded to /Downloads/"+name+" folder.", 'OK' );
        }
    }, 500);

    Notiflix.Loading.Hourglass("Downloading "+files.length+" files");
}

    function getBaseUrl() {
            let url = String(window.location);
            return url.substring(0,url.indexOf("/ebooks"));
    }



})();