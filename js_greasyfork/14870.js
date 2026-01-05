
// ==UserScript==
// @name           Dugout
// @version        7
// @description    en

// @include         https://www.dugoutsoccer.com/*
// @include         http://www.dugoutsoccer.com/*
// @exclude         https://www.dugoutsoccer.com/index.php
// @exclude         https://www.dugoutsoccer.com/
// @exclude         http://www.dugoutsoccer.com/index.php
// @exclude         http://www.dugoutsoccer.com/
// @namespace https://greasyfork.org/users/7445
// @downloadURL https://update.greasyfork.org/scripts/14870/Dugout.user.js
// @updateURL https://update.greasyfork.org/scripts/14870/Dugout.meta.js
// ==/UserScript==



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Customize Section: Customize Dugout																	///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//																														///
var menubar = "yes";		// switch yes/no to turn the menubar on/off																///
var stadium = "on";	// on/off
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var background = "ne";	
//The following background are supported right now: 																						///
//																														///
//	Aqua = aq																											///
//	Night = ni																											///																																					///     Stadium champions league = sc																										///
//	StadiumBarca = sb																										///
//	Neymar = ne																											///
//	GoKick = go																										///     	
//																									///
//																										///
//																											///
//																								///
//																										///
//																														///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var language = "en";     // choose your language, check supported languages below:


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	en = English																												///
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


switch (language) {

	
//English	
	case "en":
		var Home = "Club";
		var Squad = "Squad";
		var Tactics = "Tactics";
		var Fixtures = "Fixtures";
		var Finances = "Finances";
		var TrainingOverview = "Training Overview";
		var Training = "Training";
		var League = "League";
		var TransferList = "Transfer List";
		var Forum = "Forum";
		var Manual = "Manual";
	    var Exit = "Exit";
		
		
	break;

	

	
}



if (stadium == "on") {
switch (background) {

//Aqua
 case "aq":
    var div1 = document.createElement('div');
appdiv1 = document.body.appendChild(div1);
appdiv1.innerHTML = '<div id="menu" style="position: fixed; z-index: -1; top: -200px; left: 0px; height: 1500px; width: 3000px; -moz-opacity: .8; text-align: left; outset; background: url(http://www.imperiumtapet.com/media/wallpaper/82740/image/be83f6bbeee34c7c9d44_1920x1200_cropromiar-niestandardowy.jpg);"></a></span></div>';

  break;
  
//Night
 case "ni":
    var div1 = document.createElement('div');
appdiv1 = document.body.appendChild(div1);
appdiv1.innerHTML = '<div id="menu" style="position: fixed; z-index: -1; top: 0px; left: 0px; height: 1500px; width: 3000px; -moz-opacity: .8; text-align: left; outset; background: url(http://images7.alphacoders.com/306/306565.jpg);"></a></span></div>';

  break;
  
//StadiumCHL
 case "sc":
    var div1 = document.createElement('div');
appdiv1 = document.body.appendChild(div1);
appdiv1.innerHTML = '<div id="menu" style="position: fixed; z-index: -1; top: -50px; left: 0px; height: 1500px; width: 3000px; -moz-opacity: .8; text-align: left; outset; background: url(http://images.123hdwallpapers.com/20150523/football-stadium-1920x1200.jpg);"></a></span></div>';

  break;
  
//StadiumBarca
 case "sb":
    var div1 = document.createElement('div');
appdiv1 = document.body.appendChild(div1);
appdiv1.innerHTML = '<div id="menu" style="position: fixed; z-index: -1; top: -50px; left: 0px; height: 1500px; width: 3000px; -moz-opacity: .8; text-align: left; outset; background: url(http://images6.alphacoders.com/324/324025.jpg);"></a></span></div>';

  break;
  

//Neymar
 case "ne":
    var div1 = document.createElement('div');
appdiv1 = document.body.appendChild(div1);
appdiv1.innerHTML = '<div id="menu" style="position: fixed; z-index: -1; top: 50px; left: 0px; height: 1500px; width: 3000px; -moz-opacity: .8; text-align: left; outset; background: url(http://i.imgur.com/9uqF1im.png);"></a></span></div>';

  break;

//GoKick
 case "go":
    var div1 = document.createElement('div');
appdiv1 = document.body.appendChild(div1);
appdiv1.innerHTML = '<div id="menu" style="position: fixed; z-index: -1; top: -50px; left: 0px; height: 1500px; width: 3000px; -moz-opacity: .8; text-align: left; outset; background: url(http://i.imgur.com/dFucGWe.png);"></a></span></div>';

  break;

}
}




{


//Menu bottom right
if (menubar == "yes") {
var div1 = document.createElement('div');
appdiv1 = document.body.appendChild(div1);
appdiv1.innerHTML = '<div id="menu" style="position: fixed; z-index: 1000; bottom: 0px;  right: 450px; height: 35px; width: 800px; -moz-opacity: .8; text-align: left;   outset; background: url(http://www.patrick-meurer.de/tm/TrophyBuddy_menu2.png);">&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://dugoutsoccer.com/clubhouse.php"><img src="http://i62.tinypic.com/scffqd_th.jpg" title="' + Home + '" style="height: 25px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://dugoutsoccer.com/squad.php"><img src="http://i58.tinypic.com/r94bcn_th.jpg" title="' + Squad + '" style="height: 25px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://dugoutsoccer.com/lineup.php"><img src="http://i62.tinypic.com/1zowzzm_th.jpg" title="' + Tactics + '" style="height: 25px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://dugoutsoccer.com/fixtures.php"><img src="http://i57.tinypic.com/azb4sw_th.jpg" title="' + Fixtures + '" style="height: 25px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://dugoutsoccer.com/finances.php"><img src="http://i61.tinypic.com/ff4pkx_th.jpg" title="' + Finances + '" style="height: 25px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://www.dugoutsoccer.com/training-overview.php"><img src="http://i62.tinypic.com/2nlsmqb_th.jpg" title="' + TrainingOverview + '" style="height: 25px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://dugoutsoccer.com/training.php"><img src="http://i60.tinypic.com/dy1wle_th.jpg" title="' + Training + '" style="height: 25px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://dugoutsoccer.com/table.php"><img src="http://dugoutsoccer.com/images/trophies/1.png" title="' + League + '" style="height: 25px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://www.dugoutsoccer.com/transfer-list.php"><img src="http://i61.tinypic.com/9tohn5_th.jpg" title="' + TransferList + '" style="height: 25px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://dugoutsoccer.com/forum/index.php"><img src="http://i61.tinypic.com/2qbugpf_th.jpg" title="' + Forum + '" style="height: 25px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://dugoutsoccer.com/manual.php"><img src="http://i62.tinypic.com/j5v34i_th.jpg" title="' + Manual + '" style="height: 25px;"></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative; top:5px;left:0px"><a href="http://dugoutsoccer.com/logout.php"><img src="http://patrick-meurer.de/tm/trophybuddy/logout.png" title="' + Exit + '" style="height: 25px;"></a></span></div>';
}
else {
}
/*
var TMDB = document.createElement("span"); // erzeugt ein html-span-tag
TMDB.innerHTML=Tform;
document.getElementById("lastspan").appendChild(TMDB);
*/

}





