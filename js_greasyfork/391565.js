// ==UserScript==
// @name         Catbox Droptarget for Oppaitime
// @namespace    https://greasyfork.org/users/390979-parliament
// @version      1.51
// @description  Upload/rehost images to catbox.moe directly from upload page
// @author       Anakunda
// @iconURL      https://catbox.moe/pictures/favicon.ico
// @match        https://oppaiti.me/upload.php*
// @match        https://oppaiti.me/torrents.php?action=edit*
// @match        https://oppaiti.me/requests.php?action=new*
// @match        https://oppaiti.me/requests.php?action=edit*
// @match        https://oppaiti.me/reports.php?action=report*
// @match        https://oppaiti.me/reportsv2.php?*
// @match        https://oppaiti.me/artist.php?action=edit*
// @connect      catbox.moe
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/391565/Catbox%20Droptarget%20for%20Oppaitime.user.js
// @updateURL https://update.greasyfork.org/scripts/391565/Catbox%20Droptarget%20for%20Oppaitime.meta.js
// ==/UserScript==

'use strict';

String.prototype.toASCII = function() {
  return this.normalize("NFKD").replace(/[\x00-\x1F\u0080-\uFFFF]/g, '');
}

document.head.appendChild(document.createElement('style')).innerHTML = `
.catbox-droptarget {
  margin-left: 8px; padding: 5px;
  background-color: #fff9cc; border: solid thin black;
  align-content: center; vertical-align: 1px;
}

.catbox-img {
  height: 25px;
  vertical-align: middle;
}
`;

var userhash = GM_getValue('userhash');
var image;
bindAll();
onReportTypeChange();
if (document.location.pathname.toLowerCase() != '/requests.php') {
  var rlsTypeSelect = document.querySelector('select#categories');
  if (rlsTypeSelect != null) rlsTypeSelect.addEventListener('change', onRlsTypeChange);
}
var reportTypeSelect = document.querySelector('select#type');
if (reportTypeSelect != null) reportTypeSelect.addEventListener('change', onReportTypeChange);
GM_setValue('userhash', userhash || '');

function onReportTypeChange(evt) {
  setTimeout(function() {
	if (evt instanceof Event) {
	  image = document.querySelector('input#proofimages') || document.querySelector('input#image');
	  if (image != null) image.parentNode.append(createDropTarget(image));
	}
	bindToTextarea('extra');
  }, 1000);
}
function onRlsTypeChange(evt) { setTimeout(bindAll, 1000) }

function imageDropHandler(evt) {
  evt.preventDefault();
  uploadFiles(evt.currentTarget, evt.dataTransfer.files);
}

function clickHandler(evt) {
  evt.preventDefault();
  if (!evt.currentTarget.boundElement) throw new Error('boundElement not set');
  if (evt.currentTarget.boundElement.nodeName == 'INPUT' && /^https?:\/\//i.test(evt.currentTarget.boundElement.value)
	  && !evt.currentTarget.boundElement.value.toLowerCase().includes('catbox.moe/')) {
	rehostUrl(evt.currentTarget, evt.currentTarget.boundElement.value);
  } else {
	let currentTarget = evt.currentTarget;
	let inputElement = document.createElement("input");
	inputElement.type = "file";
	inputElement.accept = '.jpg, .jpeg, .jfif, .png, .gif, .webp';
	inputElement.multiple = true;
	inputElement.onchange = evt => { uploadFiles(currentTarget, inputElement.files) };
	inputElement.dispatchEvent(new MouseEvent("click"));
  }
}

function voidDragHandler(evt) { evt.preventDefault() }

function uploadFiles(evtSrc, files) {
  if (files.length <= 0) return;
  if (!evtSrc.boundElement) throw new Error('boundElement not set');
  if (evtSrc.busy) throw new Error('Wait till current upload finishes');
  evtSrc.busy = true;
  if (evtSrc.hTimer) {
	clearTimeout(evtSrc.hTimer);
	delete evtSrc.hTimer;
  }
  evtSrc.style.backgroundColor = 'red';
  Promise.all(upload2Catbox(files))
	.then(function(results) {
	  if (results.length > 0) {
		switch (evtSrc.boundElement.nodeName) {
		  case 'INPUT':
			evtSrc.boundElement.value = results[0];
			break;
		  case 'TEXTAREA':
			evtSrc.boundElement.value += results.join('\n');
			break;
		}
		evtSrc.style.backgroundColor = '#00C000';
		evtSrc.hTimer = setTimeout(function() {
		  evtSrc.style.backgroundColor = null;
		  delete evtSrc.hTimer;
		}, 3000);
	  } else evtSrc.style.backgroundColor = null;
	}).catch(function(e) {
	  alert(e);
	  evtSrc.style.backgroundColor = null;
	}).then(function() {
	  evtSrc.busy = false;
  	});
};

