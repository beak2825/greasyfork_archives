// ==UserScript==
// @author         pbcmatthew
// @name           Ghost Trappers Display Companion Name
// @description    A simple, minimalistic script that adds Companion Name to the Ghost Trappers companion page.
// @version        1.0
// @changes        
// @include        http://www.ghost-trappers.com/fb/setup.php?type=companion*
// @include        http://gt-1.diviad.com/fb/setup.php?type=companion*
// @include        http://www.ghost-trappers.com/fb/setup.php?action=changeSortFilter&type=companion*
// @include        http://gt-1.diviad.com/fb/setup.php?action=changeSortFilter&type=companion*
// @namespace https://greasyfork.org/users/13142
// @downloadURL https://update.greasyfork.org/scripts/10921/Ghost%20Trappers%20Display%20Companion%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/10921/Ghost%20Trappers%20Display%20Companion%20Name.meta.js
// ==/UserScript==
$(window).load(function(){ 
for (var i = 0; i<300; i++) {
	var petimglink = document.getElementsByClassName("smallImage")[i].src;
	var petimgpng = petimglink.split("/")[6];
	var petimgname = petimgpng.split(".")[0];

	var nickname =  document.getElementsByClassName("smallName")[i];
	petname = document.createElement("div"); 

	var mapObj = {
		icon:"",
		png:"",
		_:" "

	};
		petimgname = petimgname.replace(/icon|png|_/gi, function(matched){
		return mapObj[matched];
		});

petname.innerHTML = petimgname; 
nickname.appendChild(petname);
}

})