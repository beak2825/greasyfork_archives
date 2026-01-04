// ==UserScript==
// @name       Upload and Read EPUB Files
// @namespace  your-unique-namespace-here
// @version    0.1
// @description This script will upload and read EPUB files.
// @license    MIT
// @author      Bard
// @match       *
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/463537/Upload%20and%20Read%20EPUB%20Files.user.js
// @updateURL https://update.greasyfork.org/scripts/463537/Upload%20and%20Read%20EPUB%20Files.meta.js
// ==/UserScript==

(function() {
  // Get the current page's URL.
  var url = document.location.href;

  // Check if the current page is a valid EPUB file.
  if (!/\.epub$/i.test(url)) {
    return;
  }

  // Create a new XMLHttpRequest object.
  var xhr = new XMLHttpRequest();

  // Set the request method to "GET".
  xhr.open("GET", url, true);

  // Send the request.
  xhr.send();

  // Handle the response.
  xhr.onload = function() {
    if (xhr.status === 200) {
      // The request was successful.
      var reader = new window.FileReader();

      // Read the file into memory.
      reader.onload = function(event) {
        var content = event.target.result;

        // Create a new EPUB reader.
        var epubReader = new window.EPubReader();

        // Read the EPUB file.
        epubReader.read(content);
      };

      // Read the file.
      reader.readAsArrayBuffer(xhr.response);
    } else {
      // The request failed.
      console.log("Request failed: " + xhr.status);
    }
  };
})();
