// ==UserScript==
// @name        Copy !bsr id
// @description Add button to scoresaber to copy the !bsr command
// @namespace   finally.ScoreSaber
// @match       https://scoresaber.com/*
// @grant       none
// @version     1.0
// @author      finally
// @downloadURL https://update.greasyfork.org/scripts/421324/Copy%20%21bsr%20id.user.js
// @updateURL https://update.greasyfork.org/scripts/421324/Copy%20%21bsr%20id.meta.js
// ==/UserScript==

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

var bsr = "";

var rightBoxDiv = document.getElementsByClassName("box has-shadow")[0];
var id = rightBoxDiv.children[4].innerText;
var url = "https://beatsaver.com/api/maps/by-hash/" + id;

var bsrButton = document.createElement('Button');
bsrButton.className = "bhackel-button button is-dark has-background-grey-dark";
bsrButton.innerHTML = "Copy !bsr";
bsrButton.addEventListener("click", () => {
  copyTextToClipboard(`!bsr ${bsr}`);
  bsrButton.innerHTML = "Copied!";
  setTimeout(() => bsrButton.innerHTML = "Copy !bsr", 1000);
});

rightBoxDiv.append(bsrButton);

fetch(url).then((r) => r.json()).then((t) => bsr = t.key);