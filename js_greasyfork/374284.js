// ==UserScript==
// @name		 Bot Otecald Chatovod
// @version	  2.7.6
// @description  Cargador del cargador del Bot Otecald para Chatovod.
// @author	   ArtEze
// @match		*://*.chatovod.com/*
// @grant		none
// @namespace https://greasyfork.org/users/163524
// @downloadURL https://update.greasyfork.org/scripts/374284/Bot%20Otecald%20Chatovod.user.js
// @updateURL https://update.greasyfork.org/scripts/374284/Bot%20Otecald%20Chatovod.meta.js
// ==/UserScript==

window.número_aleatorio = hasta=>Math.floor(Math.random()*hasta)
window.cargar_cargador = function()
{
	if(document.querySelector(".chat")==null){return;}
	window.dirección_bot = "https://github.com/ArtEze/Chatovod_Mod/blob/master/JS/Bot/Activar_Bot.js"
	window.raw_dir = window.dirección_bot.replace(/^(.+)(git)(hub)(.+)(\/blob)(.+)(\/.+)(\.js)$/,"$1raw$2$4$6/")
	var archivo = "Cargar_lista_archivos"
	var interrogación = "?"
	var ruta = window.raw_dir + archivo + ".js" + interrogación + window.número_aleatorio(1000)
	var a = document.createElement("script")
	a.src = ruta
	document.head.appendChild(a)
}
window.cargar_cargador()
