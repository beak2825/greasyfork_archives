// ==UserScript==
// @name         Usis Advising Printer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A button to download advised routine
// @author       You
// @match        https://usis.bracu.ac.bd/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458733/Usis%20Advising%20Printer.user.js
// @updateURL https://update.greasyfork.org/scripts/458733/Usis%20Advising%20Printer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btn = document.createElement('button');
    btn.innerHTML = "Print my advising";

    btn.onclick = () => {
        try {
            var id = downloadAdvisingSlipFormWindow.toString().substring(353,360);
            if($('#academiaSession').val() == ""){
                alert("Please select advising session.");
                return;
            }
            alert("If you see an error, please relogin usis and try again");
            window.location.href = "https://usis.bracu.ac.bd/academia/studentCourse/createSchedulePDF?content=pdf&studentId="+id+"&sessionId="+$('#academiaSession').val();
        }
        catch(err) {
            alert("Please navigate to Bank Payment Slip.");
        }
    };


    var widgets = document.getElementsByClassName("ui-widget-header")[0];
    widgets.insertBefore(btn,widgets[0]);
})();