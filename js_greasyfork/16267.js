// ==UserScript==
// @name         Jump Coordinates fatenation.ru
// @namespace    fatenationcustomscripts
// @version      0.14
// @description  Add a field to enter coordinates and jump to them. For civ-like online game fatenation.ru
// @author       stan@fatenation.ru
// @include      http://*.fatenation.ru
// @include      http://*.fatenation.ru/*
// @include      http://*.fatenation.ru/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16267/Jump%20Coordinates%20fatenationru.user.js
// @updateURL https://update.greasyfork.org/scripts/16267/Jump%20Coordinates%20fatenationru.meta.js
// ==/UserScript==

// Your code here...

simple_delay();

function simple_delay() {
if (document.getElementsByClassName('status-bar-holder')[0]!==undefined) {simple_coordinates_jump_menu()}
else {setTimeout(simple_delay, 1000);}
}

function simple_coordinates_jump_menu() {

    var j=document.createElement('span');
    j.className='jump';
    j.setAttribute('style',"z-index:10000;padding:2px;background:#777;");
    f=document.createElement("input");
    f.className="jumping_here";
    f.type="text";
    f.setAttribute('style',"margin:0;border:0;padding:0;background:none;");
    f.size=7;
    f.onblur=function(){
       $input=document.getElementsByClassName('jumping_here')[0].value;
       $xy=$input.split(" ");
       if (!isNaN(parseInt($xy[0])) && !isNaN(parseInt($xy[1]))){$location=(FN.Map.getLocationByXY(parseInt($xy[0],10),parseInt($xy[1], 10))); FN.Map.setCenterXY(FN.Map.getXByLocation($location) - 4, FN.Map.getYByLocation($location) - 4);}
       else if (!isNaN(parseInt($xy[0]))) {$location=parseInt($xy[0], 10); FN.Map.setCenterXY(FN.Map.getXByLocation($location) - 4, FN.Map.getYByLocation($location) - 4);}
       else {/* :-) */}
    }
    j.appendChild(f);
    document.getElementsByClassName('status-bar-holder')[0].appendChild(j);
}