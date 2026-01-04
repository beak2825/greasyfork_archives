// ==UserScript==
// @name        Prueba
// @match       https://play.pokemonshowdown.com/*
// @match       https://replay.pokemonshowdown.com/*
// @version     0.1
// @description Traducción de Pokémon Showdown al español (v2)
// @author      PdRoC
// @require     https://code.jquery.com/jquery-3.6.4.min.js
// @run-at      document-end
// @namespace https://greasyfork.org/users/171803
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463399/Prueba.user.js
// @updateURL https://update.greasyfork.org/scripts/463399/Prueba.meta.js
// ==/UserScript==

// Menú principal
$(".activitymenu").hide();
$("button[name='search']").text("<strong>¡Combatir!</strong><br><small>Busca un rival aleatorio</small>");
$("button[value='teambuilder']").text("Constructor de equipos");
$("button[value='ladder']").text("Clasificación");
$("button[value='/smogtours']").text("Torneos");
$("button[value='battles']").text("Ver un combate");
$("button[name='finduser']").text("Buscar un usuario");