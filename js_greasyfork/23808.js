// ==UserScript==
// @name         Wowhead Fixed Search Header
// @description  Makes the page header (the search box) "sticky" when you scroll.
// @namespace    drnick
// @include      *wowhead.com*
// @grant        none
// @version      1.2.0
// @downloadURL https://update.greasyfork.org/scripts/23808/Wowhead%20Fixed%20Search%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/23808/Wowhead%20Fixed%20Search%20Header.meta.js
// ==/UserScript==

(function() {

	if (typeof jQuery == "undefined") throw "jQuery not found";
	if (window.top != window.self) return;
	
	var $ = jQuery;
	
	var $window = $(window);
	var $header = $(".header-search");
	var $headerInput = $(".header-search input");
	
	if ($header.length == 0) throw "#header not found";
	
	var styles = [
		".header-search.sticky {",
			"position: fixed;",
			"top: 5px;",
			"right: 5px;",
			"z-index: 9999;",
			"-width: 300px;",
			"box-shadow: 0 6px 8px #000;",
            "margin-right: 10px;",
            "opacity: 0.7;",
		"}",
        ".header-search.sticky[data-has-focus=true] {",
            "opacity: 1;",
		"}",
        ".header-search.sticky form {",
			"position: static !important;",
		"}",
		".header-search.sticky input {",
			"width: 260px !important;",
			"-padding: 2px !important;",
		"}",
		".header-search.sticky .header-search-button {",
            "top: 2px !important;",
            "left: 0px !important;",
			"-height: 26px;",
			"-line-height: 26px;",
		"}",
        ".header-search.sticky .data-env-links {",
			"display: none;",
		"}",
        ".fixed-interior-sidebar {",
			"margin-top: 3em;",
		"}",
	].join("\n");
	
	$liveSearchStyle = $("<style type='text/css'></style");
	
	$("head").append("<style type='text/css'>" + styles + "</style>");
	$("head").append($liveSearchStyle);
	
	var offset = $header.offset().top;
	var height = $header.height();
	
	var $dummy = $header.clone();
	$dummy.empty();
	$dummy.attr("id", "header-dummy");
	$dummy.hide();
	
	$dummy.insertAfter($header);
	
	var liveSearchStyle = $liveSearchStyle.get(0);
	
	var isFloating = false;	
	var liveSearchLeft = 0;
	var liveSearchTop = 0;
	var liveSearchWidth = 0;
	var liveSearchPos = "absolute";
	
	$window.on("scroll resize", function(event) {
        var scrollTop = $window.scrollTop();
        var recalc = true;
        
        if (!isFloating && scrollTop > offset) {
            $header.addClass("sticky");
            $dummy.show();
            isFloating = true;
            liveSearchPos = "fixed";
        }
        else if (isFloating && scrollTop <= offset) {
            $header.removeClass("sticky");
            $dummy.hide();
            isFloating = false;
            liveSearchPos = "absolute";
        }
        else
            recalc = false;
        
        if (recalc || event.type == "resize") {
            console.log("recalc");
            liveSearchLeft = $header.offset().left | 0;
            liveSearchTop = ($header.offset().top + $header.height()) | 0;
            liveSearchWidth = $headerInput.outerWidth() | 0;
            
            if (isFloating) {
                liveSearchTop -= ($window.scrollTop() | 0);
            
                liveSearchStyle.innerHTML = ".live-search { " 
                        + "position:" + liveSearchPos + " !important; " 
                        + "top: " + liveSearchTop + "px !important; " 
                        + "left: " + liveSearchLeft + "px !important; " 
                        + "width: " + liveSearchWidth + "px !important; "
                    + "}";
            }
            else
                liveSearchStyle.innerHTML = "";
        }
    });
	
	$window.trigger('scroll');
	
})();
