// ==UserScript==
// @name         Censuringa!
// @namespace    http://taringa.net/rata__7
// @version      0.4
// @description  Carga imagenes de imgur con su hash bajo el hashtag que se me cante
// @author       Nezumi
// @include      *://www.taringa.net/mi
// @include      *://www.taringa.net/*/mi/*
// @downloadURL https://update.greasyfork.org/scripts/28141/Censuringa%21.user.js
// @updateURL https://update.greasyfork.org/scripts/28141/Censuringa%21.meta.js
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
var imgurIt = function(str){
    var $str = $(str);
    $str.waitUntilExists(function(){
        var $this = $(this);
        var parent=$this.parent();
        var name=parent.parent().prev().prev().attr("name");
        var href=parent.parent().prev().attr("href");
        $this.remove();
        var childs=parent.html().split("<br>");
        var id=childs[1];
        parent.html(childs.slice(2).join("<br>"));
        parent.after("<a href='"+href+"/mi/"+name+"'><img width='525' src='http://i.imgur.com/"+id+".jpg'></a>");
    });
};

imgurIt("a[data-filtername='#Censuringa']");
imgurIt("a[href='/hashtag/Censuringa']");