// ==UserScript==
// @name        thiemeRIPP
// @namespace   thi
// @include     https://vpn.i-med.ac.at/*/ebooks/*
// @include     https://www.thieme-connect.de/*/ebooks/*
// @version     1
// @grant       none
// @description none
// @downloadURL https://update.greasyfork.org/scripts/34173/thiemeRIPP.user.js
// @updateURL https://update.greasyfork.org/scripts/34173/thiemeRIPP.meta.js
// ==/UserScript==

var pdfs = [];
var name = document.getElementsByClassName("productTitle")[0].textContent.replace(/\s/g, "");
if (document.getElementsByClassName("productTitle").length > 1) {
  name = document.getElementsByClassName("productTitle")[1].textContent.replace(/\s/g, "");
}
var indx = 0;
if (confirm('Download?') == true) {
    var elements = document.getElementsByTagName("a");
    indx = 0;
    for (var ie = 0; ie < elements.length; ie++) {
      
        if (elements[ie].href.indexOf(".pdf") !== -1) {
					indx++;
          
          pdfs.push({ download: elements[ie].href, filename: indx + "_" + name + ".pdf"});
         
        };
      
      
      
    };
  
 download_files(pdfs);

};

function download_files(files) {
  function download_next(i) {
    if (i >= files.length) {
      return;
    }
    var a = document.createElement('a');
    a.href = files[i].download;
    a.target = '_parent';
    // Use a.download if available, it prevents plugins from opening.
    if ('download' in a) {
      a.download = files[i].filename;
    };

    // Add a to the doc for click to work.
    (document.body || document.documentElement).appendChild(a);
    if (a.click) {
      a.click(); // The click method is supported by most browsers.
    } else {
      $(a).click(); // Backup using jquery
    }
    // Delete the temporary link.
    a.parentNode.removeChild(a);
    // Download the next file with a small timeout. The timeout is necessary
    // for IE, which will otherwise only download the first file.
    setTimeout(function() {
      download_next(i + 1);
    }, 1000);
  }
  // Initiate the first download.
  download_next(0);
}
