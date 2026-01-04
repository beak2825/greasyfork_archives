// ==UserScript==
// @name        Microsoft Teams: Patch Missing Conversations
// @namespace   http://www.asaurus.net/
// @description Hot patch "missing conversations" bug where threads are truncated at 2-3 replies
//              and old threads won't populate, after a channel switch.
//              Author: Kevin Buhr <buhr@asaurus.net>
// @match       https://teams.microsoft.com/*
// @version     1.1
// @grant       none
// @license     Public Domain
// @downloadURL https://update.greasyfork.org/scripts/441058/Microsoft%20Teams%3A%20Patch%20Missing%20Conversations.user.js
// @updateURL https://update.greasyfork.org/scripts/441058/Microsoft%20Teams%3A%20Patch%20Missing%20Conversations.meta.js
// ==/UserScript==

var prefix = "Patch Missing Conversations: ";
(function loop() {
	var mp = unsafeWindow.angular && unsafeWindow.angular.element("message-pane");
 	var ct = mp && mp.controller && mp.controller("messagePane");
  if (ct) {
    var cp = ct.constructor.prototype;
    if (cp.initialize.patched) {
      console.log(prefix+"patch already applied");
    } else {
      var oldinitialize = cp.initialize;
      var initialize = function() {
        var that = this.wrappedJSObject || this;
        if (that.context === '') return;
        oldinitialize.call(that);
      }
      initialize.patched = 1;
      cp.initialize = exportFunction(initialize, cp);
    	console.log(prefix+"patch applied");
 	 }
	} else {
  	setTimeout(loop, 1000);
  }
})();
