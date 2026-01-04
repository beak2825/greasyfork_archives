// ==UserScript==
// @name        Auto-open thepiratebay content links
// @description:en  Provide a button at the bottom of TPB item info to open links found in the torrent info area.
// @namespace   horse
// @include     about:addons
// @version     1.2
// @grant       none
// @include		htt*://thepiratebay.*
// @namespace https://greasyfork.org/users/441
// @require http://code.jquery.com/jquery-3.2.1.slim.min.js
// @description Provide a button at the bottom of TPB item info to open links found in the torrent info area.
// @downloadURL https://update.greasyfork.org/scripts/30374/Auto-open%20thepiratebay%20content%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/30374/Auto-open%20thepiratebay%20content%20links.meta.js
// ==/UserScript==
$(function(){
	
	function openNewBackgroundTab($url){
    var a = document.createElement("a");
    a.href = $url;
    var evt = document.createEvent("MouseEvents");
    //the tenth parameter of initMouseEvent sets ctrl key
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,true, false, false, false, 0, null);
    a.dispatchEvent(evt);
    focus();
	}
  
  if ($('#details .nfo a').length) {
  	$('<button class="open-info-links">Open links</button>').appendTo($('#details .nfo'));
  }

  $('.open-info-links').on('click', function(e) { e.preventDefault();
  	links = $('#details .nfo').find('a');
  	links.each(function(i, el) {
  		
  		var url = $(el).attr('href');
  		//console.log(link);
  		var win = window.open(url, '_blank');
  		//openNewBackgroundTab(link);
  	});
  })

});