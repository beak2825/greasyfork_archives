// ==UserScript==
// @id             5a3ebe9b-d73f-4397-a5c3-7a382723c39e
// @name           [BETA VERSION] Youtube - Right Side Description 
// @namespace      Takato
// @author         Takato
// @copyright      2010+, Takato (https://greasyfork.org/users/1158/)
// @licence        Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International - Additional conditions apply; https://greasyfork.org/scripts/976/
// @description    Moves the video description to the right of the video, adds options for a retro player and style
// @icon           https://i.imgur.com/JwIVLou.png https://i.imgur.com/qlQhuaa.png
// @icon64         https://i.imgur.com/qlQhuaa.png
// @resource       icon https://i.imgur.com/JwIVLou.png
// @resource       icon64 https://i.imgur.com/JwIVLou.png
// @version        2020.07.31
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require		   https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @website        https://greasyfork.org/scripts/32695/
// @homepageURL		 https://greasyfork.org/scripts/32695/
// @noframes
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @grant          GM_getResourceURL
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.deleteValue
// @grant          GM.addStyle
// @grant          GM.getResourceUrl
// @include        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/32695/%5BBETA%20VERSION%5D%20Youtube%20-%20Right%20Side%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/32695/%5BBETA%20VERSION%5D%20Youtube%20-%20Right%20Side%20Description.meta.js
// ==/UserScript==
// This script is licenced under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (https://creativecommons.org/licenses/by-nc-sa/4.0/) with additional conditions. 
// See https://greasyfork.org/scripts/976/ for full details of the licence and conditions.
(async function() {

var script = {};
script.version = "2020.07.31";

// SETTINGS -----------------------------

// Available by hovering over the Youtube header on a video page. The settings button will appear.

// --------------------------------------

  
// Don't edit below this line. All settings are listed above.

// Defining static script properties
script.name = "Right Side Description [BETA]"; // Previously known as Better Watch Page
script.shortname = "RSD Beta";
script.website = "https://greasyfork.org/scripts/32695/";
script.discussion = "https://greasyfork.org/scripts/32695/feedback";
script.icon = await GM.getResourceUrl("icon");
script.icon64 = await GM.getResourceUrl("icon64");
script.mainCSS = "ytd-masthead:not(:hover) #bwp-retrostyle-toggle:not(.open) {display:none;}    	  /* Top Title Enabled */    	.rsdTitle ytd-watch-flexy:not([theater]) #rsd-title {margin-bottom:4px;}  	.rsdTitle ytd-watch-flexy[theater] #rsd-title, .rsdTitle ytd-watch-flexy:not([theater]) ytd-video-primary-info-renderer h1.title {display:none;}     	.rsdTitle ytd-watch-flexy:not([theater]):not([fullscreen]) #primary.ytd-watch-flexy  {padding-top:5px;}    	html:not(.rsdTitle) #rsd-title {display:none;}  	    /* Side description (always) enabled */  	#meta.rsd-description {width:auto; padding-right:0; order:0; margin-bottom:16px;}    	.rsdTitle ytd-watch-flexy:not([theater]) #meta.rsd-description {margin-top:9px;}    	ytd-video-secondary-info-renderer {max-height:390px; overflow:auto; width:auto; padding-top:0; padding-bottom:0; margin-right: 0 !important; background-color:var(--yt-playlist-background-item); padding:8px; border-bottom-width:0px;}  	@media screen and (min-width: 1000px) {  		ytd-video-secondary-info-renderer {margin-left:-14px;}  	}      ytd-video-secondary-info-renderer #top-row.ytd-video-secondary-info-renderer {padding-top:0;}  	ytd-video-secondary-info-renderer #top-row.ytd-video-secondary-info-renderer paper-button {padding:4px 10px; min-width:20px;}  	ytd-video-secondary-info-renderer #subscribe-button.ytd-video-secondary-info-renderer ytd-subscription-notification-toggle-button-renderer {--yt-button-icon-size:24px; --yt-button-icon-padding:0px;}  	ytd-video-secondary-info-renderer #owner-sub-count {text-align:right;}  	ytd-video-secondary-info-renderer #subscribe-button, ytd-video-secondary-info-renderer #sponsor-button, ytd-video-secondary-info-renderer #analytics-button {align-self:start;}    	ytd-video-secondary-info-renderer #date.ytd-video-primary-info-renderer #dot {display:none;}  	  	  	ytd-video-secondary-info-renderer ytd-expander.ytd-video-secondary-info-renderer {margin-left:0; max-width:100%; font-size:1.3rem; line-height:normal; --ytd-expander-collapsed-height:auto !important;}  	ytd-video-secondary-info-renderer ytd-expander[collapsed]:before {content:'Some description data may be missing - Refresh page to fix.';  margin-bottom:1rem; display:block; font-weight:bold; }  	ytd-video-secondary-info-renderer #less {display:none;}    	ytd-video-secondary-info-renderer #title.ytd-metadata-row-renderer {width:auto; font-size:1.1rem; line-height:normal;}  	ytd-video-secondary-info-renderer .content.ytd-metadata-row-renderer {width:auto; font-size:1.1rem; line-height:normal; white-space:normal;}  	ytd-video-secondary-info-renderer .content.content-line-height-override.ytd-metadata-row-renderer {line-height:normal;}    	ytd-video-secondary-info-renderer #contents.ytd-rich-metadata-row-renderer {margin-right:0;}  	ytd-video-secondary-info-renderer ytd-rich-metadata-renderer {transform:scale(0.68); transform-origin:top left; margin-right:-88px !important; margin-bottom:-30px !important; margin-top:0 !important; min-width:none; max-width:none;}  	  	#playlist.ytd-watch-flexy {margin-bottom:16px;}    	  	    /* Below Video */  	  	/*html:not(.rsdTitle) ytd-watch-flexy:not([theater]) ytd-video-primary-info-renderer {padding-top:10px;}    	ytd-video-primary-info-renderer #count {float:right; margin-top:-14px;}  	html:not(.rsdTitle) ytd-video-primary-info-renderer #count,  ytd-watch-flexy[theater] ytd-video-primary-info-renderer #count {margin-top:-22px;}  	ytd-video-primary-info-renderer #count yt-view-count-renderer {font-size:18px;}  	ytd-video-primary-info-renderer #sentiment.ytd-video-primary-info-renderer {width:100%;}*/  	  	  	  	/*Retro CSS*/    	  	html:not([dark]).rsdRetro ytd-app[is-watch-page] {background-color: white !important;}  	  	.rsdRetro body, .rsdRetro input, .rsdRetro textarea, .rsdRetro select {font-family:arial,sans-serif;}    	.rsdRetro #masthead-container.ytd-app::after {display:none;}  	.rsdRetro #masthead:not([dark]) {border-bottom: 1px solid #CCCCCC;}  	.rsdRetro #container.ytd-masthead {height:49px;}  	  	  	.rsdRetro #masthead:not([dark]) #logo-icon-container.ytd-topbar-logo-renderer {background:url(https://s.ytimg.com/yt/img/master.png) 0px -641px; }  	.rsdRetro #masthead:not([dark]) #logo-icon-container.ytd-topbar-logo-renderer svg  {visibility:hidden;}  	.rsdRetro #masthead:not([dark]) #logo-icon-container.ytd-topbar-logo-renderer {width:99px; height:42px;}  	.rsdRetro ytd-topbar-logo-renderer #country-code {display:none;}    	  	  	.rsdRetro #page-manager.ytd-app {margin-top: 49px;}  	  	    	.rsdRetro #rsd-title {font-size:19px; font-weight:bold;}  	  	  	.rsdRetro ytd-video-secondary-info-renderer {background:#EEEEEE;  border:1px solid #CCCCCC; font-size:12px; padding:6px; margin-bottom:8px;}  	html[dark].rsdRetro  ytd-video-secondary-info-renderer {background:var(--yt-playlist-background-item); border-color:var(--yt-border-color);}  	.rsdRetro ytd-video-secondary-info-renderer a.yt-simple-endpoint:not(.ytd-button-renderer):not(.ytd-subscription-notification-toggle-button-renderer), .rsdRetro  ytd-video-secondary-info-renderer a.yt-simple-endpoint:not(.ytd-button-renderer):not(.ytd-subscription-notification-toggle-button-renderer):hover {color:#0033CC;}  	html[dark].rsdRetro  ytd-video-secondary-info-renderer a.yt-simple-endpoint:not(.ytd-button-renderer), html[dark].rsdRetro  ytd-video-secondary-info-renderer a.yt-simple-endpoint:not(.ytd-button-renderer):hover {color:var(--yt-spec-call-to-action);}  	.rsdRetro ytd-video-secondary-info-renderer #top-row.ytd-video-secondary-info-renderer {margin-bottom:2px; }  	.rsdRetro ytd-video-secondary-info-renderer #avatar.ytd-video-owner-renderer {border-radius:0; border:1px solid white; outline:1px solid #999999; margin:1px; margin-right:7px;}  	html[dark].rsdRetro  ytd-video-secondary-info-renderer #avatar.ytd-video-owner-renderer  {outline-color:#1b1b1b; border-color:var(--yt-border-color);}  	.rsdRetro ytd-video-secondary-info-renderer #upload-info.ytd-video-owner-renderer {justify-content:flex-start;}  	.rsdRetro ytd-video-secondary-info-renderer #upload-info.ytd-video-owner-renderer > * {font-size:1em; color:black;}  	html[dark].rsdRetro ytd-video-secondary-info-renderer #upload-info.ytd-video-owner-renderer > * {color:white;}  	.rsdRetro ytd-video-secondary-info-renderer #owner-name.ytd-video-owner-renderer, .rsdRetro ytd-video-secondary-info-renderer #channel-name.ytd-video-owner-renderer  {font-weight:bold; font-size:1em;}   	html:not([dark]).rsdRetro ytd-video-secondary-info-renderer yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string {color:#0033CC;}  	.rsdRetro ytd-video-secondary-info-renderer #upload-info.ytd-video-owner-renderer .date.ytd-video-secondary-info-renderer { font-size:1em; color:var(--yt-primary-text-color);	}  	  	  	  	.rsdRetro ytd-video-secondary-info-renderer ytd-expander.ytd-video-secondary-info-renderer {font-size:1em; line-height:15px;}  	html:not([dark]).rsdRetro  ytd-video-secondary-info-renderer .content.ytd-video-secondary-info-renderer {color:#333;}  	  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-container-renderer {border-top:1px solid #CCCCCC; padding-top:2px; margin-top:8px;}  	html[dark].rsdRetro  ytd-video-secondary-info-renderer ytd-metadata-row-container-renderer {border-color:var(--yt-border-color);}  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-renderer {margin:0; margin-top:2px; }  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-header-renderer[has-divider-line] {margin-top:0; border-top:0;}  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-header-renderer {display:inline-block; padding-top:0; }  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-header-renderer + ytd-metadata-row-header-renderer {margin-left:8px; padding-left:8px; border-left:1px solid #CCCCCC;}  	html[dark].rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-header-renderer + ytd-metadata-row-header-renderer {border-left-color:var(--yt-border-color);}  	.rsdRetro ytd-video-secondary-info-renderer ytd-metadata-row-header-renderer .content.ytd-metadata-row-header-renderer {font-size:0.9em;}  	.rsdRetro ytd-video-secondary-info-renderer #title.ytd-metadata-row-renderer {font-size:0.9em;}  	.rsdRetro ytd-video-secondary-info-renderer .content.ytd-metadata-row-renderer {font-size:0.9em;}          	  	  	.rsdPlayer ytd-player#ytd-player #container.ytd-player  {overflow:hidden; padding-bottom:30px;}    	.rsdPlayer #player.ytd-watch-flexy {margin-bottom:30px;}  	.rsdPlayer  ytd-watch-flexy[theater] #player-theater-container {margin-bottom:30px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) {overflow:visible; contain: layout size;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-player-content, #movie_player:not(.ytp-fullscreen) .ytp-settings-menu {bottom:8px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-player-content.html5-endscreen {bottom:39px; top:28px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-bottom:not(.ytp-preview), .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-paid-content-overlay {bottom:14px; top:auto !important;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-preview {bottom:46px; top:auto !important;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .caption-window.ytp-caption-window-bottom {margin-bottom:0;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-gradient-bottom {display:none;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-bottom {  background-color:#ccc; color:#000; text-shadow:none; border:0px solid #ccc; border-width: 0px 12px 0 12px; left:0 !important; opacity:1; bottom:-30px; height:27px;}       	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-progress-bar-container {bottom:27px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-progress-list {transform-origin:center bottom !important; background-color:#444;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-progress-bar-container:not(:hover) .ytp-progress-list {margin-left:-12px; width:calc(100% + 24px) !important; }  	      	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls {padding-left:0; padding-right:0; margin-left:-12px; margin-right:-12px; height:27px; line-height:27px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-time-display {height:34px; margin-top:-3px; font-size:95%; line-height:34px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chapter-container {font-size:100%; line-height:27px; color:#4d4d4d; transition: opacity 0.05s}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen):not(.paused-mode):not(:hover) .ytp-chrome-bottom .ytp-chapter-container {opacity:0; transition: opacity 0.2s 2s}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-time-separator, .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-time-duration {color:#666;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button, .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel {color:#4d4d4d; opacity:1; height:34px; margin-top:-3px;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle:before, .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle, .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle:after {background-color:#4d4d4d;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle:after {opacity:0.35;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button:hover {color:#3d3d3d;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button .ytp-svg-fill, .rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button path[fill='#fff'] {fill:currentColor;}  	.rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button .ytp-svg-shadow {stroke:none;}    	  	html[dark].rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-bottom {background-color:#1b1b1b; color:#fff; border-color:#1b1b1b;}      html[dark].rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chapter-container {color:#8E8E8E; }  html[dark].rsdPlayer   #movie_player:not(.ytp-fullscreen) .ytp-time-separator, html[dark].rsdPlayer   #movie_player:not(.ytp-fullscreen) .ytp-time-duration {color:#999;}  html[dark].rsdPlayer   #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button, html[dark].rsdPlayer   #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel {color:#8E8E8E; }  html[dark].rsdPlayer   #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle:before, html[dark].rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle, html[dark].rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-volume-panel .ytp-volume-slider-handle:after {background-color:#8E8E8E;}  html[dark].rsdPlayer  #movie_player:not(.ytp-fullscreen) .ytp-chrome-controls .ytp-button:hover {color:#EBEBEB;}"; 

// Defining dynamic script properties
script.cssMainLoaded = null;
//script.cssRetroLoaded = null;
script.forceControlsTimer = null;
script.forceControlsListener = null;
script.watchSetupDone = false;

  

function pageSetup() {
  // Runs: Once, after the first page has loaded
  // Purpose: Set up settings handling, and event hooks
	console.log("pageFirstRun");
	
	if ($("#rsd-menu").length > 0) {
    console.warn(script.shortname + " - Another version of this script is already running, so this copy will not be loaded. Check your list of installed scripts.");
    return;
  }
  
  
  console.warn("Beta version is now inactive. Please ensure you have the main version installed.");
  return;
  
  
  $(document.createElement("div"))
  	.attr("id", "rsd-menu")
  	.attr("hidden","hidden")
  	.attr("style", "position:absolute; position:fixed; top:55px; right:10px; width:500px; height:auto; max-height:calc(100vh - 60px); background:white; background:var(--yt-spec-brand-background-primary); color:black; color:var(--yt-spec-text-primary); border:1px black solid; border-color:var(--yt-spec-text-primary); z-index:2200; border-radius:2px; padding:20px; box-sizing: border-box; font-size:16px")
  	.html("<div class='arrow' style='position:absolute; width:15px; height:15px; border:black solid 1px; border-color:border-color:var(--yt-spec-text-primary); border-width:1px 1px 0 0; background:inherit; transform:rotate(-45deg); top:-9px; pointer-events:none;'></div><img style='float:right; margin-left:4px;' src='"+script.icon+"'><small style='float:right; margin-left:3px; text-align:right;'>Version "+script.version+"<br/><a style='color:var(--yt-spec-call-to-action)' href='"+script.website+"' target='_blank'>Updates & Help</a></small><h2>'"+script.name+"' Script Settings</h2><br><input type='checkbox' disabled checked> Description on right [Always Enabled]<br><label><input type='checkbox' id='rsd-menu-retrotheme' autocomplete='off'> Retro theme</label><br><label><input type='checkbox' id='rsd-menu-retroplayer' autocomplete='off'> Retro player</label><br><label><input type='checkbox' id='rsd-menu-titletop' autocomplete='off'> Title on top</label><br/><br/><small>Dark Mode is supported (toggle in Youtube Settings)</small>")
  	.appendTo("body");
  PrepSettings();
  async function PrepSettings() {
    if (await GM.getValue("retrotheme", true)) {
      $("#rsd-menu-retrotheme").prop("checked", true);
    }
    if (await GM.getValue("retroplayer", true)) {
      $("#rsd-menu-retroplayer").prop("checked", true);
    }
    if (await GM.getValue("titletop", true)) {
      $("#rsd-menu-titletop").prop("checked", true);
    }
  }
  
  $("#rsd-menu input").click(async function() {
    var state = ($(this).prop("checked")?true:false);
    if (this.id=="rsd-menu-retrotheme") {
      await GM.setValue("retrotheme", state);
    } else if (this.id=="rsd-menu-retroplayer") {
      await GM.setValue("retroplayer", state);
    } else if (this.id=="rsd-menu-titletop") {
      await GM.setValue("titletop", state);
    }
      
    watchApply(); // apply changed settings
  });
  
	$(document.createElement("div"))
		.attr("id", "bwp-retrostyle-toggle")
		.attr("class", "style-scope ytd-menu-renderer style-default")
		.attr("is-icon-button", "")
		.attr("button-renderer","")
		.attr("hidden","hidden")
		.html("<a is='yt-endpoint' tabindex='-1' class='style-scope ytd-button-renderer'><paper-icon-button src='"+script.icon+"'\" alt='RSD Menu' title='\"Right Side Description\" Script Menu'></paper-icon-button><paper-tooltip>\"Right Side Description\" Script Menu</paper-tooltip></a>")
  	.click( function() {
    	if ($("#rsd-menu").attr("hidden") ) {
         	$("#rsd-menu").removeAttr("hidden");
        	$("#bwp-retrostyle-toggle").addClass("open");
        	$("#rsd-menu .arrow").css("right", (document.body.clientWidth - $("#bwp-retrostyle-toggle")[0].getBoundingClientRect().right) + "px");
      } else {
        $("#rsd-menu").attr("hidden","hidden");
        $("#bwp-retrostyle-toggle").removeClass("open");
      }
  	})
		.prependTo("ytd-masthead #end");
	
	typeChange();
	$("ytd-app").on("yt-page-type-changed", typeChange);
}

function typeChange() {
  // Runs: Every time the page type changes
	console.log("typeChange");
	
  setTimeout(function() { // delay only seems to be needed for miniplayer closing
    console.log("typeChange - delayed section"); 
    
    if ($("#page-manager ytd-watch-flexy:not([hidden]), #page-manager ytd-watch-flexy.loading").length > 0) {
      if (!script.watchSetupDone) {
        watchSetup();
      } 
      watchApply();
    } else {
      if (script.watchSetupDone) {
        watchCleanup();
      }
    }
  
  }, 1);
  
}

function watchSetup() {
  // Runs: First time a watch page has loaded
  // Purpose: Single-time watch page modification and event hooks
	console.log("watchSetup");
	script.watchSetupDone = true;
  
  
  $('<h1 id="rsd-title" class="title style-scope ytd-video-primary-info-renderer"></h1>').prependTo( $("ytd-watch-flexy #primary-inner") );
 
  $('<div id="rsd-description-entry"></div>').prependTo("ytd-watch-flexy #related");
  	
	dataRun();
	$("ytd-app").on("yt-update-title", dataRun);
	//yt-page-data-updated ?
	
}

async function watchApply() {
  // Changed TO a watch page, or a setting has changed
	console.log("watchApply");
	loadCSS();
	$("#bwp-retrostyle-toggle").removeAttr("hidden");
	applyRetroPlayer(await GM.getValue("retroplayer", true));
	
}
function watchCleanup() {
  // Changed FROM a watch page (undo watchApply)
	console.log("watchCleanup");
	unloadCSS();
	$("#bwp-retrostyle-toggle").attr("hidden","hidden").removeClass("open");
	$("#rsd-menu").attr("hidden","hidden");
	applyRetroPlayer(false);
}


function dataRun() {
  // Runs: Navigating from one video to another
  // Purpose: Modify the page in ways that need to happen after every video change
  console.log("dataRun");
  
 
	
	setTimeout(function() { // These don't generate until after yt-update-title, need to find another event to listen to
		console.log("dataRun - delayed section");
		
		 
    // Title above video
    var title = $("ytd-video-primary-info-renderer > #container > h1 > yt-formatted-string").html();
    $("#rsd-title").html(title);
    
    
    
    // Description panel
    var meta = $("ytd-watch-flexy #primary-inner > #meta").addClass("rsd-description");
  	$(meta).prependTo( $("#rsd-description-entry") );
    // Expand description
		$("#meta.rsd-description ytd-expander #more").click();
    if ($("#meta.rsd-description ytd-expander[collapsed]").length > 0) {
      console.log("Expand didn't work"); // CSS message will warn user to refresh. Todo: find a way to automatically re-expand
    }
    
    // Upload date - move from below video to description panel
    $("ytd-video-primary-info-renderer #info #date").insertAfter("ytd-video-owner-renderer #channel-name");
    
    // Sub count
    if ( $("#meta.rsd-description #subscribe-button").text() ) { // prevent picking up the skeleton
			$("#owner-sub-count").appendTo("#meta.rsd-description ytd-video-secondary-info-renderer #subscribe-button");
    }
    
    
    
    // Below video
    
    // Viewcount
    //$("ytd-video-primary-info-renderer #info #count").prependTo("ytd-video-primary-info-renderer #info #menu-container");
    
    // New container for shifted buttons, move them into it (all except like/dislike)
   /* $("#menu-container-left-rsd").remove(); // remove old copies
    $("<div id='menu-container-left-rsd'></div>").prependTo("ytd-video-primary-info-renderer #info");
    $("ytd-video-primary-info-renderer #info #menu-container #top-level-buttons > *").each(function() {
      if (this.nodeName != "YTD-TOGGLE-BUTTON-RENDERER") {
        $(this).appendTo("#menu-container-left-rsd");
      }
    });
    $("ytd-video-primary-info-renderer #info #menu-container #top-level-buttons + *").insertAfter("#menu-container-left-rsd");*/
    
		
	}, 1);

}
  
  
$(document).one("yt-navigate-finish", pageSetup);


// possible script points [old test notes]
// yt-update-title on ytd-app - seems to run when data changes?
// yt-page-type-changed on ytd-app - for detecting if they've move away from video or back
// yt-page-data-updated on body - may run after all data changed?
// yt-navigate-finish on document - same as above?

async function loadCSS() {
	if (!script.cssMainLoaded) {
		script.cssMainLoaded = GM_addStyle(script.mainCSS);
	}
  
  $("html").addClass("rsdLoaded");
  if (await GM.getValue("retrotheme", true)) {
    $("html").addClass("rsdRetro");
  } else {
    $("html").removeClass("rsdRetro");
  }
  if (await GM.getValue("retroplayer", true)) {
    $("html").addClass("rsdPlayer");
    applyRetroPlayer(true);
  } else {
    $("html").removeClass("rsdPlayer");
    applyRetroPlayer(false);
  }
  if (await GM.getValue("titletop", true)) {
    $("html").addClass("rsdTitle");
  } else {
    $("html").removeClass("rsdTitle");
  }
	  
  
}
function unloadCSS() {
	if (script.cssMainLoaded) {
		$(script.cssMainLoaded).remove();
		script.cssMainLoaded = null;
	}
  
  applyRetroPlayer(false);
  
  $("html").removeClass("rsdLoaded");
  $("html").removeClass("rsdRetro");
  $("html").removeClass("rsdPlayer");
  $("html").removeClass("rsdTitle");
  
}

function applyRetroPlayer(activate) {
	if (activate) {
		if (!script.forceControlsTimer) {
			var mouseMoveEvent = new Event('mousemove');
			script.forceControlsTimer = setInterval(function() {
				if (!document.hidden) {
					$("#movie_player.playing-mode:not(.ytp-fullscreen)")[0].dispatchEvent(mouseMoveEvent);
				}
			}, 1000);
		}
		if (!script.forceControlsListener) {
			script.forceControlsListener = function() {
				if (!document.hidden) {
					var mouseMoveEvent = new Event('mousemove');
					$("#movie_player.playing-mode:not(.ytp-fullscreen)")[0].dispatchEvent(mouseMoveEvent);
				}
			};
			$(document).on("visibilitychange", script.forceControlsListener);
		}
	} else {
		if (script.forceControlsTimer) {
			clearInterval(script.forceControlsTimer);
			script.forceControlsTimer = null;
		}
		if (script.forceControlsListener) {
			$(document).off("visibilitychange", script.forceControlsListener);
			script.forceControlsListener = null;
		}		
	}
}





})();