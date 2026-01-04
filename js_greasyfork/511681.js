// ==UserScript==
// @name         Bettermod Dorgathon [NI]
// @author       Dawid
// @match        https://*.margonem.pl
// @match        *://*.margonem.com/*
// @grant        none
// @description  Ramki
// @version 0.0.1.20241006145739
// @namespace https://greasyfork.org/users/1377504
// @downloadURL https://update.greasyfork.org/scripts/511681/Bettermod%20Dorgathon%20%5BNI%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/511681/Bettermod%20Dorgathon%20%5BNI%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
if (getCookie('interface') === 'ni'){
    $(`<style>


/* NADPISANIE DOMYŚLNYCH RAMEK */

.bottomItem .highlight.h-exist,.bottomItem .icon.h-exist,.item .highlight.h-exist,.item .icon.h-exist{
    background: url(UsuwamDomyślneRamki.pl);
}


/* RAMKI */

.highlight.t-upgraded{
        box-shadow: inset 0 0 5px 3px yellow;
}

.highlight.t-uniupg{

        box-shadow: inset 0 0 5px 3px orange;
  }


.highlight.t-her{

        box-shadow: inset 0 0 5px 3px #2090FE;
  }


.highlight.t-leg{

       box-shadow: inset 0 0 5px 3px #808;
  }


</style>`).appendTo('body');
}
preload();
})();

