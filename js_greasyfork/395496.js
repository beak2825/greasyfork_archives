// ==UserScript==
// @name           Digital Clock & Date figuccio
// @namespace      https://greasyfork.org/users/237458
// @description    digital clock data al passaggio del mouse
// @match          *://*/*
// @version        2.4
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @icon           data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @noframes
// @require        http://code.jquery.com/jquery-latest.js
// @require        https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/395496/Digital%20Clock%20%20Date%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/395496/Digital%20Clock%20%20Date%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery.noConflict();
    const body = document.body;
    var use_date = false;
    var language = GM_getValue('language') || 'it'; // Recupera la lingua dal localStorage o usa 'it' come predefinita
    const languages = {
    en: { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' },
    it: { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' }
    };

    var time_box = document.createElement("div");
    time_box.id = "digital_clock";
    time_box.title = 'Date';
    time_box.setAttribute("style", "left:770px;position:fixed;font-size:20px;line-height:12px;width:auto;padding:3px 6px;color:green!important;background-color:white!important;border:4px solid #c471ed!important;font-family:sans-serif;top:6px;text-align:center;border-radius:10px;z-index:99999999;cursor:pointer;transition:all 0.3s ease;");
    document.body.appendChild(time_box);
    // Recupera le coordinate salvate
var savedPosition = GM_getValue("position");
if (savedPosition) {
    var [left, top] = savedPosition.split(",");
    time_box.style.left = left + "px";
    time_box.style.top = top + "px";
}

document.body.appendChild(time_box);
$(time_box).draggable({
    containment: "window", // Assicura che l'elemento draggable sia confinato alla finestra del browser
    stop: function() {
    // Salva le nuove coordinate quando si smette di trascinare il widget
    var position = $(this).position();
    GM_setValue("position", position.left + "," + position.top);
    }
});

    // Animation effects
    time_box.addEventListener('mouseover', function() {
    time_box.style.transform = 'scale(1.1)';
    time_box.style.boxShadow = '0px 0px 10px #c471ed';
    time_box.style. width='335px';
    use_date = true;
    });

    time_box.addEventListener('mouseout', function() {
        time_box.style.transform = 'scale(1)';
        time_box.style.boxShadow = 'none';
        time_box.style. width='auto';
        use_date = false;
    });

    function setTime() {
        var period = "",
        fulldate = "",
        date = new Date();
        var time = new Date().toLocaleTimeString();
        var ms = date.getMilliseconds();

        if (use_date) {
            var datario = new Date().toLocaleString(language, languages[language]);
            fulldate = datario;
        }

        time_box.textContent = time + period + ":" + ms +
            (use_date ? ("  " + fulldate) : "");
        window.setTimeout(setTime, 70);
    }

    window.setTimeout(setTime, 0);

    time_box.addEventListener('click', function() {
    time_box.style.display = (time_box.style.display != 'none') ? 'none' : 'block';
    });

    // Menu command to change language
    function changeLanguage() {
        language = (language === 'it') ? 'en' : 'it';
        GM_setValue('language', language); // Salva la lingua scelta nel localStorage
        alert(`Lingua cambiata a: ${language}`);
    }
    GM_registerMenuCommand("Cambia Lingua", changeLanguage);

    // Menu command to toggle clock visibility
    function toggleDisplay() {
    time_box.style.display = (time_box.style.display != 'none') ? 'none' : 'block';
    }
    GM_registerMenuCommand("Nascondi/Mostra Orologio", toggleDisplay);
})();
