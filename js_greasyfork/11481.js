// ==UserScript==
// @name         [2015] Granjer-o-matic
// @namespace    2015-Granjer-o-matic
// @description:en  No sabe no contesta
// @include      http://*.ogame.gameforge.com*
// @exclude      http://board.*.ogame.gameforge.com*
// @version      2015.08.25
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @install      https://greasyfork.org/scripts/11481-2015-granjer-o-matic/code/%5B2015%5D%20Granjer-o-matic.user.js
// @description No sabe no contesta
// @downloadURL https://update.greasyfork.org/scripts/11481/%5B2015%5D%20Granjer-o-matic.user.js
// @updateURL https://update.greasyfork.org/scripts/11481/%5B2015%5D%20Granjer-o-matic.meta.js
// ==/UserScript==

/************************************************************
 *
 *   REQUERIMIENTOS
 *   - A n t i g a m e debe estar instalado
 *   - S p i o H e l p e r debe estar activado y funcionando (esto requiere activar la opción "Mostrar teporte de espionaje completo")
 *   - Nro de mensajes visualizados por pagina = 50
 *
 ************************************************************/
 
/************************************************************
 * Pendientes:
 * - Que si detecta que te están atacando, se gaste los recursos en defensas
 * - la posibilidad de que lleve los recursos a algun planeta (ver posibilidad de integrar con E a s y  T r a n s po r t)
 * 
 ************************************************************/

