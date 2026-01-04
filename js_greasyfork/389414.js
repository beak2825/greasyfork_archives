	// ==UserScript==
	// @name		  Protect Textarea
	// @namespace	  http://www.arantius.com/
	// @description	  Confirm before closing a web page with modified textareas
	// @include		  *
	// @exclude		  http*://*mail.google.com/*
// @version 0.0.1.20190827001948
// @downloadURL https://update.greasyfork.org/scripts/389414/Protect%20Textarea.user.js
// @updateURL https://update.greasyfork.org/scripts/389414/Protect%20Textarea.meta.js
	// ==/UserScript==

	// based on code by Anthony Lieuallen
	// and included here with his gracious permission
	// http://www.arantius.com/article/arantius/protect+textarea/

	//indicator to skip handler because the unload is caused by form submission
	var _pt_skip=false;
	var real_submit = null;

	//find all textarea elements and record their original value
	var els=document.evaluate('//textarea',
		document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var el=null, i=0; el=els.snapshotItem(i); i++) {
		var real_el = el.wrappedJSObject || el;
		real_el._pt_orig_value=el.value;
	}

	//if i>0 we found textareas, so do the rest
	if (i == 0) { return; }
	
	//this function handles the case where we are submitting the form,
	//in this case, we do not want to bother the user about losing data
	var handleSubmit = function() {
		_pt_skip=true;
		return real_submit();
	}
		
	//this function will handle the event when the page is unloaded and
	//check to see if any textareas have been modified
	var handleUnload = function() {
		if (_pt_skip) { return; }
		var els=document.getElementsByTagName('textarea');
		for (var el=null, i=0; el=els[i]; i++) {
			var real_el = el.wrappedJSObject || el;
			if (real_el._pt_orig_value!=el.value) {
				return 'You have modified a textarea, and have not ' +
				'submitted the form.';
				}
			}
		}
		
		// trap form submit to set flag
		real_submit = HTMLFormElement.prototype.submit;
		HTMLFormElement.prototype.submit = handleSubmit;
		window.addEventListener('submit', handleSubmit, true);

		// trap unload to check for unmodified textareas
		unsafeWindow.onbeforeunload = handleUnload;