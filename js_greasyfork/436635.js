// ==UserScript==
// @name Colocar População para Trabalhar + Execução de 10 minutos
// @namespace kowsky.org
// @version 0.1
// @description Imperiaonline movearmy for v5, v6
// @match http://*/imperia/game_v5/game/villagejs.php
// @match https://*/imperia/game_v5/game/villagejs.php
// @match http://*/imperia/game_v5/game/village.php
// @match https://*/imperia/game_v5/game/village.php

// @match http://*/imperiaonline/game_v5/game/villagejs.php
// @match https://*/imperiaonline/game_v5/game/villagejs.php
// @match http://*/imperiaonline/game_v5/game/village.php
// @match https://*/imperiaonline/game_v5/game/village.php

// @match http://*/imperiaonline.org/game_v5/game/villagejs.php
// @match https://*/imperiaonline.org/game_v5/game/villagejs.php
// @match http://*/imperiaonline.org/game_v5/game/village.php
// @match https://*/imperiaonline.org/game_v5/game/village.php

// @match http://*/imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match https://*/imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match http://*/imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match https://*/imperiaonline.org/imperia/game_v5/game/villagejs.php

// @match https://www127.imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match http://www127.imperiaonline.org/imperia/game_v5/game/villagejs.php
// @copyright 2012+, You
// @downloadURL https://update.greasyfork.org/scripts/436635/Colocar%20Popula%C3%A7%C3%A3o%20para%20Trabalhar%20%2B%20Execu%C3%A7%C3%A3o%20de%2010%20minutos.user.js
// @updateURL https://update.greasyfork.org/scripts/436635/Colocar%20Popula%C3%A7%C3%A3o%20para%20Trabalhar%20%2B%20Execu%C3%A7%C3%A3o%20de%2010%20minutos.meta.js
// ==/UserScript==

function addJQuery(callback) {
var script = document.createElement("script");
script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
script.addEventListener('load', function() {
var script = document.createElement("script");
script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
document.body.appendChild(script);
}, false);
}

$(document).ready(function(){

    if (typeof(Storage) !== "undefined") {
    }
    else {
        alert("Desculpe! web storage não suportado, esse script não vai funcionar neste browser, aconselho a utilizar Mozilla Firefox ou Google Chrome");
    }

    setTimeout(function(){
		    // Reduzir 10 minutos
        xajax_listResearches('1', '1', '', -1, 0, 0, 'NULL', 2);
	},10000);

    setTimeout(function(){
		xajax_fastHireWorkers(containersStuff.findContaner({saveName:'fast_hire', title:'Empregar trabalhadores em todas as províncias',template:'untabbed'}));
	},15000);

    setTimeout(function(){
		xajax_fastHireWorkers(1,2,'AllProv',2,{'hireAll':1});return false;
	},20000);

    setTimeout(function(){
        xajax_fastHireWorkers(1,4,'AllProv',2,{'hireAll':1});return false;
	},25000);


setTimeout(function(){
        setTimeout(function(){
            window.location.href= $(location).attr('href');
        },10000);
},30000);

});