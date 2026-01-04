// ==UserScript==
// @name               Yahoo Mail Tweaks
// @namespace          https://greasyfork.org/en/users/105361-randomusername404
// @description        Tweaks pour Yahoo Mail.
// @include            https://mg.mail.yahoo.com/*
// @include            https://mail.yahoo.com/*
// @version            1.04
// @run-at             document-start
// @require            https://code.jquery.com/jquery-3.2.1.min.js
// @author             RandomUsername404
// @grant              none
// @icon               https://s.yimg.com/nq/nr/img/favicon_LFWFGUw4cMt2cbVGy0T6xBqoJ4BBr2VKY56xSLK4IX0.ico
// @downloadURL https://update.greasyfork.org/scripts/38882/Yahoo%20Mail%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/38882/Yahoo%20Mail%20Tweaks.meta.js
// ==/UserScript==

$(document).ready(function () {
  
    $(".H_0").css("margin-bottom","-45px");
    $(".ybar-logo-standard").css("margin-left","25px");
    $(".D_F.ek_BB.iz_A.iy_h").hide();

    $('div[data-test-id="comms-properties"]').insertAfter('.D_F .Q_6EGz');

});

// Clique sur menu gauche ou bouton retour
$(document).on("click", ".D_F, .c27KHO0_n", function (event) {

            setTimeout(function () {
            $(".H_0").css("margin-bottom","-45px");
            $('div[data-test-id="comms-properties"]').insertAfter('.D_F .Q_6EGz');
        }, 400);

});
