// ==UserScript==
// @name        CSGL TimeZone Changer
// @version     1.6
// @description Change CSGO timezones.
// @match       http://csgolounge.com/*
// @match 		http://dota2lounge.com/*
// @require     http://code.jquery.com/jquery-2.1.1.js
// @require		http://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @copyright   Josh Hubbard
// @namespace 	https://greasyfork.org/users/5596
// @downloadURL https://update.greasyfork.org/scripts/5285/CSGL%20TimeZone%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/5285/CSGL%20TimeZone%20Changer.meta.js
// ==/UserScript==

// TODO: Dry up the code. Things need to be speeded up.

$(function () {
    var dt = new Date(),
        tzOffset = (dt.getTimezoneOffset()/60) + 1,
        AMorPM = "",
        hour12 = true;
    
    if ($.cookie("showTwelve") == undefined) {
    	$.cookie("showTwelve", true);
    } else {
        if ($.cookie("showTwelve") == 'true') {
    		hour12 = true;
        } else {
            hour12 = false;
        }
    }

    // Insert 12/24 hours box
    if (hour12) {
        $('#submenu > nav').append('<a id="hour-option">Switch to 24 Hours</a>');
    } else {
        $('#submenu > nav').append('<a id="hour-option">Switch to 12 Hours</a>');
    }
    
    $('#hour-option').click(function() {
        if (hour12) {
        	$.cookie("showTwelve", false);    
        } else {
	        $.cookie("showTwelve", true);   
        }
        
        location.reload();
    });
    
    $timeBox = $('.half:contains("CET")');
    
    // Converts CEST to local on match page.
    if ($timeBox.length) {
        var timeInCEST = $timeBox.text(),
            hour = timeInCEST.split(" ")[0].split(":")[0],
            minute = timeInCEST.split(" ")[0].split(":")[1];
        
        hour = hour - tzOffset;
        
        if (hour < 0) hour = 24 + hour;  
        
        if (hour12) {
          console.log('2');
          if (hour == 12) {
              AMorPM = "PM";
          } else if (hour > 12) {
              hour = hour - 12;
	     	  AMorPM = "PM";      
		  } else {
			AMorPM = "AM";
		  }
        }
        
        if (hour12) {
        	$timeBox.html("(" + hour + ":" + minute + " " + AMorPM + ") " + $timeBox.html());
        } else {
        	$timeBox.html("(" + hour + ":" + minute + ") " + $timeBox.html());
        }
    }
    
    // Gets match information for all upcoming matches and converts time.
    $boxes = $(".matchmain:has(.whenm:contains('hour'):contains('from now'),.whenm:contains('minute'):contains('from now'))");
    
    $boxes.each(function(i) {
        var $this = $(this),
            link = $this.find("a[href*='match']").attr("href"),
            $whenBox =  $this.find(".whenm:first");
        
        $.get(link, function(data) {
            var response = $('<html />').html(data),
                $timeBox = response.find('.half:contains("CET")'),
                timeInCEST = $timeBox.text(),
                hour = timeInCEST.split(" ")[0].split(":")[0] - tzOffset,
                minute = timeInCEST.split(" ")[0].split(":")[1];
            
            if (hour < 0) hour = 24 + hour;  
            
            if (hour12) {
                if (hour == 12) {
                    AMorPM = "PM";
                } else if (hour > 12) {
                    hour = hour - 12;
                    AMorPM = "PM";      
                } else {
                    AMorPM = "AM";
                }
        	}
            
            if (hour12) {
            	$whenBox.html($whenBox.html() + " (" + hour + ":" + minute + " " + AMorPM + ")");
            } else {
            	$whenBox.html($whenBox.html() + " (" + hour + ":" + minute + ")");    
            }
        });
        
    });
});