// ==UserScript==
// @name         GA Live-Feed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  GameAnalytics Live-Feed
// @author       Jo
// @match        https://go.gameanalytics.com/game/*/live-feed
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameanalytics.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442898/GA%20Live-Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/442898/GA%20Live-Feed.meta.js
// ==/UserScript==

setInterval(function(){

    var where = $(".details-container").children(".event-type");
	if ( where.filter('span:contains("Progression")').next("span").children(".ga-json").length ) {
		where.filter('span:contains("Design")').parent().parent().remove();
		where.filter('span:contains("Error")').parent().parent().remove();
		where.filter('span:contains("-")').parent().parent().remove();
		where.filter('span:contains("Progression")').parent().css("background-color", "#dbffff");
		where.filter('span:contains("User")').parent().css("background-color", "#e4ffdb");
		where.filter('span:contains("Session_end")').parent().css("background-color", "#ecdbff");
		function convert(value) {
			return Math.floor(value / 60) + "m" + (value % 60 ? value % 60 : '00') + "s"
		}
		$('.details-container').each(function(i, obj) {
			var userid = $(this).children(".event-type").next("span").children(".ga-json").children(".property").filter('span:contains("user_id")').next("span").html();
			var length = $(this).children(".event-type").filter('span:contains("Session_end")').next("span").children(".ga-json").children(".property").filter('span:contains("length")').next(".int").html();
			var session = $(this).children(".event-type").next("span").children(".ga-json").children(".property").filter('span:contains("session_num")').next(".int").text();
            var value = $(this).children(".event-type").next("span").children(".ga-json").children(".property").filter('span:contains("value")').next(".int").text();
            var event = $(this).children(".event-type").filter('span:contains("Progression")').next("span").children(".ga-json").children(".property").filter('span:contains("event_id")').next(".string").text();
            var country = $(this).children(".event-type").next("span").children(".ga-json").children(".property").filter('span:contains("country")').next(".string").text();
			length = convert(length);
            //userid = userid.replace(/[^a-z]/g,'').substring(0, 5).toUpperCase();
            userid = userid.replace(/[^0-9]/g,'').substring(0, 3);
            event = event.replace(/\:/g,'\ \=\ ');
			$(this).children(".event-type").filter('span:contains("Session_end")').next("span").html(":ㅤ<font color='navy'>" + length + "</font> ㅤ//ㅤ <font color='red'>Session = " + session + "</font> ㅤ//ㅤ User = " + userid + " (" + country + ") ");
			$(this).children(".event-type").filter('span:contains("Progression")').next("span").html(":ㅤ<font color='#b210db'>" + event + "</font> ㅤ//ㅤ <font color='red'>Session = " + session + "</font> ㅤ//ㅤ User = " + userid + " (" + country + ") ");
            //$(this).children(".event-type").filter('span:contains("Design")').next("span").html(":ㅤ<font color='#b210db'>Value = " + value + "</font> ㅤ//ㅤ <font color='red'>Session = " + session + "</font> ㅤ//ㅤ User = " + userid);
			$(this).children(".event-type").filter('span:contains("User")').next("span").html(":ㅤ<font color='red'>Session = " + session + "</font> ㅤ//ㅤ User : " + userid + " (" + country + ") ");
			$(this).children(".event-type").next("span").css('font-weight', 'bold');
            $(this).children(".event-type").next("span").css('color', 'black').css('font-size', '13px');
            $(this).children(".event-type").css('color', '#383838');
            if (session == 1){
                $(this).children(".event-type").filter('span:contains("User")').parent().css("background-color", "#fffb79");
                $(this).children(".event-type").filter('span:contains("User")').text("New User !");
            }
		});
	}
}, 100);