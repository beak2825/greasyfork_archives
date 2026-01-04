// ==UserScript==
// @name         mangadex delayed chapter auto redirect to group site
// @namespace    https://greasyfork.org/en/users/158832
// @version      0.1
// @description  try to make your life easier!
// @author       Riztard
// @match        http*://mangadex.org/chapter/*
// @license    MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390854/mangadex%20delayed%20chapter%20auto%20redirect%20to%20group%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/390854/mangadex%20delayed%20chapter%20auto%20redirect%20to%20group%20site.meta.js
// ==/UserScript==

(function () {

  window.location.href = document.getElementsByClassName("alert-info")[0].getElementsByTagName("a")[0].getAttribute("href");
  
})();
