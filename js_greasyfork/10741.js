// ==UserScript==
// @name        (Broken) CSGO Lounge Better
// @namespace   CSGO_lounge_better
// @match       http://csgolounge.com/*
// @author             ToXIc
// @description       (Broken - Hope to update soon) Some CS:GO Lounge Tweaks
// @require		http://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10741/%28Broken%29%20CSGO%20Lounge%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/10741/%28Broken%29%20CSGO%20Lounge%20Better.meta.js
// ==/UserScript==

var twitchLogo = "<img alt='Open Twitch' src='data:image/png;base64,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'>";
var hitboxLogo = "<img width='128px' src='https://pbs.twimg.com/profile_images/494847151969558529/B86qAp7S.png'>";

function RemoveStream() {
    $('#live_embed_player_flash').remove();
    var streamlink = $('#chat_embed').attr("src").split("//")[1];
    var channelName = "";
    var logo = twitchLogo;
    
    if(streamlink.split(".")[0] == "twitch"){
        channelName = "http://twitch.tv/"+streamlink.split("channel=")[1].split("&popout_chat")[0];
    } else if (streamlink.split(".")[1] == "hitbox"){
        channelName = "http://www.hitbox.tv/"+streamlink.split("embedchat/")[1];
        logo = hitboxLogo;
    }
    $('#chat_embed').remove();
    $('#mainstream').remove();
    $('#stream').append("<div id='mainstream'><br><center><a target='_blank' href='"+channelName+"'>"+logo+"<br>"+channelName.split("/")[3]+"</a></center></div>");
}

function check() {
  if ($("#chat_embed").length > 0){
      RemoveStream();
  }
}
window.setInterval(check, 100); 


$(function () {
    $('#last30bets').hide();$('#disqus_thread').show();
        var dt = new Date(),
        tzOffset = (dt.getTimezoneOffset()/60) + 2,
        AMorPM = "",
        theMinutes = dt.getMinutes(),
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
    
      $('header').append('<div class="ddbtn" style="height: 32px !important;"><a id="toggle">Show Menu</a></div>');
    
    $("#toggle").click(function(){
        if (document.getElementById("toggle").innerHTML === "Show Menu"){
        $("#submenu").show();
        $('main').css('padding-right', '250px');
        document.getElementById("toggle").innerHTML = "Hide Menu";
        } else {
        $("#submenu").hide();
        $('main').css('padding-right', '0px');
        document.getElementById("toggle").innerHTML = "Show Menu"
        }
    });
    
       $(document).ready ( function(){
        $("#submenu").hide();
        $('main').css('padding-right', '0px');
       });
    
    $('#hour-option').click(function() {
        if (hour12) {
        	$.cookie("showTwelve", false);    
        } else {
	        $.cookie("showTwelve", true);   
        }
        
        location.reload();
    });
    
    $timeBox = $('.half:contains("CEST")');
    
    // Converts CEST to local on match page.
    if ($timeBox.length) {
        var timeInCEST = $timeBox.text();
            var res = timeInCEST.trim();
            hour = res.substring(0,2);
            minute = res.substring(3,6);
        
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
        	$timeBox.html($timeBox.html() + "(" + hour + ":" + minute + " " + AMorPM + ") ");
        } else {
        	$timeBox.html($timeBox.html() + "(" + hour + ":" + minute + ") ");
        }
    }
    
        // Gets match information for all upcoming matches and converts time.
    $boxes = $(".matchmain:has(.whenm:contains('hour'):contains('from now'),.whenm:contains('minute'):contains('from now'))");
	if ($boxes.length) {
	    $boxes.each(function(i) {
				$whenBox =  $(this).find(".whenm:first");
		var timeText = $(this).text();
				var format = "12h";
		if (timeText.match(/day/))
		    return 0;
		var offset = timeText.match(/\d+/)[0];
		var isFuture = timeText.match("ago") > 0 ?  -1 : 1;

		if (timeText.match(/hour/))
		    var gameTime = new Date(dt.getTime() + (offset * 3600000 * isFuture));
		else
		    var gameTime = new Date(dt.getTime() + (offset * 60000 * isFuture));

		var gameHour = gameTime.getHours();
		var gameMinute = gameTime.getMinutes();
				
				//console.log(gameHour);

		if ($(this).text().match(/hour/)) {
		    if (theMinutes > 30) gameHour = gameHour + 1;
		    gameMinute = "00";
		} else {
		    gameMinute = (gameMinute === 0) ? "00" : gameMinute;
		}
		if (!hour12){
		    //$(this).find(".whenm:first").text(" (" + gameHour + ":" + gameMinute + ")");
        $whenBox.html($whenBox.html() + " (" + gameHour + ":" + gameMinute + ")");
		}
		else {
		    AMorPM = (gameHour >= 12) ? "PM" : "AM";
		    gameHour = (gameHour > 12) ? gameHour - 12 : gameHour;
//console.log(AMorPM);
		    //$(this).find(".whenm:first").html(" (" + gameHour + ":" + gameMinute + " " + AMorPM + ")");
			$whenBox.html($whenBox.html() + " (" + gameHour + ":" + gameMinute + " " + AMorPM + ")");
		}
	    });
	}

});