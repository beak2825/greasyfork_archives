// ==UserScript==
// @version 6.7.3.9
// @name Source Viewer
// @name:de Seitenquelltext anzeigen
// @description View the HTML source code of any online web page. (use the Tampermonkey Command Menu)
// @description:de Schauen Sie sich den Seitenquelltext von jeder beliebigen Website an.
// @author JAS1998
// @copyright 2019+ , JAS1998 (https://greasyfork.org/users/4792)
// @namespace https://greasyfork.org/users/4792
// @supportURL https://greasyfork.org/scripts/4611/feedback
// @license CC BY-NC-ND 4.0; http://creativecommons.org/licenses/by-nc-nd/4.0/
// @noframes
// @compatible Chrome tested with Tampermonkey
// @contributionURL https://www.paypal.com/donate?hosted_button_id=9JEGCDFJJHWU8
// @contributionAmount €1.00
// @grant GM_registerMenuCommand
// @grant GM_notification
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/4611/Source%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/4611/Source%20Viewer.meta.js
// ==/UserScript==
 
/* jshint esversion: 9 */
 
GM_registerMenuCommand("Donate now 🎁", function () {
alert("Hello, I'm JAS1998\nand i wrote this script as a hobby\nYou have been using this script for some time, if you find it useful, i would appreciate a small donation! =)");
    window.location="https://www.paypal.com/donate?hosted_button_id=9JEGCDFJJHWU8";
    });
 
GM_registerMenuCommand("view-source:" + window.location, function () {
  if (GM_info.script.copyright.includes(GM_info.script.namespace)) {
      var source = "<html>";
      source += document.getElementsByTagName('html')[0].innerHTML;
      source += "</html>";
      source = source.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      source = "<pre>" + source + "</pre>";
      var sourceWindow = window.open();
      sourceWindow.document.write(source);
      sourceWindow.document.close();
      if (window.focus) sourceWindow.focus();
    }
  else {
    alert("Please install the Orginal Version");
    location.href = GM_info.script.supportURL.replace("feedback", "");
  }
});
// ==============