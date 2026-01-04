// ==UserScript==
// @name         SSC Polish letters
// @namespace    el nino
// @version      1.10
// @author       el nino
// @description  SSC Convert Polish letters in ISO-8859-1 to ISO-8859-2
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @include      *://www.skyscrapercity.com/*
// @downloadURL https://update.greasyfork.org/scripts/369520/SSC%20Polish%20letters.user.js
// @updateURL https://update.greasyfork.org/scripts/369520/SSC%20Polish%20letters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var letters88591 = '¡±ÆæÊê£³ÑñÓó¦¶¬¼¯¿';
    var letters88592 = 'ĄąĆćĘęŁłŃńÓóŚśŹźŻż';

    $('[id^="td_post_"]').each(function() {
        for (i = 0; i < letters88591.length; i++) {
            var letter88591 = letters88591.substr(i, 1);
            var letter88592 = letters88592.substr(i, 1);
            this.innerHTML = this.innerHTML.replace(letter88591, letter88592);
        }        
    });
})();