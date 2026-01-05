// ==UserScript==
// @name        Disable Digital Digest Software Download Manager
// @namespace   DisableDigitalDigestSoftwareDownloadManager
// @description Disable Digital Digest Software Download Manager so that clicking the software download link downloads the actual software file instead of Digital Digest's Download Manager.
// @author      jcunews
// @include     *://downloads.dddwnld.com/software/download.php*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28714/Disable%20Digital%20Digest%20Software%20Download%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/28714/Disable%20Digital%20Digest%20Software%20Download%20Manager.meta.js
// ==/UserScript==

(function() {
  var hereLink = document.querySelector(".disclaimer a");
  var dlLink = document.querySelector(".download_link");
  if (!(hereLink && dlLink)) return;
  dlLink.href = hereLink.href;
  hereLink.parentNode.innerHTML='<style>\
.disclaimer,.disclaimer~br{display:none}\
.download_link{display:inline-block;border-radius:15px;background-color:#0b0;padding:0 15px 15px;color:#fff;text-decoration:none}\
.download_link div{color:#000;font-size:8pt}\
</style>';
  dlLink.innerHTML='<h2>Download</h2><div>Download Manager Disabled</div>';
})();
