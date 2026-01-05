// ==UserScript==
// @name        Update stats NOW!
// @namespace   Update stats NOW!
// @description Aktualizuje statystyki w czasie rzeczywistym.
// @include     http://*.hogwart-rpg.com/*
// @include     http://hogwart-rpg.com/*
// @exclude     http://hogwart-rpg.com/forum/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @version     1
// @author      Daav
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12816/Update%20stats%20NOW%21.user.js
// @updateURL https://update.greasyfork.org/scripts/12816/Update%20stats%20NOW%21.meta.js
// ==/UserScript==

function get_new_data(){
		var sI = setInterval(function(){ 
			$.get('http://hogwart-rpg.com/witaj/', function( data ) {
				var new_data = $(data).find("div#postac").first().html();
                if(!$('div#postac').length){ clearInterval(sI); } else {
                  $('div#postac').html(new_data).append('<br><br><div style="width:100%; text-align:center;font-size:9px">Update stats NOW! by Daav</div>');	
                }
			});
		}, 500);
}

get_new_data();