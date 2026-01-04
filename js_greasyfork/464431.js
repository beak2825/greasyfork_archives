// ==UserScript==
// @name         Overleaf - File History
// @namespace    https://github.com/BLumbye/overleaf-userscripts
// @version      0.1
// @description  Lets you use the browser history to navigate between previously opened files
// @author       Benjamin Lumbye
// @license      GPL-3
// @match        https://www.overleaf.com/project/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464431/Overleaf%20-%20File%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/464431/Overleaf%20-%20File%20History.meta.js
// ==/UserScript==

'use strict';

(function () {
  // Listen for file open events
  _ide.$scope.$on('doc:after-opened', onFileOpen);
  _ide.$scope.$on('file-view:file-opened', onFileOpen);

  // Listen for popstate event
  window.addEventListener('popstate', (event) => {
    if (event.state?.fileID) {
      openFile(event.state.fileID);
    }
  });
})();

function onFileOpen(event) {
  const fileID = _ide.fileTreeManager.selected_entity_id;
  if (history.state?.fileID === fileID) return;
  history.pushState({ fileID }, '');
}

function openFile(fileID) {
  const file = _ide.fileTreeManager.findEntityById(fileID);
  if (!file) return;
  if (file.type === 'file') {
    // BUG: File does not get highlighted in the file tree
    _ide.binaryFilesManager.openFile(file);
  } else if (file.type === 'doc') {
    _ide.editorManager.openDoc(file);
  }
}
