    // ==UserScript==
    // @name         junon.io cheese auto clicker
    // @namespace    http://tampermonkey.net/
    // @version      auto
    // @description  just a test
    // @author       cheese
    // @match        junon.io
    // @require      http://code.jquery.com/jquery-3.4.1.min.js
    // @grant        none
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495828/junonio%20cheese%20auto%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/495828/junonio%20cheese%20auto%20clicker.meta.js
    // ==/UserScript==
    var event = new KeyboardEvent('keydown', {
	key: 'g',
	ctrlKey: true
});
 
setInterval(function(){
	for (i = 0; i < 100; i++) {
		document.dispatchEvent(event);
	}
}, 100); 