// ==UserScript==
// @name         Eliminar Shouts Texto
// @namespace    http://taringa.net/rata__7
// @version      0.3
// @description  Elimina los shouts de solo texto
// @author       Nezumi
// @include      *://www.taringa.net/*
// @exclude      *://www.taringa.net/*/mi/*
// @exclude      /.*:\/\/www.taringa\.net\/.*\/[0-9]+/

// @downloadURL https://update.greasyfork.org/scripts/28076/Eliminar%20Shouts%20Texto.user.js
// @updateURL https://update.greasyfork.org/scripts/28076/Eliminar%20Shouts%20Texto.meta.js
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

//Acá empieza mi código
var eliminarTexto = function(){
    $(".activity-element.shout").waitUntilExists(function(){
        $(".activity-element.shout").remove();
    });
    $(".shout-main-content.none").waitUntilExists(function(){
        $(".shout-main-content.none").parent().remove();
    });
};

eliminarTexto();