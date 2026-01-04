// ==UserScript==
// @name       Сирена
// @namespace  SHATL
// @version    V6.03
// @description  enter something useful
// @match    https://imperia.mail.ru/imperia/game_v6/game/village.php*
// @match    https://*.imperiaonline.org/imperia/game_v6/game/village.php
// @match    https://rbkgames.com/games/imperiaonline2/play/
// @match    https://*/*
// @copyright  2017, You
// @downloadURL https://update.greasyfork.org/scripts/35296/%D0%A1%D0%B8%D1%80%D0%B5%D0%BD%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/35296/%D0%A1%D0%B8%D1%80%D0%B5%D0%BD%D0%B0.meta.js
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}


//document.body.style.background = 'aqua';
setInterval(
function checker(){
var sound = document.createElement('object');
sound.setAttribute('width', '5px');
sound.setAttribute('height', '5px');
sound.setAttribute('data', 'https://www.soundjay.com/transportation/sounds/car-alarm-1.mp3');
       if( $('.ui-missions').html() != null && $('.ui-missions .attack-me').html() != null){
 	document.body.appendChild(sound);
    document.body.style.background = 'red';
        }
       if( $('.ui-missions').html() != null && $('.ui-missions .attack-alliance').html() != null){
 	document.body.appendChild(sound);
    document.body.style.background = 'red';
        }
},5000);
