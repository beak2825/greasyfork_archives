// ==UserScript==
// @name        DC - BlockUse Fixed
// @namespace   InGame
// @include     https://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @author      Odul, Fixed by Lorkah
// @version     1.2
// @description Bloque l'utilisation de consommables par défaut. Faut déverouiller le petit cadenas 'BU' pour pouvoir.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/412356/DC%20-%20BlockUse%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/412356/DC%20-%20BlockUse%20Fixed.meta.js
// ==/UserScript==

function checkActivable(){
  if( document.getElementById('blockUse').style.backgroundImage.replace(/\"/g,'') == 'url(https://i.imgur.com/SNOpqJt.png)')
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
blockUse.setAttribute("style", "height:30px;background-image:url('https://i.imgur.com/qKgO7xV.png');background-repeat: no-repeat;z-index: 999999;");

$('#bandeau ul')[0].insertBefore(blockUse,$('#bandeau ul')[0].firstChild);          
$('#blockUse').css('background-position','0px 6px').css('top','5px').css('background-size','15px 15px').addClass('link').text('BU').css("color","#999");

blockUse.onclick = function(){
    if( document.getElementById('blockUse').style.backgroundImage.replace(/\"/g,'') == 'url(https://i.imgur.com/SNOpqJt.png)')
    document.getElementById('blockUse').style.backgroundImage = 'url("https://i.imgur.com/qKgO7xV.png")';
  else
    document.getElementById('blockUse').style.backgroundImage = 'url("https://i.imgur.com/SNOpqJt.png")';
};
    
  
  var myVar = setInterval(function () {
    checkActivable()
  }, 3000);
}) ();


