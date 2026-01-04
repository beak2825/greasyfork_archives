// ==UserScript==
// @name         dmv
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  DMV california test with shortcut in https://pass-dmv-test.com/
// @author       Enxing Xiong
// @match        https://pass-dmv-test.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pass-dmv-test.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478666/dmv.user.js
// @updateURL https://update.greasyfork.org/scripts/478666/dmv.meta.js
// ==/UserScript==

function takeScreenshot() {
    // Capture a screenshot of the entire webpage
    html2canvas(document.body).then(function(canvas) {
        // Convert the screenshot to a data URL
        var screenshotData = canvas.toDataURL('image/png');

        // Create a temporary link and trigger a download
        var a = document.createElement('a');

        // Modify the file name to replace slashes with underscores
        var url = window.location.href;
        var fileName = url.replace(/[/\\?*:|"<>]/g, '_') + '.png';

        a.href = screenshotData;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}
(function() {
    'use strict';
    var buttons = document.getElementsByClassName("btn btn-outline-primary");
    let prev = buttons[0]
    let next = buttons[2]
    let options = document.getElementsByClassName("form-check-input me-1")

    document.addEventListener('keydown', function(event) {
      // Check if the key pressed is 'A' (you can use any other key)
      if (event.key === 'n' || event.key === 'N') {
        prev.click();
      } else if (event.key === 'm' || event.key === 'M') {
        next.click();
      } else {

          switch (event.key) {
              case 'A':
              case 'a':
              case '1':
              case 'j':
                  options[0].click()
                  break;
              case 'B':
              case 'b':
              case '2':
              case 'k':
                  options[1].click()
                  break;
              case 'C':
              case 'c':
              case '3':
              case 'l':
                  options[2].click()
                  break;
              case 'D':
              case 'd':
              case '4':
              case ';':
                  options[3].click()
                  break;
              case 's':
                  takeScreenshot()

          }
      }

    });

})();