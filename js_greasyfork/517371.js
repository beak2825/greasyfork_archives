// ==UserScript==
// @name        TCG Card Sheet Helper
// @namespace   finally.idle-pixel.tcgsheet
// @match       https://idle-pixel.com/login/play/*
// @grant       none
// @version     1.0
// @author      finally
// @description Adds button to copy TCG Card data for spreadsheet use
// @downloadURL https://update.greasyfork.org/scripts/517371/TCG%20Card%20Sheet%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/517371/TCG%20Card%20Sheet%20Helper.meta.js
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

(() => {
  return new Promise((resolve) => {
    function check() {
      if (window.websocket?.connected_socket && document.getElementById("panel-criptoe-tcg")) {
        resolve();
        return;
      }
      setTimeout(check, 200);
    }
    check();
  });
})().then(() => {
  let tcgData = null;

  window.websocket.connected_socket.addEventListener("message", (e) => {
    if (!e.data.startsWith("REFRESH_TCG")) return;

    tcgData = e.data;
  });

  let button = document.createElement("a");
  button.innerHTML = `
    <div class="itembox-rings hover">
      <div class="center mt-1">
        📋
      </div>
      <div class="center mt-2">
        Copy TCG Data
      </div>
    </div>
  `;

  let node = document.querySelector("[data-tooltip='tcg_unknown']");
  node.parentNode.insertBefore(button, node.nextElementSibling);

  button.addEventListener("click", () => {
    copyTextToClipboard(tcgData);
    button.firstElementChild.lastElementChild.innerHTML = "Copied";
    setTimeout(() => {
      button.firstElementChild.lastElementChild.innerHTML = "Copy TCG Data";
    }, 2000);
  });
});
