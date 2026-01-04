// ==UserScript==
// @name         FXP Custom Writeout.
// @namespace    http://pa0neix.github.io/
// @version      1.0
// @description  pnx shit...
// @author       pnx
// @match        https://www.fxp.co.il/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390151/FXP%20Custom%20Writeout.user.js
// @updateURL https://update.greasyfork.org/scripts/390151/FXP%20Custom%20Writeout.meta.js
// ==/UserScript==

function RTP(x) {
	function rgbToHex(r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
		var y = '', z = 0;
		let gen = Math.round(255 / (x.length - (x.match(/\s/g) == null ? 0 : x.match(/\s/g).length)));
    x.split('').forEach(function(e,i) {
			if(e.match(/\s/g)) return y += ' ';
			if(i!=0) z += gen; else z = 0;
			if(i == x.length - 1) z = 255;
      let tmp = rgbToHex(255, 0, z);
      y += '[COLOR='+tmp+']'+e+'[/COLOR]';
	  	console.log(z);
    });
	return y;
}

var waitforit = setInterval(function() {
	if(!document.querySelector('*[name="sbutton"]')) return;
	document.querySelectorAll('*[name="sbutton"]').forEach(function(ex) {
		if(ex.getAttribute('niqqa') == '') return;
		ex.setAttribute('niqqa', '');
		console.log('inserted into \\/ (niqqa marked).');
		console.log(ex);
		ex.addEventListener('click', function(elem) {
			elem.preventDefault();
			var x = null;
			if(document.querySelector('#cke_contents_vB_Editor_QR_editor')) x = document.querySelector('#cke_contents_vB_Editor_QR_editor>iframe').contentDocument.querySelector('body').innerHTML;
			else x = document.querySelector('.wysibb-body').innerText;
			var tmp = x;
			x.split(/\n/g).forEach(function(e) {
			    e.split(/\[.*\/\w+\]/g).forEach(function(rep) {
			        tmp = '[FONT=open sans hebrew]' + tmp.replace(rep, RTP(rep)) + '[/FONT]';
			    });
			});
			elem.target.form.querySelector('#message,textarea[name="message"]').value = tmp;
			elem.target.form.submit();
		});
	});
}, 750);