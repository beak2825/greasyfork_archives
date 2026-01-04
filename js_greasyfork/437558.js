// ==UserScript==
// @name        Copy IPA - ldoceonline.com
// @namespace   Violentmonkey Scripts
// @match       https://www.ldoceonline.com/dictionary/*
// @grant       none
// @version     1.0
// @author      quangthang
// @description 12/25/2021, 11:51:53 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437558/Copy%20IPA%20-%20ldoceonlinecom.user.js
// @updateURL https://update.greasyfork.org/scripts/437558/Copy%20IPA%20-%20ldoceonlinecom.meta.js
// ==/UserScript==


function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

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

window.addEventListener('DOMContentLoaded', (event) => {
  const IPAElem = document.querySelector('.PronCodes');
  let copyBtn = document.createElement('button');
  copyBtn.textContent = "Copy";
  copyBtn.onclick = () => {if(copyToClipboard(IPAElem)) {copyBtn.textContent = "Copied"}};
  copyBtn.style.border = "2px solid #000";
  copyBtn.style.marginLeft = "5px";
  copyBtn.style.padding = "2px 7px";
  insertAfter(IPAElem, copyBtn);
});