$(document).ready(function() {

    /* CONFIGURACION POR DEFECTO */
    var val = "sxxx-es.ogame.gameforge.com";          // remplaza XXX por el número del universo donde juegas más activamente
    var username = 'Tu nombre';
    var password = 'Tu contraseña';
    var mintime = 1500;                               // Si notas que el script va muy lento, le bajas el tiempo, si por el contrario, notas que se cuelga o que los espionajes son demasiado rápidos, sube el tiempo.
    var minloot = 400000;                             // botín minimo, si hay demasiados reportes de espionaje, aumentará este valor automaticamente
    var expeditions = false;                           // true / false => activa o desactiva enviar expediciones
    var leaveXEmptySlot = 0;                          // cantidad de espacios de flota que debe dejar libres
    var galaxy_min_range = 30;                        // cuantas galaxias de distancia debe espiar como minimo 
    var galaxy_max_range = 50;                        // cuantas galaxias de distancia debe espiar como máximo, lo ideal sería que el maximo coincida con el alcance de tu phalanx
    var excluded_planets = ['00000000', '99999999'];  // ID de planetas desde los cuales no quieres hacer ataques. Ej: '00000000', '99999999'. Sirve en caso de que tengas una colonia en algún G donde no haya granjas y ni valga la pena espiar
    
    /**
     *
     *  Modo de espionaje / ataque
     *  both => espia y ataca desde planetas y lunas                          
     *  planets => espioa y ataca solamente desde planetas (no recomendado porque te pueden ver con phalanx)
     *  moon => espia y ataca desde solamente desde lunas (recomendado pero requiere defensas en las lunas para evitar ser granjeado)
    */
    var mode = 'planets';
    var spyMoons = true;   // true = espia lunas. false para que no espie lunas. A tener en cuenta: requiere tener commandante activo


    // SOBREESCRIBE CONFIGURACIÓN PARA OTRO UNI
    if(window.location.hash == "#uniXXX") {  // remplaza XXX por el numero del universo, luego guarda en tus favoritos el link  http://es.ogame.gameforge.com/#uniXXX , cuando accedas a ese link se autoconectará
      var val = "sxxx-es.ogame.gameforge.com";
      var username = 'Tu nombre';
      var password = 'Tu contraseña';
    }
    if (getMetaContent("ogame-universe") == 'sXXX-es.ogame.gameforge.com') { // Remplazar XXX por el numero del otro universo
      var mintime = 1100;                               // Si notas que el script va muy lento, le bajas el tiempo, si por el contrario, notas que se cuelga o que los espionajes son demasiado rápidos, sube el tiempo.
      var minloot = 300000;                             // botín minimo, si hay demasiados reportes de espionaje, aumentará este valor automaticamente
      var expeditions = true;                           // true / false => activa o desactiva enviar expediciones
      var leaveXEmptySlot = 1;                          // cantidad de espacios de flota que debe dejar libres
      var galaxy_min_range = 30;                        // cuantas galaxias de distancia debe espiar como minimo 
      var galaxy_max_range = 50;                        // cuantas galaxias de distancia debe espiar como máximo, lo ideal sería que el maximo coincida con el alcance de tu phalanx
      var excluded_planets = [];                        // ID de planetas desde los cuales no quieres hacer ataques. Ej: '00000000', '99999999'. Sirve en caso de que tengas una colonia en algún G donde no haya granjas y ni valga la pena espiar
    }
    
    if (getMetaContent("ogame-universe") == 'sXXX-es.ogame.gameforge.com') { // Remplazar XXX por el numero del universo   
        // Quita las // de la siguiente línea para provocar que el script no se ejecuete en este universo 
        // return;
    }

    /* FIN CONFIGURACION */

    /************************************************************
     *
     *     NO EDITAR DEBAJO
     *     Salvo que sepan programación javascript / jQuery
     * 
     ************************************************************/
    
    /* variables calculadas */
    var universe = ((getMetaContent("ogame-universe")).split('.')[0]).split('-')[0];
    var cuTargetsListKey = universe + "_attackList";
    var cuPlanetKey = universe + "_planetID";
    var planetID = getMetaContent("ogame-planet-id");

    /* Funciones útiles que copie de otros scripts */
    if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported") != -1)) {
        this.GM_getValue = function(key, def) {
            return localStorage[key] || def;
        };
        this.GM_setValue = function(key, value) {
            return localStorage[key] = value;
        };
        this.GM_deleteValue = function(key) {
            return delete localStorage[key];
        };
    }
    var setValue = function(key, value) {
        GM_setValue(key, JSON.stringify(value));
    }
    var getValue = function(key, def) {
        var value = GM_getValue(key);
        if (value === undefined) {
            return def;
        }
        return JSON.parse(value);
    }

    function getMetaContent(mn) {
        var m = document.getElementsByTagName('meta');
        for (var i in m) {
            if (m[i].name == mn) {
                return m[i].content;
            }
        }
        return "";
    }

    function randomNumber() {
        var rmin = mintime;
        var rmax = mintime * 2;
        var rnum = Math.floor(Math.random() * (rmax - rmin + 1)) + rmin;
        return rnum;
    }
    /* ! funciones copiadas */
    
    /* Obtiene un planeta al azar */        
    function getRamdomPlanet() {
        var planets = GM_getValue('planets');
        if (planets === undefined || planets.length <2) {
            planets = [];
            var planetlinks = $("#rechts").find(".smallplanet");
            if (planetlinks.length > 1) {
                var testlabelPlanet = 'planetlink active';
                var testlabelLune = 'moonlink active';
                for (var i = 0; i < planetlinks.length; i++) {
                    var pid;
                    
                    if(mode == 'both' || mode == 'planets') {
                      pid = planetlinks[i].innerHTML.split('moonlink')[0].split('&amp;cp=')[1].split('" title')[0];
                      if ((pid != GM_getValue(cuPlanetKey)) && (excluded_planets.indexOf(pid) < 0 )) {  // usa cuPlanetKey porque es el planeta desde donde vamos a granjear
                          planets.push(pid);
                      }
                		}
                    if(mode == 'both' || mode == 'moons') {
                      if (planetlinks[i].innerHTML.indexOf('class="icon-moon"') > 0) {
                        pid = planetlinks[i].innerHTML.split('moonlink')[1].split('&amp;cp=')[1].split('\">')[0].replace( /[^0-9-]/g, "");
                        if ((pid != GM_getValue(cuPlanetKey)) && (excluded_planets.indexOf(pid) < 0 )) {  // usa cuPlanetKey porque es el planeta desde donde vamos a granjear
                            planets.push(pid);
                        }
                  		}
                    }
                }
                GM_setValue('planets', planets);
            }
        }
        var index = Math.floor((Math.random() * planets.length) + 1);
        var pid = planets[index];
        planets = planets.splice(index, 1);
        GM_setValue('planets', planets);
        return pid;
    }
    
    /* Si están todos los espacios de flota ocupados, no tiene sentido reintentar al azar, 
       por lo cual, obtiene el tiempo restante hasta la ocurrencia del proximo 
       evento y lo utiliza para planificar el proximo refresco */
    function getNextEventTime() {
        var maxtime = mintime + 1234;
        var timestring = document.getElementById('tempcounter').innerHTML;
        var milisegundos = randomNumber(mintime * 8, maxtime * 8); // le suma un tiempo random para discimular :P
        if (timestring.indexOf("h") > 0) {
            milisegundos = milisegundos + (parseInt(timestring) * 3600000);
        }
        if (timestring.indexOf("m") > 0) {
            if (timestring.indexOf("h") > 0) {
                milisegundos = milisegundos + (parseInt(timestring.substr((timestring.indexOf("m") - 3), 3)) * 60000);
            } else {
                milisegundos = milisegundos + (parseInt(timestring) * 60000);
            }
        }
        if (timestring.indexOf("s") > 0) {
            if (timestring.indexOf("m") > 0) {
                milisegundos = milisegundos + (parseInt(timestring.substr((timestring.indexOf("s") - 3), 3)) * 1000);
            } else {
                milisegundos = milisegundos + (parseInt(timestring) * 1000);
            }
        }
        if (isNaN(milisegundos)) {
            // si por algún motivo calculamos mal el tiempo, utiliza un tiempo random x 8
            milisegundos = randomNumber(mintime * 8, maxtime * 8);
        }
        return milisegundos;
    }


    /*****************************
     * Inicia
     ***************************/
    if(document.location.href.indexOf("index.php?page") < 0) {
      setTimeout((function() {
        var uni = document.getElementById('serverLogin');
        for(var i, j = 0; i = uni.options[j]; j++) {
          if(i.value == val) {
              uni.selectedIndex = j;
              break;
          }
        }
        document.getElementById('usernameLogin').value = username;
        document.getElementById('passwordLogin').value = password;
        document.forms["loginForm"].submit();
      }), randomNumber() * 30);
      
    } else if (document.location.href.indexOf("fleet1") > 0 && (document.location.href.indexOf("routine=3") > 0 || document.location.href.indexOf("routine=7") > 0)) {
        GM_setValue('submitting', '0');
        
        var carguerasp = $("#button202 > div:nth-child(1) > a:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1)");
        if(carguerasp.length) {
          carguerasp = carguerasp[0].nextSibling.textContent;        
          carguerasp = carguerasp.replace(/\./g,'');
          carguerasp = (parseInt (carguerasp));
        }
        
        var carguerasg = $("#button203 > div:nth-child(1) > a:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1)");
        if(carguerasg.length) {
          carguerasg = carguerasg[0].nextSibling.textContent;        
          carguerasg = carguerasg.replace(/\./g,'');
          carguerasg = (parseInt (carguerasg));
        }
        
        if(carguerasp == 0 && carguerasg == 0){
          // Si no hay cargueras, esperará hasta que regresen algunas y refrescará la pantalla
          setTimeout((function() {window.location.reload();}), getNextEventTime());
          return;
        }
                
        setTimeout((function() {
            if (document.location.href.indexOf("routine=7") > 0) {
                // Setea las naves para la expedición
                $("#ago_routine_7")[0].click();
            }
            if (document.location.href.indexOf("routine=3") > 0 || document.location.href.indexOf("routine=7") > 0) {
                GM_setValue('submitting', '1'); // esto es necesario para que no se autosubmitee cuando estamos planeando un ataque manual o transporte
                $("#continue")[0].click();
            }
        }), randomNumber());

    } else if (document.location.href.indexOf("fleet2") > 0 && GM_getValue('submitting') == '1') {
        /* Le hace click al boton enviar */
        var mission = $('.missionName').text();
        if(mission=='Atacar' || mission=='Expedición'){
            setTimeout((function() {
                $("#continue")[0].click();
            }), randomNumber());
        }

    } else if (document.location.href.indexOf("fleet3") > 0 && GM_getValue('submitting') == '1') {
        /* Le hace click al boton enviar */
        var mission = $('.missionName').text();
        if(mission=='AtacarAtacar' || mission=='ExpediciónExpedición'){
            setTimeout((function() {
                GM_setValue('submitting', '0');
                $("#start")[0].click();
            }), randomNumber());
        }
        
    } else if (document.location.href.indexOf("galaxy") > 0) {
        /*
          Esta parte está basada en un script que se llamaba galaxy-explorer pero
          no logro encontrar el nombre del autor original ni el script original
        */
        var m = galaxy_min_range;
        var n = galaxy_max_range;
        var range = Math.floor(Math.random() * (n - m + 1)) + m;
        var galaxy = $("#galaxy_input");
        var system = $("#system_input");
        setTimeout((function() {
            /*Setea valores por defecto / iniciales del formularios */
            var min = 1;
            var max = 499;
            if ((system.val() * 1 - range) >= 1) {
                min = galaxy.val() + ":" + parseInt(system.val() - range);
            } else {
                min = galaxy.val() + ":" + 1;
            }
            if ((system.val() * 1 + range) <= 499) {
                max = galaxy.val() + ":" + parseInt(system.val() * 1 + range);
            } else {
                max = galaxy.val() + ":" + 499;
            }
            /* Genera formulario */
            $("#galaxyContent").before('<table cellspacing="0" cellpadding="5" border="1" style="width: 100%; background-color: black; padding: 10px;" id="galaxytablex"><tr class="info info_headertd" colspan="13" id="interface"></td></tr></table>');
            $("#interface").html('<span>Opciones <select style="visibility: visible;"><option value="i" selected="selected">Espiar inactivos</option><option value="galaxytool">GalaxyTools</option><!--option value="all">Espiar activos (no funciona)</option--></select> Desde: <input type="text" id="min" size="3" value="' + min + '"/> Hasta: <input type="text" id="max" size="3"  value="' + max + '"/> <input type="button" id="scanner" value="Iniciar escaneo" />  <input type="button" id="procesar" value="Procesar espionajes" /></span>');
            /* Initializer */
            $("#scanner").click((function() {
                var min = $("#min").val().split(':');
                var max = $("#max").val().split(':');
                galaxy.val(min[0]);
                system.val(min[1]);
                unsafeWindow.submitForm();
                process(max[0], max[1], $("#interface option:selected").val());
            }));
            
            $("#procesar").click(function() {
                window.location.href = './index.php?page=messages#process';
            });
            
            if (document.location.href.indexOf("#process") > 0) {
                $("#scanner").click();
            }
            
        }), (randomNumber() / 2));

        var process = function(max_galaxy, max_system, who) {           
            var address = window.location + "";
            var galaxy = $("#galaxy_input");
            var system = $("#system_input");
            var i = 0;
            
            var interval = setInterval((function() {
                var atacable = 0;
                $('#galaxytable .row').each(function(index) {
                     if( 
                        !($(this).find("span").hasClass('status_abbr_vacation') ||
                          $(this).find("span").hasClass('status_abbr_noob') ||
                          $(this).find("span").hasClass('status_abbr_outlaw') ||
                          $(this).find("span").hasClass('status_abbr_banned') ||
                          $(this).find("span").hasClass('status_abbr_buddy') ||
                          $(this).find("span").hasClass('status_abbr_friends') ||
                          $(this).find("span").hasClass('status_abbr_ally_own')
                        )
                        && 
                        (
                          $(this).find("span").hasClass('status_abbr_inactive') || 
                          $(this).find("span").hasClass('status_abbr_longinactive') 
                        )
                      ) {       
                        atacable +=1;
                        
                    }
                });
            
                if (atacable > 0 && i < 15) {
                    if (!($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_vacation']").html()) && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_noob']").html()) && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_outlaw']").html()) && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_banned']").html()) && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_buddy']").html()) && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_friends']").html()) && !($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_ally_own']").html())
                        // status_abbr_war  en guerra     
                    ) {
                        if (who == "i") {
                            spyInactivePlayer(galaxy, system, i);
                        } else {
                            //galaxytool
                            clearInterval(interval);
                            retry();
                        }
                    }
                    i++;
                } else {
                    clearInterval(interval);
                    retry();
                }
            }), Math.floor((Math.random() + 1) * mintime));

            function spyInactivePlayer(galaxy, system, i) {
                var prank = parseInt($("#galaxytable .row:eq(" + i + ") .rank").text().match(/\d+/g));
                if (!isNaN(prank) && ($("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_longinactive']").html() || $("#galaxytable .row:eq(" + i + ") span[class*='status_abbr_inactive']").html())) {
                        try {
                            $("#galaxytable .row:eq(" + i + ") a[class*='espionage']").click();
                        } catch (e) {
                          //  console.log(e);
                        }
                }
            }

            function retry() {
                if (system.val() == max_system && galaxy.val() == max_galaxy) {
                    window.location.href = './index.php?page=messages#process';
                } else if (system.val() != max_system) {
                    if (system.val() < 499) {
                        unsafeWindow.submitOnKey(39);
                        setTimeout((function() {
                            process(max_galaxy, max_system, who);
                        }), randomNumber());
                    } else if (galaxy.val() != max_galaxy) {
                        galaxy.val(galaxy.val() * 1 + 1);
                        system.val(1);
                        unsafeWindow.submitForm();
                        setTimeout((function() {
                            process(max_galaxy, max_system, who);
                        }), randomNumber());
                    }
                } else if (galaxy.val() != max_galaxy) {
                    galaxy.val(galaxy.val() * 1 + 1);
                    system.val(1);
                    unsafeWindow.submitForm();
                    setTimeout((function() {
                        process(max_galaxy, max_system, who);
                    }), randomNumber());
                }
            }
        }


    } else if (document.location.href.indexOf("messages") > 0) {
        /* 
           Cuando ingresa a la sección mensajes, utiliza el S p i o H e l p e r   d e   E l a r i  a (que viene 
           incluido en el Antigame Origins) y lo que hace es buscar todas las granjas con
           recursos pero sin defensas ni flota; y guarda esas granjas en el navegador.
           
           Cuando termina de guardar las granjas, lleva al juego a la pantalla de
           movimiento de flotas.
              
        */
        
        if (document.location.href.indexOf("messages#process") > 0) {
            GM_setValue('process', '1'); // lo pone en TRUE para que solo se ejecute 1 vez y no joda cada vez que ingresamos a ver mensajes
        }
        
        if (GM_getValue('process') == '0') {
            // Si está en 0 (FALSE) es porque este listado de granjas ya fue procesado
            return;
        }
        
        $("#101")[0].click(); // Hace click en mensajes nuevos
        /* Un pequeña espera para dar tiempo a que los mensajes se carguen */
        setTimeout((function() {
            try {
                $("#7")[0].click(); // Selecciona pestaña de espionajes para los que tienen comandantes  
            } catch (e) {
              //  console.log(e);
            }
            
            /* Este timeout espera a que se cargue el  S p i o H e l p e r  de  A n t i g a m e   O r i g e  n */
            setTimeout((function() {
                
                /*   Esto lo quito porque cuando el script borra todos los mensajes, 
                    aparece este mensaje incorrectamente e interrumpe la ejecución.
                
                ¿Se cargó correctamente el s p i o h e l p e r?
                if($('spioHelper').length === 0) {
                  alert('El SpioHelper de Antigame debe estar activado y funcionando');
                  return;
                }  */          
            
                var clean = false;
                var targetsList = [];

                var maxLoot = 0;
                var count = 0;
                var totalloot = 0;
                
                $('tr.row').each(function(index) {
                    var loot = +($(this).children(':nth-child(5)').text().replace(/\./g, ''));
                    if (loot > maxLoot) {
                        maxLoot = loot;
                    }
                    totalloot = totalloot + loot;
                    count = count + 1;
                });
                
                
                /* Si la cantidad de espionajes es mayor a 45, agrandar el minloot automaticamente y 
                así se reducirá la lista de ataques a 45 ya que si son muchas paginas no atacará a 
                los de la segunda pagina y puede que en la segunda pagina haya buenas granjas */
                if(count > 45) {
                  // minloot = totalloot / 45; // Saca promedio y ataca solo a los que están por sobre el promedio
                  minloot = maxLoot * 10 / 100; // El botín deberá dar renta mayor al 10% del mejor botín (recomendado porque hará menos ataques)
                }
                
                $('tr.row').each(function(index) {
                    var loot = +($(this).children(':nth-child(5)').text().replace(/\./g, ''));
                    var fleet = +($(this).children(':nth-child(6)').text().replace(/\./g, ''));
                    var defence = +($(this).children(':nth-child(7)').text().replace(/\./g, ''));
                    if (loot >= +minloot && fleet == 0 && defence == 0) {
                        var url = $(this).find('.attackIconButton').attr('href');
                        targetsList.push(url);
                    } else {
                        clean = true;
                        $(this).find('.checkSingle')[0].click();
                    }
                });
                
                if (clean) {
                    $("[name='91']")[0].click();
                    setTimeout((function() {window.location.reload();}), randomNumber() * 2);
                } else {
                    // se ejecuta una vez que se limpió el listado de granjas
                    if (targetsList.length > 0) {
                        $("[name='91']")[0].click();
                        $("[name='91']").click();
                        
                        setTimeout((function() {
                            GM_setValue('process', '0');
                            GM_setValue(cuPlanetKey, planetID);
                            GM_setValue(cuTargetsListKey, targetsList);
                            window.location.href = './index.php?page=movement';
                        }), randomNumber());
                    };
                }

            }), randomNumber());
        }), randomNumber() * 2);

    } else if (document.location.href.indexOf("movement") > 0) {
        /* 
           Cuando ingresa a la sección movieminetos de flotas, lo que hace es revisar si
           hay granjas para ser atacadas, luego comprueba que haya espacios de flota.
           
           Si hay espacios de flota, lo primero que intenta hacer es expediciones (para que
           no sea tan obvio el script) y luego comienza a hacer ataques.
           
           Cuando ya no quedan espacios de flota, el script se queda en la pantalla de
           moviemiento de flotas hasta que regresa alguna flota (el regreso de flota provoca
           un refresco de pantalla y ese refresco inicia el siguiente ataque del script)
        */
        setTimeout((function() {
            var targetsList = GM_getValue(cuTargetsListKey);
            var fleetSlotsCurrent = parseInt($(".fleetSlots").find(".current").text());
            var fleetSlotsAll = parseInt($(".fleetSlots").find(".all").text());
            var fleetSlotsAvailable = fleetSlotsAll - fleetSlotsCurrent - leaveXEmptySlot;
            var expSlotsCurrent = parseInt($(".expSlots").find(".current").text());
            var expSlotsAll = parseInt($(".expSlots").find(".all").text());
            var expSlotsAvailable = expSlotsAll - expSlotsCurrent;
        
            if (fleetSlotsAvailable > 0) {
                var url = '';
                if (expSlotsAvailable > 0 && expeditions) {
                    var exppid = getRamdomPlanet(); // un planeta al azar que no sea el actual
                    if (exppid != GM_getValue(cuPlanetKey)) {
                      /* Manda la exp desde un planeta al azar para que el planeta no se quede sin naves*/
                      url = './index.php?page=fleet1&mission=15&routine=7&cp=' + exppid;
                      window.location.href = url;
                    } else {
                      window.location.reload();
                    }
                } else {               
                   if (targetsList.length > 0) {
                        url = targetsList.shift(); // shift extrae el primer elemento del array
                        if (url !== undefined) {
                            if (GM_getValue(cuPlanetKey) != planetID) {
                                url = url + '&cp=' + GM_getValue(cuPlanetKey);
                            }
                            setTimeout((function() {
                                GM_setValue(cuTargetsListKey, targetsList)
                            }), 0);
                            window.location.href = url;
                        }
                    }
                    if (targetsList.length < 1 || url === undefined) {
                        targetsList = [];
                        setTimeout((function() {
                            GM_setValue(cuTargetsListKey, targetsList)
                        }), 0);      
                        /* Cuando se termina la lista de granjas, si hay X espacios de flota libres, comenzará a espiar nuevamente */
                        if (fleetSlotsAvailable > 5) {
                            var exppid = getRamdomPlanet(); // un planeta al azar que no sea el actual
                            if(exppid === undefined){
                              window.location.reload();
                            }
                            setTimeout((function(pid) {
                                url = './index.php?page=galaxy&cp=' + pid + '#process';
                                window.location.href = url;
                            }), randomNumber(), exppid);
                        }
                    }
                }
            }
        }), randomNumber() * 2);

    } else {   
        return;
    }

});