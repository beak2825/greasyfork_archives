// ==UserScript==
// @name               TW night mode
// @version            1.00
// @description        The West night mode
// @author             HALCON DE ORO ty hiroaki
// @include 	       https://*.the-west.*/game.php*
// @namespace https://greasyfork.org/users/6511
// @downloadURL https://update.greasyfork.org/scripts/40157/TW%20night%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/40157/TW%20night%20mode.meta.js
// ==/UserScript==


(function(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	(document.body || document.head || document.documentElement).appendChild(newScript);
	newScript.parentNode.removeChild(newScript);
})(function() {
  
    TWNM = {
        version: '1.0',
        name: 'TW night mode',
        author: 'HALCON DE ORO ty hiroaki',
        minGame: '2.01',
        maxGame: Game.version.toString(),
        website: 'https://greasyfork.org/es/scripts/40157-tw-night-mode',
      

};   

  TheWestApi.register('TWNM', TWNM.name, TWNM.minGame, TWNM.maxGame, TWNM.author, TWNM.website).setGui('With this script you put the game in night mode');
var brillo1="brightness(";
var brillo2=50;
var brillo3="%)";
reload = function (){ 
  
  var brillototal=brillo1+brillo2+brillo3;
	$("#map").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#ui_workcontainer").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#ui_bottomleft").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#ui_bottombar").css({ "filter": brillototal, "-webkit-filter": brillototal }); 
  $("#ui_experience_bar").css({ "filter": brillototal, "-webkit-filter": brillototal }); 
	$("#ui_topbar").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#ui_character_avatar_container").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#windows").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#ui_notibar").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#buffbars").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#ui_menubar").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#ui_right").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#ui_notifications").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#hiro_friends_container").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#custom_unit_counter_Easter_hasMousePopup_with_log").css({ "filter": brillototal, "-webkit-filter": brillototal });
 	$("#westforts_link_div").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#mpi-playerinfo").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#mission-map-container").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#popup_div_compare").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#popup").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $("#ui_windowdock").css({ "filter": brillototal, "-webkit-filter": brillototal });

  
  $(".friendsbar").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $(".friendsbar-toggle").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $(".custom_unit_counter.Easter.hasMousePopup.with_log").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $(".tw2gui_selectbox").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $(".tw2gui_dialog").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $(".ui-loader-wrap").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $(".mpi-ui-topbar").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $(".mpi-abilities").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $(".mpi-timeline.animate.horizontal").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $(".teamlist.team-red.team-right").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $(".teamlist.team-blue.team-left").css({ "filter": brillototal, "-webkit-filter": brillototal });
  $(".fancybanner.mpi-end-game-dialog").css({ "filter": brillototal, "-webkit-filter": brillototal });

 
};
  
  setInterval(function() {
    reload()
  }, 50);
});