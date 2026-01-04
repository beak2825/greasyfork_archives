// ==UserScript==
// @name        Gist Edit Resize
// @namespace   cvladan.com
// @match       *://gist.github.com/*
// @run-at      document-start
// @inject-into content
// @grant       none
// @version     1.0
// @license MIT
// @author      -
// @description Gist enhancements with collapsible files and larger editor area
// @downloadURL https://update.greasyfork.org/scripts/460849/Gist%20Edit%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/460849/Gist%20Edit%20Resize.meta.js
// ==/UserScript==

var css = `

  .CodeMirror {
    height: auto !important;
  }

  .file.show-code:has(.CodeMirror.CodeMirror-focused) {
    outline: 3px solid gray;
  }

`

// Inject CSS in document head
//
function injectStyle(css) {
	var doc = document;
  var script = document.createElement('style');
  script.textContent = css;

  var where = doc.getElementsByTagName ('head')[0] || doc.body || doc.documentElement;
  where.appendChild(script);
}

injectStyle(css)


// Toggle buttons to every file
// Plain JavaScript rewrite of https://greasyfork.org/en/scripts/31700-togglegist
//
document.addEventListener('DOMContentLoaded', function() {
  const fileBoxes = document.querySelectorAll('.file-box');

  fileBoxes.forEach(function(fileBox) {
    const btn = document.createElement('a');
    btn.classList.add('btn', 'btn-sm', 'git-toggle-file');
    btn.href = '#';
    btn.textContent = 'Toggle';

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const wrapper = e.target.closest('.file').querySelector('.blob-wrapper, .blob');
      wrapper.hidden = !wrapper.hidden;
    })

    fileBox.querySelector('.file-actions .btn').parentElement.appendChild(btn);
  })
});