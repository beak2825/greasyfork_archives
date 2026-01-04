// ==UserScript==
// @name         WAZ+ Decode
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Dekodiert den Bezahlinhalt der FUNKE-Seiten (WAZ+ usw.)
// @author       Jonesmann
// @match        https://www.waz.de/*
// @match        https://www.wr.de/*
// @match        https://www.wp.de/*
// @match        https://www.nrz.de/*
// @match        https://www.ikz-online.de/*
// @match        https://www.otz.de/*
// @match        https://www.thueringer-allgemeine.de/*
// @match        https://www.tlz.de/*
// @match        https://www.abendblatt.de/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/400908/WAZ%2B%20Decode.user.js
// @updateURL https://update.greasyfork.org/scripts/400908/WAZ%2B%20Decode.meta.js
// ==/UserScript==

var shift = 25;

function caesarShift(str, amount) {
	if (amount < 0){
		return caesarShift(str, amount + 26);
    }
	var output = '';
	for (var i = 0; i < str.length; i ++) {
		var c = str[i];
        if (c.match(/[a-z]/i)) {
			var code = str.charCodeAt(i);
			if ((code >= 65) && (code <= 90)){
				c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
            }
			else if ((code >= 97) && (code <= 122)){
				c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
            }
		}
		output += c;
	}
	return output;
};

function replaceSpecials(str) {
    // Deutsch
    str = str.replace(/{/g, 'z');
    str = str.replace(/à/g, 'ß');
    str = str.replace(/Å/g, 'Ä');
    str = str.replace(/å/g, 'ä');
    str = str.replace(/Ý/g, 'Ü');
    str = str.replace(/ý/g, 'ü');
    str = str.replace(/÷/g, 'ö');
    str = str.replace(/×/g, 'Ö');
    str = str.replace(/\[/g, 'Z');

    // Special
    str = str.replace(/#/g, '"');
    str = str.replace(/=/g, '<');
    str = str.replace(/\?/g, '>');
    str = str.replace(/@/g, '!');
    str = str.replace(/-/g, ',');
    str = str.replace(/\./g, '-');
    str = str.replace(/µ/g, '=');
    str = str.replace(/\//g, '.');
    str = str.replace(/0/g, '/');


    // Zahlen
    str = str.replace(/1/g, '0');
    str = str.replace(/2/g, '1');
    str = str.replace(/3/g, '2');
    str = str.replace(/4/g, '3');
    str = str.replace(/5/g, '4');
    str = str.replace(/6/g, '5');
    str = str.replace(/7/g, '6');
    str = str.replace(/8/g, '7');
    str = str.replace(/9/g, '8');
    str = str.replace(/:/g, '9');

    // Special 2
    str = str.replace(/;/g, ':');

//
    str = str.replace(/\!/g, '&#63;');
    str = str.replace(/\*/g, '&#41;');
    str = str.replace(/\)/g, '&#40;');
    str = str.replace(/\'gt´/g, '&#62;');
    str = str.replace(/\'amp´/g, '&#38;');

    return str;
}

var en_text = document.getElementsByClassName("obfuscated");
//console.log(en_text[0].innerText);
var i;
for (i = 0; i < en_text.length; i++) {
    var newText = caesarShift(en_text[i].innerText, shift);
    //console.log(newText);
    if(newText.startsWith("=")){
       newText = "";
    }
    console.log(newText);
    newText = replaceSpecials(newText);
    console.log(newText);
    en_text[i].innerHTML = newText;
    en_text[i].style.display ="block";
}