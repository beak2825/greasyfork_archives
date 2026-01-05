// ==UserScript==
// @name        Wykop - dobre strony wykopu
// @namespace   aszInfo
// @description Oznacza znaleziska na wykop.pl, w których źródłem są strony ze zmiennej _adresy
// @include     http://www.wykop.pl/
// @include     http://www.wykop.pl/strona/*
// @include     http://www.wykop.pl/wykopalisko*

// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10720/Wykop%20-%20dobre%20strony%20wykopu.user.js
// @updateURL https://update.greasyfork.org/scripts/10720/Wykop%20-%20dobre%20strony%20wykopu.meta.js
// ==/UserScript==

/*
Poniżej zdefiniowane zmienne: 

_adresy_dobre - lista adresów, które mają być oznaczone na zielono

Dodawanie adresów:
  Adresy należy dodawać po przecinku, jak w przykładzie poniżej
_adresy_dobre=['adres1.pl','adres2.pl','adres3.pl']

*/

function oznaczStrony()
{

  var _adresy_dobre=['rmf24.pl'];
 
  
  $(".fix-tagline").find('span.tag a').each(function(i,e){
    
    if ($.inArray($(e).text(),_adresy_dobre) > -1)
    {
      $(e).css({background:'#080', color:'#fff', padding:'0.2em', borderRadius:'2px' }).removeClass('affect') 
      $(e).parent().parent().parent().parent().parent().css({border:'5px solid #050'});
      $(e).parent().parent().parent().find('h2 a').css({color:"#080"});
    }
    
    
  });
}

oznaczStrony();