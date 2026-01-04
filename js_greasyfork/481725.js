// ==UserScript==
// @name     Pastebin Copy/Decode Base64/Close
// @description         Decodes Base64 text in a raw pastebin then it copies the text and lastly closes the tab.
// @match    https://pastebin.com/raw/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_setClipboard
// @version 0.0.1.20231208184620
// @namespace https://greasyfork.org/users/1105828
// @downloadURL https://update.greasyfork.org/scripts/481725/Pastebin%20CopyDecode%20Base64Close.user.js
// @updateURL https://update.greasyfork.org/scripts/481725/Pastebin%20CopyDecode%20Base64Close.meta.js
// ==/UserScript==

function decodeBase64(encodedText) {
  return atob(encodedText);
}

$(document).ready(function () {
  var preElement = $("pre");

  if (preElement.length > 0) {
    var encodedText = preElement.text().trim();

    var decodedLines = encodedText.split('\n').map(function (line) {
      return decodeBase64(line);
    });

    var decodedText = decodedLines.join('\n');

    console.log("Decoded and copied to clipboard: ", decodedText);
    GM_setClipboard(decodedText);

    window.open('', '_self', '');
    window.close();
  } else {
    console.log("No <pre> element found on the page.");
  }
});
