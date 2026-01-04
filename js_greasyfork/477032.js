// ==UserScript==
// @name        Disable ad blocking and download PDF automatically
// @version     0.1
// @description    Automatically disables ad blocking and downloads the PDF file from the website https://doceru.com/doc/
// @author       Bard
// @match       https://doceru.com/doc/
// @namespace https://greasyfork.org/users/1171795
// @downloadURL https://update.greasyfork.org/scripts/477032/Disable%20ad%20blocking%20and%20download%20PDF%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/477032/Disable%20ad%20blocking%20and%20download%20PDF%20automatically.meta.js
// ==/UserScript==

(function() {
  // Disable ad blocking
  document.querySelector("header#nex1sccv > div:nth-child(5) > div:nth-child(1) > div > section:nth-child(3) > div:nth-child(4)").style.display = "none";

  // Click the download button
  document.querySelector("#dwn_btn").click();
})();
