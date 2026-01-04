// ==UserScript==
// @name         Voronezh Р—Р“Рђ/РљСѓСЂР°С‚РѕСЂС‹
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  РњРѕР№ СЃРєСЂРёРїС‚ С‚РѕРї
// @author       Tommy_Ferrari
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/470403/Voronezh%20%D0%A0%E2%80%94%D0%A0%E2%80%9C%D0%A0%D1%92%D0%A0%D1%99%D0%A1%D1%93%D0%A1%D0%82%D0%A0%C2%B0%D0%A1%E2%80%9A%D0%A0%D1%95%D0%A1%D0%82%D0%A1%E2%80%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/470403/Voronezh%20%D0%A0%E2%80%94%D0%A0%E2%80%9C%D0%A0%D1%92%D0%A0%D1%99%D0%A1%D1%93%D0%A1%D0%82%D0%A0%C2%B0%D0%A1%E2%80%9A%D0%A0%D1%95%D0%A1%D0%82%D0%A1%E2%80%B9.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECIAL_PREFIX = 11;
const TECH_PREFIX = 13;
const buttons = [
    {
	  title: '----> Р Р°Р·РґРµР» Р–Р°Р»РѕР± <-----',
	},
    {
	  title: '|',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }} [/B]<br><br>"+
		"[B][/B]",
	},
	{
	  title: 'РќР° СЂР°СЃСЃРјРѕС‚СЂРµРЅРёРµ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’Р°С€Р° Р¶Р°Р»РѕР±Р° РІР·СЏС‚Р° РЅР° СЂР°СЃСЃРјРѕС‚СЂРµРЅРёРµ, РїРѕР¶Р°Р»СѓР№СЃС‚Р° РЅРµ СЃРѕР·РґР°РІР°Р№С‚Рµ РґСѓР±Р»РёРєР°С‚РѕРІ. РћР¶РёРґР°Р№С‚Рµ РѕС‚РІРµС‚Р°.<br>"+
		'[B]РќР° СЂР°СЃСЃРјРѕС‚СЂРµРЅРёРµ[/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'РќРµ РїРѕ С„РѕСЂРјРµ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’Р°С€Р° Р¶Р°Р»РѕР±Р° СЃРѕСЃС‚Р°РІР»РµРЅР° РЅРµ РїРѕ С„РѕСЂРјРµ, РїРѕР¶Р°Р»СѓР№СЃС‚Р° РѕР·РЅР°РєРѕРјСЊС‚РµСЃСЊ СЃ РїСЂР°РІРёР»Р°РјРё РїРѕРґР°С‡Рё Р¶Р°Р»РѕР± : [URL='https://forum.blackrussia.online/index.php?threads/3429349/']*РќР°Р¶РјРёС‚Рµ СЃСЋРґР°*[/URL].<br>"+
        '[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',

	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'РќРµС‚ /time',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’ РїСЂРµРґРѕСЃС‚Р°РІР»РµРЅРЅС‹С… РґРѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІ РѕС‚СЃСѓС‚СЃС‚РІСѓРµС‚ РІСЂРµРјСЏ (/time), РЅРµ РїРѕРґР»РµР¶РёС‚ СЂР°СЃСЃРјРѕС‚СЂРµРЅРёСЋ.<br>"+
        '[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'РћС‚ 3 Р»РёС†Р°',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р–Р°Р»РѕР±Р° СЃРѕСЃС‚Р°РІР»РµРЅР° РѕС‚ 3-РіРѕ Р»РёС†Р°, РјС‹ РЅРµ РјРѕР¶РµРј РµРµ СЂР°СЃСЃРјРѕС‚СЂРµС‚СЊ.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'РќСѓР¶РµРЅ С„СЂР°РїСЃ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’ РґР°РЅРЅРѕР№ СЃРёС‚СѓР°С†РёРё РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ С„СЂР°РїСЃ (РІРёРґРµРѕ С„РёРєСЃР°С†РёСЏ) РІСЃРµС… РјРѕРјРµРЅС‚РѕРІ, РІ РїСЂРѕС‚РёРІРЅРѕРј СЃР»СѓС‡Р°Рµ Р¶Р°Р»РѕР±Р° Р±СѓРґРµС‚ РѕС‚РєР°Р·Р°РЅРѕ.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: 'РќРµС„СѓР» С„СЂР°РїСЃ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’РёРґРµРѕ Р·Р°РїРёСЃСЊ РЅРµ РїРѕР»РЅР°СЏ Р»РёР±Рѕ Р¶Рµ РЅРµС‚ СѓСЃР»РѕРІРёРё СЃРґРµР»РєРё, Рє СЃРѕР¶РµР»РµРЅРёСЋ РјС‹ РІС‹РЅСѓР¶РґРµРЅС‹ РѕС‚РєР°Р·Р°С‚СЊ..<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Р”РѕРєРё РѕС‚СЂРµРґР°РєС‚РёСЂРѕРІР°РЅС‹',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B] РџСЂРµРґСЃС‚Р°РІР»РµРЅРЅС‹Рµ РґРѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІР° Р±С‹Р»Рё РѕС‚СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРЅС‹Рµ РёР»Рё РІ РїР»РѕС…РѕРј РєР°С‡РµСЃС‚РІРµ, РїРѕР¶Р°Р»СѓР№СЃС‚Р° РїСЂРёРєСЂРµРїРёС‚Рµ РѕСЂРёРіРёРЅР°Р».<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'РџСЂРѕС€Р»Рѕ Р±РѕР»СЊС€Рµ 48 С‡Р°СЃРѕРІ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B] РЎ РјРѕРјРµРЅС‚Р° РІС‹РґР°С‡Рё РЅР°РєР°Р·Р°РЅРёСЏ РїСЂРѕС€Р»Рѕ Р±РѕР»РµРµ 48-РјРё С‡Р°СЃРѕРІ, Р¶Р°Р»РѕР±Р° РЅРµ РїРѕРґР»РµР¶РёС‚ СЂР°СЃСЃРјРѕС‚СЂРµРЅРёСЋ.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'РќРµС‚ РґРѕРєРѕРІ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’ РІР°С€РµР№ Р¶Р°Р»РѕР±Рµ РѕС‚СЃСѓС‚СЃС‚РІСѓСЋС‚ РґРѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІР° РґР»СЏ СЂР°СЃСЃРјРѕС‚СЂР°. РџРѕР¶Р°Р»СѓР№СЃС‚Р° РїСЂРёРєСЂРµРїРёС‚Рµ РґРѕРєР°Р·Р°С‚РµР»СЊСЃРІР° РІ С…РѕСЂРѕС€РµРј РєР°С‡РµСЃС‚РІРµ РЅР° СЂР°Р·СЂРµС€РµРЅРЅС‹С… РїР»Р°С‚С„РѕСЂРјР°С…. (Yapix/Imgur/Youtube/Disk)<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'РќРµ СЂР°Р±РѕС‡РёРµ РґРѕРєРІР°',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]РџСЂРµРґРѕСЃС‚Р°РІР»РµРЅРЅС‹Рµ РґРѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІР° РЅРµ СЂР°Р±РѕС‡РёРµ Р»РёР±Рѕ Р¶Рµ Р±РёС‚Р°СЏ СЃСЃС‹Р»РєР°, РїРѕР¶Р°Р»СѓР№СЃС‚Р° Р·Р°РіСЂСѓР·РёС‚Рµ РґРѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІР° РЅР° С„РѕС‚Рѕ/РІРёРґРµРѕ С…РѕСЃС‚РёРЅРіРµ.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'РћРєРЅРѕ Р±Р°РЅР°',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. <br><br>"+
		"[B]Р—Р°Р№РґРёС‚Рµ РІ РёРіСЂСѓ Рё СЃРґРµР»Р°Р№С‚Рµ СЃРєСЂРёРЅ РѕРєРЅР° СЃ Р±Р°РЅРѕРј РїРѕСЃР»Рµ С‡РµРіРѕ, Р·Р°РЅРѕРІРѕ РЅР°РїРёС€РёС‚Рµ Р¶Р°Р»РѕР±Сѓ.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Р”СѓР±Р»РёСЂРѕРІР°РЅРёРµ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]РќР°РїРѕРјРёРЅР°СЋ, Р·Р° РґСѓР±Р»РёСЂРѕРІР°РЅРёРµ С‚РµРј РІР°С€ С„РѕСЂСѓРјРЅС‹Р№ Р°РєРєР°СѓРЅС‚ РјРѕР¶РµС‚ Р±С‹С‚СЊ Р·Р°Р±Р»РѕРєРёСЂРѕРІР°РЅ.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'РџСЂРѕРёРЅСЃС‚СЂСѓРєС‚РёСЂРѕРІР°С‚СЊ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р‘Р»Р°РіРѕРґР°СЂРёРј Р·Р° РІР°С€Рµ РѕР±СЂР°С‰РµРЅРёРµ! РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ Р±СѓРґРµС‚ РїСЂРѕРёРЅСЃС‚СЂСѓРєС‚РёСЂРѕРІР°РЅ.<br>"+
		'[B]РћРґРѕР±СЂРµРЅРѕ.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Р‘РµСЃРµРґР° СЃ Р°РґРјРёРЅРѕРј',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’Р°С€Р° Р¶Р°Р»РѕР±Р° Р±С‹Р»Р° РѕРґРѕР±СЂРµРЅР° Рё Р±СѓРґРµС‚ РїСЂРѕРІРµРґРµРЅР° Р±РµСЃРµРґР° СЃ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂРѕРј.<br>"+
		'[B]РћРґРѕР±СЂРµРЅРѕ.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'РЎС‚СЂРѕРіР°СЏ Р±РµСЃРµРґР° СЃ Р°РґРјРёРЅРѕРј',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’Р°С€Р° Р¶Р°Р»РѕР±Р° Р±С‹Р»Р° РѕРґРѕР±СЂРµРЅР° Рё Р±СѓРґРµС‚ РїСЂРѕРІРµРґРµРЅР° СЃС‚СЂРѕРіР°СЏ Р±РµСЃРµРґР° СЃ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂРѕРј.<br>"+
		'[B]РћРґРѕР±СЂРµРЅРѕ.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'РђРґРјРёРЅ Р±СѓРґРµС‚ РЅР°РєР°Р·Р°РЅ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’Р°С€Р° Р¶Р°Р»РѕР±Р° Р±С‹Р»Р° РѕРґРѕР±СЂРµРЅР° Рё Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ РїРѕР»СѓС‡РёС‚ РЅР°РєР°Р·Р°РЅРёРµ.<br>"+
		'[B]РћРґРѕР±СЂРµРЅРѕ.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'РќРµС‚ РЅР°СЂСѓС€РµРЅРёР№',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]РСЃС…РѕРґСЏ РёР· РІС‹С€Рµ РїСЂРёР»РѕР¶РµРЅРЅС‹С… РґРѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІ, РЅР°СЂСѓС€РµРЅРёСЏ СЃРѕ СЃС‚РѕСЂРѕРЅС‹ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР° - РЅРµ РёРјРµРµС‚СЃСЏ!<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'РќР°РєР°Р·Р°РЅРёРµ РІРµСЂРЅРѕРµ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]РџСЂРѕРІРµСЂРёРІ РґРѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІР° Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°, Р±С‹Р»Рѕ РїСЂРёРЅСЏС‚Рѕ СЂРµС€РµРЅРёРµ, С‡С‚Рѕ РЅР°РєР°Р·Р°РЅРёРµ РІС‹РґР°РЅРѕ РІРµСЂРЅРѕ.<br>"+
		'[B]Р—Р°РєСЂС‹С‚Рѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'РќР°РєР°Р·Р°РЅРёРµ РїРѕ РѕС€РёР±РєРµ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’ СЃР»РµРґСЃС‚РІРёРµ Р±РµСЃРµРґС‹ СЃ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂРѕРј, Р±С‹Р»Рѕ РІС‹СЏСЃРЅРµРЅРѕ, РЅР°РєР°Р·Р°РЅРёРµ Р±С‹Р»Рѕ РІС‹РґР°РЅРѕ РїРѕ РѕС€РёР±РєРµ.<br>"+
		'[B]РћРґРѕР±СЂРµРЅРѕ.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'РђРґРјРёРЅ РЎРЅСЏС‚/РџРЎР–',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ Р±С‹Р» СЃРЅСЏС‚/СѓС€РµР» СЃ РїРѕСЃС‚Р° Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°.<br>"+
		'[B]Р Р°СЃСЃРјРѕС‚СЂРµРЅРѕ.[/B]',
	  prefix: WATCHED_PREFIX,
	  status: false,
	},
    {
	  title: 'РџРµСЂРµРґР°РЅРѕ Р“Рђ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р–Р°Р»РѕР±Р° РїРµСЂРµРґР°РЅР° Р“Р»Р°РІРЅРѕРјСѓ РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂСѓ - @Edward Davidson, РїРѕР¶Р°Р»СѓР№СЃС‚Р° РѕР¶РёРґР°Р№С‚Рµ РѕС‚РІРµС‚Р°..<br>"+
		'[B]РџРµСЂРµРґР°РЅРѕ Р“Р»Р°РІРЅРѕРјСѓ РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂСѓ.[/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: 'РџРµСЂРµРґР°РЅРѕ Р—Р“Рђ Р“РћРЎРЎ & РћРџР“',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р–Р°Р»РѕР±Р° РїРµСЂРµРґР°РЅР° Р—Р°РјРµСЃС‚РёС‚РµР»СЋ Р“Р»Р°РІРЅРѕРіРѕ РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР° РїРѕ РЅР°РїСЂР°РІР»РµРЅРё РћРџР“ Рё Р“РћРЎРЎ - @Tommy Ferrari, РїРѕР¶Р°Р»СѓР№СЃС‚Р° РѕР¶РёРґР°Р№С‚Рµ РѕС‚РІРµС‚Р°..<br>"+
		'[B]РџРµСЂРµРґР°РЅРѕ Р—Р“Рђ Р“РћРЎРЎ&РћРџР“.[/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: 'РџРµСЂРµРґР°РЅРѕ РўРµС…Сѓ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’Р°С€Р° Р¶Р°Р»РѕР±Р° Р±С‹Р»Р° РїРµСЂРµРґР°РЅР° С‚РµС…РЅРёС‡РµСЃРєРѕРјСѓ СЃРїРµС†РёР°Р»РёСЃС‚Сѓ СЃРµСЂРІРµСЂР°, РїРѕР¶Р°Р»СѓР№СЃС‚Р° РѕР¶РёРґР°Р№С‚Рµ РѕС‚РІРµС‚Р°..<br>"+
		'[B]РџРµСЂРµРґР°РЅРѕ РўРµС…РЅРёС‡РµСЃРєРѕРјСѓ РЎРїРµС†РёР°Р»РёСЃС‚Сѓ.[/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: 'РџРµСЂРµРґР°РЅРѕ РЎРїРµС†Сѓ Рё Р—Р°РјСѓ РЎРїРµС†Р°',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B] Р–Р°Р»РѕР±Р° РїРµСЂРµРґР°РЅР° РЎРїРµС†РёР°Р»СЊРЅРѕРјСѓ РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂСѓ, Р° С‚Р°Рє Р¶Рµ РµРіРѕ Р—Р°РјРµСЃС‚РёС‚РµР»СЋ - @Sander_Kligan / @Clarence Crown, РїРѕР¶Р°Р»СѓР№СЃС‚Р° РѕР¶РёРґР°Р№С‚Рµ РѕС‚РІРµС‚Р°.<br>"+
		'[B]РџРµСЂРµРґР°РЅРѕ РЎРїРµС†РёР°Р»СЊРЅРѕРјСѓ РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂСѓ.[/B]',
	  prefix: SPECIAL_PREFIX,
	  status: true,
	},
	{
	  title: 'РЎРѕС†. СЃРµС‚Рё',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р”РѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІР° РёР· СЃРѕС†. СЃРµС‚РµР№ РЅРµ РїСЂРёРЅРёРјР°СЋС‚СЃСЏ, РІР°Рј РЅСѓР¶РЅРѕ Р·Р°РіСЂСѓР·РёС‚СЊ РґРѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІ РЅР° РІРёРґРµРѕ/С„РѕС‚Рѕ С…РѕСЃС‚РёРЅРіРµ.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Р’ РўРµС… СЂР°Р·РґРµР»',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]РџРѕР¶Р°Р»СѓР№СЃС‚Р° СЃРѕСЃС‚Р°РІСЊС‚Рµ СЃРІРѕСЋ Р¶Р°Р»РѕР±Сѓ РІ РўРµС…РЅРёС‡РµСЃРєРёР№ СЂР°Р·РґРµР» СЃРµСЂРІРµСЂР° : [URL=https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9640-voronezh.1799/]*РќР°Р¶РјРёС‚Рµ СЃСЋРґР°*[/URL]<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Р’ Р–Р‘ РЅР° С‚РµС…Р°',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’Р°Рј Р±С‹Р»Рѕ РІС‹РґР°РЅРѕ РЅР°РєР°Р·Р°РЅРёСЏ РўРµС…РЅРёС‡РµСЃРєРёРј СЃРїРµС†РёР°Р»РёСЃС‚РѕРј, РІС‹ РјРѕР¶РµС‚Рµ РЅР°РїРёСЃР°С‚СЊ Р¶Р°Р»РѕР±Сѓ Р·РґРµСЃСЊ : [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*РќР°Р¶РјРёС‚Рµ СЃСЋРґР°*[/URL]<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Р’ РѕР±Р¶Р°Р»РѕРІР°РЅРёРµ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B] Р•СЃР»Рё РІС‹ СЃРѕРіР»Р°СЃРЅС‹ СЃ РІС‹РґР°РЅРЅС‹Рј РЅР°РєР°Р·Р°РЅРёРµРј, С‚Рѕ РЅР°РїРёС€РёС‚Рµ РІ СЂР°Р·РґРµР» РћР±Р¶Р°Р»РѕРІР°РЅРёРµ.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '_____Р Р°Р·РґРµР» РћР±Р¶Р°Р»РѕРІР°РЅРёРµ____',
	},
    {
	  title: 'РќРµ РїРѕ С„РѕСЂРјРµ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’Р°С€Рµ РѕР±Р¶Р°Р»РѕРІР°РЅРёРµ СЃРѕСЃС‚Р°РІР»РµРЅРѕ РЅРµ РїРѕ С„РѕСЂРјРµ, РїРѕР¶Р°Р»СѓР№СЃС‚Р° РѕР·РЅР°РєРѕРјСЊС‚РµСЃСЊ СЃ РїСЂР°РІРёР»Р°РјРё РїРѕРґР°С‡Рё РѕР±Р¶Р°Р»РѕРІР°РЅРёР№ : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.2639626/']*РќР°Р¶РјРёС‚Рµ СЃСЋРґР°*[/URL]<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'РћР±Р¶Р°Р»РѕРІР°РЅРёСЋ РЅРµ РїРѕРґР»РµР¶РёС‚',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р”Р°РЅРЅРѕРµ РЅР°СЂСѓС€РµРЅРёСЏ РЅРµ РїРѕРґР»РµР¶РёС‚ РѕР±Р¶Р°Р»РѕРІР°РЅРёСЋ, Р°РґРјРёРЅРёСЃС‚СЂР°С†РёСЏ РЅРµ РјРѕР¶РµС‚ СЃРЅРёР·РёС‚СЊ РІР°Рј РµРіРѕ.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'РќРµ РіРѕС‚РѕРІС‹ СЃРЅРёР·РёС‚СЊ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]РђРґРјРёРЅРёСЃС‚СЂР°С†РёСЏ СЃРµСЂРІРµСЂР° РЅРµ РіРѕС‚РѕРІР° СЃРЅРёР·РёС‚СЊ РІР°Рј РЅР°РєР°Р·Р°РЅРёСЏ, РїРѕР¶Р°Р»СѓР№СЃС‚Р° РЅРµ СЃРѕР·РґР°РІР°Р№С‚Рµ РґСѓР±Р»РёРєР°С‚С‹, СЃРѕР·РґР°РЅРёРµ РґСѓР±Р»РёРєР°С‚РѕРІ РєР°СЂР°РµС‚СЃСЏ Р±Р°РЅРѕРј С„РѕСЂСѓРјРЅРѕРіРѕ Р°РєРєР°СѓРЅС‚Р°.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'РћР‘Р– РЅР° СЂР°СЃСЃРјРѕС‚СЂРµРЅРёРµ',
	  content:

		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’Р°С€Рµ РѕР±Р¶Р°Р»РѕРІР°РЅРёРµ РІР·СЏС‚Рѕ РЅР° СЂР°СЃСЃРјРѕС‚СЂРµРЅРёРµ, РїРѕР¶Р°Р»СѓР№СЃС‚Р° РЅРµ СЃРѕР·РґР°РІР°Р№С‚Рµ РґСѓР±Р»РёРєР°С‚РѕРІ. РћР¶РёРґР°Р№С‚Рµ РѕС‚РІРµС‚Р°.<br>"+
		'[B]РќР° СЂР°СЃСЃРјРѕС‚СЂРµРЅРёРµ.[/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'РЈР¶Рµ РµСЃС‚СЊ РјРёРЅ. РЅР°РєР°Р·Р°РЅРёСЏ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р’Р°Рј Р±С‹Р»Рѕ РІС‹РґР°РЅРѕ РјРёРЅРёРјР°Р»СЊРЅРѕРµ РЅР°РєР°Р·Р°РЅРёРµ, РѕР±Р¶Р°Р»РѕРІР°РЅРёСЋ РЅРµ РїРѕРґР»РµР¶РёС‚.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'РћР±Р¶Р°Р»РѕРІР°РЅРёРµ РѕРґРѕР±СЂРµРЅРѕ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]РћР±Р¶Р°Р»РѕРІР°РЅРёРµ РѕРґРѕР±СЂРµРЅРѕ, РІР°С€Рµ РЅР°РєР°Р·Р°РЅРёРµ Р±СѓРґРµС‚ СЃРЅСЏС‚Рѕ/СЃРЅРёР¶РµРЅРѕ РІ С‚РµС‡РµРЅРёРµ 24-РµС… С‡Р°СЃРѕРІ.<br>"+
		'[B]РћРґРѕР±СЂРµРЅРѕ.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'РџРµСЂРµРґР°РЅРѕ Р“Рђ РѕР±Р¶',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. <br><br>"+
		"[B]РћР±Р¶Р°Р»РѕРІР°РЅРёРµ РїРµСЂРµРґР°РЅРѕ Р“Р»Р°РІРЅРѕРјСѓ РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂСѓ - @Jennie Carter, РїРѕР¶Р°Р»СѓР№СЃС‚Р° РѕР¶РёРґР°Р№С‚Рµ РѕС‚РІРµС‚Р°.<br>"+
		'[B]РќР° СЂР°СЃСЃРјРѕС‚СЂРµРЅРёРµ.[/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: 'РЎРѕС†. СЃРµС‚Рё РћР‘Р–',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B] Р”РѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІР° РёР· СЃРѕС† СЃРµС‚РµР№ РЅРµ РїСЂРёРЅРёРјР°СЋС‚СЃСЏ, РІР°Рј РЅСѓР¶РЅРѕ Р·Р°РіСЂСѓР·РёС‚СЊ РґРѕРєР°Р·Р°С‚РµР»СЊСЃС‚РІ РЅР° РІРёРґРµРѕ/С„РѕС‚Рѕ С…РѕСЃС‚РёРЅРіРµ.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Р’ Р¶Р± РЅР° Р°РґРјРёРЅРѕРІ',
	  content:
		"[B]Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ СѓРІР°Р¶Р°РµРјС‹Р№ {{ user.name }}. [/B]<br><br>"+
		"[B]Р•СЃР»Рё РІС‹ РЅРµ СЃРѕРіР»Р°СЃРЅС‹ СЃ РІС‹РґР°РЅРЅС‹Рј РЅР°РєР°Р·Р°РЅРёРµРј, С‚Рѕ РЅР°РїРёС€РёС‚Рµ РІ СЂР°Р·РґРµР» Р–Р°Р»РѕР±С‹ РЅР° РђРґРјРёРЅРёСЃС‚СЂР°С†РёСЋ.<br>"+
		'[B]РћС‚РєР°Р·Р°РЅРѕ.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	}
];

