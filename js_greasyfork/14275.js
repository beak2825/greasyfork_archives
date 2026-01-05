// ==UserScript==
// @name       Reducere 10 minute
// @namespace  Nirobot
// @version    0.1
// @description  enter something useful
// @match      http://*.imperiaonline.org/imperia/game_v5/game/village.php
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/14275/Reducere%2010%20minute.user.js
// @updateURL https://update.greasyfork.org/scripts/14275/Reducere%2010%20minute.meta.js
// ==/UserScript==

var script = document.createElement("script");
script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
document.body.appendChild(script);

setInterval(
    function(){
    	xajax_listResearches('1', '1', '', -1, 0, 0, 'NULL', 2);
    },60000
);