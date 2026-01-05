// ==UserScript==
// @name        AnimeZone Highlighter
// @description Wyróżnia śledzone przez nas tytuły
// @version     1.1.0
// @author      peXu
// @namespace   https://greasyfork.org/pl/users/10243-pexu
// @match       http://www.animezone.pl/*
// @match       https://www.animezone.pl/*
// @run-at      document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21569/AnimeZone%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/21569/AnimeZone%20Highlighter.meta.js
// ==/UserScript==



(function() {
    'use strict';
	
    var observed = []; // array of observed titles
    var animeName = null; // anime name (when on title page)
	
	// load observed from localstorage
	function loadObserved() {
		if (localStorage.observed!==undefined)
			observed = JSON.parse(localStorage.observed);
	}
	
	// ANIME PAGE
	
	// save observed in localstorage
	function saveObserved() {
		localStorage.observed = JSON.stringify(observed);
		location.reload();
	}
	
    // get anime name from URL
    function getAnimeName() {
        animeName = window.location.pathname.split("/")[2];
    }
    
    // check if anime page of observed anime or not
    function isObserved(name) {
        return observed.includes(name);
    }
	
	// Add new anime to observed
	function addObserved() {
		loadObserved();
		observed.push(animeName);
		saveObserved();
	}
	
	
	// Remove anime from observed
	function removeObserved() {
		loadObserved();
		observed.splice(observed.indexOf(animeName),1);
		saveObserved();
	}
    
	// add functionality to add or remove observed series
    function animePage() {
		getAnimeName();
        if (isObserved(animeName)) { // anime is observed
            $("div.panel.panel-default.category-description > div.panel-heading").append('<a href="#" class="pull-right btn btn-xs btn-danger" id="us-button" style="margin-right:15px"><i class="fa fa-minus"></i> Nie Obserwuj</a>');
			$('#us-button').click(removeObserved);
        } else { // isnt observed yet
			$("div.panel.panel-default.category-description > div.panel-heading").append('<a href="#" class="pull-right btn btn-xs btn-success" id="us-button" style="margin-right:15px"><i class="fa fa-plus"></i> Obserwuj</a>');
			$('#us-button').click(addObserved);
        }
    }
	

	
	// EP LIST
	
	// check if episode of observed series
	function epCheck(element) {
		var name = $(element).children('a').attr('href').split('/')[2];
		return isObserved(name);
	}
	
	// Highlight observed series
    function epList() {
		$('div.panel-body.categories-collection > div.categories').each(function() {
			if (epCheck(this)) { // anime is observed
				$(this).css('border-color', '#6de446');
				$(this).css('background-image', 'linear-gradient(to bottom,#e8e8e8 0,#cbecc0 100%)');
			}
		});
    }
	
	// BACKUP & MANAGE
	
	// show list
	function showList() {
		$('#us-modal').show();
	}
	
	// backup observed list
	function backupObserved() {
		window.prompt('Skopiuj i zapisz ten tekst w bezpiecznym miejscu.', JSON.stringify(observed));
	}
	
	// restore observed list
	function restoreObserved() {
		var observedTmp = window.prompt('Wklej wcześniej skopiowany tekst. \n\n\n Wklejenie nieprawidłowego tekstu == problemy.');
		if (observedTmp) observed = JSON.parse(observedTmp);
		saveObserved();
	}
	
	// allows user to save and restore his observed list
	function backupSettings() {
		$('div.site-sidebar').append('<div class="panel panel-default desktop"><div class="panel-heading"><h4 class="panel-title"><i class="fa fa-list"></i> Obserwowane</h4></div><div class="panel-body social row text-center"><br><a href="#" class="btn btn-xs btn-default" id="us-list"> LISTA OBSERWOWANYCH</a><br><br><a href="#" class="btn btn-xs btn-default" id="us-export"> EKSPORT</a>     <a href="#" class="btn btn-xs btn-default" id="us-import" style="margin-left:15px"> IMPORT</a><br><br></div></div>');
		$('#us-export').click(backupObserved);
		$('#us-import').click(restoreObserved);
		
		var observedListHTML = '<div id="us-modal" class="us-modal"><div class="us-modal-content"><div class="us-modal-header"><span class="us-close">×</span><span>LISTA OBSERWOWANYCH</span></div><div class="us-modal-body">';
		
		var tmpLink;
		for (var i = 0; i < observed.length; i++) {
			tmpLink = observed[i];
			tmpLink = tmpLink.replace(/-/g,' ').toUpperCase();
			observedListHTML += '<a href="http://www.animezone.pl/odcinki-online/' + observed[i] + '">' + tmpLink + '</a><br>';
		}
		
		observedListHTML += '</div></div></div>';
		$('body').append(observedListHTML);
		$('#us-list').click(function() { $('#us-modal').show(); });
		$('.us-close').click(function() { $('#us-modal').hide(); });

	}

    // MAIN ENTRY POINT
	loadObserved();
	
    if (window.location.pathname.includes("/odcinki-online/")) { // anime page
        animePage();
    } else if (window.location.pathname === "/" || window.location.pathname === "/pl") { // episodes list
		epList();
    }
	
	backupSettings();
    
})();

GM_addStyle ("                                                             \
.us-modal {                                                                \
    display: none;                                                         \
    position: fixed;                                                       \
    z-index: 1;                                                            \
    padding-top: 100px;                                                    \
    left: 0;                                                               \
    top: 0;                                                                \
    width: 100%;                                                           \
    height: 100%;                                                          \
    overflow: auto;                                                        \
    background-color: rgba(0,0,0,0.7);                                     \
}                                                                          \
                                                                           \
.us-modal-content {                                                        \
    position: relative;                                                    \
    background-color: #fafafa;                                             \
    margin: auto;                                                          \
    padding: 0;                                                            \
    border: 1px solid #888;                                                \
    width: 600px;                                                          \
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); \
    -webkit-animation-name: animatetop;                                    \
    -webkit-animation-duration: 0.4s;                                      \
    animation-name: animatetop;                                            \
    animation-duration: 0.4s                                               \
}                                                                          \
                                                                           \
@-webkit-keyframes animatetop {                                            \
    from {top:-300px; opacity:0}                                           \
    to {top:0; opacity:1}                                                  \
}                                                                          \
                                                                           \
@keyframes animatetop {                                                    \
    from {top:-300px; opacity:0}                                           \
    to {top:0; opacity:1}                                                  \
}                                                                          \
                                                                           \
.us-close {                                                                \
    color: white;                                                          \
    float: right;                                                          \
    font-size: 24px;                                                       \
    margin-top: -8px;                                                      \
    font-weight: bold;                                                     \
}                                                                          \
                                                                           \
.us-close:hover,                                                           \
.us-close:focus {                                                          \
    color: #000;                                                           \
    text-decoration: none;                                                 \
    cursor: pointer;                                                       \
}                                                                          \
                                                                           \
.us-modal-header {                                                         \
    padding: 10px 16px;                                                    \
    background-color: #222;                                                \
    color: white;                                                          \
}                                                                          \
                                                                           \
.us-modal-body {padding: 2px 16px;}                                        \
");