$(document).ready(() => {
	// Р—Р°РіСЂСѓР·РєР° СЃРєСЂРёРїС‚Р° РґР»СЏ РѕР±СЂР°Р±РѕС‚РєРё С€Р°Р±Р»РѕРЅРѕРІ
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Р”РѕР±Р°РІР»РµРЅРёРµ РєРЅРѕРїРѕРє РїСЂРё Р·Р°РіСЂСѓР·РєРµ СЃС‚СЂР°РЅРёС†С‹
	addButton('РћС‚РІРµС‚С‹', 'selectAnswer');
	addButton('РћРґРѕР±СЂРµРЅРѕ', 'accepted');
	addButton('РћС‚РєР°Р·Р°РЅРѕ', 'unaccept');
	addButton('РќР° СЂР°СЃСЃРјРѕС‚СЂРµРЅРёРµ', 'pin');
	addButton('Р Р°СЃСЃРјРѕС‚СЂРµРЅРѕ', 'watched');
	addButton('Р—Р°РєСЂС‹С‚СЊ', 'closed');
	addButton(`РљРџ`, `teamProject`);
    addButton ('РЎРїРµС†Сѓ', 'specialAdmin');
    addButton ('Р“Рђ', 'mainAdmin');
    addButton('РўРµС….РЎРїРµС†Сѓ', 'techspec');


	// РџРѕРёСЃРє РёРЅС„РѕСЂРјР°С†РёРё Рѕ С‚РµРјРµ
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
	$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));
	$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
	$(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
	$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

	$(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Р’С‹Р±РµСЂРёС‚Рµ РѕС‚РІРµС‚:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
			}
		});
	});
});

