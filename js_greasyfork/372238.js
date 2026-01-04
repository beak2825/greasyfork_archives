// ==UserScript==
// @name        atWARned
// @name:fr     atWARned
// @namespace   atwarned
// @description Improve atWar's webgame display
// @description:fr	Améliore l'affichage du jeu web atWar
// @author		oliezekat
// @include     https://atwar-game.com/*
// @include     https://*.atwar-game.com/*
// @version     1
// @grant		GM_addStyle
// @grant		GM_log
// @downloadURL https://update.greasyfork.org/scripts/372238/atWARned.user.js
// @updateURL https://update.greasyfork.org/scripts/372238/atWARned.meta.js
// ==/UserScript==

// Unique object
if (!atWARned) var atWARned = {};

atWARned =
	{
	/* Requires modules */
	Log:			 {},
	Renders:		 {}
	};
atWARned.Init = function()
	{
	/* Init Log */
	this.Log.Init(this);
	this.Log._Enabled = false;
	this.Log.Add('Start...');

	this.Renders.Init(this);
	
	// Common features
	this.Renders.Set_NoVisualEffects_Styles();
		
	this.Log.Add('End.');
	};
atWARned.Log =
	{
	_Parent: null,
	_Enabled: false
	};
atWARned.Log.Init = function(parent)
	{
	this._Parent = parent;
	};
atWARned.Log.Add = function(msg)
	{
	if (this._Enabled == true)
		{
		GM_log(msg);
		}
	};
atWARned.Renders =
	{
	_Parent:			 null
	};
atWARned.Renders.Init = function(parent)
	{
	this._Parent = parent;
	};
atWARned.Renders.Set_NoVisualEffects_Styles = function()
	{
	var default_style = '\
	* {\
		border-radius:none !important;\
		border-bottom-left-radius: 0 !important;\
		border-bottom-right-radius: 0 !important;\
		border-top-left-radius: 0 !important;\
		border-top-right-radius: 0 !important;\
		box-shadow: none !important;\
		text-shadow: none !important;\
		transform: none !important;\
		transition: none !important;\
		}\
	.bottom-toolbar-chat #chat_expanded,\
	.bottom-toolbar-chat #chat_settings {\
		background-image:none !important;\
		background-color:rgba(0,0,0,0.4);\
		}\
	.game-modal .modal-dialog .modal-content {\
		background-color:#000 !important;\
		}\
	.game-modal .striped > div:nth-child(2n+1),\
	.game-modal .table-striped > tbody > tr:nth-child(2n+1) > td,\
	.game-modal .table-striped > tbody > tr:nth-child(2n+1) > th {\
		}\
	#chatbox_website {\
		background-image:none !important;\
		background-color:#111;\
		}\
	#chatbox_website #chat_players,\
	#chatbox_website #chat_players_pills {\
		background:none !important;\
		}\
	';
	GM_addStyle(default_style);
	};

atWARned.Init();