// ==UserScript==
// @name         CDM : Textarea font fix
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Corrige la police des textarea
// @author       Flamby67
// @match        http*://*.cm-cic.fr/*
// @exclude      http*://deskportal2003-si.cm-cic.fr/*
// @exclude      http*://*_pid=Menu*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396547/CDM%20%3A%20Textarea%20font%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/396547/CDM%20%3A%20Textarea%20font%20fix.meta.js
// ==/UserScript==

(function() {
    var $j = jQueryWlib;
    $j(document).ready(function() {
        $j('textarea').css({
            'font-family': 'Arial,Helvetica,sans-serif',
            'font-size': '13px'
        });
    });
})();