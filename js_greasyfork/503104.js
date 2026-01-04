// ==UserScript==
// @name         Reddit old new swticher link
// @namespace    https://reddit.com/
// @version      2
// @description  Adds links to old.reddit on new reddit pages, and links to new reddit on old.reddit pages.
// @author       Tehhund
// @match        *://*.reddit.com/*
// @match        *://reddit.com/*
// @icon         https://www.redditstatic.com/shreddit/assets/favicon/64x64.png
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503104/Reddit%20old%20new%20swticher%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/503104/Reddit%20old%20new%20swticher%20link.meta.js
// ==/UserScript==

addLinks = () => {
  if (document.getElementsByClassName(`oldNewRedditSwitcher`)[0]) { return } // If the script already ran, do nothing.
  let oldOrNew = new URL(window.location.href).host.includes(`old.reddit`) ? `New` : `Old`;
  let myUrl = new URL(window.location.href);
  myUrl.host = `${(oldOrNew) == `Old` ? `old` : `www`}.reddit.com`;
  if (oldOrNew == `Old`) {
    const link = document.getElementById(`create-post`).cloneNode(false);
    link.classList.add(`oldNewRedditSwitcher`);
    link.textContent = `${oldOrNew} Reddit`;
    link.href = myUrl.href;
    document.getElementById(`create-post`).insertAdjacentElement(`afterend`, link);
  } else {
    const link = document.createElement(`a`)
    link.classList.add(`oldNewRedditSwitcher`);
    link.textContent = `${oldOrNew} Reddit`;
    link.href = myUrl.href;
    document.getElementById(`redesign-beta-optin-btn`).insertAdjacentElement(`afterend`, link);
  }
}

try { addLinks(); } catch (e) { }// If the script runs after DOMContentLoaded this will add the links. If it runs before DOMContentLoaded, this will error and the listener below will run it instead.
window.addEventListener('DOMContentLoaded', addLinks);