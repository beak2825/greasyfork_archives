// ==UserScript==
// @name        MTurk Research Tasks Keyboard Shortcuts
// @namespace   http://idlewords.net/
// @description Add keyboard shortcuts to MTurk requester Research Task's HITs
// @include     https://vqa.cloudcv.org/*
// @version     0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10721/MTurk%20Research%20Tasks%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/10721/MTurk%20Research%20Tasks%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

if (document.URL.search('vqa') > -1 && document.getElementById('site_header').textContent.search('Help Us Answer Questions') > -1 && document.getElementById('corrYes')) {
	if (document.getElementById('extra')) {
		document.getElementById('corrYes').value += ' (Y)';
		document.getElementById('extra').value += ' (L)';
		document.getElementById('extra').style.width = '155px';
		document.getElementById('corrMaybe').value += ' (S)';
		document.getElementById('corrMaybe').style.width = '155px';
		document.getElementById('corrNo').value += ' (V)';
	    document.addEventListener('keydown', function(e){
			if (e.keyCode == 89 && e.ctrlKey) { // Ctrl-Y
				document.getElementById('corrYes').click();
				e.preventDefault();
			}
			if (e.keyCode == 76 && e.ctrlKey) { // Ctrl-L
				document.getElementById('extra').click();
				e.preventDefault();
			}
			if (e.keyCode == 83 && e.ctrlKey) { // Ctrl-S
				document.getElementById('corrMaybe').click();
				e.preventDefault();
			}
			if (e.keyCode == 86 && e.ctrlKey) { // Ctrl-V
				document.getElementById('corrNo').click();
				e.preventDefault();
			}
	    });
	} else {
		document.getElementById('corrYes').value += ' (Y)';
		document.getElementById('corrMaybe').value += ' (M)';
		document.getElementById('corrNo').value += ' (N)';
	    document.addEventListener('keydown', function(e){
	        if (e.keyCode == 89 && e.ctrlKey) { // Ctrl-Y
	            document.getElementById('corrYes').click();
	            e.preventDefault();
	        }
	        if (e.keyCode == 78 && e.ctrlKey) { // Ctrl-M
	            document.getElementById('corrNo').click();
	            e.preventDefault();
	        }
	        if (e.keyCode == 77 && e.ctrlKey) { // Ctrl-N
	            document.getElementById('corrMaybe').click();
	            e.preventDefault();
	        }
	    });
	}
}