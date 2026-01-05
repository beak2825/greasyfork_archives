// ==UserScript==
// @name convert kg to lbs in Fitocracy
// @version 2015.07.21
// @description Convert kg to lbs on fitocracy.
// @match https://www.fitocracy.com/*
// @namespace https://greasyfork.org/users/13501
// @downloadURL https://update.greasyfork.org/scripts/11105/convert%20kg%20to%20lbs%20in%20Fitocracy.user.js
// @updateURL https://update.greasyfork.org/scripts/11105/convert%20kg%20to%20lbs%20in%20Fitocracy.meta.js
// ==/UserScript==

version = '2015.07.21';

//var t = window.setInterval(checkUnits, 5000)

function checkUnits(){
	var p = document.getElementsByClassName('action_detail');
	
	if (p.length > 0){
		for (p1=0; p1<p.length; p1++) {
			var c = p[p1].getElementsByTagName('li');
			for (c1=0; c1<c.length; c1++) c[c1].innerHTML = (tolb(c[c1].innerHTML));
		}
    }
}
function tolb(str){ 
  var re = /((\d+)(\s)?(kg))/i; 
  function ptolb(str, pr, weight, div, unit,s){ 
    div = div ? div : ''; 
    return (+weight*2.2).toFixed(0) + div + 'lb'; 
  } 
  return str.replace(re,ptolb);
} 

checkUnits();

if (document.getElementById('ftf-promotion-widget') !==null) document.getElementById('ftf-promotion-widget').style.display = 'none';
if ( document.getElementById('minidash-placeholder') !==null) document.getElementById('minidash-placeholder').style.display = 'none';
if ( document.getElementById('useful-links') !==null) document.getElementById('useful-links').style.display = 'none';
if ( document.getElementById('social-media') !==null) document.getElementById('social-media').style.display = 'none';
if ( document.getElementById('invite-friends-widget') !==null) document.getElementById('invite-friends-widget').style.display = 'none';
if ( document.getElementById('team-fitness') !==null) document.getElementById('team-fitness').style.display = 'none';

var elems = document.getElementsByClassName('ad_container');
for(var i = 0; i != elems.length; ++i) elems[i].style.display= "none";
