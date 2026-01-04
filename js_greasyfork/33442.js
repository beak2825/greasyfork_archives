// ==UserScript==
// @name        ShowUp.TV LeavingViaMSGWarning
// @author      fapka
// @namespace   fapkamaster@gmail.com
// @description Ostrzeżenie przed opuszczeniem własnej transmisji.
// @include     https://showup.tv/site/start_transmission*
// @version     0.2.1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/33442/ShowUpTV%20LeavingViaMSGWarning.user.js
// @updateURL https://update.greasyfork.org/scripts/33442/ShowUpTV%20LeavingViaMSGWarning.meta.js
// ==/UserScript==

setTimeout(() => {
$(".blue-btn").on("click", function(event){
    if(confirm("Potwierdź opuszczenie transmisji."))
    {
       return true;
    }
    else
    {
        event.preventDefault();
        return false;
    }
})
}, 1000);
