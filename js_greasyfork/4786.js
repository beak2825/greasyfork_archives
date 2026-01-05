// ==UserScript==
// @name     		Hide YIFY
// @description		Filters and hides YIFY releases on The Pirate Bay to assuage HD primadonnas. Row visibility can be toggled. Filtering is bypassed when search terms include "YIFY".
// @version			0.2.1
// @author			VICEGIRLS
// @copyright		2014 - CC BY-NC-SA 4.0
// @namespace		vg.filters.TPB
// @include  		http://thepiratebay.*/search/*/*/2*
// @include			https://thepiratebay.*/search/*/*/2*
// @include			http://thepiratebay.*/browse/2*
// @include			https://thepiratebay.*/browse/2*
// @exclude			http://thepiratebay.*/search/*yify*
// @exclude			https://thepiratebay.*/search/*yify*
// @require  		https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/4786/Hide%20YIFY.user.js
// @updateURL https://update.greasyfork.org/scripts/4786/Hide%20YIFY.meta.js
// ==/UserScript==

// Main function
function hideEvent() {
    
    // Extending jQuery for a text toggling function with external target
    // Basic function method courtesy user Nate on StackOverflow (goo.gl/Z468fI)
    $.fn.extend({
        toggleText: function (target, a, b){
            var isClicked = false;
            // var that = this;
            if(target!=this) {
                var that = $(target);
            } else {
                var that = this;
            }
            this.click(function (){
                if (isClicked) { that.text(a); isClicked = false; }
                else { that.text(b); isClicked = true; }
            });
            return this;
        }
    });
    
    // Insert custom styles
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "data:text/css,"+
        ".toggleContainer { display: block; min-height: 15px; min-width: 60px; padding: 2px 5px 2px 5px; background: transparent; color: #78604F; font-size: 10px; " +
        "position: relative; top: -20px; right: -5px; float: right; opacity: 0.3; }" +
        	".toggleContainer:hover { cursor: pointer; opacity: 1.0; }" +
        	".hideToggle { font-weight: 400; letter-spacing: 0.5px; }" +
        	".toggleActive { background: #FF0000; color: #FFFFFF; opacity: 1.0; }"
    }).appendTo("head");
    
    // Find rows for heathen uploads and create object
    var $filteredRows = $("tr").has("a[href*='YIFY']");
    
    // Hide table rows that include links to heathen user
    $filteredRows.toggle();
    
    // Clear the h2 element to properly display the toggle button 
    $("h2").css("clear: both;");
    
    // Add link to toggle visibility, a feature with questionable utility
    $("h2").append('<div class="toggleContainer"><span class="hideToggle">Reveal YIFY</span></div>');
    
    // Toggle row visibility when hideToggle element is clicked
    $(".toggleContainer").click(function() {
        $filteredRows.toggle();
        $(".toggleContainer").toggleClass("toggleActive");
    });
    
    // Change text of hideToggle element dependent on toggle state
    $(".toggleContainer").toggleText(".hideToggle", "Reveal YIFY", "Filter YIFY");
    
}

// Run main function
hideEvent();