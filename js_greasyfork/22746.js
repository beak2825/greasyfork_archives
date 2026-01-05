// ==UserScript==
// @name        SgWin
// @namespace   vsgw
// @include     https://www.steamgifts.com/
// @include     https://www.steamgifts.com/giveaway/*
// @icon        https://cdn.steamgifts.com/img/favicon.ico
// @version     1.2
// @grant       none
// @description SG win
// @downloadURL https://update.greasyfork.org/scripts/22746/SgWin.user.js
// @updateURL https://update.greasyfork.org/scripts/22746/SgWin.meta.js
// ==/UserScript==


function luck(vl,s) {
   var vls = vl.replace(',','');
   vls = vls.replace(' entries','');
   var vln = Math.ceil(vls/2);
   vls = vln.toString();
   if (vls.length>3) {vls = vls.substr(0,vls.length-3) + ',' + vls.substr(-3)}
   if (s == 1) vls += ' entries'; 
   return(vls);
}

var Nent = document.getElementsByClassName('fa fa-tag');
for(var i = 0; i < Nent.length; i++) {       
    if(Nent[i].className == 'fa fa-tag') {
      Nent[i].parentNode.getElementsByTagName('span')[0].innerHTML = luck(Nent[i].parentNode.getElementsByTagName('span')[0].innerHTML,1);
    }
}
Nent = document.getElementsByClassName('sidebar__navigation__item__count live__entry-count');
for(var i = 0; i < Nent.length; i++) {       
    if(Nent[i].className == 'sidebar__navigation__item__count live__entry-count') {
      Nent[i].innerHTML = luck(Nent[i].innerHTML,0);
    }
}

