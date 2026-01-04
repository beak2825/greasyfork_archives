// ==UserScript==
// @name           Dante Auto Task Checker
// @name:pl        Dante Auto Task Checker
// @namespace      http://tampermonkey.net/
// @version        0.2
// @description    Script auto refreshes Dante page after posting a task and inform if it's failed or completed.
// @description:pl Skrypt automatycznie odświeża stronę Dante po udostępnieniu zadania i informuje, czy zadanie zostało zaliczone.
// @author         DaveIT
// @match          https://dante.iis.p.lodz.pl/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/408506/Dante%20Auto%20Task%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/408506/Dante%20Auto%20Task%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var oldTitle = document.title;
    var spinner = document.querySelector('.fa-spinner.fa-spin');
    var failed = document.querySelector('.fa-times-circle.text-danger');
    var sounds = {
        success: new Audio('https://free-sounds.ct8.pl/success.mp3'),
        fail: new Audio('https://free-sounds.ct8.pl/fail.mp3')
    }

    var button = document.querySelector('.btn.btn-warning.btn-block.font-weight-bold');

    if(button !== null) {
        button.onclick = function() {
            setTimeout(()=> {
                document.querySelector('.fa.fa-book.fa-fw').click();
                window.location.reload(true);
            }, 1000);
        }
    }

    document.onfocus = function() {
        document.title = oldTitle;
    }

    if(spinner != null && failed == null) {
        setTimeout(()=> {
            window.location.reload(true);
        }, 1000);
    } else if(failed != null) {
        document.title = 'Niezaliczono zadania';
        sounds.fail.play();
    } else {
        document.title = 'Zaliczono zadanie';
        sounds.success.play();
    }


})();