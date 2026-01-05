// ==UserScript==
// @name         Coral Isle Invitation Dialog Extension
// @namespace    http://blank.org/
// @version      1.3.3
// @description  Erweitert den Einladen Dialog von Coral Isle um "Zeige Profil"
// @author       k5x
// @match        https://apps.facebook.com/coral-isle/*
// @match        https://apps.facebook.com/coral-isle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/28031/Coral%20Isle%20Invitation%20Dialog%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/28031/Coral%20Isle%20Invitation%20Dialog%20Extension.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var name = "Coral Isle Invitation Dialog Extension";
	var version="1.3.2";
	
	console.log("script start: Coral Isle Invitation Dialog Extension");

	var idPrefix=Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
	var canConnect=false;
	var CurrentUser = {};
	var DisplayedUser ={};
	var Settings = {};
	
	var lastId=0;
	function nextId(){lastId++;return idPrefix+"_"+lastId;}
	
	function escapeMatch(s) {return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');}
	
	function getProfileUrlPart(href) {	
		var n=null;
		if(href.contains("profile.php")) n = href.match(/(facebook\.com\/)(profile\.php\?id=\d+)&?/)[2];
		else n=href.match(/(facebook\.com\/)([^?]*)/)[2];
//		console.log(n);
		return n;
	}
	
	function urlMatch(url,matches){
		for(var i=0;i<matches.length;i++){
			var match=matches[i];
			var pattern=escapeMatch(match.replace(/\*/g,'~STAR~'));
			pattern="^"+pattern.replace(/~STAR~/g,'.*?')+"$";
			var regexp=new RegExp(pattern,'i');
			if(regexp.test(url)) return true;
		}
		return false;
	}
		
	function getIdFromDataHovercard(elmt){
		var data=elmt.getAttribute('data-hovercard');
		if(data===null) {
			return null;
		}
		var id=data.match(/(id=)(\d+)/)[2];
		return id;
	}
	
	CurrentUser = {
		_name:"CurrentUser",
		id:null,
		link:null,
		profileName:null,
		displayName:null,
		fullName:null,
		token:null,
		
		updateFromTimelineProfile:function(){
			var me=CurrentUser;
			var $span=$("#fb-timeline-cover-name");
			var a=$span[0].parentElement;
			
			me.link        = $(a).attr("href");
			me.fullName    = $span.text();
			me.profileName = getProfileUrlPart(me.link);
		},
		
		updateFromBlueBar:function(){
			var me=CurrentUser;
			var selector1="a[data-testid='blue_bar_profile_link']";
			var selector2="a._2s25";
			var selector=null;
			var elmt= $(selector1)[0];
			if(elmt!==undefined) selector=selector1;
			else selector=selector2;
			
			me.link        = $(selector).attr("href");
			me.id          = $(selector+" img").attr("id").match(/\d+$/)[0];
			me.displayName = $(selector).text();
			me.profileName = getProfileUrlPart(me.link);
		},
		
		init:function() {
			var me=CurrentUser;
			me.updateFromBlueBar();
		}
	};
	
	var CiInvitationDialog={
		_name:"CiInvitationDialog",
		dialogFound:false,
		neighborId:null,
		neighborName:null,
		senderName:null,
		senderId:null,
		canConnect:true,
		
		openProfile:function() {
			console.log("openProfile");
			var me=CiInvitationDialog;
			
			window.open("https://www.facebook.com/profile.php?id="+me.neighborId,"_blank");
			document.getElementById("platformDialogForm").elements["__CANCEL__"][0].click();
		},
		
		tick: function () {
			var me=CiInvitationDialog;
			var form=document.getElementById("platformDialogForm");
			
			if(form!==null && me.dialogFound===false) {
				me.dialogFound=true;
				var elements=form.getElementsByClassName("uiTokenText");
				var span=elements[0];
				var td=span.parentElement.parentElement.parentElement;

				$(form).append(`<div style="margin:4px">Diese Seite wurde erweitert mit <a href="#" target="_blank">Coral Isle Invitation Dialog Extension</a><div>`);
				
				$(".uiOverlayFooter").append(`<button type="button" id="openProfile" class="_42ft _4jy0 layerConfirm _1flv _51_n autofocus uiOverlayButton _4jy3 _4jy1 selected _51sy" style="position: absolute;left: 95px; background:green">Zeige Profil</button>`);
				$("#openProfile")[0].addEventListener('click',me.openProfile, false);
				me.neighborId=form.elements.to.value;
				setTimeout(me.tick,1000);
				return;
			}
			
			if(form===null && me.dialogFound===true) {
				me.dialogFound=false;
			}
			setTimeout(me.tick,1000);
		},
		
		onPageLoad:function(isAjax){
			console.log("CiInvitationDialog.onPageLoad(isAjax:"+isAjax+")");
			var me=CiInvitationDialog;
			if(!isAjax) {
				setTimeout(me.tick,3000);
			}
		}
	};
	
	console.log("location:", document.location.href);
	
	function onPageLoad(isAjax) {
		if(urlMatch(document.location.href,["https://apps.facebook.com/coral-isle/*","https://apps.facebook.com/coral-isle"])){
			CiInvitationDialog.onPageLoad(isAjax);
		}
	}
	
	var PageMonitor = {
		_name:"PageMonitor",
		count:0,
		onPageLoad:function(){},
		
		poll: function (me) {
			var href=document.location.href;
			if(!$("body").hasClass("PageMonitor")){
				$("body").addClass("PageMonitor");
				me.count++;
				console.log("Page load detected",href);
				setTimeout(function(){me.onPageLoad(me.count>1);},500);
			}
		},
		
		init: function(onPageLoad){
			var me=PageMonitor;
			me.onPageLoad=onPageLoad;
			setInterval(function(){me.poll(me);},100);
		}
	};
	
	function waitUserLoaded(){
		var elmt= $("a[data-testid='blue_bar_profile_link']")[0];
		if(elmt===undefined) elmt= $("a._2s25")[0];
		if(elmt===undefined) {
			setTimeout(waitUserLoaded,100);
			return;
		}
		CurrentUser.init();
		PageMonitor.init(onPageLoad);
	}
	
	waitUserLoaded();
	console.log("script initialized.");
	
})();