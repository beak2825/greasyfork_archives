// ==UserScript==
// @name        digitec.ch price limiter
// @namespace   Violentmonkey Scripts
// @match       https://www.digitec.ch/de/s1/producttype/grafikkarte-106
// @grant       none
// @version     1.0
// @author      -
// @description 1/8/2020, 11:56:27 AM
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/394823/digitecch%20price%20limiter.user.js
// @updateURL https://update.greasyfork.org/scripts/394823/digitecch%20price%20limiter.meta.js
// ==/UserScript==


$('body').attr('contextmenu', 'maxPrice');
$('body').add('<menu type="context" id="maxPrice"><menuitem label="Max. Price" onclick="priceLimiter()" /></menu>').appendTo(document.body);



window.priceLimiter = function() {
  
  if (unsafeWindow.maxP === undefined) {
    unsafeWindow.maxP = 999999;
  }
    
  unsafeWindow.maxP = parseInt( prompt('Max. Price:').match(/\d+/)[0] );

  console.log('Set max price' + unsafeWindow.maxP)
  
  $(window).scroll(
    function(e) {
      
      var maxP = parseInt( unsafeWindow.maxP );
      
      console.log('Scroll');
      console.log('max ' + maxP) 
      
      $('article.panelProduct').each( 

        function(e) {

          var p = $(this).find('.ZZcu').text().match(/(\d+)/);
          
          if ( p !== null )
          {
            var pInt = parseInt( p[0] );
            
            console.log(pInt);
            
            if (pInt > maxP )
            { 
              $(this).css('display', 'none');
            }
          }
        }
      )
    }
  ) 
}