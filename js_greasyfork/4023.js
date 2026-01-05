// ==UserScript==
// @name           [ARCHIVED]Youtube SuBar
// @namespace      https://gist.github.com/look997/9ad33fc1ee4fa18d7e06#file-readme-md
// @description    Puts the action buttons in one line with the 'Subscribe' button. Reveals the number of subscriptions. Turns Theater mode on player.
// @version        5.04.105 beta
// @author         look997
// @resource       metadata https://gist.github.com/look997/9ad33fc1ee4fa18d7e06/raw/youtube.subar.user.js
// @include        *youtube.com/*
// @date           2015-04-30
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/4023/%5BARCHIVED%5DYoutube%20SuBar.user.js
// @updateURL https://update.greasyfork.org/scripts/4023/%5BARCHIVED%5DYoutube%20SuBar.meta.js
// ==/UserScript==

"use strict";

function addStyle (idStyle,styles) {
        if(document.getElementById(idStyle)){ document.getElementsByTagName("head")[0].removeChild(document.getElementById(idStyle)); }
        let css = document.createElement('style'); css.type = 'text/css'; css.id = idStyle;
        css.styleSheet ? css.styleSheet.cssText = styles : css.appendChild( document.createTextNode(styles) );
        document.getElementsByTagName("head")[0].appendChild(css);
}

function suBar () {
	addStyle('subar-styles',
	 `
	
	/* Puts the action buttons in one line with the 'Subscribe' button. */
	#watch8-secondary-actions .yt-uix-button-content { display: none; } // hide buttons labels
	
	/* Uncover long string - video views counts - Update 5.03.090. */
	#watch-headline-title { margin-bottom: 0px !important; }
	#watch7-user-header { padding-top: 10px !important; }
	
	#watch8-secondary-actions { position: relative; } /* Wyrównanie 3-przycisków z przyciskiem subskrybcji. */
	/*+"#watch7-views-info { top: -8px !important; bottom: auto !important; right: 0px !important; }*/
	#watch7-views-info { bottom: 31px !important; width: 192px !important; } /* Obniżenie i wyrównanie prawej strony panelu. */
	#watch7-user-header { padding-bottom: 3px !important; } /* Margines dolny panelu i między niebieksim paskiem. */
	#watch8-action-buttons { display: inline; padding-top: 0px; border-top: none; } /* Umieszczenie paska akcji w jednej linii. */
	#watch8-action-buttons:after,
	#watch8-action-buttons:before { content: none !important; } /* Umieszczenie paska akcji w jednej linii. */
	#watch8-secondary-actions .yt-uix-button { padding: 0px 0px !important; } /* Zmniejszenie odstępów między przyciskami. */
	#watch8-secondary-actions { left: 5px !important; } /* Odstęp przycisku subskrybcji od przycisków akcji. */
	#watch-header { min-height: auto; } /* Height panel. */
	/* Auto hide. */
	/*#watch7-user-header:hover #watch8-action-buttons { visibility: visible !important; }
	#watch8-action-buttons { visibility: hidden !important; }*/
	.concurrent-viewers.watch-view-count { /* Count live stream views. */
		font-size: 11px;
	}
	/* Reveals the number of subscriptions. */
	.yt-subscription-button-subscriber-count-branded-horizontal, .html5-text-button, .yt-subscription-button-subscriber-count-unbranded { display: inline-block !important; }
	/* Skok do aktualnie odtwarzanego elementu na playliście.
	.watch-wide #watch-appbar-playlist .playlist-videos-list {
	height: 490px !important;
	}
	.watch-wide #watch-appbar-playlist {
	min-height: 592px !important;
	}
	#watch-appbar-playlist .playlist-videos-list {
	max-height: 490px !important;
	}*/
	`
	);
	
	/* Przeniesienie przycisków akcji. */
	document.querySelector("#watch7-user-header").appendChild(document.querySelector("#watch8-action-buttons"));
	document.querySelector("#watch7-user-header").appendChild(document.querySelector("#watch8-sentiment-actions"));
	document.querySelector("#watch7-user-header").appendChild(document.querySelector("#watch7-views-info"));
	
	
	var addBut = document.querySelector("#watch8-secondary-actions .addto-button .yt-uix-button-content").textContent;
	var shareBut = document.querySelector('#watch8-secondary-actions [data-trigger-for="action-panel-share"] .yt-uix-button-content').textContent;
	var moreBut = document.querySelector('#action-panel-overflow-button .yt-uix-button-content').textContent;
	
	var addBut = document.querySelector("#watch8-secondary-actions .addto-button").title = addBut;
	var shareBut = document.querySelector('#watch8-secondary-actions [data-trigger-for="action-panel-share"]').title = shareBut;
	var shareBut = document.querySelector('#action-panel-overflow-button').title = moreBut;
}


function theaterMode () {
	document.cookie = "wide=1; domain=.youtube.com";
	
	document.querySelector("#page").classList.remove("watch-non-stage-mode");
	document.querySelector("#page").classList.add("watch-stage-mode");
	document.querySelector("#player").classList.remove("watch-small");
	document.querySelector("#player").classList.add("watch-medium");
	document.querySelector("#placeholder-player").classList.remove("watch-small");
	document.querySelector("#placeholder-player").classList.add("watch-medium");

	document.querySelector("#watch7-container").classList.add("watch-wide");

}


function setTOFun () {
	setTimeout( function () {
		if (document.querySelector("#progress") == undefined) {
			suBar();
		}
		else {
			setTOFun();
		}
	}, 100);
}

function progressBar () {
	
	document.querySelector("html").addEventListener("click", setTOFun, false); // Kliknięcie linka. Dodatkowo funkcja odświeżająca skrypt.
	
	window.addEventListener("popstate", function(e) { // Do przycisków 'wstecz' i 'do przodu'.
		setTOFun();
		suBar();
	});
}

document.addEventListener("DOMContentLoaded", function () {
	suBar();
	theaterMode();
	
	progressBar();
	
});