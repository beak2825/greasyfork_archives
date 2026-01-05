// ==UserScript==
// @name           bw-flash-pass
// @description    http://www.bloodyworld.com
// @include http://www.bloodyworld.com/
// @version 0.0.1.20150604004341
// @namespace https://greasyfork.org/users/12000
// @downloadURL https://update.greasyfork.org/scripts/10249/bw-flash-pass.user.js
// @updateURL https://update.greasyfork.org/scripts/10249/bw-flash-pass.meta.js
// ==/UserScript==
// (c) Anton Fedorov aka DataCompBoy, 2006-2007
// Clan <The Keepers of Balance>.

  window.opera.addEventListener('AfterEvent.load',function(e) {
	if( e.event.target instanceof Document ) {
	  if (document.forms["flash_pass_form"])
		document.forms["flash_pass_form"].flashpass.type = "input";
	}
  }, false);
