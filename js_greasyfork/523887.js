// ==UserScript==
// @name         PeakyTube Dev Build
// @namespace    http://tampermonkey.net/
// @version      0.0.0.97
// @description  Custom Mobile Basic Layout For V3 YouTube
// @author       lightbeam24
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523887/PeakyTube%20Dev%20Build.user.js
// @updateURL https://update.greasyfork.org/scripts/523887/PeakyTube%20Dev%20Build.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let $=a=>document.querySelector(a);
    let k="?";
    let useiOSStyles=false;
    if(window.location.href.includes("?")){
        k="&";
    }
    let build=97;
    let canGo=false;
    function timeout(durationMs){
        return new Promise((resolve, reject) => {
            setTimeout(function(){
                resolve();
            }, durationMs);
        });
    }
    async function waitForElement(elm,dur){
        while (null == document.querySelector(elm)){
            await new Promise(r => requestAnimationFrame(r));
        }
        await timeout(dur).then(function(){
            canGo = true;
            return document.querySelector(elm);
        });
    }
    var V3_SETTINGS = localStorage.getItem("v3_local_db");
    if(V3_SETTINGS){
        V3_SETTINGS = JSON.parse(V3_SETTINGS);
        var V3_SETTINGS_CONF = V3_SETTINGS.config.db.yt;
        V3_SETTINGS_CONF.WATCH8=true;
        V3_SETTINGS_CONF.SITE_AS_GIANT_CARD=true;
        V3_SETTINGS_CONF.CARDIFIED_PAGE=true;
        V3_SETTINGS_CONF.INDIVIDUAL_CARDS=false;
        V3_SETTINGS_CONF.INDIVIDUAL_CARDS_WATCH=true;
        V3_SETTINGS_CONF.CARDIFIED_PAGE_LESS_PADDED=true;
        V3_SETTINGS_CONF.APPBAR_GUIDE=true;
        V3_SETTINGS_CONF.MASTHEAD_APPBAR_LAUNCH=true;
        V3_SETTINGS_CONF.APPBAR_GUIDE_BUTTON_SIMPLE_STYLE=true;
        V3_SETTINGS_CONF.NEW_APPBAR_GUIDE_ICONS=true;
        V3_SETTINGS_CONF.APPBAR_GUIDE_PINNING=false;
        V3_SETTINGS_CONF.APPBAR_GUIDE_SCROLL=false;
        V3_SETTINGS_CONF.MASTHEAD_APPBAR_FUSION=false;
        V3_SETTINGS_CONF.SITE_CENTER_ALIGNED=true;
        V3_SETTINGS_CONF.WATCH7_ACTION_PANELS_USE_ICONS=true;
        V3_SETTINGS_CONF.WATCH7_HIDE_ACTION_PANEL_TITLES=true;
        V3_SETTINGS_CONF.WATCH7_EXTRA_ACTIONS_INSIDE_MENU=true;
        V3_SETTINGS_CONF.W2W_AS_LOHP_EVERYTIME=false;
        V3_SETTINGS_CONF.MASTHEAD_SHOW_RED_LOGO_FOR_REDUSER=false;
        V3_SETTINGS_CONF.APPBAR_GUIDE_IS_PART_OF_MASTHEAD_POSITIONER=false;
        V3_SETTINGS_CONF.USING_GBAR=false;
        V3_SETTINGS_CONF.NEW_LOGO=true;
        V3_SETTINGS_CONF.GUIDE_NAVIGATE_TO_CHANNEL_FEED=false;
        V3_SETTINGS_CONF.WATCH_TEATHER_ENABLED=false;
        V3_SETTINGS.config.db.yt = V3_SETTINGS_CONF;
        V3_SETTINGS = JSON.stringify(V3_SETTINGS);
        localStorage.setItem("v3_local_db",V3_SETTINGS);
    }
    let defaultSettings={
        "commentBtnPos":{
            "tValue":"aboveRelated",
            "visValue":"aboveRelated"
        },
        "commentPos":{
            "tValue":"tab",
            "visValue":"tab"
        },
        "logo":{
            "tValue":"normal",
            "visValue":"normal"
        },
        "searchIcon":{
            "tValue":"old",
            "visValue":"old"
        }
    }
    let SRS={
        "playerVersion":{
            "tValue":"modernV3"
        }
    }
    let PT_SETTINGS=localStorage.getItem("PT_SETTINGS");
    function applySettings(){
        localStorage.setItem("PT_SETTINGS",JSON.stringify(PT_SETTINGS));
    }
    if(PT_SETTINGS==null){
        PT_SETTINGS=defaultSettings;
        applySettings();
    }else{
        PT_SETTINGS=JSON.parse(PT_SETTINGS);
    }
    if(PT_SETTINGS.logo==null){
        PT_SETTINGS.logo=defaultSettings.logo;
    }
    if(PT_SETTINGS.searchIcon==null){
        PT_SETTINGS.searchIcon=defaultSettings.searchIcon;
    }
    if(PT_SETTINGS.commentPos==null){
        PT_SETTINGS.commentPos=defaultSettings.commentPos;
    }
    if(window.location.href=="https://m.youtube.com/"){
        window.location="https://www.youtube.com"+k+"app=desktop";
    }else if(window.location.href.includes("m.youtube.com")){
        let newURL=window.location.href.split(".youtube.com")[1];
        window.location="https://www.youtube.com"+newURL+k+"app=desktop";
    }
    if(window.navigator.userAgent.includes("iPhone")||window.navigator.userAgent.includes("iPad")||window.navigator.userAgent.includes("Mac")){
        useiOSStyles=true;
        $("body .v3").setAttribute("ios-styling","");
    }
    $("body .v3").setAttribute("commentBtnPos",PT_SETTINGS.commentBtnPos.tValue);
    $("body .v3").setAttribute("commentPos",PT_SETTINGS.commentPos.tValue);
    $("body .v3").setAttribute("logo",PT_SETTINGS.logo.tValue);
    $("body .v3").setAttribute("searchIcon",PT_SETTINGS.searchIcon.tValue);
    $("body .v3").setAttribute("compact-logo","");
    function createSearchText(){
		if($("#masthead-search-term")){
			$("#masthead-search-term").setAttribute("placeholder","Search");
		}
    }
    function createDeviceScale(){
        if($("#pt-meta")==null){
            let conta=$("head");
            let nE=document.createElement("meta");
            nE.id="pt-meta";
            nE.setAttribute("name","viewport");
            nE.setAttribute("content","width=device-width,initial-scale=1.0,minimum-scale=1.0");
            conta.append(nE);
        }
        $("html").removeAttribute("mobile");
    }
    function doScrollableGuide(){
		if($("#guide-library-section")){
            $("#guide-library-section").data.guideSubscriptionsSectionRenderer.navigationEndpoint="";
		}
		if($(".startube-fixed-guide-item")==null){
			var elm="#guide-subscriptions-section";
			waitForElement(elm,10).then(function(elm){
				if(canGo!=false){
					if($("#guide-library-container .guide-flyout")&&$("#startube-library-expander-container")==null){
						let container = $("#guide-library-container");
						let newElem = document.createElement("div");
						newElem.id = "startube-library-expander-container";
						newElem.innerHTML = `
								<div class="startube-guide-expander yt-uix-expander yt-uix-expander-collapsed guide-channels-list">
									<div class="startube-guide-expander-items yt-uix-expander-body">
                                    <li class="guide-channel startube">
									<a class="startube-guide-expand-button pt-collapse flex-bar guide-item yt-uix-expander-head guide-view-more yt-valign">
									<span class="yt-valign-container startube-has-icon"><span class="display-name no-count"><span>Show fewer</span></span></span>
  </a>
  </li>
									</div>
									<div class="yt-uix-expander-collapsed-body">
                                    <li class="guide-channel startube">
<a class="startube-guide-expand-button flex-bar guide-item pt-expand yt-uix-expander-head guide-view-more yt-valign">
									<span class="yt-valign-container startube-has-icon"><span class="display-name no-count"><span>Show more</span></span></span>
  </a>
  </li>
									</div>
								</div>
								`;
						container.insertBefore(newElem, container.children[5]);
						var theFlyout = document.querySelector("#guide-library-container .guide-flyout .guide-channels-list");
						var newHome = document.querySelector("#guide-library-container .startube-guide-expander-items");
						newHome.insertBefore(theFlyout, newHome.children[0]);
						newHome.classList.add("startube-fixed-guide-item");
                        $(".startube-guide-expand-button.pt-expand").data="";
                        $(".startube-guide-expand-button.pt-collapse").data="";
					}
					if($("#guide-subscriptions-container:not(.st-modded) .guide-flyout") && $("#startube-subs-expander-container") == null){
						let container = $("#guide-subscriptions-container");
						let newElem = document.createElement("div");
						newElem.id = "startube-subs-expander-container";
						newElem.innerHTML = `
								 <div class="startube-guide-expander yt-uix-expander yt-uix-expander-collapsed guide-channels-list">
									<div class="startube-guide-expander-items yt-uix-expander-body">
                                    <li class="guide-channel startube">
									<a class="startube-guide-expand-button flex-bar guide-item yt-uix-expander-head guide-view-more yt-valign">
									<span class="yt-valign-container startube-has-icon">
					<span class="display-name no-count"><span>Show fewer</span></span></span>
  </a></li>
									</div>
									<div class="yt-uix-expander-collapsed-body">
                                    <li class="guide-channel startube">
<a class="startube-guide-expand-button flex-bar guide-item yt-uix-expander-head guide-view-more yt-valign">
									<span class="yt-valign-container startube-has-icon">
					<span class="display-name no-count"><span>Show more</span></span></span>
  </a></li>
									</div>
								</div>
								`;
						container.insertBefore(newElem, container.children[4]);
						container.classList.add("st-modded");
						theFlyout = document.querySelector("#guide-subscriptions-container .guide-flyout .guide-channels-list");
						newHome = document.querySelector("#guide-subscriptions-container .startube-guide-expander-items");
						newHome.insertBefore(theFlyout, newHome.children[0]);
						newHome.classList.add("startube-fixed-guide-item");
					}
					if(document.querySelectorAll("#guide-subscriptions-container")[1]){
						if($(".st-guide-2") == null){
							// if($("#guide-subscriptions-container + #guide-subscriptions-container:not(.st-modded) .guide-flyout")){
							document.querySelectorAll("#guide-subscriptions-container")[1].classList.add("st-guide-2");
							let container = $(".st-guide-2");
							let newElem = document.createElement("div");
							newElem.id = "startube-subs-expander-container";
							newElem.innerHTML = `
								<div class="startube-guide-expander yt-uix-expander yt-uix-expander-collapsed guide-channels-list">
									<div class="startube-guide-expander-items yt-uix-expander-body">
                                    <li class="guide-channel startube">
									<a class="startube-guide-expand-button flex-bar guide-item yt-uix-expander-head guide-view-more yt-valign">
									<span class="yt-valign-container startube-has-icon">
					<span class="display-name no-count"><span>Show fewer</span></span></span>
  </a></li>
									</div>
									<div class="yt-uix-expander-collapsed-body">
                                    <li class="guide-channel startube">
<a class="startube-guide-expand-button flex-bar guide-item yt-uix-expander-head guide-view-more yt-valign">
									<span class="yt-valign-container startube-has-icon">
					<span class="display-name no-count"><span>Show more</span></span></span>
  </a></li>
									</div>
								</div>
								`;
							container.insertBefore(newElem, container.children[4]);
							theFlyout = document.querySelector(".st-guide-2 .guide-flyout .guide-channels-list");
							newHome = document.querySelector(".st-guide-2 .startube-guide-expander-items");
							newHome.insertBefore(theFlyout, newHome.children[0]);
							newHome.classList.add("startube-fixed-guide-item");
							container.classList.add("st-modded");
							//  }
						}
					}
				}
			});
		}
	}
    function doModernPlayer(){
			if($("#page.watch") || $("#page.channel")){
				var elm = ".html5-player-chrome";
				waitForElement(elm,10).then(function(elm){
					if(canGo != false){
						$("#movie_player").classList.add("autohide-controls");
						if($(".ytp-button-play.startube-has-icon") == null && $(".ytp-button-pause.startube-has-icon") == null){
							let container;
							if($(".ytp-button-play")){
								container = $(".ytp-button-play");
							}else if($(".ytp-button-pause")){
								container = $(".ytp-button-pause");
							}else{
								container = $(".ytp-button-stop");
							}
							let newElem = document.createElement("div");
							newElem.setAttribute("class","startube-player-svg");
							container.classList.add("startube-has-icon");
							container.classList.add("startube-player-icon");
							container.id = "startube-playpause";
							if(SRS.playerVersion.tValue!="modernV1"){
								newElem.innerHTML = `
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<path id="ytp-11" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z">
		<animate id="st-pausing" attributeType="XML" attributeName="d" fill="freeze" from="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" to="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" dur="0.2s" keySplines=".4 0 1 1" repeatCount="1">
		</animate>
		<animate id="st-playing" attributeType="XML" attributeName="d" fill="freeze" from="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" to="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" dur="0.2s" keySplines=".4 0 1 1" repeatCount="1">
		</animate>
	</path>
</svg>
					`;
							}else{
								 newElem.innerHTML = `
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<path id="ytp-11" d="M11,10 L18,13.74 18,22.28 11,26 Z M18,13.74 L26,18 26,18 18,22.28 Z">
		<animate id="st-pausing" attributeType="XML" attributeName="d" fill="freeze" from="M11,10 L17,10 17,26 11,26 Z M20,10 L26,10 26,26 20,26 Z" to="M11,10 L18,13.74 18,22.28 11,26 Z M18,13.74 L26,18 26,18 18,22.28 Z" dur="0.2s" keySplines=".4 0 1 1" repeatCount="1">
		</animate>
		<animate id="st-playing" attributeType="XML" attributeName="d" fill="freeze" from="M11,10 L18,13.74 18,22.28 11,26 Z M18,13.74 L26,18 26,18 18,22.28 Z" to="M11,10 L17,10 17,26 11,26 Z M20,10 L26,10 26,26 20,26 Z" dur="0.2s" keySplines=".4 0 1 1" repeatCount="1">
		</animate>
	</path>
</svg>
					`;
							}
							container.insertBefore(newElem, container.children[0]);
							let currPlayerState = "paused";
							// Select the node that will be observed for mutations
							const targetNode = document.querySelector("#movie_player");

							// Options for the observer (which mutations to observe)
							const config = { attributes: true };

							// Callback function to execute when mutations are observed
							const callback = (mutationList, observer) => {
								for (const mutation of mutationList){
									if($(".playing-mode") && currPlayerState == "paused"){
										$("#st-playing").beginElement();
										currPlayerState = "playing";
									}
									if($(".paused-mode") && currPlayerState == "playing"){
										$("#st-pausing").beginElement();
										currPlayerState = "paused";
									}
								}
							};

							// Create an observer instance linked to the callback function
							const observer = new MutationObserver(callback);

							// Start observing the target node for configured mutations
							observer.observe(targetNode, config);
						}
						if($(".ytp-button-volume.startube-has-icon") == null){
							let container = $(".ytp-button-volume");
							let newElem = document.createElement("div");
							newElem.setAttribute("class","startube-player-svg");
							container.classList.add("startube-has-icon");
							container.classList.add("startube-player-icon");
							container.id = "startube-volume";
							newElem.innerHTML = `
<div id="st-max">
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="ytp-svg-shadow" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-fill" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-shadow" d="M22,17.99 C22,16.4 20.74,15.05 19,14.54 L19,21.44 C20.74,20.93 22,19.59 22,17.99 Z" opacity="1"></path><path class="ytp-svg-fill" d="M22,17.99 C22,16.4 20.74,15.05 19,14.54 L19,21.44 C20.74,20.93 22,19.59 22,17.99 Z" opacity="1"></path><path class="ytp-svg-shadow" d="M19,24.31 L19,26 C22.99,25.24 26,21.94 26,18 C26,14.05 22.99,10.75 19,10 L19,11.68 C22.01,12.41 24.24,14.84 24.24,18 C24.24,21.15 22.01,23.58 19,24.31 Z" opacity="1"></path><path class="ytp-svg-fill" d="M19,24.31 L19,26 C22.99,25.24 26,21.94 26,18 C26,14.05 22.99,10.75 19,10 L19,11.68 C22.01,12.41 24.24,14.84 24.24,18 C24.24,21.15 22.01,23.58 19,24.31 Z" opacity="1"></path></svg>
</div>
<div id="st-low">
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="ytp-svg-shadow" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-fill" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-shadow" d="M22,17.99 C22,16.4 20.74,15.05 19,14.54 L19,21.44 C20.74,20.93 22,19.59 22,17.99 Z" opacity="1"></path><path class="ytp-svg-fill" d="M22,17.99 C22,16.4 20.74,15.05 19,14.54 L19,21.44 C20.74,20.93 22,19.59 22,17.99 Z" opacity="1"></path></svg>
</div>
<div id="st-muted">
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="ytp-svg-shadow" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-fill" d="M12.39,15.54 L10,15.54 L10,20.44 L12.4,20.44 L17,25.50 L17,10.48 L12.39,15.54 Z" opacity="1"></path><path class="ytp-svg-shadow" d="M19.63,15.92 L20.68,14.93 L22.81,16.94 L24.94,14.93 L26,15.92 L23.86,17.93 L26,19.93 L24.94,20.92 L22.81,18.92 L20.68,20.92 L19.63,19.93 L21.76,17.93 L19.63,15.92 Z" opacity="1"></path><path class="ytp-svg-fill" d="M19.63,15.92 L20.68,14.93 L22.81,16.94 L24.94,14.93 L26,15.92 L23.86,17.93 L26,19.93 L24.94,20.92 L22.81,18.92 L20.68,20.92 L19.63,19.93 L21.76,17.93 L19.63,15.92 Z" opacity="1"></path></svg>
</div>
`;
							container.insertBefore(newElem, container.children[0]);
						}
						if($("#subtitles_button.startube-has-icon") == null && $("#subtitles_button")){
							let container = $("#subtitles_button");
							let newElem = document.createElement("div");
							newElem.setAttribute("class","startube-player-svg");
							container.classList.add("startube-has-icon");
							container.classList.add("startube-player-icon");
							if(SRS.playerVersion.tValue!="modernV1"){
								newElem.innerHTML = `
<svg class="ytp-subtitles-button-icon" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-17"></use><path d="M11,11 C9.89,11 9,11.9 9,13 L9,23 C9,24.1 9.89,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 Z M17,17 L15.5,17 L15.5,16.5 L13.5,16.5 L13.5,19.5 L15.5,19.5 L15.5,19 L17,19 L17,20 C17,20.55 16.55,21 16,21 L13,21 C12.45,21 12,20.55 12,20 L12,16 C12,15.45 12.45,15 13,15 L16,15 C16.55,15 17,15.45 17,16 L17,17 L17,17 Z M24,17 L22.5,17 L22.5,16.5 L20.5,16.5 L20.5,19.5 L22.5,19.5 L22.5,19 L24,19 L24,20 C24,20.55 23.55,21 23,21 L20,21 C19.45,21 19,20.55 19,20 L19,16 C19,15.45 19.45,15 20,15 L23,15 C23.55,15 24,15.45 24,16 L24,17 L24,17 Z" fill="#fff" id="ytp-id-17"></path></svg>
`;
							}else{
							newElem.innerHTML = `
<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M9,24 L27,24 L27,12 L9,12 L9,24 Z M17.05,19.50 C16.91,19.79 16.72,20.04 16.49,20.24 C16.26,20.44 15.99,20.60 15.69,20.70 C15.38,20.81 15.04,20.86 14.67,20.86 C14.21,20.86 13.79,20.79 13.43,20.64 C13.06,20.48 12.75,20.27 12.5,20.01 C12.24,19.74 12.05,19.42 11.91,19.06 C11.78,18.70 11.71,18.31 11.71,17.89 C11.71,17.47 11.78,17.07 11.91,16.70 C12.05,16.34 12.24,16.02 12.5,15.74 C12.75,15.47 13.06,15.26 13.43,15.10 C13.79,14.95 14.21,14.87 14.67,14.87 C15.00,14.87 15.31,14.91 15.61,15.01 C15.90,15.10 16.16,15.23 16.40,15.40 C16.63,15.58 16.82,15.79 16.97,16.05 C17.13,16.31 17.22,16.60 17.26,16.93 L15.98,16.93 C15.96,16.79 15.91,16.66 15.83,16.54 C15.75,16.41 15.65,16.31 15.53,16.22 C15.42,16.13 15.28,16.06 15.14,16.01 C14.98,15.95 14.83,15.93 14.67,15.93 C14.37,15.93 14.12,15.98 13.91,16.09 C13.70,16.20 13.53,16.35 13.40,16.54 C13.27,16.72 13.18,16.93 13.12,17.17 C13.06,17.40 13.03,17.64 13.03,17.89 C13.03,18.14 13.06,18.37 13.12,18.60 C13.18,18.82 13.27,19.03 13.40,19.21 C13.53,19.39 13.70,19.54 13.91,19.65 C14.12,19.76 14.37,19.81 14.67,19.81 C15.07,19.81 15.39,19.70 15.61,19.46 C15.84,19.22 15.98,18.91 16.03,18.53 L17.31,18.53 C17.28,18.89 17.19,19.21 17.05,19.50 L17.05,19.50 Z M24.04,19.51 C23.90,19.80 23.72,20.04 23.49,20.24 C23.26,20.45 22.99,20.60 22.68,20.71 C22.37,20.82 22.03,20.87 21.66,20.87 C21.20,20.87 20.79,20.80 20.42,20.64 C20.05,20.49 19.74,20.28 19.49,20.01 C19.24,19.75 19.04,19.43 18.91,19.07 C18.77,18.71 18.70,18.32 18.70,17.90 C18.70,17.47 18.77,17.08 18.91,16.71 C19.04,16.34 19.24,16.02 19.49,15.75 C19.74,15.48 20.05,15.26 20.42,15.11 C20.79,14.95 21.20,14.88 21.66,14.88 C21.99,14.88 22.30,14.92 22.60,15.01 C22.89,15.10 23.16,15.24 23.39,15.41 C23.62,15.58 23.82,15.80 23.97,16.06 C24.12,16.31 24.21,16.61 24.25,16.94 L22.97,16.94 C22.95,16.79 22.90,16.66 22.82,16.54 C22.74,16.42 22.65,16.32 22.53,16.22 C22.41,16.13 22.27,16.06 22.13,16.01 C21.98,15.96 21.82,15.94 21.66,15.94 C21.36,15.94 21.11,15.99 20.90,16.10 C20.7,16.21 20.53,16.36 20.40,16.54 C20.27,16.73 20.17,16.94 20.11,17.17 C20.06,17.41 20.03,17.65 20.03,17.90 C20.03,18.14 20.06,18.38 20.11,18.60 C20.17,18.83 20.27,19.04 20.40,19.22 C20.53,19.40 20.7,19.55 20.90,19.66 C21.11,19.76 21.36,19.82 21.66,19.82 C22.06,19.82 22.38,19.70 22.61,19.47 C22.84,19.23 22.97,18.92 23.02,18.54 L24.30,18.54 C24.27,18.89 24.18,19.22 24.04,19.51 L24.04,19.51 Z" id="ytp-svg-8"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-8"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-8"></use></svg>
`;
							}
							container.insertBefore(newElem, container.children[1]);
						}
						if($("#settings_button.startube-has-icon") == null){
							let container = $("#settings_button");
							let newElem = document.createElement("div");
							newElem.setAttribute("class","startube-player-svg");
							container.classList.add("startube-has-icon");
							container.classList.add("startube-player-icon");
							if(SRS.playerVersion.tValue!="modernV1"){
								newElem.innerHTML = `
<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-19"></use><path d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z" fill="#fff" id="ytp-id-19"></path></svg>
`;
							}else{
							newElem.innerHTML = `
<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M27,19.35 L27,16.65 L24.61,16.65 C24.44,15.79 24.10,14.99 23.63,14.28 L25.31,12.60 L23.40,10.69 L21.72,12.37 C21.01,11.90 20.21,11.56 19.35,11.38 L19.35,9 L16.65,9 L16.65,11.38 C15.78,11.56 14.98,11.90 14.27,12.37 L12.59,10.69 L10.68,12.60 L12.36,14.28 C11.89,14.99 11.55,15.79 11.38,16.65 L9,16.65 L9,19.35 L11.38,19.35 C11.56,20.21 11.90,21.01 12.37,21.72 L10.68,23.41 L12.59,25.32 L14.28,23.63 C14.99,24.1 15.79,24.44 16.65,24.61 L16.65,27 L19.35,27 L19.35,24.61 C20.21,24.44 21.00,24.1 21.71,23.63 L23.40,25.32 L25.31,23.41 L23.62,21.72 C24.09,21.01 24.43,20.21 24.61,19.35 L27,19.35 Z M18,22.05 C15.76,22.05 13.95,20.23 13.95,18 C13.95,15.76 15.76,13.95 18,13.95 C20.23,13.95 22.05,15.76 22.05,18 C22.05,20.23 20.23,22.05 18,22.05 L18,22.05 Z" id="ytp-svg-39"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-39"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-39"></use></svg>
`;
							}
							container.insertBefore(newElem, container.children[1]);
						}
						if($(".ytp-size-toggle-large.startube-has-icon") == null && $(".ytp-size-toggle-small.startube-has-icon") == null){
							let container;
							if($(".ytp-size-toggle-large")){
								container = $(".ytp-size-toggle-large");
							}else{
								container = $(".ytp-size-toggle-small");
							}
							let newElem = document.createElement("div");
							newElem.setAttribute("class","startube-player-svg");
							container.classList.add("startube-has-icon");
							container.classList.add("startube-player-icon");
							container.id = "startube-theater";
							if(SRS.playerVersion.tValue!="modernV1"){
								newElem.innerHTML = `
<div id="st-large">
<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-272"></use><path d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z" fill="#fff" fill-rule="evenodd" id="ytp-id-272"></path></svg>
</div>
<div id="st-small">
<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-246"></use><path d="m 26,13 0,10 -16,0 0,-10 z m -14,2 12,0 0,6 -12,0 0,-6 z" fill="#fff" fill-rule="evenodd" id="ytp-id-246"></path></svg>
</div>
`;
							}else{
							newElem.innerHTML = `
<div id="st-large">
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="ytp-1294" d="M8,11 L28,11 28,25 8,25 8,11 Z M11,14 L11,22 25,22 25,14 11,14 Z"></path></defs><use xlink:href="#ytp-1294" class="ytp-svg-shadow"></use><use xlink:href="#ytp-1294" class="ytp-svg-fill"></use></svg>
</div>
<div id="st-small">
<svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="ytp-12" d="M10,13 L26,13 26,23 10,23 10,13 Z M13,16 L13,20 23,20 23,16 13,16 Z">
</path></defs><use xlink:href="#ytp-12" class="ytp-svg-shadow"></use><use xlink:href="#ytp-12" class="ytp-svg-fill"></use></svg>
</div>
`;
							}
							container.insertBefore(newElem, container.children[0]);
						}
						if($(".ytp-button-fullscreen-enter.startube-has-icon") == null && $(".ytp-button-fullscreen-exit.startube-has-icon") == null){
							let container;
							if($(".ytp-button-fullscreen-enter")){
								container = $(".ytp-button-fullscreen-enter");
							}else{
								container = $(".ytp-button-fullscreen-exit");
							}
							let newElem = document.createElement("div");
							newElem.setAttribute("class","startube-player-svg");
							container.classList.add("startube-has-icon");
							container.classList.add("startube-player-icon");
							container.id = "startube-fullscreen";
							if(SRS.playerVersion.tValue!="modernV1"){
								newElem.innerHTML = `
<div id="st-enter">
<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><g class="ytp-fullscreen-button-corner-0"><use class="ytp-svg-shadow" xlink:href="#ytp-id-7"></use><path class="ytp-svg-fill" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z" id="ytp-id-7"></path></g><g class="ytp-fullscreen-button-corner-1"><use class="ytp-svg-shadow" xlink:href="#ytp-id-8"></use><path class="ytp-svg-fill" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z" id="ytp-id-8"></path></g><g class="ytp-fullscreen-button-corner-2"><use class="ytp-svg-shadow" xlink:href="#ytp-id-9"></use><path class="ytp-svg-fill" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z" id="ytp-id-9"></path></g><g class="ytp-fullscreen-button-corner-3"><use class="ytp-svg-shadow" xlink:href="#ytp-id-10"></use><path class="ytp-svg-fill" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z" id="ytp-id-10"></path></g></svg>
</div>
<div id="st-exit">
<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><g class="ytp-fullscreen-button-corner-2"><use class="ytp-svg-shadow" xlink:href="#ytp-id-44"></use><path class="ytp-svg-fill" d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z" id="ytp-id-44"></path></g><g class="ytp-fullscreen-button-corner-3"><use class="ytp-svg-shadow" xlink:href="#ytp-id-45"></use><path class="ytp-svg-fill" d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z" id="ytp-id-45"></path></g><g class="ytp-fullscreen-button-corner-0"><use class="ytp-svg-shadow" xlink:href="#ytp-id-46"></use><path class="ytp-svg-fill" d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z" id="ytp-id-46"></path></g><g class="ytp-fullscreen-button-corner-1"><use class="ytp-svg-shadow" xlink:href="#ytp-id-47"></use><path class="ytp-svg-fill" d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z" id="ytp-id-47"></path></g></svg>
</div>
`;
							}else{
							newElem.innerHTML = `
<div id="st-enter">
<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M7,16 L10,16 L10,13 L13,13 L13,10 L7,10 L7,16 Z" id="ytp-svg-12"></path><path d="M23,10 L23,13 L26,13 L26,16 L29,16 L29,10 L23,10 Z" id="ytp-svg-13"></path><path d="M23,23 L23,26 L29,26 L29,20 L26,20 L26,23 L23,23 Z" id="ytp-svg-14"></path><path d="M10,20 L7,20 L7,26 L13,26 L13,23 L10,23 L10,20 Z" id="ytp-svg-15"></path></defs><use class="ytp-svg-shadow ytp-fullscreen-button-corner-0" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-12"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-1" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-13"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-2" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-14"></use><use class="ytp-svg-shadow ytp-fullscreen-button-corner-3" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-15"></use><use class="ytp-svg-fill ytp-fullscreen-button-corner-0" fill="#fff" xlink:href="#ytp-svg-12"></use><use class="ytp-svg-fill ytp-fullscreen-button-corner-1" fill="#fff" xlink:href="#ytp-svg-13"></use><use class="ytp-svg-fill ytp-fullscreen-button-corner-2" fill="#fff" xlink:href="#ytp-svg-14"></use><use class="ytp-svg-fill ytp-fullscreen-button-corner-3" fill="#fff" xlink:href="#ytp-svg-15"></use></svg>
</div>
<div id="st-exit">
<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M13,10 L10,10 L10,13 L7,13 L7,16 L13,16 L13,10 Z" id="ytp-svg-16"></path><path d="M29,16 L29,13 L26,13 L26,10 L23,10 L23,16 L29,16 Z" id="ytp-svg-17"></path><path d="M29,23 L29,20 L23,20 L23,26 L26,26 L26,23 L29,23 Z" id="ytp-svg-18"></path><path d="M10,26 L13,26 L13,20 L7,20 L7,23 L10,23 L10,26 Z" id="ytp-svg-19"></path></defs><use class="ytp-svg-shadow ytp-fullscreen-close-button-corner-0" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-16"></use><use class="ytp-svg-shadow ytp-fullscreen-close-button-corner-1" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-17"></use><use class="ytp-svg-shadow ytp-fullscreen-close-button-corner-2" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-18"></use><use class="ytp-svg-shadow ytp-fullscreen-close-button-corner-3" stroke="#000" stroke-opacity=".15" stroke-width="2px" xlink:href="#ytp-svg-19"></use><use class="ytp-svg-fill ytp-fullscreen-close-button-corner-0" fill="#fff" xlink:href="#ytp-svg-16"></use><use class="ytp-svg-fill ytp-fullscreen-close-button-corner-1" fill="#fff" xlink:href="#ytp-svg-17"></use><use class="ytp-svg-fill ytp-fullscreen-close-button-corner-2" fill="#fff" xlink:href="#ytp-svg-18"></use><use class="ytp-svg-fill ytp-fullscreen-close-button-corner-3" fill="#fff" xlink:href="#ytp-svg-19"></use></svg>
</div>
`;
							}
							container.insertBefore(newElem, container.children[0]);
						}
						if($(".ytp-action-buttons .ytp-button-watch-later") == null){
							var theBtn = document.querySelector(".ytp-button-watch-later");
							var newHome = document.querySelector('.ytp-action-buttons');
							newHome.insertBefore(theBtn, newHome.children[2]);
						}
						if($(".ytp-button-watch-later.startube-has-icon") == null){
							let container = $(".ytp-button-watch-later");
							let newElem = document.createElement("div");
							newElem.setAttribute("class","startube-player-svg");
							container.classList.add("startube-has-icon");
							container.classList.add("startube-player-icon");
							newElem.innerHTML = `
<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M18,8 C12.47,8 8,12.47 8,18 C8,23.52 12.47,28 18,28 C23.52,28 28,23.52 28,18 C28,12.47 23.52,8 18,8 L18,8 Z M16,19.02 L16,12.00 L18,12.00 L18,17.86 L23.10,20.81 L22.10,22.54 L16,19.02 Z" id="ytp-svg-52"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-52"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-52"></use></svg>
`;
							container.insertBefore(newElem, container.children[0]);
						}
						if($(".ytp-button-share.startube-has-icon") == null){
							let container = $(".ytp-button-share");
							let newElem = document.createElement("div");
							newElem.setAttribute("class","startube-player-svg");
							container.classList.add("startube-has-icon");
							container.classList.add("startube-player-icon");
							newElem.innerHTML = `
<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="m 20.20,14.19 0,-4.45 7.79,7.79 -7.79,7.79 0,-4.56 C 16.27,20.69 12.10,21.81 9.34,24.76 8.80,25.13 7.60,27.29 8.12,25.65 9.08,21.32 11.80,17.18 15.98,15.38 c 1.33,-0.60 2.76,-0.98 4.21,-1.19 z" id="ytp-svg-40"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-40"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-40"></use></svg>
`;
							container.insertBefore(newElem, container.children[0]);
						}
						if($(".ytp-button-prev.startube-has-icon") == null){
							let container = $(".ytp-button-prev");
							let newElem = document.createElement("div");
							newElem.setAttribute("class","startube-player-svg");
							container.classList.add("startube-has-icon");
							container.classList.add("startube-player-icon");
							if(SRS.playerVersion.tValue!="modernV1"){
								newElem.innerHTML = `
<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-11"></use><path class="ytp-svg-fill" d="m 12,12 h 2 v 12 h -2 z m 3.5,6 8.5,6 V 12 z" id="ytp-id-11"></path></svg>
`;
							}else{
							newElem.innerHTML = `
<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M19.8,12.5 L19.8,16.49 L27,12.5 L27,23.5 L19.8,19.50 L19.8,23.5 L11.5,19.1 L11.5,23.5 L9,23.5 L9,12.5 L11.5,12.5 L11.5,17.45 L19.8,12.5 Z" id="ytp-svg-36"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-36"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-36"></use></svg>
`;
							}
							container.insertBefore(newElem, container.children[0]);
						}
						if($(".ytp-button-next.startube-has-icon") == null){
							let container = $(".ytp-button-next");
							let newElem = document.createElement("div");
							newElem.setAttribute("class","startube-player-svg");
							container.classList.add("startube-has-icon");
							container.classList.add("startube-player-icon");
							if(SRS.playerVersion.tValue!="modernV1"){
								newElem.innerHTML = `
<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-13"></use><path class="ytp-svg-fill" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" id="ytp-id-13"></path></svg>
`;
							}else{
							newElem.innerHTML = `
<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><defs><path d="M16.2,12.5 L16.2,16.49 L9,12.5 L9,23.5 L16.2,19.50 L16.2,23.5 L24.5,19.1 L24.5,23.5 L27,23.5 L27,12.5 L24.5,12.5 L24.5,17.45 L16.2,12.5 Z" id="ytp-svg-31"></path></defs><use class="ytp-svg-shadow" xlink:href="#ytp-svg-31"></use><use class="ytp-svg-fill" xlink:href="#ytp-svg-31"></use></svg>
`;
                            }
							container.insertBefore(newElem, container.children[0]);
						}
					}
				});
			}
	}
    function createUploadButton(){
        if($("#upload-menu-upload")==null&&$("#appbar-settings-menu")){
            let conta=$("#appbar-settings-menu");
            let nE=document.createElement("li");
            nE.setAttribute("role","menuitem");
            nE.id="upload-menu-upload";
            nE.innerHTML=`
        <a class="yt-uix-button-menu-item upload-menu-item" href="/upload">
            <span class="yt-valign icon-container">
                <img src="https://s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif" class="yt-uix-button-icon-appbar-upload yt-valign-container">
            </span>Upload
        </a>
        `;
            conta.insertBefore(nE,conta.children[0]);
        }
        if($("#upload-menu-peaky")==null&&$("#appbar-settings-menu")){
            let conta=$("#appbar-settings-menu");
            let nE=document.createElement("li");
            nE.setAttribute("role","menuitem");
            nE.id="upload-menu-peaky";
            nE.innerHTML=`
        <a class="yt-uix-button-menu-item upload-menu-item">
            <span class="yt-valign icon-container">
                <img src="https://s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif" class="upload-menu-account-settings-icon yt-valign-container">
            </span>PeakyTube Settings
        </a>
        `;
            conta.insertBefore(nE,conta.children[6]);
            $("#upload-menu-peaky").addEventListener("click",function(){
                $("body .v3").setAttribute("settings-open","");
            });
        }
    }
    function insertCSS(){
        if($("#pt-style")==null){
            let conta=$("body .v3");
            let nE=document.createElement("div");
            nE.id="pt-style";
            nE.innerHTML=`
        <style>
.flex-bar{
  display:flex;
  align-items:center
}
.flex{
  display:flex
}
#sb-wrapper{
  min-width:100vw!important;
  max-width:100vw
}
.comments-iframe-container{
  max-width:100vw
}
#sb-container.sb-card{
  right:0
}
#yt-masthead-container{
  padding-inline:10px
}
body #yt-masthead #appbar-guide-button{
  margin-left:0!important;
  left:5px
}
body .v3 #appbar-guide-button{
  background:none;
  box-shadow:none;
  border:none;
  height:40px
}
.site-center-aligned #yt-masthead #logo-container{
  margin-left:35px;
  margin-right:15px;
  margin-left:2px
}
#yt-masthead #appbar-guide-button ~ #masthead-search{
  margin-left:0;
  margin-right:0
}
#yt-masthead-content,
.site-center-aligned #masthead-search{
  min-width:calc(100vw - 190px);
  max-width:calc(100vw - 190px);
  transition-duration:.2s
}
[compact-logo] #yt-masthead-content,
.site-center-aligned [compact-logo] #masthead-search{
  min-width:calc(100vw - 156px);
  max-width:calc(100vw - 156px);
}
.v3:not([compact-logo]) #search-btn{
  width:34px;
  opacity:0!important;
  margin-right:-34px;
  transition-duration:.2s
}
#yt-masthead #search-btn .yt-uix-button-content{
  margin:0 10px
}
[searchIcon="new"] #yt-masthead #search-btn .yt-uix-button-content{
  background:no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfljEooDy.png) -44px -274px;
}
/*html:has(.gsfe_b) #search-btn{
  display:block!important;
  opacity:1!important;
  margin-right:0
}
html:has(.gsfe_b) #yt-masthead-content,
html:has(.gsfe_b) .site-center-aligned #masthead-search{
  min-width:calc(100vw - 110px);
  max-width:calc(100vw - 110px)
}
html:has(.gsfe_b) #yt-masthead-user{
  opacity:0
}*/
#yt-masthead-user{
  margin-left:14px;
  transition-duration:.2s
}
[compact-logo] #yt-masthead-user{
  margin-top:2px
}
[compact-logo] .yt-thumb-27,
[compact-logo] .yt-thumb-27 img,
[compact-logo] #yt-masthead #yt-masthead-user .yt-masthead-user-icon{
  height:32px;
  width:32px;
  border:none;
  border-radius:1px
}
#yt-masthead{
  display:flex;
}
#logo-container{
  order:1
}
#yt-masthead-content{
  order:2
}
#yt-masthead-user{
  order:3
}
/*.exp-new-logo #yt-masthead #logo {
  background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflbk2Y8_.png) -341px -164px;
    background-size: auto;
  background-size: auto;
  width: 45px;
  height: 30px;
}*/
.site-center-aligned [compact-logo] #yt-masthead #logo-container{
  height:28px;
  margin-top:3px;
  margin-right:10px
}
body [compact-logo] #yt-masthead #logo{
  width:40px!important;
  height:28px!important;
  background:no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflvB63an.png)-130px -288px!important
}
body [compact-logo][logo^="ringo"] #yt-masthead #logo{
  background:no-repeat url(https://www.youtube.com/yts/img/ringo/hitchhiker/yt_play_logo_2x-vflXx5Pg3.png)!important;
  background-size:40px 28px!important;
}
body [compact-logo][logo="ringo2"] #yt-masthead #logo{
  filter:hue-rotate(-14.6deg)
}
[logo^="ringo"] #footer-logo img{
background:no-repeat url(https://www.youtube.com/yts/img/ringo/hitchhiker/logo_small_2x-vfl4_cFqn.png)!important;
background-size:100px 30px!important;
width:100px!important
}
[logo="ringo2"] #footer-logo img{
background-image:url(https://i.imgur.com/g5wUhra.png)!important
}
html{
  max-width:100vw;
  overflow-x:hidden
}
#footer-container,
#masthead-appbar-container{
  width:100vw;
  min-width:100vw;
  max-width:100vw
}
.cardified-page #masthead-appbar-container{
  box-shadow:none;
  border-bottom:1px solid var(--e8)
}
#footer-main .pickers.yt-uix-button-group{
  display:flex;
  flex-wrap:wrap
}
#masthead-appbar{
  max-height:40px
}
#appbar-nav{
  min-width:0;
  max-width:100vw;
  width:fit-content;
  left:unset;
  right:unset;
  margin:0 auto;
  position:relative
}
#appbar-settings-button{
  margin-right:12px
}
#upload-btn .yt-uix-button-icon-wrapper{
  margin:0
}
#appbar-secondary-container .yt-uix-button{
  padding:0 6px
}
#appbar-nav .epic-nav-item-heading{
  border:none;
  font-size:15px
}
.appbar-nav-menu li{
  margin-left:0
}
#appbar-content.appbar-content-hidden .appbar-content-hidable{
  margin-top:0;
}
#appbar-settings-menu .yt-uix-button-icon-appbar-upload{
  background:no-repeat url(//s.ytimg.com/yts/imgbin/www-guide-topguide-vflEJuCEB.png)-18px 0;
  background-size:73px 13px;
  width:11px;
  height:13px;
  filter:brightness(0)
}
.dark-mode #appbar-settings-menu .yt-uix-button-icon-appbar-upload{
  filter:invert(1)
}


.site-center-aligned.flex-width-enabled #alerts,
.site-center-aligned.flex-width-enabled #content{
  min-width:100vw
}
.feed-item-container.browse-list-item-container{
  margin:0 15px
}


#masthead-expanded-menus-container{
  padding-left:5px
}
#masthead-expanded-menu{
  width:120px!important
}
.site-center-aligned #alerts,
.site-center-aligned #content,
#page.watch #guide,
html:not([data-player-size="fullscreen"]) .site-center-aligned #page.watch #player,
html:not([data-player-size="fullscreen"]) #page.watch #movie_player,
html:not([data-player-size="fullscreen"]) #page.watch #movie_player video,
html:not([data-player-size="fullscreen"]) #page.watch .player-width{
  width:100vw!important
}
#playlist{
  min-width:100vw;
  max-width:100vw
}
html:not([data-player-size="fullscreen"]) #page.watch #movie_player,
html:not([data-player-size="fullscreen"]) #page.watch .player-height{
  height:calc(100vw / 1.56)!important;
  height:calc(100vw / 1.56 - 30px)!important;
  /*height:calc(100vw / 1.56 + 6px)!important;*/
  /*height:calc(100vw / 1.56 + 158px)!important*/
}
html:not([data-player-size="fullscreen"]) #page.watch [aspect-ratio="1:1"] #movie_player,
html:not([data-player-size="fullscreen"]) #page.watch [aspect-ratio="1:1"] .player-height{
  height:calc(100vw + 30px)!important;
  height:100vw!important;
}
html:not([data-player-size="fullscreen"]) [ios-styling] #page.watch #movie_player,
html:not([data-player-size="fullscreen"]) [ios-styling] #page.watch .player-height{
  height:calc(100vw / 1.56 - 30px) !important;
  height:calc(100vw / 1.56 - 45px) !important
}
html:not([data-player-size="fullscreen"]) [ios-styling] #page.watch [aspect-ratio="1:1"] #movie_player,
html:not([data-player-size="fullscreen"]) [ios-styling] #page.watch [aspect-ratio="1:1"] .player-height{
  height:calc(100vw)!important;
}
/*
html:not([data-player-size="fullscreen"]) #page.watch .player-height{
  height:calc(100vw / 1.56 + 30px)!important;
}
*/
html:not([data-player-size="fullscreen"]) #page.watch #movie_player video{
  top:0!important;
  left:unset!important
}
#masthead-expanded-menu-google-column2,
#masthead-expanded-menus-container,
#masthead-expanded-google-menu{
  float:unset!important
}
.masthead-expanded-menu-item .yt-uix-clickcard-card{
  right:15px!important;
}
.masthead-expanded-menu-item .yt-uix-clickcard-card-body{
  overflow-y:scroll!important;
  height:400px
}


/* watch page */
#watch-discussion{
  max-width:100vw;
  padding:15px
}
#watch7-headline{
  padding:10px 15px 5px 15px
}
#watch7-headline h1{
  font-size:20px
}
#watch7-user-header{
  padding-inline:15px;
  padding-bottom:10px;
  padding-bottom:12px /* 10px */
}
#watch7-user-header .yt-user-name{
  font-size:14px;
  height:26px;
  max-width:calc(100vw - 100px)
}
.yt-thumb-48 img,
.yt-thumb-48{
  width:56px;
  height:56px
}
.yt-uix-subscription-button{
  height:30px;
  padding:0 10px
}
.yt-uix-button-subscribed-branded + .yt-uix-subscription-preferences-button{
  height:30px;
  padding:0 8px
}
.yt-subscription-button-subscriber-count-branded-horizontal{
  padding:3px 8px;
  font-size:12px
}
.yt-subscription-button-subscriber-count-branded-horizontal::before{
  top:7px
}
.yt-subscription-button-subscriber-count-branded-horizontal::after{
  top:8px
}
.yt-uix-subscription-button .yt-uix-button-content{
  margin-left:-6px;
  margin-right:-6px;
  font-weight:bold
}
#watch7-action-buttons{
  width:calc(100vw - 19px);
  left:0;
  position:relative;
  padding:0 10px 0 8px;
  overflow:visible;
  border-bottom:none
}
.watch8 #watch7-secondary-actions .yt-uix-button:nth-child(3),
#watch7-secondary-actions .yt-uix-button{
  margin-left:0
}
#action-panel-details{
  display:block!important
}
#watch7-main.watch8 #watch7-views-info{
  top:28px
}
#pt-view-count::before{
  content:" | "
}
#watch-description:not(.yt-uix-expander-collapsed) #watch-description-content{
  display:flex;
  flex-direction:column-reverse
}
#watch-description-clip{
  width:100%;
  font-size:13px
}
#watch-description-extra-info{
  margin-top:8px
}
#watch-description.yt-uix-expander-collapsed #watch-description-content{
  height:34px!important;
  min-height:34px!important /* 68px click-to-buy */
}
.yt-uix-expander-collapsed #watch-description-extra-info{
  display:none
}
#watch7-main.watch8 #watch7-sentiment-actions{
  float:left
}
#watch7-main.watch8 #watch7-secondary-actions{
  float:right
}

.cardified-page.exp-individual-cards-watch #watch7-sidebar{
  left:0;
  margin-top:10px!important
}

.appbar-flexwatch-mini.site-center-aligned #player,
.appbar-flexwatch-mini.site-center-aligned #page.watch #content,
#watch7-content,
#watch7-sidebar,
.site-center-aligned.exp-responsive-page #page:not(.watch) #content{
  max-width:100vw;
  width:100vw;
  min-width:100vw
}
#player,
#watch7-main,
#page.search.no-flex .branded-page-v2-container{
  min-width:100vw
}
#page.search #gh-activityfeed .yt-card{
  margin-top:0
}
/*@keyframes slideIn{
0%{
  transform:translateY(-100%)
}
100%{
  transform:translateY(0)
}
}
.show-guide #appbar-guide-menu{
  animation:.2s slideIn 1
}*/
#appbar-guide-menu{
  overflow-y:scroll!important;
  height:calc(100vh - 80px);
  padding:15px
}
.exp-top-guide .guide-item{
  height:34px
}

/* shelf */
.yt-uix-button-shelf-slider-pager{
  height:50px!important;
  margin-top:25%;
  display:none
}
.feed-item-container.browse-list-item-container .compact-shelf .yt-uix-shelfslider-prev{
  left:0!important
}
.feed-item-container.browse-list-item-container .compact-shelf .yt-uix-shelfslider-next{
  right:0!important
}
.compact-shelf .yt-uix-shelfslider-list{
  overflow-x:scroll;
  overflow-y:clip
}
#page.channel .compact-shelf.yt-uix-shelfslider{
  padding:15px
}
.multirow-shelf .yt-uix-expander-head{
  padding:15px 0;
  width:100%;
  margin:0
}
.multirow-shelf .yt-uix-expander .shelf-content > li:last-child > div,
.multirow-shelf .yt-uix-expander.yt-uix-expander-collapsed .shelf-content > li:nth-child(6) > div{
  margin-bottom:0
}
.yt-uix-expander-collapsed #watch-description-toggle .yt-uix-button-content::after,
.multirow-shelf .yt-uix-expander.yt-uix-expander-collapsed .yt-uix-expander-head::after{
  transform:unset
}
#watch-description-toggle .yt-uix-button-content::after,
.multirow-shelf .yt-uix-expander-head::after{
  background:url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflhAgjzS.png) 0 -845px no-repeat;
  width:18px;
  height:12px;
  transform:rotate(180deg);
  content:"";
  display:block;
  visibility:visible!important;
  margin:0 auto
}
.dark-mode #watch-description-toggle .yt-uix-button-content::after,
.dark-mode .multirow-shelf .yt-uix-expander-head::after{
  filter:invert(1)
}
.watch8 #watch-description-toggle{
  border:none;
  margin-top:0
}
#watch-description-toggle .yt-uix-button-content span{
  display:none
}
.branded-page-module-title-v2{
  margin:4px 0 12px
}


/* video renderers */
.v3 .multirow-shelf .yt-uix-expander .shelf-content{
  display:flex;
  flex-direction:column
}
.site-center-aligned .multirow-shelf .yt-uix-expander.yt-uix-expander-collapsed .yt-shelf-grid-item:nth-child(-n+6),
.site-center-aligned #page.home .multirow-shelf .yt-uix-expander:not(.yt-uix-expander-collapsed) .yt-shelf-grid-item,
.multirow-shelf .yt-shelf-grid-item .context-data-item{
  display:flex;
  min-width:210px;
  width:calc(100vw - 30px)!important
}
.site-center-aligned #page.home .multirow-shelf .yt-shelf-grid-item{
  margin-bottom:0
}
.channels-browse-content-grid .channels-content-item{
  margin-bottom:10px
}
.multirow-shelf .yt-lockup-thumbnail{
  width:160px;
  min-width:160px;
  height:90px
}
.multirow-shelf .yt-lockup-content{
  margin-left:8px
}
.search .yt-lockup-title,
#channels-browse-content-grid .yt-lockup-title,
.multirow-shelf .yt-lockup-title{
  margin:0
}
.yt-lockup-grid{
  margin-right:0
}
.yt-lockup-grid::before{
  display:none
}
.extra{
  display:inline-block!important
}
/* shelf rens */
#c4-shelves-container .fluid-shelf.yt-uix-shelfslider .yt-shelf-grid-item,
.site-center-aligned.flex-width-enabled .feeds-mode .yt-shelf-grid-item{
  width:160px
}
/* feed list */
.yt-thumb-120,
.yt-thumb-120 img,
.yt-thumb-185,
.yt-thumb-185 img{
  width:160px
}
.feed-item-main .feed-item-header{
  margin-bottom:22px
}
.feed-item-container .feed-item-main{
  margin-left:0
}

/* related */
.continuation_item_wrapper button{
  height:38px
}
#page.channel .continuation_item_wrapper button,
.feed-page .continuation_item_wrapper button{
  width:100%;
  text-transform:uppercase;
  color:#787878;
  border:none;
  box-shadow:none;
  background:none;
  margin:0!important
}
#page.channel .continuation_item_wrapper button{
  border-top:1px solid var(--e8)
}
/* search */
.result-list .yt-lockup-thumbnail{
  width:unset
}

#pt-settings-window,
[commentPos="panel"] #pt-comment-panel{
  position:fixed;
  width:100vw;
  height:0;
  bottom:0;
  z-index:50111;
  transition-duration:.5s;
  opacity:0;
  border-radius:16px 16px 0 0;
  box-shadow:0 -2px 5px rgba(0,0,0,0.1)
}
[comments-open][commentPos="panel"] #pt-comment-panel{
  height:calc(100vh - 200px);
  opacity:1
}
[settings-open] #pt-settings-window{
  height:calc(100vh - 200px);
  opacity:1;
  z-index:9999999999
}
#pt-settings-topbar,
#pt-comment-panel-title{
  height:44px;
  position:fixed;
  width:100vw;
  z-index:11;
  background:rgba(255,255,255,0.7);
  backdrop-filter:blur(10px);
  border-radius:16px 16px 0 0
}
.pt-title-text{
  margin:0 auto;
  font-size:16px;
  font-weight:bold
}
.pt-close-button{
  font-size:16px;
  position:absolute;
  right:15px;
  color:#1783f2;
  font-weight:bold
}
.pt-close-button:active{
  opacity:.5
}
body{
  --e8:#e8e8e8;
  --fff:#fff;
  --333:#333;
  --ccc:#ccc;
  --ddd:#ddd;
  --eee:#eee
}
.dark-mode{
  --e8:#333;
  --fff:#1a1a1a;
  --333:#fff;
  --ccc:#444;
  --ddd:#333;
  --eee:#222
}
#pt-settings-content,
[commentPos="panel"] #pt-comment-panel-scroller{
  padding-top:44px;
  height:calc(100% - 44px);
  overflow-y:auto;
  background:var(--fff);
  border-radius:16px 16px 0 0;
  overscroll-behavior:contain
}
#watch-discussion{
  margin-top:0;
  border:none
}
/*.player-api,
#masthead-appbar-container{
  transition:.5s opacity;
  transition-delay:0s
}
[comments-open] .player-api,
[comments-open] #masthead-appbar-container{
  opacity:0;
  pointer-events:none;
  transition-delay:.25s
}
[comments-open] #masthead-positioner{
  height:50px
}*/
[commentPos="panel"][comments-open] #player,
[commentPos="panel"][comments-open] #player .html5-video-controls,
[commentPos="panel"][comments-open] #player .player-api,
[commentPos="panel"][comments-open] #player .html5-video-container{
  z-index:0!important
}
#watch7-content{
  display:flex;
  flex-direction:column
}
#pt-comment-trigger{
  width:100vw;
  height:48px;
  background:var(--fff);
  padding:0 15px;
  z-index:100;
  font-weight:bold;
  color:var(--333);
  margin-top:8px;
  box-shadow:0 1px 2px rgba(0,0,0,.1)
}
[commentBtnPos="fixedBottom"] #pt-comment-trigger{
  position:fixed;
  border-top:1px solid var(--e8)
  bottom:0
}
[commentBtnPos="belowRelated"][commentPos="panel"] #pt-comments{
  order:3
}
[commentBtnPos="belowRelated"] #pt-comment-trigger{
  margin-top:20px
}
#pt-watch-tabs{
  background:var(--fff);
  padding:0 15px;
  margin-top:8px;
  border-bottom:1px solid var(--e8)
}
[comments-open] #pt-watch-tabs{
  position:sticky;
  top:89px;
  /*top:86px;*/
  z-index:1111
}
[commentPos="tab"] #pt-comments{
  position:sticky;
  top:81px;
  /*top:78px;*/
  z-index:1111
}
.pt-tab{
  height:48px;
  border-bottom:3px solid transparent;
  width:calc(50vw - 0px);
  font-weight:bold;
  opacity:.6;
  justify-content:center;
  font-size:15px;
  color:var(--333);
  padding-top:3px
}
.v3:not([comments-open]) #pt-related-tab,
[comments-open] #pt-comment-tab{
  opacity:1;
  border-bottom-color:var(--red)
}
.cardified-page.exp-individual-cards-watch [commentPos="tab"] #watch7-sidebar{
  margin-top:0!important
}
.pt-fence{
  height:100vh;
  width:100vw;
  position:fixed;
  left:0;
  top:0;
  z-index:50110;
  pointer-events:none;
  overscroll-behavior:contain;
  overflow:scroll
}
[appbar-menu-open] #pt-appbar-fence,
[settings-open] #pt-settings-fence,
[comments-open][commentPos="panel"] #pt-comment-fence{
  pointer-events:all
}
#pt-settings-content{
  background:#f2f2f7
}
#pt-settings-topbar{
  background:#f2f2f788
}
.dark-mode #pt-settings-content{
  background:#000
}
.dark-mode #pt-settings-topbar{
  background:#0008
}
#pt-appbar-menu{
  position:fixed;
  width:100vw;
  top:90px
}
#pt-appbar-menu-inner{
  background:var(--fff);
  border:1px solid var(--e8);
  margin:0 auto;
  width:220px;
  /*box-shadow:0 0 15px rgba(0,0,0,.18);*/
  position:relative;
  z-index:50111
}
#pt-appbar-items li{
  display:block
}
#pt-appbar-items h2,
#pt-appbar-items a{
  border:none;
  padding:0 15px;
  min-height:40px;
  line-height:1.2;
  display:flex;
  align-items:center;
  white-space:break-spaces;
  color:var(--333)
}
#pt-appbar-items a{
  opacity:.7
}
#pt-appbar-items h2{
  background:var(--ddd)
}
#pt-appbar-items a:active{
  background:var(--ccc)
}
#pt-appbar-title{
  max-width:calc(100vw - 110px);
  overflow:hidden;
  text-overflow:ellipsis;
  height:40px
}
/* comments */
.distiller_yt-thread .thread .post{
  margin-left:56px
}
.distiller_yt-thread_avatar{
  margin:0 0 0 -56px;
  width:56px;
  height:56px;
}
.distiller_yt-thread .action_bar .reply-button{
  font-size:12px
}
.distiller_yt-post_comment_section .loader{
  margin-left:66px;
  margin-top:0;
  padding:4px 0
}
.distiller_yt-post_comment_section .loader .link_action_text{
  font-size:14px
}
.distiller_yt-post_comment_section .distiller_yt-post-content{
  padding-left:66px
}


/* channels */
#c4-header-bg-container{
  height:90px
}
.channel-header #header-links{
  right:15px
}
.channel-header-profile-image-container{
  width:64px;
  height:64px;
  left:15px;
  box-shadow:rgba(0,0,0,.5) 0 4px 5px -1px
}
.channel-header-profile-image-container img{
  width:64px;
  height:64px
}
.channel-header .primary-header-contents{
  padding:15px 15px 0 15px;
  display:flex;
  flex-direction:column-reverse
}
.primary-header-actions{
  margin:10px 0 6px /* 10 0 12 */
}
.channel-header .branded-page-header-title .spf-link{
  font-size:16px;
  font-weight:400!important;
  line-height:16px
}
#channel-navigation-menu > li{
  margin-left:0
}
#channel-navigation-menu .epic-nav-item-empty{
  height:32px!important
}
.epic-nav-item-heading{
  padding:0px 10px;
  padding:0;
  font-size:13px;
  height:32px;
  max-width:100vw;
  overflow:hidden;
  text-overflow:ellipsis
}
#channel-subheader .epic-nav-item-heading{
  padding:0 10px
}
a.yt-uix-button.yt-uix-button-epic-nav-item,
button.yt-uix-button-epic-nav-item{
  padding:0px 10px;
  font-size:13px;
  height:32px
}
#channel-subheader{
  padding:0 15px
}
#channel-search,
#channel-search *{
  transition:none!important
}
#channel-search.expanded{
  padding-top:10px;
  border-top:1px solid var(--e8)
}
#channel-navigation-menu li:last-child:has(.expanded){
  margin-left:0
}
#channel-search.expanded .search-field{
  width:calc(100vw - 62px)
}
#channel-search.expanded .search-form.epic-nav-item.secondary-nav{
  padding:0 0 10px 0
}
#content-sort-menu{
  margin-right:0
}
.branded-page-v2-subnav-container button{
  height:32px
}
#page:not(.channel) .branded-page-v2-subnav-container,
.branded-page-v2-header .branded-page-gutter-padding,
.branded-page-v2-primary-col .branded-page-gutter-padding{
  padding-inline:15px
}
.yt-uix-button-menu .yt-uix-button-menu-item{
  line-height:34px
}
#channel-featured-content{
  padding:15px
}
#channels-browse-content-grid{
  display:flex;
  flex-direction:column;
  margin-right:0
}
#channels-browse-content-grid.channels-browse-content-grid .channels-content-item{
  width:100%
}
#channels-browse-content-grid.channels-browse-content-grid .channels-content-item > div{
  display:flex;
  margin-right:0
}
#channels-browse-content-grid .yt-lockup-thumbnail{
  width:160px
}
#channels-browse-content-grid .yt-lockup-content{
  margin-left:8px;
  width:100%
}

#c4-shelves-container ol{
  padding-block:0;
  box-shadow:none;
  border:none
}
.branded-page-v2-primary-col .branded-page-box-padding{
  padding:15px
}
.other-channels-module > .yt-card,
#page.channel #gh-activityfeed > .yt-card{
  margin:0;
  padding:0
}
.about-stats{
  margin-bottom:15px
}
.branded-page-v2-primary-col .other-channels-module .branded-page-box{
  padding:15px
}
.channel-summary-list-item{
  min-width:104px
}
#c4-about-tab .channel-summary-list-fluid-grid{
  width:fit-content;
  margin-right:10px
}

#content-container,
#body-container{
  padding-bottom:10px
}
#watch7-sidebar,
#watch7-main{
  margin-bottom:0
}

[ios-styling] video{
  height:unset!important
}

.pt-setting{
  margin:15px 15px 20px 15px;
  transition-duration:.5s
}
#commentBtnPos{
  overflow:hidden;
  padding-bottom:2px;
  max-height:220px
}
[commentPos="tab"] #commentBtnPos{
  max-height:0;
  margin:-7.5px 15px;
  opacity:0;
  padding-bottom:0
}
.pt-setting-desc,
.pt-setting-title{
  font-size:13px;
  color:#787878;
  margin:8px 15px 0 15px
}
.pt-setting-title{
  text-transform:uppercase;
  margin:0 0 8px 15px
}
.pt-option{
  background:var(--fff);
  padding:13px 15px;
  flex-wrap:wrap;
  position:relative;
  font-size:17px!important
}
.dark-mode .pt-option{
  background:#1c1c1e
}
.pt-option > span:not(.pt-option-extra){
  font-size:17px!important
}
.pt-option:active{
  background:var(--ccc)
}
.pt-option:not(:last-of-type){
  border-bottom:1px solid #eee
}
.dark-mode .pt-option:not(:last-of-type){
border-color:#333
}
.pt-option:first-of-type{
  border-radius:8px 8px 0 0
}
.pt-option:last-of-type{
  border-radius:0 0 8px 8px
}
.pt-option:last-of-type:first-of-type{
  border-radius:8px
}
.pt-option-text{
  display:block;
  width:100%;
  font-size:13px!important
}
.pt-option-extra{
  display:block;
  width:100%;
  margin:4px 0 -2px 0;
  font-size:13px!important;
  color:#999
}
.pt-option svg{
  width:12px;
  height:12px;
  position:absolute;
  right:15px
}
.pt-option[value="false"] svg{
  display:none
}
.pt-red-text{
  color:#f44
}
.pt-buildinfo{
  margin:40px auto 20px auto;
  width:fit-content
}

.v3{
  --red:#cc181e
}
[logo="ringo"]{
  --red:#f00
}
[logo="ringo2"]{
  --red:#f03
}
[logo^="ringo"] #guide-container .guide-item.guide-item-selected:hover,
[logo^="ringo"] #guide-container .guide-item.guide-item-selected,
[logo^="ringo"] #guide-container .guide-collection-item .guide-item.guide-item-selected,
[logo^="ringo"] #yt-masthead-user .sb-notif-on .yt-uix-button-content{
  background:var(--red)
}
[logo^="ringo"] a.yt-uix-button-epic-nav-item.selected,
[logo^="ringo"] a.yt-uix-button-epic-nav-item.yt-uix-button-toggled,
[logo^="ringo"] button.yt-uix-button-epic-nav-item.selected,
[logo^="ringo"] button.yt-uix-button-epic-nav-item.yt-uix-button-toggled,
[logo^="ringo"] .epic-nav-item.selected,
[logo^="ringo"] .epic-nav-item.yt-uix-button-toggled,
[logo^="ringo"] .epic-nav-item-heading{
  border-color:var(--red)
}
.epic-nav-dropdown-group:hover,
a.yt-uix-button-epic-nav-item:hover,
.epic-nav-item:hover,
button.yt-uix-button-epic-nav-item:hover{
  border-color:transparent
}
.exp-top-guide [logo^="ringo"] li.guide-section h3{
  color:var(--red)
}
.show-guide [logo^="ringo"] #appbar-guide-button.yt-uix-button-text .yt-uix-button-icon-appbar-guide{
  filter:brightness(1.35)
}
.show-guide [logo="ringo2"] #appbar-guide-button.yt-uix-button-text .yt-uix-button-icon-appbar-guide{
  filter:brightness(1.35) hue-rotate(-14.6deg)
}
[logo="ringo"] .yt-uix-button-subscribe-branded{
  background:#f00
}
[logo="ringo"] .yt-uix-button-subscribe-branded:active{
  background:#d00
}
[logo="ringo2"] .yt-uix-button-subscribe-branded{
  background:#f03
}
[logo="ringo2"] .yt-uix-button-subscribe-branded:active{
  background:#d03
}
[logo="ringo"] #progress{
background:#f00
}
[logo="ringo2"] #progress{
background:linear-gradient(to right,#f03 80%,#ff2791 100%)
}


.v3:not([appbar-menu-open]) #pt-appbar-menu-inner,
.right-options,
[commentPos="panel"] #pt-watch-tabs,
[commentPos="tab"][comments-open] #watch7-sidebar,
[commentPos="tab"]:not([comments-open]) #pt-comment-panel,
[commentPos="tab"] #pt-comment-trigger,
[commentPos="tab"] #pt-comment-panel-title,
.ytp-size-toggle-large,
#dftvp,
[ios-styling] .html5-video-controls,
.yt-user-separator,
.yt-user-videos,
#content-flow-select,
.multirow-shelf .yt-uix-expander-head > span,
.banner-promo-renderer,
#watch7-views-info,
#watch7-secondary-actions button.start,
#masthead-expanded-sandbar,
#logo-red-suffix,
.branded-page-v2-secondary-col,
#appbar-nav > a,
/*#appbar-nav a ~ ul.appbar-nav-menu,*/
/*[location="channel"] #appbar-nav li:not(.vis),*/
.v3:not([location="channel"]) #appbar-nav li:has(a),
#upload-btn .yt-uix-button-content,
#yt-masthead-dropdown,
#appbar-guide-button .yt-uix-button-arrow,
#yt-masthead-user-displayname,
.content-region,
#yt-masthead-content #appbar-settings-button,
#upload-btn{
  display:none!important
}
[location="channel"] #appbar-content.appbar-content-hidden .appbar-content-hidable:has(.vis){
  margin-top:0
}
[location="channel"] #appbar-nav li.vis:last-child{
  display:block!important;
  font-size:15px;
  font-weight:bold;
  opacity:1;
  color:#000
}
.dark-mode [location="channel"] #appbar-nav li.vis:last-child{
  color:#fff
}

#masthead-expanded-menus-container,
#footer-links-primary a{
  font-size:13px
}
.masthead-expanded-menu-item a,
.masthead-expanded-menu-header{
  font-size:12px!important
}
#footer-main{
  margin:0;
  display:grid
}
#footer-logo{
  margin:5px auto 20px auto!important
}

*{
  -webkit-text-size-adjust:100%!important
}
#watch7-sidebar-contents .autoplay-bar .watch-sidebar-head{
  font-size:13px!important
}



[data-player-size="small"][pl-ver^="m"] #player:not(:hover) .player-api > #movie_player.ytp-block-autohide:not(.paused-mode):not(.ended-mode) .html5-video-controls,
[data-player-size="large"][pl-ver^="m"] #player:not(:hover) .player-api > #movie_player.ytp-block-autohide:not(.paused-mode):not(.ended-mode) .html5-video-controls{
opacity:0
}
[pl-ver^="m"] .player-api > #movie_player .ytp-progress-bar-container{
width:calc(100% - 24px);
margin:0 auto
}
html[data-player-size="fullscreen"][pl-ver^="m"] .player-api > #movie_player .ytp-progress-bar-container {
width: calc(100% - 48px);
}
[pl-ver^="m"] .player-api > #movie_player .html5-player-chrome {
background: none !important;
height: 36px;
}
[pl-ver^="mv2-3"] .player-api > #movie_player .html5-player-chrome {
height: 40px;
}
[pl-ver^="mv2-34"] .player-api > #movie_player .html5-player-chrome {
height: 48px;
}
html[data-player-size="fullscreen"][pl-ver^="m"] .player-api > #movie_player .html5-player-chrome {
background: none !important;
height: 54px;
}
[pl-ver^="m"] .player-api > #movie_player .html5-video-controls::before {
content: "";
width: 100%;
position: absolute;
background-repeat: repeat-x;
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==);
height: 49px;
padding-top: 49px;
bottom: -36px;
z-index: -2;
background-position: bottom;
left: 0;
pointer-events: none;
bottom: 0;
}
html[data-player-size="fullscreen"][pl-ver^="m"] .player-api > #movie_player .html5-video-controls::before {
bottom: -54px;
bottom: 0;
}
[pl-ver^="m"] .ytp-progress-bar-container {
z-index: 1;
}
[data-player-size="small"][pl-ver^="m"] .player-height {
height: 360px;
}
@media screen and (min-width: 1496px) and (min-height: 768px){
[data-player-size="small"][pl-ver^="m"] .appbar-flexwatch-mini .player-height {
height: 480px;
}
}
@media screen and (min-width: 2130px) and (min-height: 1080px){
[data-player-size="small"][pl-ver^="m"] .appbar-flexwatch-mini .player-height {
height: 720px;
}
}
[pl-ver^="m"] .player-api > #movie_player .ytp-progress-list {
height: 3px !Important;
transition: 0.25s;
}
html[data-player-size="fullscreen"][pl-ver^="m"] .player-api > #movie_player .ytp-progress-list {
height: 5px !Important;
}
[pl-ver^="m"] .player-api > #movie_player .ytp-progress-bar-container:hover .ytp-progress-list {
height: 5px !Important;
}
html[data-player-size="fullscreen"][pl-ver^="m"] .player-api > #movie_player .ytp-progress-bar-container:hover .ytp-progress-list {
height: 8px !Important;
}
[pl-ver^="m"] .player-api > #movie_player .html5-scrubber-button {
background: #f12b24 !important;
border: none;
height: 0px !important;
width: 0px;
transition: all 0.25s, left 0s;
top: 7px !important;
transform-origin: unset !important;
}
[pl-ver^="m"] [logo="ringo"] .player-api > #movie_player .ytp-play-progress,
[pl-ver^="m"] [logo="ringo"] .player-api > #movie_player .html5-scrubber-button{
background:#f00!important
}
[pl-ver^="m"] [logo="ringo2"] .player-api > #movie_player .html5-scrubber-button{
background:#f03!important
}
[pl-ver^="m"] [logo="ringo2"] .player-api > #movie_player .ytp-play-progress{
  background:linear-gradient(to right,#f03 80%,#ff2791 100%)
}
[pl-ver^="m"] .player-api > #movie_player .seeking-mode .html5-scrubber-button,
[pl-ver^="m"] .player-api > #movie_player .ytp-progress-bar-container:hover .html5-scrubber-button{
height:13px!important;
width:13px;
top:-1px!important
}
html[data-player-size="fullscreen"][pl-ver^="m"] .player-api > #movie_player .seeking-mode .html5-scrubber-button,
html[data-player-size="fullscreen"][pl-ver^="m"] .player-api > #movie_player .ytp-progress-bar-container:hover .html5-scrubber-button{
height:16px!important;
width:16px;
top:-4px!important
}
[pl-ver^="m"] .player-api > #movie_player .ytp-play-progress{
background:#f12b24
}
[pl-ver^="m"] .player-api > #movie_player .ytp-unloaded-progress{
background:none
}
[pl-ver^="m"] .player-api > #movie_player .ytp-load-progress{
background:rgba(255,255,255,.4)
}
[pl-ver^="m"] .player-api > #movie_player .ytp-hover-progress-light{
background:rgba(255,255,255,.5)
}
[pl-ver^="m"] .player-api > #movie_player .ytp-progress-list{
background:rgba(255,255,255,.2)
}
[pl-ver^="m"] .player-api > #movie_player .ytp-time-display{
color:rgb(238,238,238)!important;
font-size:11px;
height:36px;
display:flex;
align-items:center;
margin-left:0
}
[pl-ver^="mv2"] .player-api > #movie_player .ytp-time-display{
color:#ddd!important;
font-size:13px;
margin-left:5px;
font-family:"Roboto"
}
[pl-ver^="mv2-3"] .player-api > #movie_player .ytp-time-display{
height:39px
}
[pl-ver^="mv2-34"] .player-api > #movie_player .ytp-time-display{
height:47px
}
[pl-ver^="mv2"] .player-api > #movie_player .ytp-time-display span{
color:#ddd!important
}
[pl-ver^="m"] .player-api > #movie_player .ytp-time-separator{
padding:0 3px
}
html[data-player-size="fullscreen"][pl-ver^="m"] .player-api > #movie_player .ytp-time-display{
font-size:17px;
height:54px
}
html[data-player-size="fullscreen"][pl-ver^="m"] .player-api > #movie_player .ytp-time-separator{
padding:0 5px
}
html[data-player-size="fullscreen"][pl-ver^="mv2"] .player-api > #movie_player .ytp-time-display{
font-size:20.1977px;
height:54px
}
html[data-player-size="fullscreen"][pl-ver^="mv2"] .player-api > #movie_player .ytp-time-separator{
padding:0 5px
}
[pl-ver^="m"] .html5-bezel{
border-radius:50%
}
.startube-player-svg{
color:rgb(238,238,238);
fill:rgb(238,238,238)
}
#startube-playpause{
width:46px!important;
height:36px!important;
background:none;
margin-left:12px
}
[pl-ver^="mv2-3"] #startube-playpause{
width:46px!important;
height:40px!important
}
[pl-ver^="mv2-34"] #startube-playpause{
width:48px!important;
height:48px!important
}
[pl-ver^="m"] #startube-playpause::before{
content:'';
display:block;
height:100%;
width:12px;
position:absolute;
top:0;
left:-12px
}
html[data-player-size="fullscreen"][pl-ver^="m"] #startube-playpause::before{
left:-24px;
width:24px
}
#startube-playpause svg{
width:46px!important;
height:36px!important
}
[pl-ver^="mv2-3"] #startube-playpause svg{
width:46px!important;
height:40px!important
}
[pl-ver^="mv2-34"] #startube-playpause svg{
width:42px!important;
height:42px!important
}
html:not([data-player-size="fullscreen"])[pl-ver^="mv2-34"] .startube-player-svg{
height:47px;
width:45px;
margin:0 auto;
display:flex;
align-items:center
}
#startube-playpause path{
width:13px!important;
height:14px!important
}
[pl-ver^="m"] #startube-fullscreen::after{
content:'';
display:block;
height:100%;
width:12px;
position:absolute;
top:0;
right:-12px
}
html[data-player-size="fullscreen"][pl-ver^="m"] #startube-fullscreen::after{
width:24px;
right:-24px
}
#startube-fullscreen{
margin-right:12px
}
[pl-ver^="m"] .ytp-settings-hd-quality-badge{
position:absolute;
right:2px;
margin-top:4px
}
html[data-player-size="fullscreen"][pl-ver^="m"] .ytp-settings-hd-quality-badge{
background:none;
right:0;
margin-top:0
}
html[data-player-size="fullscreen"][pl-ver^="m"] .ytp-settings-hd-quality-badge::after{
content:"HD";
top:11px;
right:5px;
padding:2px;
font-family:Verdana,sans-serif;
font-size:10px;
font-weight:bold;
color:#fff;
text-shadow:0 2px 0 rgba(0,0,0,.6);
background-image:none;
border-radius:1.5px;
height:auto;
width:auto;
background-color:#f12b24;
position:absolute;
z-index:300
}
html[data-player-size="fullscreen"][pl-ver^="m"] [logo="ringo"] .ytp-settings-hd-quality-badge::after{
background-color:#f00
}
html[data-player-size="fullscreen"][pl-ver^="m"] [logo="ringo2"] .ytp-settings-hd-quality-badge::after{
background:#f03
}
html[data-player-size="small"][pl-ver^="m"] .ytp-settings-4k-quality-badge,
html[data-player-size="small"][pl-ver^="m"] .ytp-settings-2k-quality-badge{
position:absolute;
right:2px;
top:4px
}
[pl-ver^="mv2-3"] .ytp-settings-hd-quality-badge{
position:absolute;
right:7px;
margin-top:9px
}
[pl-ver^="m"] .startube-player-icon.startube-has-icon{
width:36px!important;
height:36px!important;
background:none!important;
position:relative
}
[pl-ver^="mv2-3"] .startube-player-icon.startube-has-icon{
width:40px!important;
height:40px!important
}
[pl-ver^="mv2-34"] .startube-player-icon.startube-has-icon{
width:48px!important;
height:47px!important
}
[pl-ver^="m"] .startube-player-icon.startube-has-icon svg{
width:36px!important;
height:36px!important
}
[pl-ver^="mv2-3"] .startube-player-icon.startube-has-icon svg{
width:40px!important;
height:40px!important
}
[pl-ver^="mv2-34"] .startube-player-icon.startube-has-icon svg{
width:45px!important;
height:45px!important
}
html[data-player-size="fullscreen"][pl-ver^="m"] #startube-fullscreen{
margin-right:24px
}
html[data-player-size="fullscreen"][pl-ver^="m"] #startube-theater{
display:none!important
}
html[data-player-size="fullscreen"][pl-ver^="m"] .startube-player-icon.startube-has-icon{
width:54px!important;
height:54px!important;
background:none
}
html[data-player-size="fullscreen"][pl-ver^="m"] .startube-player-icon.startube-has-icon svg{
width:54px!important;
height:54px!important
}
html[data-player-size="fullscreen"][pl-ver^="m"] #startube-playpause{
width:69px!important;
height:54px!important;
background:none;
margin-left:24px
}
html[data-player-size="fullscreen"][pl-ver^="m"] #startube-playpause svg{
width:69px!important;
height:54px!important
}
[pl-ver^="m"] .html5-video-controls .ytp-button-watch-later,
[pl-ver^="m"] .ytp-button-dislike,
[pl-ver^="m"] .ytp-button-like,
[pl-ver^="m"] .ytp-button-info{
display:none!important
}
[pl-ver^="m"] #subtitles_button{
position:relative
}
[pl-ver^="m"] #subtitles_button::after{
content:"";
display:block;
position:absolute;
width:0;
height:2px;
border-radius:0;
left:20px;
bottom:7px;
background-color:#f12b24;
-webkit-transition:left .1s cubic-bezier(.4,0,1,1),width .1s cubic-bezier(.4,0,1,1);
transition:left .1s cubic-bezier(.4,0,1,1),width .1s cubic-bezier(.4,0,1,1)
}
[pl-ver^="mv2"] #subtitles_button::after{
border-radius:3px
}
html:not([data-player-size="fullscreen"])[pl-ver^="mv2-3"] #subtitles_button.ytp-subtitles-button-active::after{
  width:24px;
  left:8px!important;
  height:3px;
  border-radius:3px;
  bottom:6px
}
html:not([data-player-size="fullscreen"])[pl-ver^="mv2-34"] #subtitles_button.ytp-subtitles-button-active::after{
  width:25px;
  left:11px!important;
  height:3px;
  border-radius:3px;
  bottom:8px
}
[pl-ver^="m"] [logo="ringo"] #subtitles_button::after{
background-color:#f00
}
[pl-ver^="m"] [logo="ringo2"] #subtitles_button::after{
background-color:#f03
}
[pl-ver^="m"] #subtitles_button.ytp-subtitles-button-active::after{
width:24px;
left:6.5px;
-webkit-transition:left .25s cubic-bezier(0,0,.2,1),width .25s cubic-bezier(0,0,.2,1);
transition:left .25s cubic-bezier(0,0,.2,1),width .25s cubic-bezier(0,0,.2,1)
}
html[data-player-size="fullscreen"][pl-ver^="m"] #subtitles_button::after{
bottom:9px;
height:3px
}
html[data-player-size="fullscreen"][pl-ver^="m"] #subtitles_button.ytp-subtitles-button-active::after{
width:40px;
left:7px;
-webkit-transition:left .25s cubic-bezier(0,0,.2,1),width .25s cubic-bezier(0,0,.2,1);
transition:left .25s cubic-bezier(0,0,.2,1),width .25s cubic-bezier(0,0,.2,1)
}
[pl-ver^="m"] #settings_button svg{
transition:transform .1s cubic-bezier(0.4,0.0,1,1)
}
[pl-ver^="m"] #settings_button[aria-pressed="true"] svg{
transform:rotateZ(22.5deg)
}
.ytp-size-toggle-large #st-small,
.ytp-size-toggle-small #st-large,
.ytp-button-fullscreen-enter #st-exit,
.ytp-button-fullscreen-exit #st-enter{
display:none
}
#startube-volume:not([data-value="max"]):not([data-value="loud"]):not([data-value="normal"]) #st-max,
#startube-volume:not([data-value="quiet"]):not([data-value="min"]) #st-low,
#startube-volume:not([data-value="off"]) #st-muted{
display:none
}
[pl-ver^="m"] .ytp-volume-slider{
height:31px
}
[pl-ver^="mv2-3"] .ytp-volume-slider{
height:33px
}
[pl-ver^="mv2-34"] .ytp-volume-slider{
height:37px
}
html[data-player-size="fullscreen"][pl-ver^="m"] .ytp-volume-slider{
height:40px
}
html[data-player-size="fullscreen"][pl-ver^="m"] .ytp-volume-slider-foreground::before,
html[data-player-size="fullscreen"][pl-ver^="m"] .ytp-volume-slider-foreground::after{
height:5px
}
[pl-ver^="m"] .ytp-volume-slider-foreground::before{
background:#f12b24
}
[pl-ver^="m"] [logo^="ringo"] .ytp-volume-slider-foreground::before{
background:#f00
}
[pl-ver^="mv2"] .ytp-volume-slider-foreground::before{
background:#fff!important
}
[pl-ver^="mv2"] .ytp-volume-slider-foreground::after{
  background:#aaa
}
.ytp-fullscreen-button-corner-0,
.ytp-fullscreen-button-corner-1,
.ytp-fullscreen-button-corner-2,
.ytp-fullscreen-button-corner-3,
.ytp-fullscreen-close-button-corner-0,
.ytp-fullscreen-close-button-corner-1,
.ytp-fullscreen-close-button-corner-2,
.ytp-fullscreen-close-button-corner-3 {
-moz-transform:translate(0,0);
-ms-transform:translate(0,0);
-webkit-transform:translate(0,0);
transform:translate(0,0)
}
@keyframes ytp-fullscreen-button-corner-0-animation {
50% {
-moz-transform:translate(-1px,-1px);
-ms-transform:translate(-1px,-1px);
-webkit-transform:translate(-1px,-1px);
transform:translate(-1px,-1px)
}
}
@keyframes ytp-fullscreen-button-corner-1-animation {
50% {
-moz-transform:translate(1px,-1px);
-ms-transform:translate(1px,-1px);
-webkit-transform:translate(1px,-1px);
transform:translate(1px,-1px)
}
}
@keyframes ytp-fullscreen-button-corner-2-animation {
50% {
-moz-transform:translate(1px,1px);
-ms-transform:translate(1px,1px);
-webkit-transform:translate(1px,1px);
transform:translate(1px,1px)
}
}
@keyframes ytp-fullscreen-button-corner-3-animation {
50% {
-moz-transform:translate(-1px,1px);
-ms-transform:translate(-1px,1px);
-webkit-transform:translate(-1px,1px);
transform:translate(-1px,1px)
}
}
@keyframes ytp-fullscreen-close-button-corner-0-animation {
50% {
-moz-transform:translate(1px,1px);
-ms-transform:translate(1px,1px);
-webkit-transform:translate(1px,1px);
transform:translate(1px,1px)
}
}
@keyframes ytp-fullscreen-close-button-corner-1-animation {
50% {
-moz-transform:translate(-1px,1px);
-ms-transform:translate(-1px,1px);
-webkit-transform:translate(-1px,1px);
transform:translate(-1px,1px)
}
}
@keyframes ytp-fullscreen-close-button-corner-2-animation {
50% {
-moz-transform:translate(-1px,-1px);
-ms-transform:translate(-1px,-1px);
-webkit-transform:translate(-1px,-1px);
transform:translate(-1px,-1px)
}
}
@keyframes ytp-fullscreen-close-button-corner-3-animation {
50% {
-moz-transform:translate(1px,-1px);
-ms-transform:translate(1px,-1px);
-webkit-transform:translate(1px,-1px);
transform:translate(1px,-1px)
}
}
[pl-ver^="m"] #startube-fullscreen:not([aria-disabled=true]):hover .ytp-fullscreen-button-corner-0 {
-moz-animation:ytp-fullscreen-button-corner-0-animation .4s cubic-bezier(0.4,0.0,0.2,1);
-webkit-animation:ytp-fullscreen-button-corner-0-animation .4s cubic-bezier(0.4,0.0,0.2,1);
animation:ytp-fullscreen-button-corner-0-animation .4s cubic-bezier(0.4,0.0,0.2,1);
}
[pl-ver^="m"] #startube-fullscreen:not([aria-disabled=true]):hover .ytp-fullscreen-button-corner-1 {
-moz-animation:ytp-fullscreen-button-corner-1-animation .4s cubic-bezier(0.4,0.0,0.2,1);
-webkit-animation:ytp-fullscreen-button-corner-1-animation .4s cubic-bezier(0.4,0.0,0.2,1);
animation:ytp-fullscreen-button-corner-1-animation .4s cubic-bezier(0.4,0.0,0.2,1)
}
[pl-ver^="m"] #startube-fullscreen:not([aria-disabled=true]):hover .ytp-fullscreen-button-corner-2 {
-moz-animation:ytp-fullscreen-button-corner-2-animation .4s cubic-bezier(0.4,0.0,0.2,1);
-webkit-animation:ytp-fullscreen-button-corner-2-animation .4s cubic-bezier(0.4,0.0,0.2,1);
animation:ytp-fullscreen-button-corner-2-animation .4s cubic-bezier(0.4,0.0,0.2,1)
}
[pl-ver^="m"] #startube-fullscreen:not([aria-disabled=true]):hover .ytp-fullscreen-button-corner-3 {
-moz-animation:ytp-fullscreen-button-corner-3-animation .4s cubic-bezier(0.4,0.0,0.2,1);
-webkit-animation:ytp-fullscreen-button-corner-3-animation .4s cubic-bezier(0.4,0.0,0.2,1);
animation:ytp-fullscreen-button-corner-3-animation .4s cubic-bezier(0.4,0.0,0.2,1)
}
[pl-ver^="m"] #startube-fullscreen:not([aria-disabled=true]):hover .ytp-fullscreen-close-button-corner-0 {
-moz-animation:ytp-fullscreen-close-button-corner-0-animation .4s cubic-bezier(0.4,0.0,0.2,1);
-webkit-animation:ytp-fullscreen-close-button-corner-0-animation .4s cubic-bezier(0.4,0.0,0.2,1);
animation:ytp-fullscreen-close-button-corner-0-animation .4s cubic-bezier(0.4,0.0,0.2,1)
}
[pl-ver^="m"] #startube-fullscreen:not([aria-disabled=true]):hover .ytp-fullscreen-close-button-corner-1 {
-moz-animation:ytp-fullscreen-close-button-corner-1-animation .4s cubic-bezier(0.4,0.0,0.2,1);
-webkit-animation:ytp-fullscreen-close-button-corner-1-animation .4s cubic-bezier(0.4,0.0,0.2,1);
animation:ytp-fullscreen-close-button-corner-1-animation .4s cubic-bezier(0.4,0.0,0.2,1)
}
[pl-ver^="m"] #startube-fullscreen:not([aria-disabled=true]):hover .ytp-fullscreen-close-button-corner-2 {
-moz-animation:ytp-fullscreen-close-button-corner-2-animation .4s cubic-bezier(0.4,0.0,0.2,1);
-webkit-animation:ytp-fullscreen-close-button-corner-2-animation .4s cubic-bezier(0.4,0.0,0.2,1);
animation:ytp-fullscreen-close-button-corner-2-animation .4s cubic-bezier(0.4,0.0,0.2,1)
}
[pl-ver^="m"] #startube-fullscreen:not([aria-disabled=true]):hover .ytp-fullscreen-close-button-corner-3 {
-moz-animation:ytp-fullscreen-close-button-corner-3-animation .4s cubic-bezier(0.4,0.0,0.2,1);
-webkit-animation:ytp-fullscreen-close-button-corner-3-animation .4s cubic-bezier(0.4,0.0,0.2,1);
animation:ytp-fullscreen-close-button-corner-3-animation .4s cubic-bezier(0.4,0.0,0.2,1)
}


[pl-ver^="m"] .ytp-menu-container {
background: none;
}
[pl-ver^="m"] .ytp-menu {
background: rgba(28,28,28,0.8);
border-radius: 4px;
transition: opacity .1s cubic-bezier(0.0,0.0,0.2,1);
}
[pl-ver^="m"] .html5-context-menu {
background: rgba(28,28,28,0.8);
text-shadow: 0 0 2px rgba(0,0,0,.5);
border-radius: 4px;
transition: opacity .1s cubic-bezier(0.0,0.0,0.2,1);
border: none;
color: #bbb;
font-size: 11px;
width: 206px;
padding: 0;
}
[pl-ver^="m"] .html5-context-menu li {
border-bottom: 1px solid #444;
}
[pl-ver^="m"] .html5-context-menu li a:hover,
[pl-ver^="m"] .html5-context-menu li span:hover {
background: #1c1c1c !important;
}
[pl-ver^="m"] .html5-context-menu a,
[pl-ver^="m"] .html5-context-menu span {
color: #bbb !important;
font-size: 11px !important;
padding: 0 10px;
}
@keyframes rcfadein {
0%{
opacity:0;
}
100%{
opacity:1;
}
}
@keyframes rcfadeout {
0%{
opacity:1;
}
100%{
opacity:0;
}
}
[pl-ver^="mv2"] .html5-context-menu[style~="block;"] {
animation:0.15s rcfadein 1;
}
[pl-ver^="mv2"] .html5-context-menu[style~="none;"] {
display:block !important;
animation:0.15s rcfadeout 1;
opacity:0;
pointer-events:none
}
[pl-ver^="mv2"] .html5-context-menu {
background: rgba(28,28,28,0.9);
text-shadow: 0 0 2px rgba(0,0,0,.5);
border-radius: 2px;
border: none;
width: 254px;
padding: 6px 0;
}
[data-player-size="fullscreen"][pl-ver^="mv2"] .html5-context-menu {
width: 387px;
}
[pl-ver^="mv2"] .html5-context-menu a,
[pl-ver^="mv2"] .html5-context-menu span{
height:33px;
display:flex;
align-items:center;
font-size:13px !important;
color: #eee!important;
padding:0 15px;
font-weight:var(--bold)
}
[data-player-size="fullscreen"][pl-ver^="mv2"] .html5-context-menu a,
[data-player-size="fullscreen"][pl-ver^="mv2"] .html5-context-menu span{
height:49px;
font-size:20px !important;
padding:0 22px;
}
[pl-ver^="mv2"] .html5-context-menu li{
cursor:pointer
}
[pl-ver^="mv2"] .html5-context-menu li:hover span,
[pl-ver^="mv2"] .html5-context-menu li:hover a{
background-color:rgba(255,255,255,.1) !important
}
[pl-ver^="mv2"] .html5-context-menu li{
border:none
}
[pl-ver^="mv2"] .html5-context-menu-loop-switch.checked::after {
content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxMDAlIj48cGF0aCBkPSJNOSAxNi4yTDQuOCAxMmwtMS40IDEuNEw5IDE5IDIxIDdsLTEuNC0xLjRMOSAxNi4yeiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=);
position: absolute;
margin-left: 10px;
font-weight: bold;
opacity:1;
height:20px;
width:14px;
right:15px;
}
[data-player-size="fullscreen"][pl-ver^="mv2"] .html5-context-menu-loop-switch.checked::after {
height:20px;
width:21px;
right:22px;
}



html[data-player-size="fullscreen"][pl-ver^="m"] .html5-info-bar {
background: none;
overflow: visible;
}
html[data-player-size="fullscreen"][pl-ver^="m"] .html5-info-bar::after {
content: "";
height: 69px;
padding-bottom: 77px;
position: absolute;
width: 100%;
top: 0;
left: 0;
z-index: -1;
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAEmCAYAAACjy/qzAAAAhklEQVQ4y52RUQ6AMAxCKd7/JJ7R6aeJAdr507TjQZqOAE4CWARwx7JE944rch/k6qOWS7bq5bh72zGF8+LTa6goJeRPgXDYNxWFfkS0QXCInLIN1GxTXA0dtS0otWJnuXJR1Y9WYP9GF1UCYRQYHRSlXMARbVO4th3sd7Y3OP5dY3Bn+SkPsGJ1+HGGVtcAAAAASUVORK5CYII=);
}
html[data-player-size="fullscreen"][pl-ver^="m"] .html5-title {
padding-left: 18px;
padding-top: 21px;
}
html[data-player-size="fullscreen"][pl-ver^="m"] .html5-title a {
font-size: 27.71px !important;
color: #fff !important;
}
[pl-ver^="m"] .ytp-action-buttons {
margin-top: -10px;
position: absolute;
right: 12px;
}

[pl-ver^="m"] .annotation.iv-branding {
top: unset;
bottom: 12px;
right: 12px;
}
html[data-player-size="fullscreen"][pl-ver^="m"] .annotation.iv-branding {
top: unset;
bottom: 32px;
right: 24px;
}
[pl-ver^="m"] .v3 #page .startube-player-svg svg {
display: block !important;
}



[logged-in="false"] #guide-subscriptions-container:not(.st-guide-2) .startube-guide-expand-button{
display:none
}
.startube-guide-expand-button{
width:100%;
text-align:left;
padding-left:26px
}
.guide-flyout-container{
display:none
}
.exp-top-guide .guide-channels-list{
overflow:visible!important;
max-height:none
}
.guide-section:last-of-type{
padding-bottom:80px
}
.guide-view-more:not(:hover){
color:#767676
}
#guide .guide-quick-filter-container{
display:none
}
#yt-masthead-signin{
  order:3;
  margin-left:10px;
  margin-right:10px
}


#startube-fullscreen{
  display:block!important;
  visibility:visible!important
}
.html5-video-container{
  display:none
}
        </style>
        `;
            conta.append(nE);
        }
    }
    function doChannel(){
        setTimeout(function(){
            if($("#channel-search")){
                $("#channel-search").classList.add("expanded");
            }
            /*if($(".qualified-channel-title-text")){
                let name=$(".qualified-channel-title-text").textContent;
                $("#appbar-nav .epic-nav-item-heading").textContent=name;
                $(".appbar-nav-menu > li:last-child").textContent=name;
                $(".appbar-nav-menu > li:last-child").classList.add("vis");
            }*/
        },10);
    }
    function doWatch(){
        if($("#pt-view-count")==null&&$(".watch-view-count")){
            let vC=$(".watch-view-count").textContent;
            if(!vC.includes("v")&&!vC.includes("w")){
                vC=vC+" views";
            }
            let conta=$("#watch-uploader-info strong");
            let nE=document.createElement("span");
            nE.id="pt-view-count";
            nE.classList="run run-text";
            nE.innerHTML=vC;
            conta.append(nE);
        }
        if($("#pt-comments")==null&&$("#watch-discussion")){
            let conta=$("#watch7-main #watch7-content");
            let nE=document.createElement("div");
            nE.id="pt-comments";
            nE.setAttribute("position","above-related");
            nE.innerHTML=`
            <button id="pt-comment-trigger" class="flex-bar">
                <span>View comments</span>
            </button>
            <div id="pt-watch-tabs">
                <div id="pt-watch-tabs-inner" class="flex-bar">
                    <button id="pt-related-tab" class="flex-bar pt-tab">
                        <span>Related videos</span>
                    </button>
                    <button id="pt-comment-tab" class="flex-bar pt-tab">
                        <span>Comments</span>
                    </button>
                </div>
            </div>
            <div id="pt-comment-fence" class="pt-fence">
            </div>
            <div id="pt-comment-panel">
                <div id="pt-comment-panel-title" class="flex-bar">
                    <span class="pt-title-text">Comments</span>
                    <button class="pt-close-button flex-bar">
                        <span>Close</span>
                    </button>
                </div>
                <div id="pt-comment-panel-scroller">
                </div>
            </div>
            `;
            conta.insertBefore(nE,conta.children[1]);
            let tM=$("#watch-discussion");
            let nH=$("#pt-comment-panel-scroller");
            nH.append(tM);
            $("#pt-comment-trigger").addEventListener("click",function(){
                $("body .v3").setAttribute("comments-open","");
            });
            $("#pt-comment-tab").addEventListener("click",function(){
                $("body .v3").setAttribute("comments-open","");
                window.scrollTo(0,500);
            });
            $("#pt-related-tab").addEventListener("click",function(){
                $("body .v3").removeAttribute("comments-open");
                window.scrollTo(0,500);
            });
            $("#pt-comment-panel-title").addEventListener("click",function(){
                $("body .v3").removeAttribute("comments-open");
            });
            $("#pt-comment-panel-title").addEventListener("touchmove",function(){
                $("body .v3").removeAttribute("comments-open");
            });
            $("#pt-comment-fence").addEventListener("touchmove",function(){
                if($("[commentPos='panel']")){
                    $("body .v3").removeAttribute("comments-open");
                }
            });
            $("#pt-comment-fence").addEventListener("click",function(){
                if($("[commentPos='panel']")){
                    $("body .v3").removeAttribute("comments-open");
                }
            });
            $("#masthead-positioner").addEventListener("click",function(){
                if($("[commentPos='panel']")){
                    $("body .v3").removeAttribute("comments-open");
                }
            });
            $("#masthead-positioner").addEventListener("touchmove",function(){
                if($("[commentPos='panel']")){
                    $("body .v3").removeAttribute("comments-open");
                }
            });
            setTimeout(function(){
                if($("#watch-discussion .yt-spinner-message").textContent.includes("unav")){
                    $("#pt-comment-trigger span").textContent="Comments are turned off.";
                    $("#pt-comment-trigger").setAttribute("disabled","");
                    $("#pt-comment-tab span").textContent="Comments (disabled)";
                    $("#pt-comment-tab").setAttribute("disabled","");
                }else{
                    var elm=".distiller_yt_headline";
                    waitForElement(elm,100).then(function(elm){
                        if(canGo!=false){
                            let commentCount=0;
                            if($(".distiller_yt_headline .run:last-child").textContent.split("(")[1]){
                                commentCount=$(".distiller_yt_headline .run:last-child").textContent.split("(")[1].split(")")[0];
                            }
                            $("#pt-comment-trigger span").textContent="View "+commentCount+" comments";
                            $("#pt-comment-tab span").textContent="Comments ("+commentCount+")";
                        }
                    });
                }
            },100);
        }
        if($("#watch7-content #watch7-sidebar")==null&&$("#watch7-sidebar")){
            let tM=$("#watch7-sidebar");
            let nH=$("#watch7-main #watch7-content");
            nH.insertBefore(tM,nH.children[2]);
        }
        var elm="#movie_player video";
        waitForElement(elm,1500).then(function(elm){
            if(canGo!=false){
                if($("#movie_player .html5-video-container video")){
                    if($("[ios-styling]")==null){
                        $("html").setAttribute("pl-ver","mv2-3");
                        doModernPlayer();
                    }else{
                        $("video").setAttribute("webkit-playsinline","true");
                        $("video").setAttribute("playsinline","true");
                        $("video").setAttribute("controls","true");
                        let nH=$("#player-api_VORAPI_ELEMENT_ID");
                        let tM=$("video");
                        nH.append(tM);
                    }
                    let width=$("#movie_player video").offsetWidth;
                    let height=$("#movie_player video").offsetHeight;
                    if(width==height){
                        $("#page > #player").setAttribute("aspect-ratio","1:1");
                    }
                }
            }
        });
    }
    function createSettings(){
        if($("#pt-settings")==null&&$("body .v3")){
            let conta=$("body .v3");
            let nE=document.createElement("div");
            nE.id="pt-settings";
            nE.innerHTML=`
            <div id="pt-settings-fence" class="pt-fence">
            </div>
            <div id="pt-settings-window">
                <div id="pt-settings-topbar" class="flex-bar">
                    <span class="pt-title-text">PeakyTube Settings</span>
                    <button class="pt-close-button flex-bar">
                        <span>Close</span>
                    </button>
                </div>
                <div id="pt-settings-content">
                    <div class="pt-setting">
                        <div class="pt-setting-title flex-bar">
                            <div class="pt-setting-text">
                                <span>Comment section location</span>
                            </div>
                        </div>
                        <div class="pt-setting-content">
                            <div class="pt-option flex-bar" c="tab" s="commentPos" value="false">
                                <span>Tab</span>
                                <span class="pt-option-extra">Default</span>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="341.06px" height="331.064px" viewBox="-0.213 -0.191 341.06 331.064" enable-background="new -0.213 -0.191 341.06 331.064" xml:space="preserve">
<g transform="translate(-67.841 -348.02)">
	<path fill="#2688eb" stroke="#2A4B8D" d="M68.155,540.938c0,0,21.195-33.643,45.134-43.77   c6.482,6.396,43.228,102.991,49.71,101.919c7.292-1.065,55.327-89.095,159.202-250.581c0,0,30.063,17.952,85.376,21.698   c-144.63,149.23-219.442,294.692-225.999,301.725c-18.637,11.724-28.188,4.94-34.67-0.389   c-15.396-18.119-77.944-126.343-78.753-130.606L68.155,540.938z"/>
</g>
</svg>
                            </div>
                            <div class="pt-option flex-bar" c="panel" s="commentPos" value="false">
                                <span>Panel</span>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="341.06px" height="331.064px" viewBox="-0.213 -0.191 341.06 331.064" enable-background="new -0.213 -0.191 341.06 331.064" xml:space="preserve">
<g transform="translate(-67.841 -348.02)">
	<path fill="#2688eb" stroke="#2A4B8D" d="M68.155,540.938c0,0,21.195-33.643,45.134-43.77   c6.482,6.396,43.228,102.991,49.71,101.919c7.292-1.065,55.327-89.095,159.202-250.581c0,0,30.063,17.952,85.376,21.698   c-144.63,149.23-219.442,294.692-225.999,301.725c-18.637,11.724-28.188,4.94-34.67-0.389   c-15.396-18.119-77.944-126.343-78.753-130.606L68.155,540.938z"/>
</g>
</svg>
                            </div>
                        </div>
                        <div class="pt-setting-desc flex-bar">
                            <span class="pt-option-text">Choose whether the comment section is located in a tab, or in a panel that you access by tapping a button.</span>
                        </div>
                    </div>
                    <div class="pt-setting" id="commentBtnPos">
                        <div class="pt-setting-title flex-bar">
                            <div class="pt-setting-text">
                                <span>Comment button position</span>
                            </div>
                        </div>
                        <div class="pt-setting-content">
                            <div class="pt-option flex-bar" c="aboveRelated" s="commentBtnPos" value="false">
                                <span>Above related videos</span>
                                <span class="pt-option-extra">Default</span>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="341.06px" height="331.064px" viewBox="-0.213 -0.191 341.06 331.064" enable-background="new -0.213 -0.191 341.06 331.064" xml:space="preserve">
<g transform="translate(-67.841 -348.02)">
	<path fill="#2688eb" stroke="#2A4B8D" d="M68.155,540.938c0,0,21.195-33.643,45.134-43.77   c6.482,6.396,43.228,102.991,49.71,101.919c7.292-1.065,55.327-89.095,159.202-250.581c0,0,30.063,17.952,85.376,21.698   c-144.63,149.23-219.442,294.692-225.999,301.725c-18.637,11.724-28.188,4.94-34.67-0.389   c-15.396-18.119-77.944-126.343-78.753-130.606L68.155,540.938z"/>
</g>
</svg>
                            </div>
                            <div class="pt-option flex-bar" c="belowRelated" s="commentBtnPos" value="false">
                                <span>Below related videos</span>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="341.06px" height="331.064px" viewBox="-0.213 -0.191 341.06 331.064" enable-background="new -0.213 -0.191 341.06 331.064" xml:space="preserve">
<g transform="translate(-67.841 -348.02)">
	<path fill="#2688eb" stroke="#2A4B8D" d="M68.155,540.938c0,0,21.195-33.643,45.134-43.77   c6.482,6.396,43.228,102.991,49.71,101.919c7.292-1.065,55.327-89.095,159.202-250.581c0,0,30.063,17.952,85.376,21.698   c-144.63,149.23-219.442,294.692-225.999,301.725c-18.637,11.724-28.188,4.94-34.67-0.389   c-15.396-18.119-77.944-126.343-78.753-130.606L68.155,540.938z"/>
</g>
</svg>
                            </div>
                            <div class="pt-option flex-bar" c="fixedBottom" s="commentBtnPos" value="false">
                                <span>Fixed to bottom of the screen</span>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="341.06px" height="331.064px" viewBox="-0.213 -0.191 341.06 331.064" enable-background="new -0.213 -0.191 341.06 331.064" xml:space="preserve">
<g transform="translate(-67.841 -348.02)">
	<path fill="#2688eb" stroke="#2A4B8D" d="M68.155,540.938c0,0,21.195-33.643,45.134-43.77   c6.482,6.396,43.228,102.991,49.71,101.919c7.292-1.065,55.327-89.095,159.202-250.581c0,0,30.063,17.952,85.376,21.698   c-144.63,149.23-219.442,294.692-225.999,301.725c-18.637,11.724-28.188,4.94-34.67-0.389   c-15.396-18.119-77.944-126.343-78.753-130.606L68.155,540.938z"/>
</g>
</svg>
                            </div>
                        </div>
                        <div class="pt-setting-desc flex-bar">
                            <span class="pt-option-text">Choose where the button to view a video's comments appears on the page.</span>
                        </div>
                    </div>
                    <div class="pt-setting">
                        <div class="pt-setting-title flex-bar">
                            <div class="pt-setting-text">
                                <span>Logo and colors</span>
                            </div>
                        </div>
                        <div class="pt-setting-content">
                            <div class="pt-option flex-bar" c="normal" s="logo" value="false">
                                <span>2015 (Darker reds)</span>
                                <span class="pt-option-extra">Default</span>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="341.06px" height="331.064px" viewBox="-0.213 -0.191 341.06 331.064" enable-background="new -0.213 -0.191 341.06 331.064" xml:space="preserve">
<g transform="translate(-67.841 -348.02)">
	<path fill="#2688eb" stroke="#2A4B8D" d="M68.155,540.938c0,0,21.195-33.643,45.134-43.77   c6.482,6.396,43.228,102.991,49.71,101.919c7.292-1.065,55.327-89.095,159.202-250.581c0,0,30.063,17.952,85.376,21.698   c-144.63,149.23-219.442,294.692-225.999,301.725c-18.637,11.724-28.188,4.94-34.67-0.389   c-15.396-18.119-77.944-126.343-78.753-130.606L68.155,540.938z"/>
</g>
</svg>
                            </div>
                            <div class="pt-option flex-bar" c="ringo" s="logo" value="false">
                                <span>2017 (Brighter reds)</span>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="341.06px" height="331.064px" viewBox="-0.213 -0.191 341.06 331.064" enable-background="new -0.213 -0.191 341.06 331.064" xml:space="preserve">
<g transform="translate(-67.841 -348.02)">
	<path fill="#2688eb" stroke="#2A4B8D" d="M68.155,540.938c0,0,21.195-33.643,45.134-43.77   c6.482,6.396,43.228,102.991,49.71,101.919c7.292-1.065,55.327-89.095,159.202-250.581c0,0,30.063,17.952,85.376,21.698   c-144.63,149.23-219.442,294.692-225.999,301.725c-18.637,11.724-28.188,4.94-34.67-0.389   c-15.396-18.119-77.944-126.343-78.753-130.606L68.155,540.938z"/>
</g>
</svg>
                            </div>
                            <div class="pt-option flex-bar" c="ringo2" s="logo" value="false">
                                <span>2024 (Pinkish reds)</span>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="341.06px" height="331.064px" viewBox="-0.213 -0.191 341.06 331.064" enable-background="new -0.213 -0.191 341.06 331.064" xml:space="preserve">
<g transform="translate(-67.841 -348.02)">
	<path fill="#2688eb" stroke="#2A4B8D" d="M68.155,540.938c0,0,21.195-33.643,45.134-43.77   c6.482,6.396,43.228,102.991,49.71,101.919c7.292-1.065,55.327-89.095,159.202-250.581c0,0,30.063,17.952,85.376,21.698   c-144.63,149.23-219.442,294.692-225.999,301.725c-18.637,11.724-28.188,4.94-34.67-0.389   c-15.396-18.119-77.944-126.343-78.753-130.606L68.155,540.938z"/>
</g>
</svg>
                            </div>
                        </div>
                        <div class="pt-setting-desc flex-bar">
                            <span class="pt-option-text"></span>
                        </div>
                    </div>
                    <div class="pt-setting">
                        <div class="pt-setting-title flex-bar">
                            <div class="pt-setting-text">
                                <span>Search icon</span>
                            </div>
                        </div>
                        <div class="pt-setting-content">
                            <div class="pt-option flex-bar" c="old" s="searchIcon" value="false">
                                <span>Classic</span>
                                <span class="pt-option-extra">Default</span>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="341.06px" height="331.064px" viewBox="-0.213 -0.191 341.06 331.064" enable-background="new -0.213 -0.191 341.06 331.064" xml:space="preserve">
<g transform="translate(-67.841 -348.02)">
	<path fill="#2688eb" stroke="#2A4B8D" d="M68.155,540.938c0,0,21.195-33.643,45.134-43.77   c6.482,6.396,43.228,102.991,49.71,101.919c7.292-1.065,55.327-89.095,159.202-250.581c0,0,30.063,17.952,85.376,21.698   c-144.63,149.23-219.442,294.692-225.999,301.725c-18.637,11.724-28.188,4.94-34.67-0.389   c-15.396-18.119-77.944-126.343-78.753-130.606L68.155,540.938z"/>
</g>
</svg>
                            </div>
                            <div class="pt-option flex-bar" c="new" s="searchIcon" value="false">
                                <span>Modern</span>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="341.06px" height="331.064px" viewBox="-0.213 -0.191 341.06 331.064" enable-background="new -0.213 -0.191 341.06 331.064" xml:space="preserve">
<g transform="translate(-67.841 -348.02)">
	<path fill="#2688eb" stroke="#2A4B8D" d="M68.155,540.938c0,0,21.195-33.643,45.134-43.77   c6.482,6.396,43.228,102.991,49.71,101.919c7.292-1.065,55.327-89.095,159.202-250.581c0,0,30.063,17.952,85.376,21.698   c-144.63,149.23-219.442,294.692-225.999,301.725c-18.637,11.724-28.188,4.94-34.67-0.389   c-15.396-18.119-77.944-126.343-78.753-130.606L68.155,540.938z"/>
</g>
</svg>
                            </div>
                        </div>
                        <div class="pt-setting-desc flex-bar">
                            <span class="pt-option-text"></span>
                        </div>
                    </div>
                    <div class="pt-setting">
                        <div class="pt-setting-content">
                            <div class="pt-option flex-bar" id="reset-pt-settings">
                                <span class="pt-red-text">Reset PeakyTube Settings</span>
                            </div>
                        </div>
                        <div class="pt-setting-desc flex-bar">
                            <span class="pt-option-text">Resetting PeakyTube's settings will cause the page to refresh.</span>
                        </div>
                    </div>
                    <div class="pt-setting pt-buildinfo">
                        <div class="pt-setting-desc flex-bar">
                            <span class="pt-option-text">PeakyTube Build ${build}</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
            conta.append(nE);
            $("#pt-settings-fence").addEventListener("click",function(){
                $("body .v3").removeAttribute("settings-open","");
            });
            $("#pt-settings-topbar").addEventListener("click",function(){
                $("body .v3").removeAttribute("settings-open","");
            });
            $("#pt-settings-topbar").addEventListener("touchmove",function(){
                $("body .v3").removeAttribute("settings-open");
            });
            $("#pt-settings-fence").addEventListener("touchmove",function(){
                $("body .v3").removeAttribute("settings-open");
            });
            $("#pt-settings-fence").addEventListener("click",function(){
                $("body .v3").removeAttribute("settings-open");
            });
            $("#reset-pt-settings").addEventListener("click",function(){
                localStorage.removeItem("PT_SETTINGS");
                window.location.reload();
            });
            document.querySelectorAll(".pt-option:not(#reset-pt-settings)").forEach(i=>{
                let s=i.getAttribute("s");
                let c=i.getAttribute("c");
                if(PT_SETTINGS[s].tValue==c){
                    i.setAttribute("value","true");
                }
                i.addEventListener("click",function(){
                    $(".pt-option[s='"+s+"'][value='true']").setAttribute("value","false");
                    i.setAttribute("value","true");
                    PT_SETTINGS[s].tValue=c;
                    PT_SETTINGS[s].visValue=c;
                    $("body .v3").setAttribute(s,c);
                    applySettings();
                });
            });
        }
    }
    function createAppbarMenu(){
        if($(".appbar-nav-menu")&&$("#pt-appbar-menu")==null){
            let conta=$("#appbar-content");
            let nE=document.createElement("div");
            nE.id="pt-appbar-menu";
            nE.innerHTML=`
            <div id="pt-appbar-fence" class="pt-fence"></div>
            <div id="pt-appbar-menu-inner">
                <div id="pt-appbar-items">
                </div>
            </div>
            `;
            conta.append(nE);
            let title="";
            if($(".appbar-nav-menu h2")){
                title=$(".appbar-nav-menu h2").textContent;
            }
            document.querySelectorAll(".appbar-nav-menu li:not(.tab-group)").forEach(i=>{
                let nH=$("#pt-appbar-items");
                nH.append(i);
                i.addEventListener("click",function(){
                    $("body .v3").removeAttribute("appbar-menu-open");
                });
            });
            conta=$(".appbar-nav-menu");
            nE=document.createElement("li");
            nE.id="pt-appbar-title";
            nE.innerHTML=`
            <button>
                <h2 class="epic-nav-item-heading"></h2>
            </button>
            `;
            conta.append(nE);
            if($("[location='trending']")){
                title="Trending "+title
            }
            if($("[location='watch']")){
                $("#pt-appbar-items h2").textContent="This video";
                let name=$("#watch7-user-header").data.watch7UserHeader.userName.title.simpleText;
                let vidCount=$("#watch7-user-header").data.watch7UserHeader.initialUserVideoCount;
                let pfp=$("#watch7-user-header").data.watch7UserHeader.userPhoto.thumbnails.thumbnails[0].url;
                let navEnd=$("#watch7-user-header").data.watch7UserHeader.originalNavigationEndpoint;
                let url=navEnd.browseEndpoint.canonicalBaseUrl;
                let videosUrl=url+"/videos";
                let videosNav=$("#watch7-user-header").data.watch7UserHeader.userVideoCount.continuationItemRenderer.placeholder.watchUserVideoCount.navigationEndpoint;
                conta=$("#pt-appbar-items");
                nE=document.createElement("li");
                nE.id="pt-appbar-channel";
                nE.innerHTML=`
                <a class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-epic-nav-item"><span class="yt-uix-button-content"><span class="run"></span></span></a>
                `;
                conta.append(nE);
                nE.addEventListener("click",function(){
                    $("body .v3").removeAttribute("appbar-menu-open");
                });
                conta=$("#pt-appbar-items");
                nE=document.createElement("li");
                nE.id="pt-appbar-videos";
                nE.innerHTML=`
                <a class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-epic-nav-item"><span class="yt-uix-button-content"><span class="run"></span></span></a>
                `;
                conta.append(nE);
                nE.addEventListener("click",function(){
                    $("body .v3").removeAttribute("appbar-menu-open");
                });
                $("#pt-appbar-channel .run").textContent=name+"'s channel";
                $("#pt-appbar-channel a").href=url;
                $("#pt-appbar-channel a").data={
                    abstractVorElement:{
                        navigationEndpoint:navEnd
                    }
                }
                $("#pt-appbar-videos .run").textContent=vidCount;
                $("#pt-appbar-videos a").href=videosUrl;
                $("#pt-appbar-videos a").data={
                    abstractVorElement:{
                        navigationEndpoint:videosNav
                    }
                }
                vidCount=vidCount.split(" v")[0];
                $("#pt-appbar-videos .run").textContent=name+"'s videos ("+vidCount+")";
            }
            if($("[location='channel']")){
                if($(".qualified-channel-title-text")){
                    let name=$(".qualified-channel-title-text").textContent;
                    if(window.location.href.includes("/about")){
                        title=title+" "+name;
                    }else if(window.location.href.includes("/feed")||window.location.href.includes("/videos")||window.location.href.includes("/playlists")||window.location.href.includes("/community")){
                        title=name+"'s "+title;
                    }else{
                        title=name;
                    }
                }
            }
            $("#pt-appbar-title h2").textContent=title;
            $("#pt-appbar-title").addEventListener("click",function(){
                $("body .v3").setAttribute("appbar-menu-open","");
            });
            $("#pt-appbar-fence").addEventListener("click",function(){
                $("body .v3").removeAttribute("appbar-menu-open");
            });
            $("#pt-appbar-fence").addEventListener("touchmove",function(){
                $("body .v3").removeAttribute("appbar-menu-open");
            });
        }
    }
    function everyLoad(x){
        var elm = "body .v3";
        waitForElement(elm,1).then(function(elm){
            if(canGo != false){
                createSettings();
                insertCSS();
                if(window.location.href.includes("/watch")||window.location.href.includes("/shorts")){
                    setTimeout(doWatch,10);
                    $("body .v3").setAttribute("location","watch");
                }else if(window.location.href.includes(".com/c")||window.location.href.includes(".com/u")||window.location.href.includes(".com/@")){
                    doChannel();
                    $("body .v3").setAttribute("location","channel");
                }else if(window.location.href.includes("/trending")){
                    $("body .v3").setAttribute("location","trending");
                }else{
                    $("body .v3").setAttribute("location","other");
                }
                if($(".st-modded")==null){
                    doScrollableGuide();
                }
                createSearchText();
                createDeviceScale();
                createUploadButton();
                createAppbarMenu();
                setTimeout(function(){
                    if(x==="x"){
                        $("body .v3").removeAttribute("settings-open");
                        $("body .v3").removeAttribute("comments-open");
                        $("body .v3").removeAttribute("appbar-menu-open");
                    }
                },10);
            }
        });
    }
    document.addEventListener("V3_NAVITRONIC_FINISHED",function(e){
        everyLoad("x");
    });
    document.addEventListener("V3_SERVERCONTRACT_FLUSH_DOCEL_ATTRIB", function(e){
        everyLoad();
    });
    setTimeout(everyLoad,1000);
    setTimeout(everyLoad,2000);
    setTimeout(everyLoad,4000);
    setTimeout(everyLoad,5000);
    setTimeout(everyLoad,7000);
    setTimeout(everyLoad,10000);
})();