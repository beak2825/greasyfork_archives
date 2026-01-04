// ==UserScript==
// @namespace      http://havana.club/fixgoogle
// @version        2
// @name           Fix Google
// @name:en        Fix Google
// @description    Remove Google redirects and annoying result sections
// @description:en Remove Google redirects and annoying result sections
// @include        https://www.google.*/*
// @grant          none
// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/38975/Fix%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/38975/Fix%20Google.meta.js
// ==/UserScript==

(function($) {
  
    try
    {
        $('h3 a').removeAttr('onmousedown');
        $('h3 a').removeAttr('onclick');
        $('h3 a').removeAttr('oncontextmenu');

        $('h3 a').click( function (e) {
            e.stopImmediatePropagation();
            e.stopPropagation();
          } );
      
      	// add the complete URL under the title
      	$('h3 a').each( function() {
          	var $cite = $('<cite>').addClass('_Rm').text( $(this).attr('href') );
          	var $div = $('<div>').addClass('s').append($cite);
          	$(this).parent().after($div);
        });

	    // remove 'Top stories'
      	$('div[data-hveid="51"]').parent().remove();
      	$('div[data-hveid="52"]').parent().remove();

        // remove 'People also ask'
      	$('div[data-hveid="55"]').remove();
      	$('div[data-hveid="69"]').remove();
      
      	// remove map results
      	$('div[data-hveid="126"]').remove();
      	$('div[data-hveid="139"]').remove();
      
      	// remove Wikipédia results
      	$('div[data-hveid="724"]').remove();
      
      	// remove music results
      	$('div[data-hveid="763"]').remove();
      
    } catch (ex)
    {
      alert(ex);
    }
    
})(jQuery);