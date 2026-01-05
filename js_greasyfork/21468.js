// ==UserScript==
// @name        Pinterest registration popup killer
// @namespace   Pinterest registration popup killer
// @version     1.3
// @description Browse Pinterest without registration. Also remove the cookies banner.
// @description Based on the script https://greasyfork.org/fr/scripts/6325-pinterest-without-registration
// @description I modified that script because it suddenly stopped working for me.
// @include     http://*.pinterest.com/*
// @include     https://*.pinterest.com/*
// @copyright   2016+, Mugen25
// @require     http://code.jquery.com/jquery-latest.min.js
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/21468/Pinterest%20registration%20popup%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/21468/Pinterest%20registration%20popup%20killer.meta.js
// ==/UserScript==


$(document).ready(function () {


	if ( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ) { 
	
	 	setTimeout(
   			function() 
   				{
		 
    				 $('.Module.DenzelReactBridge > div > div:nth-of-type(2)').remove();
     				 $('.Module.DenzelReactBridge > div > div').css("position","");
     				 $('.Module.DenzelReactBridge > div > div > div:nth-of-type(1)').remove();
                     $('.FullPageModal__scroller').remove();
		
   				}, 1000);
		
		} else {

			$('.Module.DenzelReactBridge > div > div:nth-of-type(2)').remove();
     		$('.Module.DenzelReactBridge > div > div').css("position","");
     		$('.Module.DenzelReactBridge > div > div > div:nth-of-type(1)').remove();
            $('.FullPageModal__scroller').remove();
		
		}
	

  
	if(!!$("div.Module.UnauthHomeReactPage").length)
		location.href = "https://www.pinterest.com/categories";

	$("head").append("<style>.UnauthBanner, body > .Modal, .ModalManager > .Modal { display: none !important; } " +
		".noScroll { overflow: auto !important; } " +
		"div[style*='cubic-bezier'] { display: none !important; } " +
		"div.gridContainer > div, .Grid { height: auto !important; }</style>");
	$("body").removeClass("noTouch");

	$('.leftHeaderContent > .searchFormHidden').css('float', 'right');
	$('.searchFormHidden').removeClass('searchFormHidden');
	$('form[name=search] .tokenizedInputWrapper').css({
		'border-left': $('form[name=search] .tokenizedInputWrapper').css('border-right'),
		'border-radius': '6px'
	});
  
});