// ==UserScript==
// @name YouTube Video Downloader, Youtube Downloader, getthemall for chrome mikrplusext.com
// @description  YouTube Video Downloader, Youtube Downloader, online getthemall for chrome mikrplusext.com, YouTube Video Downloader for chrome. this extesion add button on youtube page.  YouTube Video Downloader For Chrome,  YouTube Video Downloader for firefox
// @namespace https://greasyfork.org/
// @author mikrplusext.com
// @version 2.9
// @date 2018-07-03
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license GNU GPL v3.0 or later. http://www.gnu.org/copyleft/gpl.html
// @match       *://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/370014/YouTube%20Video%20Downloader%2C%20Youtube%20Downloader%2C%20getthemall%20for%20chrome%20mikrplusextcom.user.js
// @updateURL https://update.greasyfork.org/scripts/370014/YouTube%20Video%20Downloader%2C%20Youtube%20Downloader%2C%20getthemall%20for%20chrome%20mikrplusextcom.meta.js
// ==/UserScript==

if("undefined" == typeof (mikrplusext)) {
	var mikrplusext = {

        userUrl: 'https://www.mikrplusext.com/?url=',
        currentMediaUrl: null,
		getParam : function (document, variable){
			 var query = document.location.search.substring(1);
			 var vars = query.split("&");
			  for (var i=0;i<vars.length;i++) {
					var pair = vars[i].split("=");
					if(pair[0] == variable){return pair[1];}
			   }       return(false);
		},

		init : function() {
			mikrplusext.onPageLoad();
		},

		addButtons: function(document) {
			var icon='data:image/png;base64,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';

				var mikrplusextpather = mikrplusext.userUrl + encodeURIComponent(document.URL);
                var div_embed = null;
                var target = '_blank';
				if(document.getElementById('meta-contents')) {
                    div_embed = document.getElementById('meta-contents').querySelector('#top-row ytd-video-owner-renderer.ytd-video-secondary-info-renderer #sponsor-button');
                    div_embed.innerHTML += '<paper-button subscribed id="mikrplusext" style="float:right" raised class="ytd-button-renderer"><a href="' + mikrplusextpather + '" target="' + target + '" style="text-decoration: none; color: black;" class="style-scope ytd-subscribe-button-renderer"><img  style="vertical-align: bottom;" src="' + icon + '"> <strong>Download</strong></a></paper-button>'+ div_embed.innerHTML;
				} else if(document.getElementById('watch8-sentiment-actions')) {
					 div_embed = document.getElementById('watch8-sentiment-actions');
					var buttonclass = "yt-uix-button yt-uix-button-default yt-uix-tooltip";
					var spanclass = "yt-uix-button-group";
                    div_embed.innerHTML = '<span id="mikrplusext" class="' + spanclass + '"><a href="' + mikrplusextpather + '" target="' + target + '"><button class="start ' + buttonclass + '" type="button" title="Download"><img alt="" class="" style="" src="' + icon + '"> <span class="yt-uix-button-content"><strong>Download</strong></span></button></a>' + div_embed.innerHTML;
				}
		},

		onPageLoad : function() {
			if(document.body && document.domain == 'www.youtube.com') {
					setInterval(mikrplusext.check, 1300);
                    mikrplusext.check();
			}
		},

        check: function() {
            if(mikrplusext.currentMediaUrl != document.URL  && typeof ytplayer != 'undefined' && ytplayer) {
                mikrplusext.currentMediaUrl = document.URL;
                if(document.getElementById('mikrplusext')) {
                    document.getElementById('mikrplusext').outerHTML="";
                }
			}
            if(!document.getElementById('mikrplusext') && typeof ytplayer != 'undefined' && ytplayer) {
                mikrplusext.addButtons(document);
            }
        },
	};
}
mikrplusext.init();