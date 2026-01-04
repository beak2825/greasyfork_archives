// ==UserScript==
// @name         Bloquear camaleon
// @namespace    https://www.taringa.net/rata__7
// @version      0.2
// @description  Bloquear a camaleon
// @author       Nezumi
// @match        *://www.taringa.net/mi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30795/Bloquear%20camaleon.user.js
// @updateURL https://update.greasyfork.org/scripts/30795/Bloquear%20camaleon.meta.js
// ==/UserScript==

;(function ($, window) {
    var intervals = {};
    var removeListener = function(selector) {
    	if (intervals[selector]) {
    		window.clearInterval(intervals[selector]);
    		intervals[selector] = null;
    	}
    };
    var found = 'waitUntilExists.found';
    $.fn.waitUntilExists = function(handler, shouldRunHandlerOnce, isChild) {
    	var selector = this.selector;
    	var $this = $(selector);
    	var $elements = $this.not(function() { return $(this).data(found); });
    	if (handler === 'remove') {
    		// Hijack and remove interval immediately if the code requests
    		removeListener(selector);
    	} else {
    		// Run the handler on all found elements and mark as found
    		$elements.each(handler).data(found, true);
    		if (shouldRunHandlerOnce && $this.length) {
    			// Element was found, implying the handler already ran for all 
    			// matched elements
    			removeListener(selector);
    		} else if (!isChild) {
    			// If this is a recurring search or if the target has not yet been 
    			// found, create an interval to continue searching for the target
    			intervals[selector] = window.setInterval(function () {
    				$this.waitUntilExists(handler, shouldRunHandlerOnce, true);
    			}, 250);
    		}
    	}
    	return $this;
    };
}(jQuery, window));

var bloquearCamaleon = function(){
    $(".notification").waitUntilExists(function(){
        var $this = $(this);
        var user = $this.children("img").attr("href").substring(1);
        var action = $this.children("p").children("i").attr("class").split(" ")[1];
        if(action === "comment-new-vote-negative" || action === "shout-new-reply"){
            $.get('https://api.taringa.net/user/nick/view/' + user, function(data){
                if(!data.profile_active){
                    $.post("https://www.taringa.net/ajax/user/block",{key: global_data.user_key, user: data.id.toString(), bloqueado: "1"}, function(res){});
                }
            });
        }
    });
};

bloquearCamaleon();