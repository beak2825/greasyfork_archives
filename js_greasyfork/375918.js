// ==UserScript==
// @name         Hide PVP
// @namespace    https://greasyfork.org/bg/users/180421-emrace
// @version      0.2
// @description  Hides the annoying guerilla fight button
// @author       Emrace
// @match        https://www.erepublik.com/*/military/battlefield/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375918/Hide%20PVP.user.js
// @updateURL https://update.greasyfork.org/scripts/375918/Hide%20PVP.meta.js
// ==/UserScript==

function pesho() {

    var pvp = $('#join_pvp');

    if(pvp.is(':visible'))
    {
        $('#join_pvp').hide()
    }

}

setTimeout(function() {
        pesho();
    },
    2000);
