// ==UserScript==
// @name        BlockUse
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @version     1.01
// @description Bloque l'utilisation de consommables par défaut.Faut déverouiller le petit cadenas 'BU' pour pouvoir.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5076/BlockUse.user.js
// @updateURL https://update.greasyfork.org/scripts/5076/BlockUse.meta.js
// ==/UserScript==

function checkActivable(){
  if( document.getElementById('blockUse').style.backgroundImage.replace(/\"/g,'') == 'url(http://zupimages.net/up/14/38/ywv2.png)')
  {
   $('.objets .non_activable').each(function (index) {
      $(this).removeClass("non_activable").addClass("activable");
    });
  }
  else
  {
     $('.objets .activable').each(function (index) {
      $(this).removeClass("activable").addClass("non_activable");
    });
  }
}

(function () {
var blockUse = document.createElement('li');
blockUse.id='blockUse';
blockUse.setAttribute("style", "height:30px;background-image:url('http://www.geodesheep.com/skin-01/images/icone_cadenas.png');background-repeat: no-repeat;z-index: 999999;");

$('#bandeau ul')[0].insertBefore(blockUse,$('#bandeau ul')[0].firstChild);          
$('#blockUse').css('background-position','0px 6px').css('top','5px').css('background-size','15px 15px').addClass('link').text('BU').css("color","#999");

blockUse.onclick = function(){
    if( document.getElementById('blockUse').style.backgroundImage.replace(/\"/g,'') == 'url(http://zupimages.net/up/14/38/ywv2.png)')
    document.getElementById('blockUse').style.backgroundImage = 'url("http://www.geodesheep.com/skin-01/images/icone_cadenas.png")';
  else
    document.getElementById('blockUse').style.backgroundImage = 'url("http://zupimages.net/up/14/38/ywv2.png")';
};
    
  
  var myVar = setInterval(function () {
    checkActivable()
  }, 3000);
}) ();


