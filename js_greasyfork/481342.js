// ==UserScript==
// @name         Auto Remote Upload + ToS
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.1.2
// @description  Automatically selects remote URL upload, ticks the TOS box, focuses the input area and allows uploading by pressing Enter on file hosting sites often used on Mobilism
// @author       Abdurazaaq Mohammed
// @author       Abdurazaaq Mohammed
// @match        https://userupload.net/?op=upload_form
// @match        https://userupload.in/?op=upload_form
// @match        https://uploadrar.com/
// @match        https://devuploads.com/upload
// @match        https://dropgalaxy.vip/
// @match        https://dropgalaxy.co/
// @match        https://dropgalaxy.com/
// @match        https://dgdrive.xyz/
// @grant        none
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @license      The Unlicense
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/481342/Auto%20Remote%20Upload%20%2B%20ToS.user.js
// @updateURL https://update.greasyfork.org/scripts/481342/Auto%20Remote%20Upload%20%2B%20ToS.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var uploadButton = document.querySelector('.uploadbtn.btn-primary.btn');

  const url = window.location.href;
  const inputField = document.querySelector("textarea");
  setTimeout(function() { // Click on the input area
      if(inputField && document.activeElement !== inputField){
        inputField.focus();
      }
    }, 500);

  if (url.includes('dropgalaxy') || url.includes('dgdrive')) {
    document.querySelector("#tab-remote_upload > span").click();
  }
  else if (url.includes('userupload')) {
    document.querySelector("#select_url").click();
    document.querySelector(".custom-control-label").click();
  }
  else if(url.includes('devuploads')) {
    document.querySelector("#select_url").click();
  }
  else {
    const form = document.querySelector("#select_url");
    uploadButton = document.querySelector('#uploadurl > div.pull-right > button');
    const intervalId = setInterval(function() { //uploadrar refuses to work if you don't do this
      if(form) {
        form.click();
        clearInterval(intervalId);
      }
    }, 200);
  }

  document.addEventListener('keydown', function(e) {
    const key = e.key;
    if (key == "Shift") uploadButton.click();
    // You can add more keys or change them as you want. The documentation for key values can be found here: https://developer.mozilla.org/en-US/docs/web/api/ui_events/keyboard_event_key_values
  });

})();