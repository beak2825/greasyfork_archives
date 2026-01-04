// ==UserScript==
// @name        Bandcamp mp3s direct downloader
// @description Show direct download link for the preview files on bandcamp albums
// @include     https://*.bandcamp.com/*
// @grant       none
// @version 0.0.1.20171111104401
// @namespace https://greasyfork.org/users/2290
// @downloadURL https://update.greasyfork.org/scripts/35036/Bandcamp%20mp3s%20direct%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/35036/Bandcamp%20mp3s%20direct%20downloader.meta.js
// ==/UserScript==



    // Insert links into track list
    window.setTimeout(function() {
      if(TralbumData && TralbumData.hasAudio && !TralbumData.freeDownloadPage && TralbumData.trackinfo) {
        var i = 0;
        var hoverdiv = document.querySelectorAll(".download-col div");
        TralbumData.trackinfo.forEach(function(t) {
          for (var prop in t.file) {
            var mp3 = t.file[prop].replace(/^\/\//,"http://");
            var a = document.createElement("a");
            a.href = mp3;
            a.target = "_blank"; // Listen to another window
            a.download = "mp3-128k.mp3"; // Force the download
            a.appendChild(document.createTextNode(prop));
            hoverdiv[i++].appendChild(a);
            break;
          }
        });
      }
    },200);