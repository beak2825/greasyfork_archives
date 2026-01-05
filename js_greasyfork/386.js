// ==UserScript==
// @name         waitUntilExists
// @version      1.0
// @description  Is a small one function script, my most use one I use..
// ==/UserScript==

(function ($) { 
    $.fn.waitUntilExists	= function (handler, shouldRunHandlerOnce, isChild) {
        var found	= 'found';
        var $this	= $(this.selector);
        var $elements	= $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);   
        if (!isChild) {
            (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
                window.setInterval(function () { $this.waitUntilExists(handler, shouldRunHandlerOnce,     
        true); }, 500);
        } else if (shouldRunHandlerOnce && $elements.length) {
            window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
        }
		return $this;
	}   
}(jQuery));