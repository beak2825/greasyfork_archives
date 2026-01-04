// ==UserScript==
// @name         Speediergrader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Make speedgrader more useable by opening the rubrics by alt + a, and alt + s to save and go to next person!
// @author       Noirgif
// @match        https://canvas.wisc.edu/courses/*/gradebook/speed_grader?*
// @icon         https://www.google.com/s2/favicons?domain=canvas.instructure.com
// @grant        none
// @license      CC0
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/435403/Speediergrader.user.js
// @updateURL https://update.greasyfork.org/scripts/435403/Speediergrader.meta.js
// ==/UserScript==

// from https://gist.github.com/PizzaBrandon/5709010#file-jquery-waituntilexists-js
;(function ($, window) {

var intervals = {};
var removeListener = function(selector) {

	if (intervals[selector]) {
		
		window.clearInterval(intervals[selector]);
		intervals[selector] = null;
	}
};
var found = 'waitUntilExists.found';

/**
 * @function
 * @property {object} jQuery plugin which runs handler function once specified
 *           element is inserted into the DOM
 * @param {function|string} handler 
 *            A function to execute at the time when the element is inserted or 
 *            string "remove" to remove the listener from the given selector
 * @param {bool} shouldRunHandlerOnce 
 *            Optional: if true, handler is unbound after its first invocation
 * @example jQuery(selector).waitUntilExists(function);
 */
 
$.fn.waitUntilExists = function(handler, shouldRunHandlerOnce, isChild) {

	var selector = this.selector;
	var $this = $(selector);
	var $elements = $this.not(function() { return $(this).data(found); });
	
	if (handler === 'remove') {
		
		// Hijack and remove interval immediately if the code requests
		removeListener(selector);
	}
	else {

		// Run the handler on all found elements and mark as found
		$elements.each(handler).data(found, true);
		
		if (shouldRunHandlerOnce && $this.length) {
			
			// Element was found, implying the handler already ran for all 
			// matched elements
			removeListener(selector);
		}
		else if (!isChild) {
			
			// If this is a recurring search or if the target has not yet been 
			// found, create an interval to continue searching for the target
			intervals[selector] = window.setInterval(function () {
				
				$this.waitUntilExists(handler, shouldRunHandlerOnce, true);
			}, 500);
		}
	}
	return $this;
};
}(jQuery, window));


(function() {
    'use strict';

    function setupRubricView() {
        $('.toggle_full_rubric').trigger('click');
        $('input').focus(function() {$(this).val((i, e) => {if (e == '--') return ''; else return e;}); $(this).change();});
    }

    function checkKey(e) {
        if(e.key == 's' && e.altKey) {
            $('.save_rubric_button').trigger('click');
            setTimeout(() => {
                $('.toggle_full_rubric').trigger('click');
                $('#next-student-button').trigger('click');
                setTimeout(() => {$('input').each((i, e) => {$('input').focus(function() {$(this).val((i, e) => {if (e == '--') return ''; else return e;}); $(this).change();});});}, 1000);
            }, 1000); // hack
        }
        else if (e.key == 'a' && e.altKey) {
            setupRubricView();
        }
    }
    document.addEventListener('keydown', checkKey, false);

    $('.toggle_full_rubric').waitUntilExists(setupRubricView);

})();