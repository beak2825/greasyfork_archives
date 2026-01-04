// ==UserScript==
// @name     One click 5LK
// @namespace CosTam
// @name:pl	 Jezyk
// @version  1
// @grant    none
// @include http*://pl*.plemiona.pl/game.php?*screen=place*
// @description	Opis
// @description:pl	Opis_pl

// @downloadURL https://update.greasyfork.org/scripts/40873/One%20click%205LK.user.js
// @updateURL https://update.greasyfork.org/scripts/40873/One%20click%205LK.meta.js
// ==/UserScript==
coords='534|520 543|521 543|518 544|518 533|524 532|523 543|515 544|524 538|512 545|516 546|516 547|520 541|529 529|528 545|531 532|532 545|532 533|533 ';

//NA ILE MAKSYMALNIE Z TYCH WIOSEK CHCESZ WYSYLAC WOJSKA
max_index = 50;

doc = document;
if(window.frames.length > 0)
{
  doc = window.main.document;
}
url = doc.URL;

//ZAMIEN 6572 NA NUMER TAKI JAK TY MASZ
if(url=="https://pl127.plemiona.pl/game.php?village=6572&screen=place")
{
  coords = coords.split(" ");
  index = 0;  
  pomocookie = document.cookie.match('(^|;) ?pomo01=([^;]*)(;|$)');
  if(pomocookie != null)
  {
  	index = parseInt(pomocookie[2]);
  }
  
	if(index < max_index && index < coords.length)
  {
		coords = coords[index];
    index = index+1;
    document.cookie ="pomo01="+index;
    doc.forms[0].input.value=coords;

    //army
    doc.forms[0].spear.value=0;
    doc.forms[0].sword.value=0;
    doc.forms[0].axe.value=0;
    doc.forms[0].spy.value=0;
    doc.forms[0].light.value=7;
    doc.forms[0].heavy.value=0;
    doc.forms[0].ram.value=0;
    doc.forms[0].catapult.value=0;
    doc.forms[0].knight.value=0;
    doc.forms[0].snob.value=0;

    document.getElementById('target_attack').click();
	}
}
else if("url==https://pl127.plemiona.pl/game.php?village=6572&screen=place&try=confirm")
{
	document.getElementById('troop_confirm_go').click();
}
