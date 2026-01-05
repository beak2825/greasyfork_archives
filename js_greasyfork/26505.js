// ==UserScript==
// @name           Pokec.sk - sifrovanie sprav na skle
// @namespace      https://greasyfork.org/en/users/3953-maxsvk
// @description    Pridava funkciu pisat na sklo sifrovane spravy. Spravy desifruje len ten, kto ma tento skript a spravny desifrovaci kluc.
// @include        http://pokec-sklo.azet.sk/miestnost/*
// @include        http://www-pokec.azet.sk/miestnost/*
// @icon           http://s.aimg.sk/pokec_base/css/favicon.ico
// @require        https://greasyfork.org/scripts/26504-pokec-utils/code/pokec-utils.js?version=169147
// @require        https://bowercdn.net/c/aes-js-2.1.0/index.js
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @grant          GM_addStyle
// @author         MaxSVK
// @version        1.0
// @date           2017-January-13
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/26505/Pokecsk%20-%20sifrovanie%20sprav%20na%20skle.user.js
// @updateURL https://update.greasyfork.org/scripts/26505/Pokecsk%20-%20sifrovanie%20sprav%20na%20skle.meta.js
// ==/UserScript==

/* ********** Global variables ********************************************** */

var prefixOfEncypted = "[[[";
var suffixOfEncypted = "]]]";
// NOTE: if future release change encrypt/decrypt then we need change this string
// to ensure sender and receiver have compatible version of userscript.
var prefixInMessage = ">v1>";

/* ********** Helper functions ********************************************** */

function randomString(len) {
	var text = "";
	var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < len; i++) {
		text += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return text;
}

function encryptArray(arr) {
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		var value = arr[i].toString(32);
		if (value.length < 2) {
			value = "0" + value;
		}
		result.push(value);
	}
	return result;
}

function decryptArray(arr) {
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		result.push(String.fromCharCode(parseInt(arr[i], 32)).charCodeAt(0));
	}
	return result;
}

/* ********** Key storage functions ***************************************** */

var KeyStore = (function () {
	"use strict";

	// name of logged user
	var masterKeyId = document.getElementById("nickBull").innerHTML;

	function get(id) {
		var key = GM_getValue(id);
		if (key === undefined) {
			return GM_getValue(masterKeyId);
		} else {
			return key;
		}
	}

	function set(id, key) {
		GM_setValue(id, key);
	}

	function remove(id) {
		GM_deleteValue(id);
	}

	function getAll() {
		return GM_listValues();
	}

	return {
		getKey: function(id) {
			return get(id);
		},

		setKey: function(id, key) {
			set(id, key);
		},

		removeKey: function(id) {
			remove(id);
		},

		getMasterKey: function() {
			return get(masterKeyId);
		},

		setMasterKey: function(key) {
			set(masterKeyId, key);
		},

		getAllIds: function() {
			return getAll();
		}
	};

}());

/* ********** Functions for UI ********************************************** */

function changeMasterKey() {
	var newMasterKey = prompt("Zadaj šifrovací kľúč", "");
	if (newMasterKey.length === 16 || newMasterKey.length === 24 || newMasterKey.length === 32) {
		KeyStore.setMasterKey(newMasterKey);
	} else {
		alert("Chyba!\nŠifrovací kľúč musí mať 16, 24 alebo 32 znakov");
	}
}

function resetMasterKey() {
	var masterKey = randomString(16);
	KeyStore.setMasterKey(masterKey);
	alert("Nový šifrovací kľúč je '" + masterKey + "'");
}

function setUserKey() {
	var userName = prompt("Zadaj meno používateľa", "");
	var userKey = prompt("Zadaj šifrovací kľúč", "");
	if (userName.length > 0 && userKey.length > 0) {
		if (userKey.length === 16 || userKey.length === 24 || userKey.length === 32) {
			KeyStore.setKey(userName, userKey);
		} else {
			alert("Chyba!\nŠifrovací kľúč musí mať 16, 24 alebo 32 znakov");
		}
	} else {
		alert("Chyba v zadaných údajoch!");
	}
}

function setRandomUserKey() {
	var userName = prompt("Zadaj meno používateľa", "");
	if (userName.length > 0) {
		var userKey = randomString(16);
		KeyStore.setKey(userName, userKey);
		alert("Šifrovací kľúč pre '" + userName + "' je '" + userKey + "'");
	} else {
		alert("Chyba!\nNezadal si meno");
	}
}

function removeUserKey() {
	var userName = prompt("Zadaj meno používateľa", "");
	if (userName.length > 0) {
		KeyStore.removeKey(userName);
	} else {
		alert("Chyba!\nNezadal si meno");
	}
}

function showAllKeys() {
	var message = "";
	var ids = KeyStore.getAllIds();
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		message += "'" + id + "' ==> '" + KeyStore.getKey(id) + "'\n";
	}
	alert(message);
}

function removeAllKeys() {
	var r = confirm("Vymazať všetky šifrovacie kľúče?");
	if (r === true) {
		var ids = KeyStore.getAllIds();
		for (var i = 0; i < ids.length; i++) {
			var id = ids[i];
			if (PokecUtils.getUserName().localeCompare(id) !== 0) { // 0 means string are equal
				KeyStore.removeKey(id);
			}
		}
		alert("Všetky šifrovacie kľúče boli vymazané");
	}
}

