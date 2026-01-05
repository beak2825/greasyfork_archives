// ==UserScript==
// @name           Detect jQuery
// @namespace      http://www.top-info.de/thein
// @description    Detect jQuery on every page
// @include        *
// @version 1.2
// @downloadURL https://update.greasyfork.org/scripts/1740/Detect%20jQuery.user.js
// @updateURL https://update.greasyfork.org/scripts/1740/Detect%20jQuery.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
	if(unsafeWindow.jQuery) {
		var $j = unsafeWindow.jQuery;
        var storedWidth = 0;
		
		var $newimg = $j('<img src="http://www.mustbebuilt.co.uk/wp-content/uploads/2011/06/jquery-logo.jpg" title="jQuery ' + $j().jquery + ' enabled page"/>').appendTo('body').css({
			"position" : "fixed",
			"top" : "0",
			"left" : "0",
			"border" : "1px solid #eeeeee",
			"border-radius" : "5px",
			"box-shadow" : "2px 2px 5px 2px black",
			"z-index" : "100000"
		}).click(function() {
			$j(this).remove();
		});
		
		var mytimeout = window.setTimeout(function() {
            storedWidth = $newimg[0].width;
            $newimg.animate({"width": "25px"}, 'slow');
            mytimeout = window.setTimeout(function() {
                $newimg.hide('slow');
            }, 10000);
		}, 200);
		
		$newimg.hover(function() {
			if(mytimeout!=0) {
				window.clearTimeout(mytimeout);
				mytimeout=0;
			}
            $newimg.animate({"width" : storedWidth + "px"}, 500);
		}, function() {
			mytimeout = window.setTimeout(function() {
				$newimg.hide('slow');
			}, 200);
		});
	}
}, false);