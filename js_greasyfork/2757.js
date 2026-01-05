// ==UserScript==
// @name		MultiIMG
// @namespace		http://www.wykop.pl/ludzie/piokom123/
// @description		Dodatek umożliwia umieszczanie wielu zdjęć we wpisach
// @author		piokom123
// @version		1.0.4
// @grant		none
// @include		http://www.wykop.pl/*
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/2757/MultiIMG.user.js
// @updateURL https://update.greasyfork.org/scripts/2757/MultiIMG.meta.js
// ==/UserScript==
// Pomysł by @Mehgods

function main() {
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    function AES_Init(){AES_Sbox_Inv=new Array(256);for(var e=0;e<256;e++)AES_Sbox_Inv[AES_Sbox[e]]=e;AES_ShiftRowTab_Inv=new Array(16);for(var e=0;e<16;e++)AES_ShiftRowTab_Inv[AES_ShiftRowTab[e]]=e;AES_xtime=new Array(256);for(var e=0;e<128;e++){AES_xtime[e]=e<<1;AES_xtime[128+e]=e<<1^27}}function AES_Done(){delete AES_Sbox_Inv;delete AES_ShiftRowTab_Inv;delete AES_xtime}function AES_ExpandKey(e){var t=e.length,n,r=1;switch(t){case 16:n=16*(10+1);break;case 24:n=16*(12+1);break;case 32:n=16*(14+1);break;default:alert("AES_ExpandKey: Only key lengths of 16, 24 or 32 bytes allowed!")}for(var i=t;i<n;i+=4){var s=e.slice(i-4,i);if(i%t==0){s=new Array(AES_Sbox[s[1]]^r,AES_Sbox[s[2]],AES_Sbox[s[3]],AES_Sbox[s[0]]);if((r<<=1)>=256)r^=283}else if(t>24&&i%t==16)s=new Array(AES_Sbox[s[0]],AES_Sbox[s[1]],AES_Sbox[s[2]],AES_Sbox[s[3]]);for(var o=0;o<4;o++)e[i+o]=e[i+o-t]^s[o]}}function AES_Encrypt(e,t){var n=t.length;AES_AddRoundKey(e,t.slice(0,16));for(var r=16;r<n-16;r+=16){AES_SubBytes(e,AES_Sbox);AES_ShiftRows(e,AES_ShiftRowTab);AES_MixColumns(e);AES_AddRoundKey(e,t.slice(r,r+16))}AES_SubBytes(e,AES_Sbox);AES_ShiftRows(e,AES_ShiftRowTab);AES_AddRoundKey(e,t.slice(r,n))}function AES_Decrypt(e,t){var n=t.length;AES_AddRoundKey(e,t.slice(n-16,n));AES_ShiftRows(e,AES_ShiftRowTab_Inv);AES_SubBytes(e,AES_Sbox_Inv);for(var r=n-32;r>=16;r-=16){AES_AddRoundKey(e,t.slice(r,r+16));AES_MixColumns_Inv(e);AES_ShiftRows(e,AES_ShiftRowTab_Inv);AES_SubBytes(e,AES_Sbox_Inv)}AES_AddRoundKey(e,t.slice(0,16))}function AES_SubBytes(e,t){for(var n=0;n<16;n++)e[n]=t[e[n]]}function AES_AddRoundKey(e,t){for(var n=0;n<16;n++)e[n]^=t[n]}function AES_ShiftRows(e,t){var n=(new Array).concat(e);for(var r=0;r<16;r++)e[r]=n[t[r]]}function AES_MixColumns(e){for(var t=0;t<16;t+=4){var n=e[t+0],r=e[t+1];var i=e[t+2],s=e[t+3];var o=n^r^i^s;e[t+0]^=o^AES_xtime[n^r];e[t+1]^=o^AES_xtime[r^i];e[t+2]^=o^AES_xtime[i^s];e[t+3]^=o^AES_xtime[s^n]}}function AES_MixColumns_Inv(e){for(var t=0;t<16;t+=4){var n=e[t+0],r=e[t+1];var i=e[t+2],s=e[t+3];var o=n^r^i^s;var u=AES_xtime[o];var a=AES_xtime[AES_xtime[u^n^i]]^o;var f=AES_xtime[AES_xtime[u^r^s]]^o;e[t+0]^=a^AES_xtime[n^r];e[t+1]^=f^AES_xtime[r^i];e[t+2]^=a^AES_xtime[i^s];e[t+3]^=f^AES_xtime[s^n]}}function init(e){AES_Init();var t=string2Bin(e);AES_ExpandKey(t);return t}function encrypt(e,t){var n=string2Bin(e);AES_Encrypt(n,t);var r=bin2String(n);return r}function decrypt(e,t){block=string2Bin(e);AES_Decrypt(block,t);var n=bin2String(block);return n}function encryptLongString(e,t){if(e.length>16){var n="";for(var r=0;r<e.length;r=r+16){n+=encrypt(e.substr(r,16),t)}return n}else{return encrypt(e,t)}}function decryptLongString(e,t){if(e.length>16){var n="";for(var r=0;r<e.length;r=r+16){n+=decrypt(e.substr(r,16),t)}return n}else{return decrypt(e,t)}}function finish(){AES_Done()}function bin2String(e){var t="";for(var n=0;n<e.length;n++){t+=String.fromCharCode(parseInt(e[n],2))}return t}function string2Bin(e){var t=[];for(var n=0;n<e.length;n++){t.push(e.charCodeAt(n))}return t}function bin2String(e){return String.fromCharCode.apply(String,e)}AES_Sbox=new Array(99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22);AES_ShiftRowTab=new Array(0,5,10,15,4,9,14,3,8,13,2,7,12,1,6,11);
    var key = init('g&3jg8*3ns0GDb83');

	var addonInfo = 'Musisz zainstalować dodatek MultiIMG, żeby zobaczyć obrazki w tym wpisie';
	function checkForSupportedTags(content) {
		if (content.indexOf('[') !== -1) {
			return true;
		}

		return false;
	}

	function replaceUrls(content) {
        if (typeof content === 'undefined' || typeof content.indexOf != 'function') {
            return content;
        }

		var replaced = false;

		if (content.indexOf('http://i.imgur.com/') !== -1) {
			content = content.replace(/http:\/\/i\.imgur.com\/(.*?)\.([A-Za-z]+)/g, function(match, g1, g2) {
                return '[' + Base64.encode(encrypt(g1, key)).replace(/[=]+/g, '') + ']'
            });
			replaced = true;
		}

		//if (replaced && content.indexOf(addonInfo) === -1) {
		//	content += "\n\n ! " + addonInfo;
		//}

		return content;
	}

	function replaceTags(content) {
		var addedContent = '';
		var regExp = /\[([A-Za-z0-9\+=\/]+)\]/g;

		match = regExp.exec(content);
		while (match != null) {
            addedContent += getImgHtml(getTagDataImgur(decrypt(Base64.decode(match[1]), key)));

			match = regExp.exec(content);
		}

		content = content.replace(/\[([A-Za-z0-9\+=\/]+)\]/g, '');
		content = content.replace(/^([\s]+)?<br(.*?)>/mg, '');

		content += addedContent;

		return content;
	}

	function getTagDataImgur(tagContent) {
        tagContent = tagContent.replace(/[^A-Za-z0-9]/g, '');
		return [
			'imgur' + tagContent,
			'http://i.imgur.com/' + tagContent + '.jpg',
			tagContent + '.jpg'
		];
	}

	function getImgHtml(data) {
		return '<div class="media-content" data-type="entry" data-id="' + data[0] + '">'
			+ '<a href="' + data[1] + '" rel="lightbox[w]" data-open="1" class="" >'
			+ '<img src="' + data[1] + '" class="block" style="max-width: 400px !important; border: 3px solid green">'
			+ '</a><p class="description light" data-type="entry" data-id="' + data[0] + '">'
			+ 'źródło: <a href="' + data[1] + '" target="_blank" data-open="1">' + data[2] + '</a><p></div>'
			+ '<div>&nbsp;</div>';
	}

	function attachToMediaForm(container) {
        if ($('.mfUploadHolder .editmultiimg', container).length == 0) {
            $('.mfUploadHolder .editspoiler', container).after('<a class="button editmultiimg" title="MultiIMG" href="#">MultiIMG</a>');
        }

		$('.editmultiimg', container).on('click', function() {
			$('textarea', $('.mfUploadHolder .editspoiler', container).parents('.mfUploadHolder')).val(replaceUrls($('textarea', $('.mfUploadHolder .editspoiler', container).parents('.mfUploadHolder')).val()));

			return false;
		});
	}

	$(document).ready(function() {
		$('#itemsStream .text p').each(function(index, item) {
			if (checkForSupportedTags(item.innerHTML)) {
				item.innerHTML = replaceTags(item.innerHTML);
			}
		});

		document.title = document.title.replace(/\[(.*?)\]/g, '');

		attachToMediaForm(document);

		$(document).on('DOMNodeInserted', function(e) {
			if ($('.text p', $(e.target)).length > 0) {
				var node = $('.text p', $(e.target));

				if (checkForSupportedTags(node.html())) {
					node.html(replaceTags(node.html()));
				}
			}

			if ($('.reply.ajax', $(e.target)).length > 0) {
				var node = $('.reply.ajax', $(e.target));

				attachToMediaForm(node);
			}
		});
	});
}

if (typeof $ == 'undefined') {
	if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
		// Firefox
		var $ = unsafeWindow.jQuery;
		main();
	} else {
		// Chrome
		addJQuery(main);
	}
} else {
	// Opera >.>
	main();
}

function addJQuery(callback) {
	var script = document.createElement("script");
	script.textContent = "(" + callback.toString() + ")();";
	document.body.appendChild(script);
}
