// ==UserScript==
// @name          飞书文本复制
// @author        Caleb
// @namespace     Caleb
// @version       1.0.2
// @description   复制飞书文本
// @license       AGPL
// @include       *
// @grant         GM_setClipboard
// @run-at        document-end
// @inject-into   auto
// @downloadURL https://update.greasyfork.org/scripts/530674/%E9%A3%9E%E4%B9%A6%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/530674/%E9%A3%9E%E4%B9%A6%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

"use strict";

function CopyText(selText) {
  if (!selText) {
    console.log("No text selected to copy");
    return;
  }
  try {
    GM_setClipboard(selText, "text");
    console.log("Text copied using GM_setClipboard: " + selText);
  } catch (e) {
    console.log("GM_setClipboard failed: " + e);
    try {
      navigator.clipboard.writeText(selText).then(
        () => console.log("Text copied using navigator.clipboard: " + selText),
        (err) => console.log("navigator.clipboard failed: " + err)
      );
    } catch (err) {
      console.log("All copy methods failed: " + err);
    }
  }
}

function InTextBox(selection) {
  var areas = document.querySelectorAll('textarea, input, [contenteditable="true"]');
  for (var i = 0; i < areas.length; i++) {
    if (selection.containsNode(areas[i], true)) {
      console.log("Selection is in a textbox");
      return true;
    }
  }
  return false;
}

function GetTextboxSelection() {
  var textbox = document.activeElement;
  if (textbox && textbox.selectionEnd > textbox.selectionStart) {
    var text = textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
    console.log("Textbox selection: " + text);
    return text;
  }
  return "";
}

function handleSelection(event) {
  var sel = window.getSelection();
  var text = "";
  
  if (!sel) {
    console.log("No selection object available");
    return;
  }

  if (InTextBox(sel)) {
    text = GetTextboxSelection().trim();
  } else {
    text = sel.toString().trim();
  }
  
  if (text) {
    console.log("Selected text: " + text);
    CopyText(text);
  } else {
    console.log("No valid text selected");
  }
}

document.addEventListener('mouseup', function(event) {
  setTimeout(function() {
    handleSelection(event);
  }, 200); 
});