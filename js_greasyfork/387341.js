// ==UserScript==
// @name				 Eternity smarTower
// @namespace			 etsmartower
// @description			 Improve Eternity Tower's webgame display
// @description:fr		 Améliore l'affichage du jeu web Eternity Tower
// @author				 oliezekat
// @include				 https://www.eternitytower.net/*
// @version				 2
// @grant				 GM_addStyle
// @grant				 GM_log
// @downloadURL https://update.greasyfork.org/scripts/387341/Eternity%20smarTower.user.js
// @updateURL https://update.greasyfork.org/scripts/387341/Eternity%20smarTower.meta.js
// ==/UserScript==

// Unique object
if (!ETsmarTower) var ETsmarTower = {};

ETsmarTower =
	{
	/* Requires modules */
	Log:			 {},
	Renders:		 {}
	};
ETsmarTower.Init = function()
	{
	/* Init Log */
	this.Log.Init(this);
	this.Log._Enabled = false;
	this.Log.Add('Start...');

	this.Renders.Init(this);
	
	// Common features
	this.Renders.Set_NoVisualEffects_Styles();
	this.Renders.Set_Patches_Styles();
	this.Renders.Set_Compact_Styles();
		
	this.Log.Add('End.');
	};
ETsmarTower.Log =
	{
	_Parent: null,
	_Enabled: false
	};
ETsmarTower.Log.Init = function(parent)
	{
	this._Parent = parent;
	};
ETsmarTower.Log.Add = function(msg)
	{
	if (this._Enabled == true)
		{
		GM_log(msg);
		}
	};
ETsmarTower.Renders =
	{
	_Parent:			 null
	};
ETsmarTower.Renders.Init = function(parent)
	{
	this._Parent = parent;
	};
ETsmarTower.Renders.Set_NoVisualEffects_Styles = function()
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
		--transform: none !important;\
		transition: none !important;\
		}\
	';
	GM_addStyle(default_style);
	};
ETsmarTower.Renders.Set_Patches_Styles = function()
	{
	var default_style = '\
	body {\
		overflow-x: hidden !important;\
		}\
	';
	GM_addStyle(default_style);
	};
ETsmarTower.Renders.Set_Compact_Styles = function()
	{
	var default_style = '\
	/* Global */\
	div.item-icon-container {\
		background-color: #fff;\
		border-width: 1px 2px 2px 1px !important;\
		border-style: solid !important;\
		}\
	div.item-icon-container.small {\
		width: 3.58rem !important;\
		height: 3.58rem !important;\
		margin: 0.12rem 0.1rem;\
		padding: 0 !important;\
		}\
	div.item-icon-container.small img.item-icon {\
		width: 1.95rem !important;\
		height: 1.95rem !important;\
		margin-top: -0.25rem !important;\
		}\
	div.item-icon-container .item-amount-bubble {\
		right: 0.18rem;\
		font-size: 0.8rem;\
		border: none;\
		text-align: right;\
		padding: 0.12rem 0.24rem;\
		max-height: none;\
		height: auto;\
		left: auto;\
		top: auto !important;\
		background-color: transparent !important;\
		bottom: 0.16rem !important;\
		color: #555 !important;\
		font-style: normal !important;\
		overflow: hidden;\
		width: 2.4rem;\
		}\
	div.item-icon-container.small .item-amount-bubble {\
		font-size: 0.7rem;\
		right: 0;\
		bottom: 0.05rem !important;\
		}\
	.item-icon-container .item-quality-bubble {\
		right: auto !important;\
		color: #444 !important;\
		width: auto;\
		border-color: rgba(0,0,0,0.2);\
		height: auto;\
		max-height: none;\
		left: -0.25rem;\
		padding: 0.2rem 0.15rem;\
		font-size: 0.8rem !important;\
		top: -0.25rem !important;\
		font-style: normal !important;\
		border-width: 1px 2px 2px 1px !important;\
		}\
	.item-icon-container.small .item-quality-bubble {\
		font-size: 0.6rem !important;\
		padding: 0.1rem 0.15rem;\
		top: -0.15rem !important;\
		left: -0.15rem;\
		}\
	div.item-icon-container:hover {\
		background-color: #f7f7f9;\
		}\
	table.table-bordered.table-centered td {\
		padding: 0.1rem 0.5rem;\
		font-size: 0.8rem;\
		}\
	table.table-bordered.table-centered td:first-child {\
		text-align: left;\
		font-size: 1rem;\
		}\
	table.table-bordered.table-centered .ore-icon {\
		height: 3rem !important;\
		width: auto !important;\
		background-color: #fff;\
		padding: 2px;\
		}\
	table.table-bordered.table-centered td div.required-items-container {\
		justify-content: right !important;\
		}\
	table.table-bordered.table-centered td div.required-items-container span.mr-3.ml-1 {\
		min-width: 3.3rem;\
		text-align: right;\
		}\
	table.table-bordered.table-centered .btn {\
		padding: 0.1rem 0.5rem;\
		}\
	table.table-bordered.table-centered tr:hover {\
		background-color: #fff;\
		}\
	table.table-bordered.table-centered tr:hover td:first-child {\
		text-decoration: underline;\
		}\
	.my-tooltip-inner {\
		border-color:#333 !important;\
		border-width: 1px 2px 2px 1px !important;\
		}\
	/* Summary List */\
	.summaryList {\
		padding: 0.5rem !important;\
		}\
	.summaryList h6 {\
		margin-bottom: 0.2rem !important;\
		}\
	.summaryList .mt-3 {\
		margin-top: 0.2rem !important;\
		}\
	.summary-mining .mine-pit-container {\
		max-width: none !important;\
		}\
	.summary-crafting {\
		max-width: none !important;\
		}\
	.summary-inscription {\
		max-width: none !important;\
		}\
	/* Battle */\
	.lobby-container > div {\
		margin-top: 0.5rem !important;\
		}\
	.lobby-container .lobby-units-container {\
		margin-bottom: 2.5rem !important;\
		}\
	button.forfeit-battle {\
		position:fixed;\
		bottom:1rem;\
		}\
	/* Mine Prospectors */\
	table.table-bordered.table-centered .prospector-row .ore-icon {\
		height: 1.5rem !important;\
		}\
	table.table-bordered.table-centered .prospector-row td div.required-items-container span.mr-3.ml-1 {\
		min-width: 2.5rem;\
		font-size: 1rem;\
		}\
	';
	GM_addStyle(default_style);
	};

ETsmarTower.Init();