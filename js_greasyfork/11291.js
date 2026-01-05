// ==UserScript==
// @name         terakeet Find email
// @namespace    http://greasyfork.org/en/users/9054
// @version      0.1
// @description  enter something useful
// @author       ikarma
// @include      https://www.mturk.com/*
// @require     http://code.jquery.com/jquery-2.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11291/terakeet%20Find%20email.user.js
// @updateURL https://update.greasyfork.org/scripts/11291/terakeet%20Find%20email.meta.js
// ==/UserScript==

 if ( $("p:contains('Find the Primary Contact Name and Email Address')").length ) 
 {
var urlOnPage = $("a:contains('http')");
var urlText = urlOnPage.text().replace('http://', '');
var urlTextField = window.document.getElementById("Answer_2_FreeText");
var googleUrl = 'https://www.google.com/search?q=email ' + urlText.replace('www.', '');
window.open(googleUrl, "name", 'left=1200, scrollbars = yes');
window.addEventListener("message", urlListener, false);

 }

function urlListener(l) {urlTextField.value = l.data.A;}

$(window).mouseup
(
  function(e) 
  {       
    window.opener.postMessage({A: getSelection().toString()},'*');
  }
);
 




