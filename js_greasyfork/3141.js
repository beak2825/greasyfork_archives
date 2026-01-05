// ==UserScript==
// @name        Runbox Email Link Fixer
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @include     https://runbox.com/mail/compose*
// @version     0.1
// @copyright   Copyright 2014 Jefferson Scher
// @license     BSD 3-clause
// @description Update Runbox new message with mailto and Email Link parameters (8 July 2014)
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/3141/Runbox%20Email%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/3141/Runbox%20Email%20Link%20Fixer.meta.js
// ==/UserScript==

/*
Important: You first need to set up RunBox to receive email links before this script will do anything.

First open up your mailbox on runbox.com.

(1) Below your inbox, open Firefox's Web Console using any of these:

* Windows: Ctrl+Shift+k or Mac: Command+Alt+k
* "3-bar" menu button > Developer > Web Console
* Tools menu > Web Developer > Web Console:

The Web Console usually appears across the bottom part of the tab.

(2) Type or paste the following next to the caret (>>):

navigator.registerProtocolHandler('mailto','https://runbox.com/mail/compose?%s','Runbox Link');

Then press the Enter or Return key to execute it.

An infobar should open at the top of the page (between the toolbar area and the page). Click "Add Application". You now can close the Web Console using any of the same methods you used for opening it.

If the infobar does not open and the Web Console displays "Not allowed to register a protocol handler for mailto" then:
* In a new tab, type or paste about:config and press Enter/Return to open the preferences editor. Click the button promising to be careful.
* In the search box that appears about the list, type mailto and pause while the list is filtered.
* If network.protocol-handler.external.mailto is bolded and user set to false, double-click it to toggle its value back to true.
* Switch back to your Runbox tab and start this step 2 again. 

(3) Assuming the handler is added successfully, the next time you click a mailto link or use Email Link, you should get a list of email options. You can test Runbox Link here and, if all goes well, check the box to make it your default choice.
*/

// Check that we have a mailto: parameter
var params = window.location.search;
if (params.indexOf("mailto%3A") > -1){
  // Parse the parameters sent by Firefox in the URL
  var parray = decodeURIComponent(params).split("&");
  // Fix up the first parameter
  if (parray[0].indexOf("?mailto:?") > -1) { 
    // Email Link, no addressee, it's body=
    parray[0] = parray[0].replace("?mailto:?", "");
  } else {
    // Has an addressee, flag it as to=
    parray[0] = parray[0].replace("?mailto:", "to=");
  }
  // Insert parameter values into the message (usually only a couple exist)
  for (var i=0; i<parray.length; i++){
    if (parray[i].indexOf("=") > -1){
      var fld = parray[i].split("=")[0].toLowerCase();
      switch (fld){
        case "to":
          document.getElementById("to_").innerHTML = parray[i].split("=")[1];
          break;
        case "cc":
          document.getElementById("cc_").innerHTML = parray[i].split("=")[1];
          break;
        case "bcc":
          document.getElementById("bcc_").innerHTML = parray[i].split("=")[1];
          break;
        case "subject":
          document.querySelector("input[name='subject']").value = decodeURIComponent(parray[i].split("=")[1]);
          break;
        case "body":
          document.getElementById("editor").innerHTML += decodeURIComponent(parray[i].split("=")[1]) + "<br>";
          break;
      }
    } else { // mystery parameter
      document.getElementById("editor").innerHTML += "{" + parray[i] + "}<br>";
    }
  }
}