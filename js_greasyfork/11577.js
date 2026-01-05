// ==UserScript==
// @name           [2015] G Explorer III
// @namespace      g-explorer-3
// @description    No sabe no contesta
// @include        http://*.ogame.*/game/index.php?page=galaxy*
// @version        2015.08.08
// @downloadURL https://update.greasyfork.org/scripts/11577/%5B2015%5D%20G%20Explorer%20III.user.js
// @updateURL https://update.greasyfork.org/scripts/11577/%5B2015%5D%20G%20Explorer%20III.meta.js
// ==/UserScript==

var document = unsafeWindow.document;
var $ = unsafeWindow.$;
var mintime = 900;
var maxtime = 1200;
var phalanx = 24;
var range   = randomNumber(35,40);
var galaxy  = $("#galaxy_input");
var system  = $("#system_input");
var rank    = ($("#bar li:eq(3)").text()).replace(/\D/g, "");

/* Genera formulario */
$("#galaxyContent").before('<table cellspacing="0" cellpadding="5" border="1" style="width:654px; background-color: black; padding: 10px; margin: 0 8px;" id="galaxytablex"><tr class="info info_headertd" colspan="13" id="interface"></td></tr></table>');
$("#interface").html('<span><select style="width: 200px;" id="target"><option value="i" selected="selected">Espiar inactivos</option><option value="galaxytool">GalaxyTools</option><option value="all">Espiar activos</option><option value="outlaw">Espiar proscriptos</option><option value="war">Espiar jugadores en guerra</option><option value="honorable">Espiar jugadores con PH</option></select> &nbsp;&nbsp;Desde: <input type="text" id="min" size="3" style="padding: 1px 4px; width: 42px;"/> Hasta: <input type="text" id="max" size="3" style="padding: 1px 4px; width: 42px;"/> <span id="all">Max TOP: <input type="text" id="rank" size="3" style="padding: 1px 4px; width: 42px;"/></span>&nbsp;&nbsp;<input type="button" id="scanner" style="padding: 3px;" value="Espiar" /></span>');                                                                                                                                                                                                                                                                                                                                  


if ((system.val() * 1 - range) >= 1 ) {
	$("#min").val(galaxy.val() + ":" + parseInt(system.val() - range));
} else {
	$("#min").val(galaxy.val() + ":" + 1);
}	

if ((system.val() * 1 + range) <= 499 ) {
	$("#max").val(galaxy.val() + ":" + parseInt(system.val() * 1 + range));
} else {
	$("#max").val(galaxy.val() + ":" + 499);
}


function randomNumber(m, n) {
	m = parseInt(m);
	n = parseInt(n);
	return Math.floor(Math.random() * (n - m + 1)) + m;
}

/* Initializer */
$("#scanner").click((function() {
	var min = $("#min").val().split(':');
	var max = $("#max").val().split(':');
	galaxy.val(min[0]);
	system.val(min[1]);
	unsafeWindow.submitForm();
	setTimeout((function() {process(max[0], max[1], $("#interface option:selected").val());}), mintime); // no tiene sentido retrasar el inicio
}));

$( "#target" ).change(function() {
  if($(this).val() != 'galaxytool' && $(this).val() != 'i' ){
    if ((system.val() * 1 - range) >= 1 ) {
    	$("#min").val(galaxy.val() + ":" + parseInt(system.val() - phalanx));
    } else {
    	$("#min").val(galaxy.val() + ":" + 1);
    }	
    
    if ((system.val() * 1 + range) <= 499 ) {
    	$("#max").val(galaxy.val() + ":" + parseInt(system.val() * 1 + phalanx));
    } else {
    	$("#max").val(galaxy.val() + ":" + 499);
    }
 
  } else {
    if ((system.val() * 1 - range) >= 1 ) {
    	$("#min").val(galaxy.val() + ":" + parseInt(system.val() - range));
    } else {
    	$("#min").val(galaxy.val() + ":" + 1);
    }	
    
    if ((system.val() * 1 + range) <= 499 ) {
    	$("#max").val(galaxy.val() + ":" + parseInt(system.val() * 1 + range));
    } else {
    	$("#max").val(galaxy.val() + ":" + 499);
    }
  }
});

