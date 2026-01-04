// ==UserScript==
// @name         	Drag Link to Copy Text
// @name:zh			拖动链接以复制文本
// @name:fr			Faites glisser le lien pour copier du texte
// @name:de			Ziehen Sie den Link zum Kopieren von Text
// @name:ru			Перетащите ссылку, чтобы скопировать текст
// @name:es			Arrastre el enlace para copiar texto
// @description  	Copy text of any link by simply dragging it.
// @description:zh	只需拖动即可复制任何链接的文本。
// @description:fr	Copiez le texte de n'importe quel lien en le faisant simplement glisser.
// @description:de	Kopieren Sie den Text eines Links, indem Sie ihn einfach ziehen.
// @description:ru	Скопируйте текст любой ссылки, просто перетащив ее.
// @description:es	Copia el texto de cualquier enlace simplemente arrastrándolo.
// @namespace    	iamMG
// @license			MIT
// @version     	1.1
// @icon			https://i.imgur.com/43qD1oK.png
// @match        	http*://*/*
// @author       	iamMG
// @run-at			document-end
// @grant        	GM_setClipboard
// @copyright		2020, iamMG (https://openuserjs.org/users/iamMG)
// @downloadURL https://update.greasyfork.org/scripts/381604/Drag%20Link%20to%20Copy%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/381604/Drag%20Link%20to%20Copy%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var links = document.getElementsByTagName("a");
	function copier(txt) {
		return function() {
			var temp = document.createElement("textarea");
			document.body.appendChild(temp);
			temp.innerText = txt;
			temp.select();
			if (document.visibilityState == 'visible') document.execCommand('copy');
			temp.parentElement.removeChild(temp);
		}
	}
	for (var i=0; i<links.length; i++ ) {
		var txt = links[i].innerText;
		if (txt) {links[i].addEventListener('dragend', copier(txt), false);}
	}
})();