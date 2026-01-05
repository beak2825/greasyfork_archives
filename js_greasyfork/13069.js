// ==UserScript==
// @name       jawz Hybrid - Answer Questions About A Photo
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/13069/jawz%20Hybrid%20-%20Answer%20Questions%20About%20A%20Photo.user.js
// @updateURL https://update.greasyfork.org/scripts/13069/jawz%20Hybrid%20-%20Answer%20Questions%20About%20A%20Photo.meta.js
// ==/UserScript==

$(document).ready(function() {
    if ($('h1:contains("about a photo")').length) {
        for (i = 2; i < 9; i++) {
            for (var j = 4, length = $('input').length; j < length; j++) {
                var temp = $('div[class="item-response order-' + i + '"]').find('input').eq(j).next().html();
                $('div[class="item-response order-' + i + '"]').find('input').eq(j).next().html('<b>(' + (j-3) + ') </b>' + temp);
            }
        }
        
        $('img').addClass('box follow-scroll');
        $('img').css('left', '50%');
        $('img').css('z-index', '100');
        (function($) {
            var element = $('.follow-scroll'),
            originalY = element.offset().top;
    
            var topMargin = 20;
    
            element.css('position', 'relative');
    
            $(window).on('scroll', function(event) {
                var scrollTop = $(window).scrollTop();
        
                element.stop(false, false).animate({
                    top: scrollTop < originalY
                    ? 0
                    : scrollTop - originalY + topMargin + 200
                }, 300);
            });
        })(jQuery);
        
        var count = 2;
        var name = "cap" + count;
        var div = $('div[class="item-response order-2"]')
        div.css('background-color', '#F3E88E');
        $('div[class="item-response order-2"]').find('input').eq(8).focus();
        
        $(document).keyup(function (event) {
	        var key = toCharacter(event.keyCode);
            if (key > 0 && key < 9) {
                var temp = parseInt(key) + 3;
	            $('div[class="item-response order-' + count + '"]').find('input').eq(temp).prop( "checked", true );
                if (count < 8)
                    count++
                name = "cap" + count;
                div.css('background-color', '#EEEEEE');
                div = $('div[class="item-response order-' + count + '"]')
                div.css('background-color', '#F3E88E');
                div.find('input').eq(8).focus();
	        }
            
            if (key=='-') {
                if (count > 2)
                    count--
                name = "cap" + count;
                div.css('background-color', '#EEEEEE');
                div = $('div[class="item-response order-' + count + '"]')
                div.css('background-color', '#F3E88E');
                div.find('input').eq(8).focus();
	        }
            
            if (key=='+') {
                if (count < 8)
                    count++
                name = "cap" + count;
                div.css('background-color', '#EEEEEE');
                div = $('div[class="item-response order-' + count + '"]')
                div.css('background-color', '#F3E88E');
                div.find('input').eq(8).focus();
	        }
        });
        
        function toCharacter(keyCode) {
            // delta to convert num-pad key codes to QWERTY codes.
            var numPadToKeyPadDelta = 48;

            // if a numeric key on the num pad was pressed.
            if (keyCode >= 96 && keyCode <= 105) {
                keyCode = keyCode - numPadToKeyPadDelta;
                return String.fromCharCode(keyCode);
            }

            if (keyCode == 106)
                return "*";

            if (keyCode == 107)
                return "+";

            if (keyCode == 109)
                return "-";

            if (keyCode == 110)
                return ".";

            if (keyCode == 111)
                return "/";

            // the 'Enter' key was pressed
            if (keyCode == 13)
                return "ENTER";  //TODO: you should change this to interpret the 'Enter' key as needed by your app.

            return String.fromCharCode(keyCode);
        }
    }
});