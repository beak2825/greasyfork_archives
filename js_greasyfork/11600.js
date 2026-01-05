// ==UserScript==
// @name         GODpeople Music Player
// @namespace    http://your.homepage/
// @version      0.2
// @description  enter something useful
// @author       You
// @match        http://*/gpplayer2013/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11600/GODpeople%20Music%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/11600/GODpeople%20Music%20Player.meta.js
// ==/UserScript==


(function(){
	document.addEventListener("DOMNodeInserted", function(){

		window.dft_user_login = 1;
		window.dft_freeis_stream='Y';
		window.dft_free= 1;            

		window.getTime = function(cTime, tTime){
			var totTime = Math.round(tTime);
			var nTime = cTime;

			h = parseInt(nTime/3600);
			m = parseInt((nTime%3600)/60);
			s = parseInt((nTime%60));
			dispTime =  fillZero(m, 2) + ":" + fillZero(s, 2);
			$('.play_time').html(dispTime);

			t_h = parseInt(totTime/3600);
			t_m = parseInt((totTime%3600)/60);
			t_s = parseInt((totTime%60));
			t_dispTime =  fillZero(t_m, 2) + ":" + fillZero(t_s, 2);
			$('.total_time').html(t_dispTime);

			json_data[dft_key].playsecond = totTime;

			dft_status = 'play';

			var param_key ;
			var p_width = 207 - 10;
			var ctime = Math.round(nTime);

			var ttime = totTime;
			var c_width = Math.round(p_width * (Math.round((ctime/ttime)*100)/100));

			if(isDrag==false){
				$(".dot_line").css("width",c_width+"px");
				$(".dot").css("left",c_width+"px");
			}
			dft_dotX = c_width ;

			if ( nTime >= ttime ){
				EndAudio();
			}
		};
	});
})();