function rehostUrl(evtSrc, url) {
  if (!/^https?:\/\//i.test(url)) return;
  if (!evtSrc.boundElement) throw new Error('boundElement not set');
  if (evtSrc.busy) throw new Error('Wait till current upload finishes');
  evtSrc.busy = true;
  if (evtSrc.hTimer) {
	clearTimeout(evtSrc.hTimer);
	delete evtSrc.hTimer;
  }
  evtSrc.style.backgroundColor = 'red';
  rehost2Catbox(evtSrc.boundElement.value).then(function(result) {
	evtSrc.boundElement.value = result;
	evtSrc.style.backgroundColor = '#00C000';
	evtSrc.hTimer = setTimeout(function() {
	  delete evtSrc.hTimer;
	  evtSrc.style.backgroundColor = null;
	}, 3000);
  }).catch(function(e) {
	alert(e);
	evtSrc.style.backgroundColor = null;
  }).then(function() {
	evtSrc.busy = false;
  });
}

function bindAll() {
  if ((image = document.getElementById('image')) != null) {
	image.parentNode.append(createDropTarget(image));
  } else if ((image = document.querySelector('input[name="image"]')) != null) {
	image.parentNode.insertBefore(createDropTarget(image), image.parentNode.querySelector(':scope > br'));
  }
  ['album_desc', 'release_desc', 'desc', 'body', 'description', 'screenshots'].forEach(bindToTextarea);
}

function bindToTextarea(id) {
  var desc = document.querySelector('textarea#' + id);
  if (desc != null) {
	var btn = desc.parentNode.parentNode.querySelector('div > input[class^="button_preview"]');
	if (btn != null) {
	  btn.parentNode.append(createDropTarget(desc));
        } else if ((btn = desc.parentNode.parentNode.querySelector(':scope > td.label')) != null) {
          var div = document.createElement('div');
          div.style.marginTop = '60px';
          div.append(createDropTarget(desc));
          btn.append(div);
	} else if ((btn = desc.parentNode.querySelector('div#Bbcode_Toolbar > div[style]:last-of-type')) != null) {
	  btn.parentNode.insertBefore(createDropTarget(desc), btn);
	}
	return btn != null;
  } else if ((desc = document.querySelector('textarea[name="' + id + '"]')) != null
		&& (btn = desc.parentNode.querySelector(':scope > div > input[value="Submit"]')) != null) {
	btn.parentNode.append(createDropTarget(desc));
	return true;
  }
  return false;
}

function createDropTarget(boundElement) {
  if (!(boundElement instanceof HTMLElement)) throw new Error('invalid boundElement');
  var dropTarget = document.createElement('span');
  dropTarget.boundElement = boundElement;
  dropTarget.className = 'catbox-droptarget';
  dropTarget.ondragover = voidDragHandler;
  dropTarget.ondrop = imageDropHandler; // upload
  dropTarget.onclick = clickHandler; // rehost
  var img = document.createElement('img');
  img.src = 'data:image/png;base64,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';
  img.onerror = function() { this.src = 'https://catbox.moe/pictures/logo.png' };
  img.className = 'catbox-img';
  dropTarget.append(img);
  return dropTarget;
}

function upload2Catbox(files) {
  if (!(files instanceof FileList)) return Promise.reject('Bad parameter (files)');
  return Array.from(files)
	.sort((file1, file2) => file1.name.localeCompare(file2.name))
	.map(file => new Promise(function(resolve, reject) {
	  var fr = new Promise(function(resolve) {
		var reader = new FileReader();
		reader.onload = function() { resolve(reader.result) }
		reader.readAsBinaryString/*readAsArrayBuffer(file)*/(file);
	  });
	  fr.then(function(result) {
		const boundary = '----WebKitFormBoundaryTID_GM';
		var data = '--' + boundary + '\r\n';
		data += 'Content-Disposition: form-data; name="reqtype"\r\n\r\n';
		data += 'fileupload\r\n';
		if (userhash) {
		  data += '--' + boundary + '\r\n';
		  data += 'Content-Disposition: form-data; name="userhash"\r\n\r\n';
		  data += userhash + '\r\n';
		}
		data += '--' + boundary + '\r\n';
		data += 'Content-Disposition: form-data; name="fileToUpload"; filename="' + file.name.toASCII() + '"\r\n';
		data += 'Content-Type: ' + file.type + '\r\n\r\n';
		data += result + '\r\n';
		data += '--' + boundary + '--\r\n';
		GM_xmlhttpRequest({
		  method: 'POST',
		  url: 'https://catbox.moe/user/api.php',
		  responseType: 'text',
		  headers: {
			'Content-Type': 'multipart/form-data; boundary=' + boundary,
			'Content-Length': data.length,
		  },
		  data: data,
		  binary: true,
		  onload: function(response) {
			if (response.status != 200) reject('Response error ' + response.status + ' (' + response.statusText + ')');
			resolve(response.response);
		  },
		  onerror: response => { reject('Response error ' + response.status + ' (' + response.statusText + ')') },
		  ontimeout: function() { reject('Timeout') },
		});
	  });
	}));
}

function rehost2Catbox(url) {
  if (typeof url != 'string' || !url) return Promise.reject('Bad parameter (url)');
  return new Promise(function(resolve, reject) {
	var data = new URLSearchParams({
	  reqtype: 'urlupload',
	  url: url.trim(),
	});
	if (userhash) data.set('userhash', userhash);
	GM_xmlhttpRequest({
	  method: 'POST',
	  url: 'https://catbox.moe/user/api.php',
	  responseType: 'text',
	  headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': data.toString().length,
	  },
	  data: data.toString(),
	  onload: function(response) {
		if (response.status != 200) reject('Response error ' + response.status + ' (' + response.statusText + ')');
		resolve(response.response);
	  },
	  onerror: response => { reject('Response error ' + response.status + ' (' + response.statusText + ')') },
	  ontimeout: function() { reject('Timeout') },
	});
  });
}
