// ==UserScript==
// @name        CodeHSRuse
// @namespace   Violentmonkey Scripts
// @match       *://codehs.com/*/assignment/*
// @grant       none
// @version     1.1
// @author      klrin
// @license MIT
// @description 1/25/2024, 9:16:47 AM || this allows you to copy and paste in CodeHS / working as of Feb 1, 24'
// @downloadURL https://update.greasyfork.org/scripts/486240/CodeHSRuse.user.js
// @updateURL https://update.greasyfork.org/scripts/486240/CodeHSRuse.meta.js
// ==/UserScript==


function handlePaste(e, editor) {
  var clipboardData, pastedData;

  // Stop data actually being pasted into div
  e.stopPropagation();
  e.preventDefault();

  // Get pasted data via clipboard API
  clipboardData = e.clipboardData || window.clipboardData;
  pastedData = clipboardData.getData('Text');

  // Do whatever with pasteddata
  editor.insert(pastedData);
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

function copyText(editor) {
  copyTextToClipboard(editor.getSelectedText())
  console.log("Copying "+editor.getSelectedText())
}


window.addEventListener("load", (e) => {
  let editorel = document.getElementById("ace-editor")
  console.log("Starting the changer.")
  let editor = ace.edit("ace-editor");
  editor.setTheme("ace/theme/twilight");
  document.addEventListener("copy", (e) => {
    console.log("RUNNING")
    copyText(editor)
  }, true)
  editorel.addEventListener("copy", (e) => {
    console.log("RUNNING")
    copyText(editor)
  }, true)
  window.addEventListener("copy", (e) => {
    console.log("RUNNING")
    copyText(editor)
  }, true)


  document.addEventListener("paste", (e) => {handlePaste(e, editor)}, true)
  editorel.addEventListener("paste", (e) => {handlePaste(e, editor)}, true)
  window.addEventListener("paste", (e) => {handlePaste(e, editor)}, true)

})




