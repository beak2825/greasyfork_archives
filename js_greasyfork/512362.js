// ==UserScript==
// @name         Return Scrollable
// @namespace    https://github.com/cilxe/JavaScriptProjects
// @version      0.1
// @description  Enable scroll functionality after blocking pop-ups on certain sites.
// @author       cilxe
// @match        *://*/*
// @icon         None
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512362/Return%20Scrollable.user.js
// @updateURL https://update.greasyfork.org/scripts/512362/Return%20Scrollable.meta.js
// ==/UserScript==

(() => {
  const css = document.createElement('style');
  css.innerText += 'body { overflow: auto !important; }';

  // Function to append the CSS to the document head
  function appendCSS() {
    document.head.append(css);
    console.log('CSS applied: body { overflow: auto !important; }');
  }

  // Get stored sites from GM_getValue
  // eslint-disable-next-line no-undef
  const sites = GM_getValue('scrollableSites', []);
  const currentSite = window.location.hostname;

  // Check if the current site is in the list and apply CSS
  if (sites.includes(currentSite)) {
    appendCSS();
  }

  // Add keyboard shortcut [Ctrl + Alt + Shift + X]
  window.addEventListener('keydown', (e) => {
    if (e.key === 'X' && e.altKey && e.shiftKey && e.ctrlKey) {
      appendCSS();
    }
  });

  // Function to add the current site to the list
  function addCurrentSite() {
    if (!sites.includes(currentSite)) {
      sites.push(currentSite); // eslint-disable-next-line no-undef
      GM_setValue('scrollableSites', sites);
      alert(`${currentSite} has been added to the list, effective after refresh.`);
    } else {
      alert('This site is already in the list.');
    }
  }

  // Add menu command to add the current site
  // eslint-disable-next-line no-undef
  GM_registerMenuCommand('Set current site to append CSS by default.', addCurrentSite);
})();
