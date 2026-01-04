// ==UserScript==
// @name         UploadOnDragnDrop
// @namespace    sheesh
// @version      1.1
// @author       Ur Momma
// @match        https://shikme.chat/
// @icon         https://shikme.chat/default_images/icon.png?v=1528136794
// @grant        none
// @description Upload files on drag and drop on input field
// @downloadURL https://update.greasyfork.org/scripts/509703/UploadOnDragnDrop.user.js
// @updateURL https://update.greasyfork.org/scripts/509703/UploadOnDragnDrop.meta.js
// ==/UserScript==
const globalFileInput = document.getElementById('content');
const privateFileInput = document.getElementById('message_content');
const fileRealInput = document.getElementById('chat_file');
const privateFileRealInput = document.getElementById('private_file');

globalFileInput.addEventListener('dragover', (event) => {
	event.preventDefault();
	event.stopPropagation();
	globalFileInput.classList.add('dragover');
});

globalFileInput.addEventListener('dragleave', (event) => {
	event.preventDefault();
	event.stopPropagation();
	globalFileInput.classList.remove('dragover');
});

globalFileInput.addEventListener('drop', (event) => {
	event.preventDefault();
	event.stopPropagation();
	globalFileInput.classList.remove('dragover');
  
	const files = event.dataTransfer.files;
	if (files.length > 0) {
		fileRealInput.files = files;
		const event = new Event('change');
		fileRealInput.dispatchEvent(event);
	}
});

privateFileInput.addEventListener('dragover', (event) => {
	event.preventDefault();
	event.stopPropagation();
	privateFileInput.classList.add('dragover');
});

privateFileInput.addEventListener('dragleave', (event) => {
	event.preventDefault();
	event.stopPropagation();
	privateFileInput.classList.remove('dragover');
});

privateFileInput.addEventListener('drop', (event) => {
	event.preventDefault();
	event.stopPropagation();
	privateFileInput.classList.remove('dragover');
  
	const files = event.dataTransfer.files;
	if (files.length > 0) {
		privateFileRealInput.files = files;
		const event = new Event('change');
		privateFileRealInput.dispatchEvent(event);
	}
});
