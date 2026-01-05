// ==UserScript==
// @name         TV3Play be reklamų
// @namespace    TV3Play.lt
// @version      0.1
// @description  Pakeičia Tv3Play grotūvą į be-reklamį.
// @author       ElliotD
// @match        http://play.tv3.lt/programos/*/*?autostart=true
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/25044/TV3Play%20be%20reklam%C5%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/25044/TV3Play%20be%20reklam%C5%B3.meta.js
// ==/UserScript==
var Delay = 2000;
(function(e)
{
    setTimeout(function(){
	e.getJSON("http://playapi.mtgx.tv/v3/videos/stream/"+e(".video-player-container")[0].dataset.id,
		function(t)
		{
			var elem = document.getElementById("avod-player");
			elem.innerHTML="";e.getScript("http://jwpsrv.com/library/nZ2GJE5tEeSLmSIAC0WXxA.js",
				function()
				{
					var elemm = document.getElementById("video-player");
					elemm.appendChild(elem);
					jwplayer("avod-player").setup({file:t.streams.medium,title:"Watch",width:"100%",aspectratio:"16:9",autostart:true});
				});
		});
},Delay);
})(jQuery);