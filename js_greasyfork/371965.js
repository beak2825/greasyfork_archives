// ==UserScript==
// @name Comprovante PagSeguro
// @namespace http://fcmartins.com.br
// @description O PagSeguro devia ter vergonha de não oferecer suporte a impressora térmica
// @version 0.1
// @include https://pagseguro.uol.com.br/transaction/details/receipt.jhtml?id=*
// @run-at document-idle

// @downloadURL https://update.greasyfork.org/scripts/371965/Comprovante%20PagSeguro.user.js
// @updateURL https://update.greasyfork.org/scripts/371965/Comprovante%20PagSeguro.meta.js
// ==/UserScript==

window.addEventListener("beforeprint", function(event) {
	let head = document.head;
	if(head) {
		Array.from(document.querySelectorAll("iframe")).forEach(el => el.parentNode.removeChild(el));

		let h2 = document.querySelector("h2");
		h2.parentNode.removeChild(h2);

		let receipt = document.querySelector("div.receipt-model");

		let figure = receipt.querySelector("figure");
		figure.parentNode.removeChild(figure);

		let li = receipt.querySelector("span#nsu").parentNode;
		li.parentNode.removeChild(li);

		li = receipt.querySelector("span#cv").parentNode;
		li.parentNode.removeChild(li);

		li = receipt.querySelector("span#arqc").parentNode;
		li.parentNode.removeChild(li);

		li = receipt.querySelector("span#aid").parentNode;
		li.parentNode.removeChild(li);

		Array.from(receipt.querySelectorAll("hr")).forEach(el => el.parentNode.removeChild(el));

		let ul = receipt.querySelector("ul:last-of-type");
		ul.parentNode.removeChild(ul);

		let section = document.querySelector("section");
		section.parentNode.removeChild(section);

		let div = document.querySelector("div#cboxOverlay");
		div.parentNode.removeChild(div);

		div = document.querySelector("div#colorbox");
		div.parentNode.removeChild(div);

		div = document.querySelector("div.receipt-model-tools");
		div.parentNode.removeChild(div);

		Array.from(document.querySelectorAll("[style]")).forEach(el => el.removeAttribute('style'));

		Array.from(document.querySelectorAll("link[rel=\"stylesheet\"]")).forEach(el => el.parentNode.removeChild(el));

		Array.from(document.querySelectorAll("style")).forEach(el => el.parentNode.removeChild(el));

		let style = document.createElement("style");	
		style.setAttribute("type", "text/css");
		style.setAttribute("media", "print");
		style.textContent = "@page {margin-left: 5mm; margin-right: 5mm; margin-top: 0; margin-bottom: 10mm; padding-bottom: 10mm; padding: 0;} body {margin: 0; width: 80mm; font-family: monospace; font-size: 10pt;} div.receipt-model ul {padding: 0;} div.receipt-model ul li {list-style-type: none;} div.receipt-model {background-color: rgb(255, 255, 255); padding: 0; width: 100%;}";
		head.appendChild(style);
	}
}, false);