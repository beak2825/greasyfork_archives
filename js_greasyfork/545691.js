// ==UserScript==
// @name        Copy button for outlinekeys
// @namespace   Violentmonkey Scripts
// @match       https://outlinekeys.com/
// @match       https://openkeys.net/
// @grant       none
// @version     1.1
// @require     https://cdn.jsdelivr.net/npm/notie@4.3.1/dist/notie.min.js
// @description Adds a copy button for each access key in the listing
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545691/Copy%20button%20for%20outlinekeys.user.js
// @updateURL https://update.greasyfork.org/scripts/545691/Copy%20button%20for%20outlinekeys.meta.js
// ==/UserScript==

// notie-css
const style = document.createElement("style");
style.innerHTML = '.notie-container{font-size:1.6rem;height:auto;left:0;position:fixed;text-align:center;width:100%;z-index:2;box-sizing:border-box;-o-box-shadow:0 0 5px 0 rgba(0,0,0,.5);-ms-box-shadow:0 0 5px 0 rgba(0,0,0,.5);box-shadow:0 0 5px 0 rgba(0,0,0,.5)}@media screen and (max-width:900px){.notie-container{font-size:1.4rem}}@media screen and (max-width:750px){.notie-container{font-size:1.2rem}}@media screen and (max-width:400px){.notie-container{font-size:1rem}}.notie-background-success{background-color:#57bf57}.notie-background-warning{background-color:#d6a14d}.notie-background-error{background-color:#e1715b}.notie-background-info{background-color:#4d82d6}.notie-background-neutral{background-color:#a0a0a0}.notie-background-overlay{background-color:#fff}.notie-textbox{color:#fff;padding:20px}.notie-textbox-inner{margin:0 auto;max-width:900px}.notie-overlay{height:100%;left:0;opacity:0;position:fixed;top:0;width:100%;z-index:1}.notie-button{cursor:pointer}.notie-button,.notie-element{color:#fff;padding:10px}.notie-element-half{width:50%}.notie-element-half,.notie-element-third{display:inline-block;box-sizing:border-box}.notie-element-third{width:33.3333%}.notie-alert{cursor:pointer}.notie-input-field{background-color:#fff;border:0;font-family:inherit;font-size:inherit;outline:0;padding:10px;text-align:center;width:100%;box-sizing:border-box}.notie-select-choice-repeated{border-bottom:1px solid hsla(0,0%,100%,.2);box-sizing:border-box}.notie-date-selector-inner{margin:0 auto;max-width:900px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.notie-date-selector-inner [contenteditable],.notie-date-selector-inner [contenteditable]:focus{outline:0 solid transparent}.notie-date-selector-up{transform:rotate(180deg)}';
document.head.appendChild(style);

const observer = new MutationObserver((mutations, obs) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
        if (node.href && node.href.startsWith(location.origin + '/key/')) {
          addExtras(node);
        }
      }
    }
  }
});

observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('DOMContentLoaded', () => observer.disconnect());

function addExtras(a) {
  const title = a.querySelector('h3');
  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.textContent = 'Copy';
  copyButton.className = 'btn btn-dark';
  copyButton.addEventListener('click', copyAccessKey);
  title.appendChild(copyButton);
}

async function copyAccessKey(event) {
  event.preventDefault();
  const button = event.target;
  const a = button.closest('a');
  const href = a.href;
  const title = a.querySelector('h3').firstChild;
  const icon = a.querySelector('img');
  const buttonText = event.target.textContent;
  event.target.textContent = 'Fetching...';
  const accessKey = await getAccessKey(href);
  if (document.hasFocus()) {
    finaly(accessKey)
  } else {
    window.addEventListener('focus', finaly.bind(null, accessKey), { once: true });
  }
  event.target.textContent = buttonText;

  function finaly(accessKey) {
    if (accessKey) {
      navigator.clipboard.writeText(accessKey);
      notie.alert({ type: 1, text: icon.outerHTML + title.textContent + ' copied', time: 1.5 });
    } else {
      notie.alert({ type: 3, text: 'Error: Access key not found in the key page', time: 3 });
    }
  }
}

async function getAccessKey(url) {
  const parser = new DOMParser();
  const res = await fetch(url);
  const src = await res.text();
  const doc = parser.parseFromString(src, 'text/html');
  const accessKey = doc.querySelector('#accessKey');
  return accessKey?.value;
}