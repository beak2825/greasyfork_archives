// ==UserScript==
// @name         Captcha Alert
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Začne zvonit když se objeví Captcha.
// @author       Darxeal
// @match        https://*/game.php?*
// @downloadURL https://update.greasyfork.org/scripts/441855/Captcha%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/441855/Captcha%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".server_info").prepend("<b style='color: green' id='alert-info'>Captcha Alert aktivní</b>");

    async function alarm() {
        let sound = new Audio("https://d1490khl9dq1ow.cloudfront.net/audio/sfx/mp3preview/BsTwCwBHBjzwub4i4/alarm-clock-buzzer-beeps_MyERv24__NWM.mp3");
        await sound.play();
        alert("Captcha!");
        sound.pause();
    }

    var interval = setInterval(() => {
        if ($(".captcha").is(":visible")) {
            alarm();
            clearInterval(interval);
            $("#alert-info").remove();
        }
    }, 1000);
})();