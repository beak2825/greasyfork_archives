// ==UserScript==
// @name       Elkopolo loading text
// @namespace  http://www.hitbox.tv/Elkopolo
// @version    1.0
// @description  Changes the loading text of Elko's stream
// @match      *://*.hitbox.tv/Elkopolo
// @match      *://*.hitbox.tv/Elkopolo/*
// @copyright  2015+, /u/Jean-Alphonse
// @author /u/Jean-Alphonse
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/11352/Elkopolo%20loading%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/11352/Elkopolo%20loading%20text.meta.js
// ==/UserScript==

var strings = ["Fuck you", "Penis", "Harvesting tomatoes", "me irl", "Shaving anus", "Hiding porn tabs", "Dying"];

$(document).ready(function() {
    
    i = Math.floor(Math.random() * strings.length);
    $(".player-loading-status").text(strings[i]);

});