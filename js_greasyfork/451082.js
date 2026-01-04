// ==UserScript==
// @name     tauron-MAX4
// @namespace dodaje do koszyka na MAXa
// @description Skrypt zwiększa automatycznie ilość węgla w koszyku do 4 palet na stronie tauron.pl
// @license MIT
// @version  1.07
// @grant    none
// @include  *sklep.tauron.pl*
// @namespace https://greasyfork.org/users/952625
// @downloadURL https://update.greasyfork.org/scripts/451082/tauron-MAX4.user.js
// @updateURL https://update.greasyfork.org/scripts/451082/tauron-MAX4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.getElementById("n_collapse_28").ariaExpanded="false";
    document.getElementById("n_collapse_28").style.height=0;
    document.getElementById("n_collapse_28").style.display = "none";
    document.getElementById("carousel-example-generic").style.display = "none";

    //---------------------------------
    (function($){$('.element').click();})(jQuery);
    let a;


    for(let xx=document.querySelector('input[name=quantity]').value; xx<4; xx++){
        //a=document.querySelector('input[name=quantity]').value;
        //alert("A="+a);
        $(".btn-plus").trigger("click");
    };

})();