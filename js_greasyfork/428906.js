// ==UserScript==
// @name         Kalendár pre "Očkovanie Portál"
// @namespace    Ambee & Očkovanie
// @version      0.2
// @description  Pridá kalendár na stránku Očkovanie/NCZI
// @author       FNsP NZ IT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @include      https://vakcinacia-portal.nczisk.sk/web/guest/ockovanie*listDay*
// @icon         https://www.google.com/s2/favicons?domain=nczisk.sk
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428906/Kalend%C3%A1r%20pre%20%22O%C4%8Dkovanie%20Port%C3%A1l%22.user.js
// @updateURL https://update.greasyfork.org/scripts/428906/Kalend%C3%A1r%20pre%20%22O%C4%8Dkovanie%20Port%C3%A1l%22.meta.js
// ==/UserScript==

(function() {

    function addDatepicker(){
        $('head').append('<link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/cupertino/jquery-ui.min.css" rel="stylesheet" type="text/css">');
        $('head').append('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"> type="text/javascript"');
        $('head').append('<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"> type="text/javascript"');
        $('ul.navbar-blank.navbar-nav.navbar-site').append('<li class="lfr-nav-item nav-item"><input type="text" id="datepicker" autocomplete="off" style="position:relative; left:14px"></li>');

        $('#datepicker').datepicker({
            firstDay: 1,
            dayNames: ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'],
            dayNamesMin: ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'],
            monthNames: ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december'],
            monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'],
            dateFormat: 'yy-mm-dd'
        });

        $('#datepicker').on('change', function(event) {
            var datePattern = /(\d{4}-\d{2}-\d{2})/,
                newDate = event.target.value,
                currentURL = window.location.href,
                newURL = currentURL.replace(datePattern, newDate);
            window.location.href = newURL;
        });
    }

    setTimeout(addDatepicker, 15000)


})();