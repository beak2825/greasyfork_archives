// ==UserScript==
// @name       Autoangajare
// @namespace  Nirobot
// @version    0.1
// @description Angajeaza automat muncitori daca exista locuri in mina
// @match      http://*.imperiaonline.org/imperia/game_v5/game/village.php
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/14273/Autoangajare.user.js
// @updateURL https://update.greasyfork.org/scripts/14273/Autoangajare.meta.js
// ==/UserScript==

var script = document.createElement("script");
script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
document.body.appendChild(script);

setInterval(
    function(){
    	xajax_fastHireWorkers(3,5,'AllProv',3);return false;
    },30000
);