// ==UserScript==
// @author         pbcmatthew
// @name           Ghost Trappers display loot name 
// @description    A simple, minimalistic script that show loot name to the icon on contract and companion page. This enable to use browser serach function to search
// @version        1.0
// @changes        none
// @include        http://www.ghost-trappers.com/fb/setup.php?type=companion*
// @include        http://gt-1.diviad.com/fb/setup.php?type=companion*
// @include        http://www.ghost-trappers.com/fb/setup.php?action=changeSortFilter&type=companion*
// @include        http://gt-1.diviad.com/fb/setup.php?action=changeSortFilter&type=companion*

// @include        http://www.ghost-trappers.com/fb/setup.php?type=contract*
// @include        http://gt-1.diviad.com/fb/setup.php?type=contract*
// @include        http://www.ghost-trappers.com/fb/setup.php?action=changeSortFilter&type=contract
// @include        http://gt-1.diviad.com/fb/setup.php?action=changeSortFilter&type=contract

// @namespace https://greasyfork.org/users/13142
// @downloadURL https://update.greasyfork.org/scripts/10920/Ghost%20Trappers%20display%20loot%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/10920/Ghost%20Trappers%20display%20loot%20name.meta.js
// ==/UserScript==

$(window).load(function(){ 

	if ( document.getElementsByClassName("itemImageContainer")[0]) {
		var field1= "stateIcon";
		var field2= "stateIcon";
		insertname(field1,field2) ;
	}
	if ( document.getElementsByClassName("companionHeadLine")[0]) {
		var field1= "smallIcon";
		var field2= "smallStat";
		insertname(field1,field2) ;
	}
	
}) 

function insertname(el1,el2) {

	for (var i = 0; i<2000; i++) {
		var str = document.getElementsByClassName(el1)[i].title ;
		var patt = new RegExp("LOOT HUNTER BONUS");
		var res = patt.exec(str);
		
		if (res=="LOOT HUNTER BONUS"){
			var lootimglink = document.getElementsByClassName(el1)[i].style.backgroundImage ;
			var lootimgpng  = lootimglink.split("/")[6];
			var lootimgname = lootimgpng.split(".")[0];
			var lootstat =  document.getElementsByClassName(el2)[i];
			lootname = document.createElement("div"); 
		
			var mapObj = {
				companion:"",
				icon:"",
				png:"",
				lh:"",
				gui:"",
				_:" "
			};
			lootimgname = lootimgname.replace(/companion|icon|png|lh|gui|_/gi, function(matched){
			return mapObj[matched];
			});
		
		lootname.innerHTML = lootimgname; 
		lootstat.appendChild(lootname);
		}
	}
}
