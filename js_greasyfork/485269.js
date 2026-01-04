// ==UserScript==
// @name       	Automatic Jango Downloader
// @author      Finomosec
// @namespace  	http://meinebasis.de/
// @description Automatically download all songs played in jango.com while listening.
// @version    	1.3
// @grant       GM.xmlHttpRequest
// @match       https://www.jango.com/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/485269/Automatic%20Jango%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/485269/Automatic%20Jango%20Downloader.meta.js
// ==/UserScript==

const storagePrefix = "D:";

var originalAudio = window.Audio;
unsafeWindow.Audio = exportFunction(function() {
  var audioElement = new originalAudio();
  audioElement.addEventListener('loadeddata', function() {
    var url = audioElement.src;
    if (url.indexOf(".jango.com/") == -1) {
      return;
    }

    var fileName = url.substring(url.lastIndexOf("/") + 1);
    var fileSuffix = url.substring(url.lastIndexOf("."));
    var niceFileName = unsafeWindow.document.title.replace(": ", " - ").replace(" - Jango", "").replace("&amp;", "&") + fileSuffix;

    if (localStorage.getItem(storagePrefix + fileName)) {
      // console.info('Already downloaded:', niceFileName);
      return;
    }

    // console.info('Downloading:', niceFileName);
    GM.xmlHttpRequest({
      method: "GET",
      url: url,
      responseType: 'arraybuffer',
      onload: function(response) {
        var blob = new Blob([response.response], {type: "audio/" + fileSuffix.substring(1)});
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = niceFileName;
        link.click();
        localStorage.setItem(storagePrefix + fileName, "1");
      }
    });
  });
  return audioElement;
}, unsafeWindow);