/* ********** Register menu commands for key handling *********************** */

GM_registerMenuCommand("Zmeniť šifrovací kľúč", changeMasterKey);
GM_registerMenuCommand("Vygenerovať náhodný šifrovací kľúč", resetMasterKey);

GM_registerMenuCommand("Nastaviť šifrovací kľúč pre používateľa", setUserKey);
GM_registerMenuCommand("Vygenerovať náhodný šifrovací kľúč pre používateľa", setRandomUserKey);
GM_registerMenuCommand("Vymazať šifrovací kľúč pre používateľa", removeUserKey);

GM_registerMenuCommand("Zobraziť všetky šifrovacie kľúče", showAllKeys);

GM_registerMenuCommand("Vymazať všetky šifrovacie kľúče", removeAllKeys);

/* ********** Main encrypt/decrypt functions ******************************** */

function encryptText(text, key) {
	// TODO: Temporary logging for debug purposes.
	console.log("Encrypting text '" + text + "' with key '" + key + "'");
	var textBytes = aesjs.util.convertStringToBytes(text);
	var keyBytes = aesjs.util.convertStringToBytes(key);

	// The counter is optional, and if omitted will begin at 0
	var aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(5));
	var encryptedBytes = aesCtr.encrypt(textBytes);

	var encryptedText = encryptArray(encryptedBytes).join('');
	// TODO: Temporary logging for debug purposes.
	console.log("Encrypted text '" + encryptedText + "'");
	return encryptedText;
}

function decryptText(text, key) {
	// TODO: Temporary logging for debug purposes.
	console.log("Decrypting text '" + text + "' with key '" + key + "'");
	var encryptedBytes = decryptArray(text.match(/.{1,2}/g));
	var keyBytes = aesjs.util.convertStringToBytes(key);

	// The counter mode of operation maintains internal state, so to
	// decrypt a new instance must be instantiated.
	var aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(5));
	var decryptedBytes = aesCtr.decrypt(encryptedBytes);

	// Convert our bytes back into text
	var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
	// TODO: Temporary logging for debug purposes.
	console.log("Decrypted text '" + decryptedText + "'");
	return decryptedText;
}

/* ********** Create GUI for message encryption ***************************** */

function createGUI(doc) {
	var odosielacElement = doc.getElementById("odosielac");

	var buttonElement = doc.createElement("button");
	buttonElement.className = "tlacidlo prvok";
	buttonElement.innerHTML = "Zašifrovať";
	buttonElement.setAttribute("style", "position: absolute; top: 66px; right: 232px; font-size: 13px; width: 82px;");
	buttonElement.onclick = function() {
		var messageToElement = doc.getElementById("messageTo");
		var messageTo = messageToElement.value;
		var key = KeyStore.getKey(messageTo);
		var messageTextElement = doc.getElementById("messageText");
		var text = prefixInMessage + messageTextElement.value;
		text = encryptText(text, key);
		text = prefixOfEncypted + text + suffixOfEncypted;
		if (text.length > 250) {
			alert("Chyba!\nVýsledný text je príliš dlhý na odoslanie.");
		} else {
			messageTextElement.value = text;
		}
	};

	// Add button as child element. We use parent node of form to avoid interruption of form submit
	odosielacElement.parentNode.appendChild(buttonElement);

	// Add new CSS
	GM_addStyle(
		'#messageText {margin-right: 100px !important;}\n' +
		'#zalozky {margin-left: 100px !important;}\n'
	);
}

createGUI(document);

/* ********** Initialise script ********************************************* */

// Set master encryption key if needed
var masterKey = KeyStore.getMasterKey();
if (masterKey === undefined) {
	var masterKey = randomString(16);
	KeyStore.setMasterKey(masterKey);
}

/* ********** Register event listener for message decryption **************** */

var sklo = document.getElementById("sklo");
sklo.addEventListener("DOMNodeInserted", function(event) {

	var nodes = event.target.getElementsByClassName("prispevok");

	for(var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		var text = node.innerHTML;

		// decrypt node text if needed
		if(text.indexOf(prefixOfEncypted) > -1 && text.indexOf(suffixOfEncypted) > -1) {
			var dtNodes = node.parentNode.parentNode.getElementsByClassName("dt");
			// in variable 'nick' we have nick of user that send or received message
			var nick;
			// first we need find sender of message
			nick = dtNodes[i].getAttribute("data-azetid");

			if (PokecUtils.getUserName().localeCompare(nick) === 0) { // equals is true, this message is from you so we have to find nick of receiver
				var menoElement = node.getElementsByClassName("meno")[0];
				if (menoElement !== undefined) {
					nick = menoElement.innerHTML;
				}
			}

			var key = KeyStore.getKey(nick);
			var originalText = text.substring( text.indexOf(prefixOfEncypted) + prefixOfEncypted.length, text.lastIndexOf(suffixOfEncypted) );
			var decryptedText = decryptText(originalText, key);
			// Show message only if decrypting was success
			if (decryptedText.startsWith(prefixInMessage)) {
				decryptedText = decryptedText.substring(prefixInMessage.length);
				// Underline for all decrypted messages, as visible information.
				node.innerHTML = text.replace(prefixOfEncypted + originalText + suffixOfEncypted, "<u>" + decryptedText + "</u>");
			}
		}
	}

}, true);