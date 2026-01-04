// ==UserScript==
// @name         Politics and War Icon Refresh
// @namespace    https://greasyfork.org/en/scripts/406107-politics-and-war-icon-refresh
// @version      1.8
// @description  Test
// @author       Empiur
// @match        https://politicsandwar.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406107/Politics%20and%20War%20Icon%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/406107/Politics%20and%20War%20Icon%20Refresh.meta.js
// ==/UserScript==

let lookup_table = {
	'https://politicsandwar.com/img/icons/16/point_gold.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726130591531270245/coin16.png', 
	'https://politicsandwar.com/img/resources/coal.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726130926131871744/coal.png', 
	'https://politicsandwar.com/img/resources/oil.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726130593942995014/oil15.png', 
	'https://politicsandwar.com/img/resources/uranium.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726131110987300974/uranium.png', 
	'https://politicsandwar.com/img/resources/lead.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726131387240939601/lead.png', 
	'https://politicsandwar.com/img/resources/iron.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726130335347376218/iron_ore.png', 
	'https://politicsandwar.com/img/resources/bauxite.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726130337779941426/bauxite.png', 
	'https://politicsandwar.com/img/resources/gasoline.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726132729628065823/gas.png', 
	'https://politicsandwar.com/img/resources/munitions.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726132286189207622/ammo.png', 
	'https://politicsandwar.com/img/resources/steel.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726127109097127986/beam16p.png', 
	'https://politicsandwar.com/img/resources/aluminum.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726133201512431646/sheets.png', 
	'https://politicsandwar.com/img/icons/16/steak_meat.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726128029159391282/food16p.png',
	'https://politicsandwar.com/img/resources/money.png':'https://cdn.discordapp.com/attachments/698801432094179368/726136648148058132/cash.png',
	'https://politicsandwar.com/img/icons/16/money_dollar.png':'https://cdn.discordapp.com/attachments/698801432094179368/726136648148058132/cash.png',
	'https://politicsandwar.com/img/icons/16/email.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726143137415692459/message.png', 
	'https://politicsandwar.com/img/icons/16/book_open.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726143142721486886/factbook.png', 
	'https://politicsandwar.com/img/icons/16/trade.png': 'https://cdn.discordapp.com/attachments/698801432094179368/726143141983551528/tradeactivity.png',
	'https://politicsandwar.com/img/icons/16/shield.png':'https://cdn.discordapp.com/attachments/698801432094179368/726143566661025882/war_activity.png',
	'https://politicsandwar.com/img/icons/16/baseball.png':'https://cdn.discordapp.com/attachments/698801432094179368/726143138359410818/basebal.png',
	'https://politicsandwar.com/img/icons/16/administrator.png':'https://cdn.discordapp.com/attachments/698801432094179368/726143135117214077/spy.png',
	'https://politicsandwar.com/img/icons/16/sword.png':'https://cdn.discordapp.com/attachments/698801432094179368/726143570834096188/declare.png',
	'https://politicsandwar.com/img/icons/16/money_delete.png':'https://cdn.discordapp.com/attachments/698801432094179368/726143175302971493/embargo.png',
	'https://politicsandwar.com/img/icons/16/email.png':'https://cdn.discordapp.com/attachments/698801432094179368/726143137415692459/message.png',
	
}

for (let image of document.getElementsByTagName('img')) {
	for (let query in lookup_table) {
		if (image.src ==query) {
				image.src = lookup_table[query];
		}
	}
}

