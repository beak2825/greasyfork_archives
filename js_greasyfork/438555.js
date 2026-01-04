// ==UserScript==
// @name         UploadHavenDownloadTimeSkiper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Skips the download time of UploadHeaven
// @author       Franko3376
// @match        https://uploadhaven.com/download/*
// @icon         https://www.google.com/s2/favicons?domain=uploadhaven.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438555/UploadHavenDownloadTimeSkiper.user.js
// @updateURL https://update.greasyfork.org/scripts/438555/UploadHavenDownloadTimeSkiper.meta.js
// ==/UserScript==
var buttonN = '<button class="btn btn-submit-free" type="submit" name="type" value="free" id="submitFree">Free Download</button>';
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
var buttonX = null;
while(buttonX == null){
  buttonX = document.getElementById('submitFree')
}
buttonX.outerHTML = buttonN;