/*Setea valores por defecto / iniciales del formularios */
$("#target").val("i").change();
$("#rank").val( Math.round(rank * 10));

var process = function(max_galaxy, max_system, who) {
  var rankrange= $("#interface #rank").val();
  var galaxy = $("#galaxy_input");
	var system = $("#system_input");
	
  if (who == "galaxytool") {
    mintime = 250;
    maxtime = mintime + 150;
  }
  
	var i = 0;
	var interval = setInterval((function() {
	
		if (i < 15) {
  		
  		  // solo jugadores:
        //  - no banneados 
        //  - no vacaciones 
        //  - no noobs 
        //  - no amigo
        //  - no alianza 
        var prank = parseInt($("#galaxytable .row:eq(" + i + ") .rank").text().match(/\d+/g));
    		if (
          !isNaN(prank) 
          && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_vacation']").html()) 
          && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_noob']").html()) 
          && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_strong']").html()) 
          && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_banned']").html()) 
          && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_admin']").html()) 
          
          && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_buddy']").html())
          && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_friends']").html())
          && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_ally_own']").html())
        ){
        // !! solo jugadores no banneados y no vacaciones
         
    			if (who == "all" && prank > rankrange) {
    			  // todos con puntaje menor a rankrange (top desde rankrange hasta TOP donde son novatos)
            spyPlayer(galaxy, system, i);
    			} else if (who == "war" && ($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_war']").html() || $("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_attack']").html())) {
    			  // todos en guerra                                                                              
            spyPlayer(galaxy, system, i);
    			} else if (who == "honorable" && ($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_honorableTarget']").html())) {
    			  // todos honorable (con puntos de honor)
            spyPlayer(galaxy, system, i);
    			} else if (who == "outlaw" && ($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_outlaw']").html())) {
    			  // todos proscriptos
            spyPlayer(galaxy, system, i);
    			} else if(who == "i" && ($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_longinactive']").html() || $("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_inactive']").html())) {
            // inactivos
            spyPlayer(galaxy, system, i);
    			} else if (who == "galaxytool") {
            clearInterval(interval);
  			    retry();
          }
        }
  			i++;
			
		} else {
			clearInterval(interval);
			retry();
		}
		
	}), randomNumber(mintime, maxtime));
  
	function spyPlayer(galaxy, system, i){
	  var time = randomNumber(mintime/2, mintime);
    setTimeout((function() {  
      try { 
            
            $("#galaxytable .row:eq(" + i + ") a[class*='espionage']").click(); 
         
            setTimeout((function() {  
              try { 
                var moon = i + 1;
                if($("#moon" + moon).html()){
                 if( ($("#moon" + moon + " ul[class*='ListLinks'] li:first a").text()).indexOf('Actividad') >= 0){
                  $("#moon" + moon  + " ul[class*='ListLinks'] li:eq(1) a").click(); 
                 } else {
                  $("#moon" + moon + " ul[class*='ListLinks'] li:first a").click(); 
                 }
                }
              } catch(e) {}
            }), 300);
        
      } catch(e) {
        /* console.log(e); */
      }
    }), time); // RandomNumber asigna un tiempo al azar para hacer mas difcil de detectar

  }

	function retry() {		
    // TODO: opcion para espiar a la inversa
    if(system.val() != max_system) {
			if(system.val() < 499) {
				unsafeWindow.submitOnKey(39); // fecha derecha
				setTimeout((function() {process(max_galaxy, max_system, who);}), randomNumber(mintime, maxtime));
      } else if (galaxy.val() != max_galaxy) {
				galaxy.val(galaxy.val() * 1 + 1);
				system.val(1);
				unsafeWindow.submitForm();
				setTimeout((function() {process(max_galaxy, max_system, who);}), randomNumber(mintime, maxtime));
			}
		} else if(galaxy.val() != max_galaxy) {
				galaxy.val(galaxy.val() * 1 + 1);
				system.val(1);
				unsafeWindow.submitForm();
				setTimeout((function() {process(max_galaxy, max_system, who);}), randomNumber(mintime, maxtime));
		} else {
        window.location.href = "http://s122-es.ogame.gameforge.com/game/index.php?page=messages#start";
    }
	}
}