// ==UserScript==
// @version 1.0.0.7
// @name Backlinks
// @name:de Rückverweise
// @description A backlink for a given web resource is a link from some other website (the referrer) to that web resource (the referent). A web resource may be (for example) a website, web page, or web directory.
// @description:de Ein Rückverweis oder Backlink bezeichnet einen Link, der von einer anderen Webseite ausgehend zu einer bestimmten Webseite führt. In vielen Suchmaschinen wird die Anzahl und Beschaffenheit der Rückverweise als Maß für die Linkpopularität oder Wichtigkeit einer Webseite verwendet.
// @author JAS1998
// @copyright 2021+ , JAS1998 (https://greasyfork.org/users/4792)
// @namespace https://greasyfork.org/users/4792
// @supportURL https://greasyfork.org/scripts/423644/feedback
// @license CC BY-NC-ND 4.0; http://creativecommons.org/licenses/by-nc-nd/4.0/
// @noframes
// @compatible Chrome tested with Tampermonkey
// @contributionURL https://www.paypal.com/donate?hosted_button_id=9JEGCDFJJHWU8
// @contributionAmount €1.00
// @grant GM_registerMenuCommand
// @grant GM_notification
// @grant GM_xmlhttpRequest
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/423644/Backlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/423644/Backlinks.meta.js
// ==/UserScript==
 
/* jshint esversion: 9 */
 
GM_registerMenuCommand("Check Backlinks", function () {
  if (!GM_info.script.copyright.includes(GM_info.script.namespace)) {
    alert("Please install the Orginal Version");
    location.href = GM_info.script.supportURL.replace("feedback", "");
    return;
  }
  
  var website = prompt("Please enter your Website:", document.URL);
  if (website == null) {
    alert("User cancelled the prompt.");
    return;
  }
  
  if (website == "") {
    alert("Input field must not be empty.");
    return;
  }
  
  var urlPattern = /^(http.?:\/\/|)\w*\.*[A-Z]*(\.\w*($|\/.*|\?)|\?.*|\d*|$)($|\:\d*($|\/|\?))/gim;
  if (!website.match(urlPattern)) {
    alert("Invalid URL");
    return;
  }
  
  var websitereplace = website.replace(/.*(\/\/|www.)/gim, '').split(/\/$/gim)[0];
  GM_xmlhttpRequest({
    method: "GET",
    url: 'https://www.google.com/search?q="' + websitereplace + '" -site:' + websitereplace,
    onload: function (response) {
      var popularity = response.responseText.split('<div id="result-stats">').pop().split('<nobr>')[0];
      alert(popularity);
    }
  });
});