function addButton(name, id) {
$('.button--icon--reply').before(
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons[id].prefix, buttons[id].status);
		$('.button--icon.button--icon--reply.rippleButton').trigger('click');
	}
}

function getThreadData() {
const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
const authorName = $('a.username').html();
const hours = new Date().getHours();
return {
  user: {
	id: authorID,
	name: authorName,
	mention: `[USER=${authorID}]${authorName}[/USER]`,
  },
  greeting: () =>
	4 < hours && hours <= 11
	  ? 'Р”РѕР±СЂРѕРµ СѓС‚СЂРѕ'
	  : 11 < hours && hours <= 15
	  ? 'Р”РѕР±СЂС‹Р№ РґРµРЅСЊ'
	  : 15 < hours && hours <= 21
	  ? 'Р”РѕР±СЂС‹Р№ РІРµС‡РµСЂ'
	  : 'Р”РѕР±СЂРѕР№ РЅРѕС‡Рё',
};
}

function editThreadData(prefix, pin = false) {
// РџРѕР»СѓС‡Р°РµРј Р·Р°РіРѕР»РѕРІРѕРє С‚РµРјС‹, С‚Р°Рє РєР°Рє РѕРЅ РЅРµРѕР±С…РѕРґРёРј РїСЂРё Р·Р°РїСЂРѕСЃРµ
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	if(pin == false){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == true){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
}

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();