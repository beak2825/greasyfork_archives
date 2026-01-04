// ==UserScript==
// @name            InfoU (Alpha)
// @version         V2.9.1
// @description     Check and return a value to check if you are throttled.
// @author          santyg2001
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license         GNU GPLv3
// @icon            https://i.imgur.com/JIKOE6W.png
// @namespace https://greasyfork.org/users/228369
// @downloadURL https://update.greasyfork.org/scripts/374921/InfoU%20%28Alpha%29.user.js
// @updateURL https://update.greasyfork.org/scripts/374921/InfoU%20%28Alpha%29.meta.js
// ==/UserScript==

/* global W */
/* global $ */
window.addEventListener('load', function(){
  // Everything has loaded! ----

  //Checking for language and setting the strings
  var langu = $('#sidepanel-prefs > div > div > form > div:nth-child(4) > select')[0].value
  if (langu == "es-419") {
    //Español Latinoamerica / Spanish (es-419)
    var blocked = "Presentas un bloqueo de edición, por favor comunicate con nosotros al hilo correcto del foro Colombiano."
    var allok = "InfoU Script: Puedes editar normalmente no hay bloqueo."
  }else if (langu == "es") {
    //Español España / Spanish (es)
    blocked = "InfoU Script: Presentas un bloqueo de edición, por favor comunicate con nosotros al hilo correcto del foro Colombiano."
    allok = "InfoU Script: Puedes editar normalmente no hay bloqueo"
  }else if (langu == "en-US") {
    //Inglés / English (en-US)
    blocked = "Your edits will not be counted in your profile since you were blocked."
    allok = "I already checked and everything is ok, you can edit freely."
  } else{
    //Mensaje de Invitación - Invitation Message to contact me
    var scriptname = GM_info.script.name
    blocked = scriptname + "does not support your current language settings of" + langu + ", please contact @santyg2001 to get this added."
    allok = scriptname + "does not support your current language settings of" + langu + ", please contact @santyg2001 to get this added."
  }


(function() {
    'use strict';
    function checkIfBlocked() {
        var valor = W.loginManager.user.mapEditingBanned;
        console.log("Checkar: El valor arrojado al consultar es" + valor)
        if (!valor) {
            alert(allok);
            console.log("Checkar: Paso 1 Listo - Checkar");
        } else {
            alert(blocked);
            console.log("Checkar: Paso 2 Listo - Checkar");
        };
    };
    //Thanks to Dude495
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.isLoggedIn()) {
            checkIfBlocked();
            console.log(GM_info.script.name, 'Initialized');
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        };
    };
    bootstrap();
    // - - //
})();
    });