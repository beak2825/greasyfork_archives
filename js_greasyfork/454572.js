// ==UserScript==
// @name     Github PR review: mark moved files as viewed
// @description  Adds an option to the Github PR review page to mark moved files as viewed.
// @include  https://github.com/*
// @license  GPLv2
// @version  1
// @grant    none
// @namespace https://greasyfork.org/users/13329
// @downloadURL https://update.greasyfork.org/scripts/454572/Github%20PR%20review%3A%20mark%20moved%20files%20as%20viewed.user.js
// @updateURL https://update.greasyfork.org/scripts/454572/Github%20PR%20review%3A%20mark%20moved%20files%20as%20viewed.meta.js
// ==/UserScript==

function should_mark(file) {
  if (file.dataset.fileDeleted === 'true') {
    return true;
  }
  
  const changes = file.getElementsByClassName('diffstat')[0].childNodes[0].textContent.trim();
  if (changes === '0' || changes === 'BIN') {
    return true;
  }
}

function mark_moved_files(event) {
  event.preventDefault();
  for (const file of document.getElementsByClassName('file')) {
    if (should_mark(file)) {
    	const checkbox = file.getElementsByClassName('js-reviewed-checkbox')[0];
    	if (!checkbox.checked) {
	      checkbox.click();
	    }
	  }
  }
  return false;
}


function add_checkbox(callback) {
  const submit_button = document.getElementById('whitespace-cb-lg')?.form?.elements?.[5];
  if (!submit_button) {
    return;
  }

  const button = document.createElement('button');
  button.addEventListener('click', callback);
  button.setAttribute('class', 'btn-sm btn');
  button.setAttribute('id', 'ignore-moved-files');

  button.append(document.createTextNode('Mark moved files as read'));

  submit_button.parentNode.insertBefore(button, submit_button);
}

function init() {
  add_checkbox(mark_moved_files);
}

window.addEventListener('DOMContentLoaded', init);