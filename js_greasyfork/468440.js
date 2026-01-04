// ==UserScript==
// @name            Password Generator
// @name:tr         Şifre Oluşturucu
// @namespace       https://aktolu.com/
// @version         0.6
// @description     Generate random passwords with Context Menu
// @description:tr  Sağ tık menüsünü kullanarak rastgele şifreler oluşturun
// @author          Muhammed Aktolu
// @match           *://*/*
// @icon            https://static-00.iconduck.com/assets.00/security-password-icon-1959x2048-sq0rdvok.png
// @grant           GM_addElement
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/468440/Password%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/468440/Password%20Generator.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
	'use strict';
	
	// Start Global
	const toast = function(text, type = 'success') {
		document.getElementById('myToast')?.remove();
		document.getElementById('myToastStyle')?.remove();
		
		// language=css
		let styleString = `
		#myToast {
			display: inline-block !important;
			padding: 20px !important;
			opacity: .6 !important;
			color: white !important;
			background-color: black !important;
			position: fixed !important;
			top: 20px !important;
			right: 20px !important;
			z-index: 9999999999999999999999 !important;
		}
		
		#myToast.success {
			background-color: green !important;
		}
		
		#myToast.warning {
			background-color: orange !important;
		}
		
		#myToast.danger {
			background-color: darkred !important;
		}
		`;
		let style = multilineCss(styleString, 'myToastStyle');
		
		let block = GM_addElement(document.body, 'div', {
			id: 'myToast',
			class: type,
		});
		
		block.innerText = text;
		
		setTimeout(() => {
			block.remove();
			style.remove();
		}, 5000);
	}
	
	const multilineCss = function(style, id = '') {
		let el = GM_addStyle(style);
		if (id !== '') {
			el.id = id;
		}
		
		return el;
	}
	// End Global
	
	// Start Password Generator
	const generatePassword = function(length = 16, minPerType = 2, uppercase = true, lowercase = true, number = true, symbol = false) {
		let string = '';
		let pass = {
			uppercase: true,
			lowercase: true,
			number: true,
			symbol: true,
		}
		let match;
		if (uppercase) {
			string += 'ABCDEFGHJKMNPQRSTUVWXYZ';
		}
		
		if (lowercase) {
			string += 'abcdefghjkmnpqrstuvwxyz';
		}
		
		if (number) {
			string += '23456789';
		}
		
		if (symbol) {
			string += '!";#$%&\'()*+,-./:;<=>?@[]^_`{|}~';
		}
		
		let password = Array.from(crypto.getRandomValues(new Uint32Array(length)))
			.map((x) => string[x % string.length])
			.join('');
		
		if (uppercase) {
			match = password.match(/[A-Z]/g);
			if (!match || match.length < minPerType) {
				pass.uppercase = false;
			}
		}
		
		if (lowercase) {
			match = password.match(/[a-z]/g);
			if (!match || match.length < minPerType) {
				pass.lowercase = false;
			}
		}
		
		if (number) {
			match = password.match(/\d/g);
			if (!match || match.length < minPerType) {
				pass.number = false;
			}
		}
		
		if (symbol) {
			match = password.match(/[^A-Za-z0-9]/g);
			if (!match || match.length < minPerType) {
				pass.symbol = false;
			}
		}
		
		if (password.match(/(.)\1/) || !pass.uppercase || !pass.lowercase || !pass.number || !pass.symbol) {
			return generatePassword(length, minPerType, uppercase, lowercase, number, symbol);
		} else {
			return password;
		}
	}
	// End Password Generator
	
	GM_registerMenuCommand('Generate Password', function() {
		if (document.getElementById('pgBlock')) {
			return false;
		}
		
		//let length = GM_getValue('passwordGeneratorLength', '16');
		let password = generatePassword(GM_getValue('pgLength', 16), GM_getValue('pgMinPerType', 2), GM_getValue('pgUppercase', true), GM_getValue('pgLowercase', true), GM_getValue('pgNumber', true), GM_getValue('pgSymbol', false));
		
		// language=css
		let styleString = `
		#pgBlock {
			position: fixed !important;
			width: 100vw !important;
			height: 100vh !important;
			z-index: 999999999999999999999 !important;
			display: flex !important;
			align-items: center !important;
			justify-content: center !important;
			background-color: rgba(0, 0, 0, .9) !important;
			left: 0 !important;
			top: 0 !important;
		}
		
		#pgBlock * {
			font-family: Helvetica, Arial, sans-serif !important;
			font-size: 15px !important;
			font-weight: 300 !important;
			letter-spacing: 0 !important;
			line-height: 100% !important;
			color: whitesmoke !important;
			float: none !important;
			border-radius: 0 !important;
		}
		
		#pgBlock div {
			display: block !important;
		}
		
		#pgBlock button {
			background-color: red !important;
			padding: 10px 30px !important;
			border: none !important;
			cursor: pointer !important;
		}
		
		#pgBlock input {
			margin-inline: 0 !important;
			font-size: 13px !important;
			display: inline !important;
		}
		
		#pgBlock input[type="number"] {
			background-color: black !important;
			border: 1px solid whitesmoke !important;
			width: 60px !important;
			padding: 1px 0 1px 2px !important;
			appearance: auto !important;
		}
		
		#pgBlock label {
			margin-right: 15px !important;
			cursor: pointer !important;
			-webkit-user-select: none !important;
			user-select: none !important;
		}

		.pgBox {
			text-align: center !important;
		}

		#pgPassword {
			font-size: 3rem !important;
			margin-bottom: 15px !important;
		}
		`;
		
		let style = multilineCss(styleString);
		let block = GM_addElement(document.body, 'div', {
			id: 'pgBlock',
		});
		
		// language=html
		block.innerHTML = `<div class="pgBox">
			<div id="pgPassword"></div>
			<div>
				<button id="pgCopyPassword">Copy</button>
				<button id="pgCancelPassword">Cancel</button>
			</div>
			<div style="margin-top: 100px">
				<div>
					Length: <input id="pgPasswordLength" type="number" value="`+GM_getValue('pgLength', 16)+`" style="margin-right: 60px" min="8" max="64">
					Min Chars Per Type: <input id="pgPasswordMinPerType" type="number" value="`+GM_getValue('pgMinPerType', 2)+`" min="0">
				</div>
				<div style="margin-top: 10px">
					<label>Uppercase: <input id="pgUppercase" type="checkbox"`+(GM_getValue('pgUppercase', true) ? ' checked' : '')+`></label>
					<label>Lowercase: <input id="pgLowercase" type="checkbox"`+(GM_getValue('pgLowercase', true) ? ' checked' : '')+`></label>
					<label>Number: <input id="pgNumber" type="checkbox"`+(GM_getValue('pgNumber', true) ? ' checked' : '')+`></label>
					<label>Symbol: <input id="pgSymbol" type="checkbox"`+(GM_getValue('pgSymbol', false) ? ' checked' : '')+`></label>
				</div>
				<button id="pgReGeneratePassword" style="margin-top: 25px">Regenerate Password</button>
			</div>
		</div>`;
		
		let passwordDiv = document.getElementById('pgPassword');
		let copyButton = document.getElementById('pgCopyPassword');
		let cancelButton = document.getElementById('pgCancelPassword');
		let passwordLengthInput = document.getElementById('pgPasswordLength');
		let minPerTypeInput = document.getElementById('pgPasswordMinPerType');
		let uppercaseCheckBox = document.getElementById('pgUppercase');
		let lowercaseCheckBox = document.getElementById('pgLowercase');
		let numberCheckBox = document.getElementById('pgNumber');
		let symbolCheckBox = document.getElementById('pgSymbol');
		let reGenerateButton = document.getElementById('pgReGeneratePassword');
		
		passwordDiv.innerText = password;
		
		copyButton.addEventListener('click', () => {
			navigator.clipboard.writeText(password)
				.then(r => toast('Password has been copied successfully.'));
			block.remove();
			style.remove();
		});
		
		cancelButton.addEventListener('click', () => {
			block.remove();
			style.remove();
		});
		
		[passwordLengthInput, minPerTypeInput].forEach(item => {
			item.addEventListener('click', () => {
				item.select();
			});
		});
		
		reGenerateButton.addEventListener('click', function() {
			GM_setValue('pgLength', parseInt(passwordLengthInput.value));
			GM_setValue('pgMinPerType', parseInt(minPerTypeInput.value));
			GM_setValue('pgUppercase', uppercaseCheckBox.checked);
			GM_setValue('pgLowercase', lowercaseCheckBox.checked);
			GM_setValue('pgNumber', numberCheckBox.checked);
			GM_setValue('pgSymbol', symbolCheckBox.checked);
			password = generatePassword(parseInt(passwordLengthInput.value), parseInt(minPerTypeInput.value), uppercaseCheckBox.checked, lowercaseCheckBox.checked, numberCheckBox.checked, symbolCheckBox.checked);
			passwordDiv.innerText = password;
		});
	});
})();