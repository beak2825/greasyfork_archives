// ==UserScript==
// @name         current DateTime
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       You
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/messagetoplayer/add/*
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/messagetoplayer/add/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367800/current%20DateTime.user.js
// @updateURL https://update.greasyfork.org/scripts/367800/current%20DateTime.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //dateButton
    var fixDate = document.createElement("div");
    fixDate.innerHTML = "Fix DateTime";
    fixDate.id = "dateTimeButton";
    fixDate.className = "rubButt specialButt";
    document.getElementById("supWrapper").appendChild(fixDate);

    (function($) { //Django wrapper
        $( "#dateTimeButton" ).click(function() { //dateButton click handler
            var UTC = new Date();
            var strMonth;
            var strDate;
            strMonth = /.(\d{2})(?=.\d{4})/.exec(UTC.toLocaleString())[1];
            strDate = /^\d{2}/.exec(UTC.toLocaleString());
            //+1 hour for timestamp correction
            //-3 for localTime GMT+0300 correction
            if (document.getElementById("id_body").value.match(/\(UTC\)/) != null){
                UTC.setHours(UTC.getHours() - 2);
                document.getElementById("id_body").value = document.getElementById("id_body").value.replace(/\d{2}:\d{2} [\w|\W]{2,3}/,
                                                                                                            UTC.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
            }
            else {
                UTC.setHours(UTC.getHours() + 1);
                document.getElementById("id_body").value = document.getElementById("id_body").value.replace(/\d{2}:\d{2} [\w|\W]{2,3}/,
                                                                                                            UTC.toLocaleString('ru-RU', { hour: 'numeric', minute: 'numeric', hour12: false }) + " МСК");
            }
            document.getElementById("id_body").value = document.getElementById("id_body").value.replace(/\d{4}.\d{2}.\d{2}/, (UTC.getFullYear() + "." + strMonth + "." + strDate));
        });
    })(django.jQuery);

})();