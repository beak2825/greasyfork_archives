// ==UserScript==
// @name         MS-Word DOCX Reader
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @author       jcunews
// @version      1.0.2
// @license      AGPLv3
// @description  Adds Microsoft Office Word DOCX document viewing functionality without using or involving any third party website. To view a Word document, use the mouse shortcut to click the link on a web page which points to a DOCX file. By default, the mouse shortcut is Alt+LeftClick, and it's configurable in the script.
// @match        *://*/*
// @connect      *
// @domain       *
// @require      https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.6/mammoth.browser.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/369973/MS-Word%20DOCX%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/369973/MS-Word%20DOCX%20Reader.meta.js
// ==/UserScript==

/*
When a DOCX link is clicked using the mouse shortcut, a popup dialog will be shown to indicate the file loading progress.
If the file size is known, a percentage number will be shown. Otherwise, the number of data bytes will be shown.

This script uses the mammoth.js library for handling the DOCX to HTML conversion.
https://github.com/mwilliamson/mammoth.js

This script is compatible with Tampermonkey and Violentmonkey addons.
For Greasemonkey addon, it may be compatible with v3.x (untested), but it's not compatible with v4.x due to its incomplete implementation.

When used with Tampermonkey addon, Tampermonkey will ask whether to allow or reject the network request made by the script for loading the DOCX document.
This is a security mechanism by Tampermonkey, because background network request to other domain is considered as a risk.
However, this network request is required, so please allow it either temporarily or permanently.
But do so after checking whether the shown Destination URL matched the link which was clicked.
i.e. the Destination URL should point to a DOCX file also.
*/

//===== CONFIGURATION BEGIN =====

//Base font size used for document and script UI
var fontSize         = "12pt";

//Modifier key(s) to use for the mouse shortcut
var shortcutCtrlKey  = false; //true = key must be held when the mouse button is pressed. false = key must not be held when the mouse button is pressed.
var shortcutShiftKey = false;
var shortcutAltKey   = true;

//Mouse button(s) which can be used for the mouse shortcut. 
var shortcutButtons  = [0]; //one and up to three numbers. 0 = LeftButton, 1 = MiddleButton, 2 = RightButton.
                            //e.g. [0, 1] means that either the LeftButton or MiddleButton can be used.

//===== CONFIGURATION END =====


addEventListener("mousedown", function(ev, popup, mwdrProgress, orgOverflow, lnk) {

  function showError(msg, response) {
    if (response) {
      alert(msg + "\n\nHTTP Status Code " + response.status + (response.statusText ? "\n\n" + response.statusText : ""));
    } else alert(msg);
  }

  function getLink(e) {
    while (e) {
      if (e.tagName === "A") return e;
      e = e.parentNode;
    }
  }

  if ((ev.ctrlKey !== shortcutCtrlKey) || (ev.shiftKey !== shortcutShiftKey) || (ev.altKey !== shortcutAltKey) || 
      (shortcutButtons.indexOf(ev.button) < 0) || !(lnk = getLink(ev.target)) || !(/\.docx$/i).test(lnk.pathname)) return;
  popup = document.createElement("DIV");
  popup.id = "mwdr_popup";
  popup.innerHTML = `
<style>
#mwdr_popup, .mwdrCurtain {position: fixed; left:0; top:0; right:0; bottom:0; font-size: ${fontSize}}
#mwdr_popup {z-index:999999999}
.mwdrCurtain {opacity:0.5; background:#000}
.mwdrDialog {
  position:relative; margin:45vh auto; width:40ex; height:4em; border-radius:1ex;
  background:#ccc; vertical-align:middle; text-align:center; line-height:4em; font-size:130%;
}
.mwdrMenu {position: fixed; left:0; top:0; right:0; border-bottom:.2em solid #000; padding:0 1ex; background:#ccc; line-height: 2em}
.mwdrClose {position:absolute; right:0; width:2em; background:#f00; color:#fff; text-align:center; font-weight:bold; cursor:pointer}
.mwdrDocument {position: fixed; left:0; top:2.2em; right:0; bottom:0; overflow:auto; padding:1ex}
</style>
<div class="mwdrCurtain"></div>
<div class="mwdrDialog">Loading <span id="mwdrProgress"></span>...</div>
`;
  mwdrProgress = popup.querySelector("#mwdrProgress");
  orgOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  document.body.appendChild(popup);
  GM_xmlhttpRequest({
    method: "GET",
    url: lnk.href,
    responseType: "arraybuffer",
    onerror: function(response) {
      showError("Failed to load data from server.", response);
      document.documentElement.style.overflow = orgOverflow;
      popup.remove();
    },
    ontimeout: function(response) {
      showError("Timed out while loading data from server.");
      document.documentElement.style.overflow = orgOverflow;
      popup.remove();
    },
    onabort: function(response) {
      document.documentElement.style.overflow = orgOverflow;
      popup.remove();
    },
    onprogress: function(response) {
      if (response.lengthComputable) {
        mwdrProgress.textContent = parseFloat((response.loaded * 100 / response.total).toFixed(2)) + "%";
      } else mwdrProgress.textContent = response.loaded + " Bytes";
    },
    onload: function(response) {
      if (response.status < 400) {
        mammoth.convertToHtml({arrayBuffer: response.response}).then(function(result, ele, a) {
          popup.style.backgroundColor = "#fff";
          ele = popup.children[1];
          ele.className = "mwdrMenu";
          a = document.createElement("DIV");
          a.textContent = "X";
          a.className = "mwdrClose";
          a.onclick = function() {
            document.documentElement.style.overflow = orgOverflow;
            popup.remove();
          };
          ele.appendChild(a);
          ele.appendChild(document.createTextNode(lnk.href));
          ele = popup.children[2];
          ele.className = "mwdrDocument";
          ele.innerHTML = result.value;
        }).done();
      } else {
        showError("Failed to load data from server.", response);
        document.documentElement.style.overflow = orgOverflow;
        popup.remove();
      }
    }
  });
  ev.preventDefault();
  ev.stopPropagation();
  ev.stopImmediatePropagation();
}, true);
