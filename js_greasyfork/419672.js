// ==UserScript==
// @name         Validate .torrent filepaths
// @version      1.0
// @author       Anakunda
// @description  Check paths length
// @match        https://redacted.ch/upload.php*
// @match        https://notwhat.cd/upload.php*
// @match        https://orpheus.network/upload.php*
// @namespace https://greasyfork.org/users/321857
// @downloadURL https://update.greasyfork.org/scripts/419672/Validate%20torrent%20filepaths.user.js
// @updateURL https://update.greasyfork.org/scripts/419672/Validate%20torrent%20filepaths.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let file = document.getElementById('file');
	if (file == null) return;

	class HTML extends String { };
	var tfMessages = [ ];

	String.prototype.trueLength = function() {
		return this.normalize('NFC').length;
		//   var index = 0, width = 0, len = 0;
		//   while (index < this.length) {
		// 	var point = this.codePointAt(index);
		// 	width = 0;
		// 	while (point) {
		// 	  ++width;
		// 	  point = point >> 8;
		// 	}
		// 	index += Math.round(width / 2);
		// 	++len;
		//   }
		//   return len;
	};

	document.head.appendChild(document.createElement('style')).innerHTML = `
.ua-messages {
	text-indent: -2em;
	margin-left: 2em;
	font: 8pt Verdana, Tahoma, sans-serif;
}
.ua-messages-bg {
	padding: 15px;
	text-align: left;
	background-color: darkslategray;
}

.ua-critical { color: red; font-weight: bold; font-size: 10pt; }
.ua-warning { color: #ff8d00; font-weight: 500; font-size: 9pt; }
.ua-notice { color: #e3d67b; }
.ua-info { color: white; }
`;

	function addMessage(text, cls) {
		if (!cls) return null;
		switch (cls = cls.toLowerCase()) {
			case 'info': var prefix = 'Info'; break;
			case 'notice': prefix = 'Notice'; break;
			case 'warning': prefix = 'Warning'; break;
			case 'critical': prefix = 'FATAL'; break;
			default:
				console.warn('addMessage(...) invalid param:', cls);
				return null;
		}
		let td = document.querySelector('tr#ual-messages > td');
		if (td == null) {
			let tr = document.createElement('tr');
			tr.id = 'ual-messages';
			td = document.createElement('td');
			td.colSpan = 2;
			td.className = 'ua-messages-bg';
			tr.append(td);
			file.parentElement.parentElement.insertAdjacentElement('afterend', tr);
		}
		let div = document.createElement('div');
		div.classList.add('ua-messages', 'ua-' + cls);
		div[text instanceof HTML ? 'innerHTML' : 'textContent'] = prefix + ': ' + text;
		return td.appendChild(div);
	}

	function safeText(unsafeText) {
		let div = document.createElement('div');
		div.innerText = unsafeText || '';
		return div.innerHTML;
	}

	function validateTorrentFile(torrent) {
		function bdecode(str) {
			let pos = 0, infoBegin = 0, infoEnd = 0;
			return bdecodeInternal(str);

			function bdecodeInternal(str) {
				if (pos >= str.length) return null;
				switch (str[pos]) {
					case 100: // char code for 'd'
						++pos;
						var retval = [];
						while (str[pos] != 101) { // char code for 'e'
							var key = bdecodeInternal(str), val = bdecodeInternal(str);
							if (key === null || val === null) break;
							retval[key] = val;
						}
						if (infoEnd == -1) infoEnd = pos + 1;
						retval.isDct = true;
						++pos;
						return retval;
					case 105: // char code for 'i'
						++pos;
						var digits = Array.prototype.indexOf.call(str, 101, pos) - pos; // 101 = char code for 'e'
						val = '';
						for (var i = pos; i < digits + pos; ++i) val += String.fromCharCode(str[i]);
						val = Math.round(parseFloat(val));
						pos += digits + 1;
						return val;
					case 108: // char code for 'l'
						++pos;
						retval = [];
						while (str[pos] != 101) { // char code for 'e'
							let val = bdecodeInternal(str);
							if (val === null) break;
							retval.push(val);
						}
						++pos;
						return retval;
					default: {
						digits = Array.prototype.indexOf.call(str, 58, pos) - pos; // 58 = char code for ':'
						if (digits < 0 || digits > 20) return null;
						let len = '';
						for (i = pos; i < digits + pos; ++i) len += String.fromCharCode(str[i]);
						len = parseInt(len);
						pos += digits + 1;
						let fstring = '';
						for (i = pos; i < len + pos; ++i) fstring += String.fromCharCode(str[i]);
						pos += len;
						if (fstring == 'info') {
							infoBegin = pos;
							infoEnd = -1;
						}
						return fstring;
					}
				}
			}
		}

		tfMessages.forEach(elem => { elem.remove() });
		tfMessages = [ ];
		let fr = new FileReader;
		fr.onload = function(evt) {
			torrent = bdecode(new Uint8Array(fr.result));
			if (!torrent || typeof torrent != 'object') {
				console.warn('Assertion failed:', torrent);
				return;
			}
			const maxPathLen = 180;
			let rootImageCount = 0, category = document.getElementById('categories'),
					rootFolderName = decodeURIComponent(escape(torrent.info.name));
			torrent.info.files.forEach(function(file) {
				let fullPath = decodeURIComponent(escape(file.path.join('/')));
				if (/\s{2,}/.test(fullPath))
					tfMessages.push(addMessage('excessive whitespace in file path: ' + fullPath, 'warning'));
				if (file.path.some(folderName => /^\s+|\s+$/.test(folderName)))
					tfMessages.push(addMessage('leading/tailing whitespace in path component: ' + fullPath, 'warning'));
				let fileName = decodeURIComponent(escape(file.path.pop())),
						totalLen = rootFolderName.trueLength() + 1 + fullPath.trueLength();
				if (totalLen > maxPathLen) tfMessages.push(addMessage(new HTML('file "' +
					safeText(fullPath.normalize('NFC').slice(0, Math.max(maxPathLen - 1 - rootFolderName.trueLength(), 0))) +
					safeText(fullPath.normalize('NFC').slice(Math.max(maxPathLen - 1 - rootFolderName.trueLength(), 0))).bold() +
					'" exceeding allowed length (' + totalLen + ' > ' + maxPathLen + ')'), 'warning'));
				if (/(?:\.(?:torrent|\!ut|\!qb|url|lnk|tmp|bak)|^Thumbs\.db)$/i.test(fileName))
					tfMessages.push(addMessage(new HTML('garbage file "' + safeText(fullPath).bold() + '"'), 'warning'));
			});
			let ref = document.querySelector('td.ua-messages-bg');
			if (ref != null && ref.childElementCount <= 0) ref.parentNode.remove();
		};
		fr.onerror = fr.ontimeout = error => { console.error('FileReader error (' + torrent.name + ')') };
		fr.readAsArrayBuffer(torrent);
	}

	file.oninput = function(evt) {
		if (evt.target.files.length > 0) validateTorrentFile(evt.target.files[0]);
	};
	if (file.files.length > 0) validateTorrentFile(file.files[0]);
})();
