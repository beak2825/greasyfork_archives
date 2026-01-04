// ==UserScript==
// @name         Auto Select Radio buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405046/Auto%20Select%20Radio%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/405046/Auto%20Select%20Radio%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(() => {
        $( document ).ready(function() {
            $('body').append($('<button>').css('z-index','100000000000000000000').css('top','0').css('position','fixed').text('Auto Select No').on('click',function() {
                $( "input[type=radio]" ).each(function( index ) {
                    var grpName = $( this ).attr('name');
                    var selectedVal = $("input[type=radio][name=" + grpName + "]:checked").val();
                    var idVal = $(this).attr("id");
                    var id = $("label[for='"+idVal+"']").text();
                    if (!selectedVal && ($( this ).val() == 'No' || $( this ).val() == 'no' || (id == 'No'))) {
                        $( this ).prop("checked", true);
                    }
                });
            }));
        });
    });

})();