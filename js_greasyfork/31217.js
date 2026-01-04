// ==UserScript==
// @name         Ocultar shouts palabras
// @namespace    https://taringa.net/rata__7
// @version      0.2
// @description  Oculta shouts con las palabras indicadas
// @author       Nezumi
// @match        https://www.taringa.net/mi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31217/Ocultar%20shouts%20palabras.user.js
// @updateURL https://update.greasyfork.org/scripts/31217/Ocultar%20shouts%20palabras.meta.js
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
var ocultarShouts = function(){
    
    // Acá tenes que agregar las palabras en minuscula que no queres
    var bannedWords = ['vero','facha','maya'];
    
    $(".activity-content").waitUntilExists(function(){
        var $this = $(this);
        var ps = $this.children('p');
        if(ps.length == 1){
            ps.children('br').replaceWith(' ');
            var words = ps.text();
            words = words.replace(/([.,;:!?"']+)/g,'').split(' ');
            var ok = true;
        loop1:
            for(var i=0; i < words.length; i++){
        loop2:
                for(var j=0; j < bannedWords.length; j++){
                    if(bannedWords[j] == words[i].toLowerCase()){
                        ok = false;
                        break loop1;
                    }
                }
            }
            if(!ok){
                $this.parent().remove();
            }
        }
    });
};

ocultarShouts();