// coding: utf-8
// ==UserScript==
// @name        SmarTwitter
// @name:fr        SmarTwitter
// @description	Simple, Fast, So Smart !
// @description:fr	Simple, Rapide, et Smart !
// @namespace   smartwitter
// @author		oliezekat
// @icon		https://greasyfork.org/system/screenshots/screenshots/000/007/119/original/large_1_.png?1493672792 
// @include     http://twitter.com/*
// @include     https://twitter.com/*
// @exclude		http://twitter.com/i/cards/*
// @exclude		https://twitter.com/i/cards/*
// @version     11
// @grant		GM_addStyle
// @grant		GM_log
// @grant		GM.addStyle
// @grant		GM.log
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/29399/SmarTwitter.user.js
// @updateURL https://update.greasyfork.org/scripts/29399/SmarTwitter.meta.js
// ==/UserScript==


// Unique object
if (!SmarTwitter) var SmarTwitter = {};

SmarTwitter =
	{
	/* Requires modules */
	Log:			 {},
	DOM:			 {},
	Twitter:		 {},
	Renders:		 {},
	
	_LastTemplateType: 'unknown'
	};
SmarTwitter.Init = function()
	{
	/* Init Log */
	this.Log.Init(this);
	this.Log._Enabled = true;
	this.Log.Add('Start...');

	this.DOM.Init(this);
	this.Twitter.Init(this);
	this.Renders.Init(this);
	
	// Common features
	this.Renders.Set_Common_Styles();
	this.Renders.Set_NoVisualEffects_Styles();
	
	this._LastTemplateType = this.Twitter.Get_TemplateType();
		
	this.Log.Add('End.');
	};

SmarTwitter.Log =
	{
	_Parent: null,
	_Enabled: false
	};
SmarTwitter.Log.Init = function(parent)
	{
	this._Parent = parent;
	};
SmarTwitter.Log.Add = function(msg)
	{
	if (this._Enabled == true)
		{
		GM.log(msg);
		}
	};

SmarTwitter.DOM =
	{
	_Parent: null
	};
SmarTwitter.DOM.Init = function(parent)
	{
	this._Parent = parent;
	};

SmarTwitter.Twitter =
	{
	_Parent: null
	};
SmarTwitter.Twitter.Init = function(parent)
	{
	this._Parent = parent;
	};
SmarTwitter.Twitter.Get_TemplateType = function()
	{
	var TemplateType = 'unknown';
	var DocumentURL = document.URL;
	var URLparts = DocumentURL.split('/');
	if ((URLparts.length >= 4) && (URLparts[3] != ''))
		{
		// Todo to recognize special pages
		}
	this._Parent.Log.Add('TemplateType: '+TemplateType);
	return TemplateType;
	};

SmarTwitter.Renders =
	{
	_Parent:			 null
	};
SmarTwitter.Renders.Init = function(parent)
	{
	this._Parent = parent;
	};
SmarTwitter.Renders.Set_Common_Styles = function()
	{
	var default_style = '\
	/* Header */\
	.topbar {\
		}\
	.AppContent {\
		}\
	.bird-topbar-etched {\
		cursor: pointer;\
		}\
	.dropdown-caret .caret-outer {\
		border-bottom: 9px solid #000;\
		}\
	.dropdown-caret .caret-inner {\
		border-bottom: 9px solid #000;\
		}\
	.dropdown-menu {\
		}\
	/* Profile popup */\
	.ProfilePopupContainer--bellbird .ProfileHeader .profile-header-inner {\
		background-image: none !important;\
		height: 80px !important;\
		}\
	/* Profile page header */\
	.ProfileCanopy {\
		height: auto !important;\
		}\
	.ProfileCanopy .ProfileCanopy-inner {\
		position: fixed !important;\
		top: auto !important;\
		width: 100%;\
		}\
	.ProfileCanopy .ProfileCanopy-card {\
		padding-top: 0 !important;\
		}\
	.ProfileCanopy-header {\
		display: none;\
		}\
	.ProfileCanopy-headerBg img {\
		display: none;\
		}\
	.ProfileCanopy-avatar {\
		display: none;\
		}\
	.ProfileAvatar-image {\
		display: none;\
		}\
	/* Lists membership dialog */\
	#list-membership-dialog-dialog {\
		left:1% !important;\
		top:2% !important;\
		width:98%;\
		}\
	#list-membership-dialog-body ul li {\
		display: inline-block;\
		overflow: hidden;\
		padding-left: 5px;\
		text-overflow: ellipsis;\
		white-space: nowrap;\
		width: 170px;\
		}\
	.list-membership-container .sm-lock {\
		float: left;\
		margin-left: -12px !important;\
		margin-top: 3px !important;\
		}\
	.list-membership-container .Icon--protected {\
		}\
	/* Lists or Memberships tabs */\
	.Grid-cell {\
	}\
	.ProfileListItem {\
	  padding: 5px 5px 0 15px !important;\
	}\
	.ProfileListItem-avatar {\
	  height: 48px !important;\
	  width: 48px !important;\
	}\
	.ProfileListItem-bio {\
	  height: 14px;\
	  margin-top: 0 !important;\
	  overflow: hidden;\
	  white-space: pre;\
	  text-overflow: ellipsis;\
	}\
	.ProfileListItem-memberCount {\
	  margin-top: 0 !important;\
	}\
	/* Following or Followers tabs */\
	.ProfileCard-bg {\
	  background-image: none !important;\
	  height: 44px !important;\
	}\
	/* Home page */\
	body.enhanced-mini-profile {\
	  background-image: none !important;\
	}\
	.DashboardProfileCard-bg {\
	  background-image: none !important;\
	  height: 40px !important;\
	}\
	.DashboardProfileCard-userFields {\
	  top: 48px !important;\
	}\
	/* DM composer */\
	.DMComposer .tweet-box {\
	  min-height: 64px !important;\
	}\
	';
	GM.addStyle(default_style);
	};
SmarTwitter.Renders.Set_NoVisualEffects_Styles = function()
	{
	var default_style = '\
	* {\
		border-radius:none !important;\
		border-bottom-left-radius: 0 !important;\
		border-bottom-right-radius: 0 !important;\
		border-top-left-radius: 0 !important;\
		border-top-right-radius: 0 !important;\
		box-shadow: none !important;\
		opacity: 1 !important;\
		text-shadow: none !important;\
		transform: none !important;\
		transition: none !important;\
		}\
	.btn {\
		background-image:none;\
		}\
	.image-selector .file-input {\
		opacity: 0 !important;\
		}\
	';
	GM.addStyle(default_style);
	};

SmarTwitter.Init();