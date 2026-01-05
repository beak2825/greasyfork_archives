// ==UserScript==
// @name       Auto Save Pic Urls
// @namespace  https://greasyfork.org/en/users/13772-endorakai
// @version    0.04b
// @description  Automagically Save Urls Of Pictures
// @include      *.jpg
// @exclude      
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/23904/Auto%20Save%20Pic%20Urls.user.js
// @updateURL https://update.greasyfork.org/scripts/23904/Auto%20Save%20Pic%20Urls.meta.js
// ==/UserScript==

//Will Increase List As Needed - See Additional Info At Namespace!!!

 function saveImageAs (imgOrURL) {
    if (typeof imgOrURL == 'object')
      imgOrURL = imgOrURL.src;
    window.win = open (imgOrURL);
    setTimeout('win.document.execCommand("SaveAs")', 500);
  }
