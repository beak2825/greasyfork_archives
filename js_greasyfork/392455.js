// ==UserScript==
// @name        SDcopyls
// @namespace   SDcopyls script
// @match       http://hd/WorkOrder.do*
// @grant       none
// @version     1.2
// @author      -
// @description 13.11.2019, 16:38:38
// @downloadURL https://update.greasyfork.org/scripts/392455/SDcopyls.user.js
// @updateURL https://update.greasyfork.org/scripts/392455/SDcopyls.meta.js
// ==/UserScript==

  if (location.href != 'http://hd/WorkOrder.do?reqTemplate=19602&isOverwrite=false&reqID=998819') {

function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

function cto() {
  document.getElementById('requesterName_PH').setAttribute('onclick', "");
  document.getElementById('requesterName_PH').onclick = function(){copyToClipboard(document.getElementById('requesterName_PH'))};
}
window.onload = function() {

      //document.getElementById('requesterName_PH').outerHTML = '<div style="font-weight: bold; display: inline-block;">'+document.getElementById('requesterName_PH').innerText+'</div>';
  setInterval(cto, '1000');


  };



  }




















