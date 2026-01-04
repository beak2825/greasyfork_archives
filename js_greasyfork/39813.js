// ==UserScript==
// @name         HTML5 Video Frame Screenshot
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.5
// @license      GNU AGPLv3
// @description  Adds ability to take a screenshot from the current frame of a HTML5 video element and be saved to a file named "video_frame.jpg" or "video_frame.png" (image format is configurable). This script is intended to be used as a bookmarklet using this URL: javascript:hvfs_ujs()
// @author       jcunews
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39813/HTML5%20Video%20Frame%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/39813/HTML5%20Video%20Frame%20Screenshot.meta.js
// ==/UserScript==

(function() {

  //=== CONFIGURATION BEGIN ===
  var imageFormat = "jpeg"; //can be one of these: jpeg, png
  //=== CONFIGURATION END ===

  window.hvfs_ujs = function(ele, cv) {
    if (ele = document.querySelector("video")) {
      cv = document.createElement("CANVAS");
      if (cv.width = ele.videoWidth) {
        cv.height = ele.videoHeight;
        cv.getContext("2d").drawImage(ele, 0, 0);
        ele = document.createElement("A");
        ele.href = cv.toDataURL("image/" + imageFormat);
        ele.download = "video_frame." + (imageFormat === "jpeg" ? "jpg" : imageFormat);
        ele.style.visibility = "hidden";
        document.body.appendChild(ele).click();
        ele.remove();
        return;
      } else {
        alert("The HTML5 video media has not been loaded yet.");
      }
    } else {
      alert("There is no HTML5 video on this page.");
    }
  };

})();
