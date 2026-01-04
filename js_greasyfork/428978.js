// ==UserScript==
// @name         Notion Copy Properties
// @namespace    https://www.notion.so/
// @version      0.8
// @description  Copy Notion Database item property values by clicking Shift + LeftMouseButton on it
// @author       Maxim Kurbatov
// @match        https://www.notion.so/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/428978/Notion%20Copy%20Properties.user.js
// @updateURL https://update.greasyfork.org/scripts/428978/Notion%20Copy%20Properties.meta.js
// ==/UserScript==

var debug = false;
GM_addStyle(`.copyable-property:hover { font-style: italic; }`);

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var target = false;
        if ( mutation.target.nodeName == "DIV" ) target = mutation.target;
        else target = mutation.target.parentElement;
        if ( target.getAttribute("contentEditable") == "true" ) target = target.parentElement;
        if ( ! target ) return;
        addCopyHandler(target);
    });
});
var config = { characterData: true, attributes: false, childList: true, subtree: true };
var mutgt = document.body;
observer.observe(mutgt, config);
var lastBlock = false;

function addCopyHandler(elm) {
    elm = elm || document;
    //if ( typeof elm.querySelectorAll !== 'function' ) return;
    //var blocks = elm.querySelectorAll("#notion-app .notion-focusable");
    const blocks = document.querySelector('.notion-page-view-discussion').parentNode.querySelector('div > div[style="margin: 0px;"]').querySelectorAll('.notion-focusable');
    blocks.forEach(function(block) {
        block.addEventListener('click', onClick);
        block.classList.add('copyable-property');
    });
}

function onClick(e) {
    const elem = e.currentTarget;
    console.log("Copying text: " + elem.innerText);
    if (e.shiftKey) {
        copyTextToClipboard(elem.innerText);
        const color = elem.style.color;
        elem.style.color = "red";
        setTimeout(function() { elem.style.color = color; }, 300);
    }
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
