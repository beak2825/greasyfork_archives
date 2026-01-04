// ==UserScript==
// @name         igg-games/bluemediafiles auto continue after wait
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.7.1
// @description  skips the waiting time on igg-games/bluemediafiles and continues to the download page
// @author       Alistair1231
// @match        http*://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425739/igg-gamesbluemediafiles%20auto%20continue%20after%20wait.user.js
// @updateURL https://update.greasyfork.org/scripts/425739/igg-gamesbluemediafiles%20auto%20continue%20after%20wait.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/425739-igg-games-bluemediafiles-auto-continue-after-wait
// https://openuserjs.org/scripts/Alistair1231/igg-gamesbluemediafiles_auto_continue_after_wait/
// https://github.com/Alistair1231/my-userscripts/raw/master/iggAutoContinue.user.js

(function () {
  "use strict";
  if (window.location.href.match(/.*bluemedia.*url-generator-?\d+?.php/)) {
    const getCode = () => {
      var scripts = document.getElementsByTagName("script");

      // Regex to match the function call
      var regex = /Goroi_n_Create_Button\("([^"]+)"\)/;

      // Loop through all script tags
      for (var i = 0; i < scripts.length; i++) {
        var scriptContent = scripts[i].textContent;

        // Check if the script contains the function call
        var matches = regex.exec(scriptContent);
        if (matches) {
          // Found the argument, do something with it
          console.log("Extracted d_roi:", matches[1]);
          return matches[1];
          break;
        }
      }
      return -1;
    };

    const decodeCode = (d_roi) => {
      var KQ_URL_DOWNLOAD_LINK_DA_ENCRYPT_Lan_2 = "";
      for (i = d_roi.length / 0x2 - 0x5; i >= 0x0; i = i - 0x2) {
        KQ_URL_DOWNLOAD_LINK_DA_ENCRYPT_Lan_2 += d_roi[i];
      }
      for (i = d_roi.length / 0x2 + 0x4; i < d_roi.length; i = i + 0x2) {
        KQ_URL_DOWNLOAD_LINK_DA_ENCRYPT_Lan_2 += d_roi[i];
      }
      return KQ_URL_DOWNLOAD_LINK_DA_ENCRYPT_Lan_2;
    };

    var decodedCode = decodeCode(getCode());
    console.log(`decoded: ${decodedCode}`);
    window.location = "/get-url.php?url=" + decodedCode;
    
    
    //   old logic
    // // waiting for countown
    // var clickButton;
    // var count = 0;
    // var interval = setInterval(() => {
    //     clickButton = document.getElementById("nut");
    //     count++;
    //     console.log("Waited " + count + " seconds");
    //     if (clickButton.src !== "") {
    //         //clicking
    //         clickButton.parentElement.submit();
    //         clearInterval(interval);
    //     }
    // }, 1000);
  }
})();
