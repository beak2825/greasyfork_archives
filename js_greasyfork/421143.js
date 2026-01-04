// ==UserScript==
// @name         Quick Copy - aonprd
// @namespace    http://statonions.com/
// @version      0.6
// @description  Copy from aonprd
// @author       Noon
// @match        https://www.aonprd.com/*
// @match        https://aonprd.com/*
// @downloadURL https://update.greasyfork.org/scripts/421143/Quick%20Copy%20-%20aonprd.user.js
// @updateURL https://update.greasyfork.org/scripts/421143/Quick%20Copy%20-%20aonprd.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var meat = document.querySelector("#main");
	meat.innerHTML = splitHeads(meat.innerHTML,1);

	document.querySelectorAll('h1,h2,h3').forEach(o => {
		o.onclick = (p) => {
			var target = p.target, copy;
			if (event.shiftKey) copy = copyTextToClipboard(target.outerHTML + "\n" + target.nextElementSibling.outerHTML);
			else copy = copyTextToClipboard(target.innerText + "\n" + target.nextElementSibling.innerText);
			if (copy) target.nextElementSibling.style['background-color'] = 'slategrey';
		};
	});

	function copyTextToClipboard(text) {
		var textArea = document.createElement("textarea");
		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;
		textArea.style.width = '2em';
		textArea.style.height = '2em';
		textArea.style.padding = 0;
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';
		textArea.style.background = 'transparent';
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful'; console.log('Copying text command was ' + msg);
			document.body.removeChild(textArea);
			return true;
			//GM_notification({text: msg, silent: true, timeout: 2});
		} catch (err) {
			console.log('Oops, unable to copy');
			document.body.removeChild(textArea);
			return false;
		}
	};

	function splitHeads(flesh, depth) {
		if (depth > 3) return flesh;
		var reg = new RegExp(`(<h${depth}[^>]*>.*?<\/h${depth}>)`, "g");
		return flesh.split(reg).filter(o => o).map((p,idx,arr) => {
			if (arr.length == 1) return splitHeads(p, depth+1);
			if (idx != 0 && parseInt(p.charAt(2)) != depth) return `<div>${splitHeads(p, depth+1)}</div>`;
			return p;
		}).join("\n");
	}

	document.onkeyup=function(e){
		e = e || window.event; // for IE to cover IEs window object
		if(e.shiftKey && e.which == 67) {
			var sel = getSelection()?.anchorNode?.parentNode.closest('h1.title').parentNode;
			if (!sel)
				sel = document.querySelector("h1.title").parentNode;
			if (copyTextToClipboard(sel.innerText.trim()))
				sel.style['background-color'] = 'slategrey';
			return true;
		}
	}

})();