// ==UserScript==
// @name         Xthor: fix affichage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix affichage de la page browse.php et de la page gang.php
// @author       Poseidon
// @match        https://xthor.bz/browse.php*
// @match        https://xthor.bz/gang.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28450/Xthor%3A%20fix%20affichage.user.js
// @updateURL https://update.greasyfork.org/scripts/28450/Xthor%3A%20fix%20affichage.meta.js
// ==/UserScript==

(function() {
    var BROWSE_REGEX = /https:\/\/xthor\.bz\/browse\.php.*/i;
    var BROWSE_URL = '#ancri > div > div.article > table:nth-child(10) > ';

    var GANG_REGEX = /^https:\/\/xthor\.bz\/gang\.php\?id=\d.*/i;
    var GANG_URL = '#ancri > div > table:nth-child(10) >';

    var startUrl = "";
    if (GANG_REGEX.test(window.location.href))
        startUrl = GANG_URL;
    else if (BROWSE_REGEX.test(window.location.href))
        startUrl = BROWSE_URL;

    var GangPerso= false;
    var CheckIsValid = false;
    if (startUrl !== "")
    {
        if ( GangPerso === false)
        {

            $(startUrl + 'tbody > tr > td > span').each(function() {
                $(this)[0].className = "";
                CheckIsValid = true;
            });

            if (CheckIsValid === false)
            {
                startUrl = '#ancri > div > table:nth-child(9) >';
                GangPerso = true;
            }
        }

        if (GangPerso === true )
        {
            $(startUrl + 'tbody > tr > td > span').each(function() {
                $(this)[0].className = "";
            });
        }
    }
})();