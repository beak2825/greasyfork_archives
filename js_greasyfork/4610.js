// ==UserScript==
// @version 4.0.4.6
// @name Translator
// @name:de Übersetzer
// @description Press (F2) to Translate.
// @description:de Drücken Sie (F2) zum übersetzen.
// @author JAS1998
// @copyright 2019+ , JAS1998 (https://greasyfork.org/users/4792)
// @namespace https://greasyfork.org/users/4792
// @icon https://translate.google.com/favicon.ico
// @supportURL https://greasyfork.org/scripts/4610/feedback
// @license CC BY-NC-ND 4.0; http://creativecommons.org/licenses/by-nc-nd/4.0/
// @noframes
// @compatible Chrome tested with Tampermonkey
// @contributionURL https://www.paypal.com/donate?hosted_button_id=9JEGCDFJJHWU8
// @contributionAmount €1.00
// @grant GM_notification
// @match *://*/*
// @exclude /^[a-z]{4}.*\/greasyfork\.org\/.*\/4610.*$
// @exclude https://luna.amazon*
// @downloadURL https://update.greasyfork.org/scripts/4610/Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/4610/Translator.meta.js
// ==/UserScript==
 
/* jshint esversion: 9 */
 
document.onkeydown = openPage;
 
function openPage(F2) {
  if (GM_info.script.copyright.includes(GM_info.script.namespace)) {
    F2 = window.event ? event : F2;
    if (F2.keyCode == 113) {
        location.href = "http://translate.google.com/translate?sl=auto&u=" + window.location;
        GM_notification({
          title: GM_info.script.name,
          text: "Post a review, comment, or question",
          timeout: "10000",
          onclick: function () {
            location.href = GM_info.script.supportURL;
          },
        });
      }
    }
  else {
    location.href = GM_info.script.supportURL.replace("feedback", "");
    alert("Please install the Orginal Version");
  }
}
 
if (window.location.host.includes('translate.google')) {
  console.log("Post a review, comment, or question\n" + GM_info.script.supportURL + "\n\nCopyright " + GM_info.script.copyright);
}
// ==============