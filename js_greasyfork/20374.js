// ==UserScript==
// @name        Taboola Ads Remover
// @namespace   MegaByteTAR
// @description A script which removes the annoying Taboola ads.
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at      document-idle
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20374/Taboola%20Ads%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/20374/Taboola%20Ads%20Remover.meta.js
// ==/UserScript==


    this.$ = this.jQuery = jQuery.noConflict(true);
	
	var attr = ["class", "id"];
    var filter = ["Taboola_TOP_LEADERBOARD_AB", "taboola-above-article-thumbnails", "NATIVE_TABOOLA_ARTICLE", "Taboola_NATIVE_TABOOLA_ARTICLE", "taboola-below-article-thumbnails"];
    var link_wrapper = ["trc_rbox_container", "trc_wrapper", "trc_header", "videoCube", ]
	var link_filter = ["taboola.com", "taboolasyndication.com"];
    
    function check() {
	
		for(var a of attr) {
			for(var f of filter) $("["+a+"*="+f+"]").remove();
			for(var f of link_wrapper) for(var lf of link_wrapper) {
					var w = $("["+a+"*="+f+"]");
					if(w.find("[href*="+lf).length!=0) w.remove();
				}
		}
		
		setTimeout(check, 100);
	}
	
	check();