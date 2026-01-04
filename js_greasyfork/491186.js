// ==UserScript==
// @name         Trimps Tweaks
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.2.3
// @description  various tweaks like Quicksave/Quickload for Trimps
// @author       Alistair1231
// @match        https://trimps.github.io/
// @icon         https://icons.duckduckgo.com/ip2/github.io.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491186/Trimps%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/491186/Trimps%20Tweaks.meta.js
// ==/UserScript==
// https://github.com/Alistair1231/my-userscripts/raw/master/trimps-tweaks.user.js
// https://greasyfork.org/en/scripts/491186-trimps-tweaks/

const getSave = () => window.save(true);
const setSave = (save) => window.load(save);

const copy = async (text) => await window.navigator.clipboard.writeText(text);

const addHotkey = (key, action) => {
  document.addEventListener('keydown', (e) => {
    if (e.key === key) action(e);
  });
}

// show a toast bubble on the bottom right of the screen, green with white text on success, red with white text on failure
const showToast = (message, success = true) => {
  const toast = document.createElement('div');
  toast.style.cssText = `position: fixed;
    bottom: 7vh;
    right: 1vw;
    background-color: ${success ? '#0a3' : '#a30'};
    color: #e7e7e7;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 2px 5px black;
    z-index: 9999;
    opacity: 1;
    transition: opacity 1s;`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove()
    }, 1000);
  }, 2000);
}


const addLabel = (selector, filter, value) => {
  const run = () => {
    const exportDiv = [...document.querySelectorAll(selector)].find(x => x.innerHTML === filter);
    if (exportDiv) {
      exportDiv.innerHTML += value;
      return true;
    }
    return false;
  }
  // try to run immediately, if it fails, wait for the settings to load
  if (run()) return;

  new Promise(resolve => {
    const observer = new MutationObserver(() => {
      const target = document.querySelector(selector);
      if (target) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, {childList: true, subtree: true});
  }).then(run);
}


(async () => {
  'use strict';
  // export save to clipboard when pressing F8
  addHotkey('F8', (e) => {
    e.preventDefault();
    // get the save string and copy it to the clipboard
    copy(getSave());
    showToast('Exported save to clipboard');
  });

  // import save from clipboard when pressing F9
  addHotkey('F9', async (e) => {
    e.preventDefault();
    // show the current save in the console in case the import is a mistake
    console.log('Backup save:', getSave());
    // ask user for a save string
    const save = prompt('Paste save here');
    // if the user pasted a save, import it, else do nothing
    if(save) {
      // import the save
      setSave(save);
      showToast(`Imported save from clipboard, the last save was printed to the console`);
    }
  });

  // add (F8)/(F9) to the export/import buttons
  addLabel("#settingsTable div", "Export", " (F8)");
  addLabel("#settingsTable div", "Import", " (F9)");

})();