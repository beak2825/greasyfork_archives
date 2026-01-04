// ==UserScript==
// @name         Primary Start
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Move 'Start Fight' button to primary weapon slot
// @author       monogamy [2563432]
// @match        https://www.torn.com/loader*
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/450501/Primary%20Start.user.js
// @updateURL https://update.greasyfork.org/scripts/450501/Primary%20Start.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // logging?
    const logging = true;

    const startFightCallBack = function(mutationsList, observer) {
        var wimg;
        var dialogButton;
        var weapon_main;
        var modal;

        for(const mutation of mutationsList) {
            $( mutation.addedNodes ).find('#attacker').find('[class^="modal___"]').each( function(){
                modal = $(this)
                if (logging) console.log("sf @target #attacker .modal added node - item: ", modal)
                modal.css( "zIndex", 1 )
            });
            $( mutation.addedNodes ).find('[class^="dialogButtons___"]').each( function(){
                dialogButton = $(this).find('button')
                if (logging) console.log("sf @target .dialogbuttons added node - item: ", dialogButton)
            });
            $( mutation.addedNodes ).find('#attacker #weapon_main').each( function(){
                var descby = $(this).attr("aria-describedby");
                if (descby.startsWith('label_attacker')) {
                    weapon_main = $(this)
                    if (logging) console.log("sf @target #weapon_main found attacker - item: ",descby,":", weapon_main)
                }
            });

            // When defender stats are added, fight is started
            //   bring the actual main button back
            $( mutation.addedNodes ).find('#defender_strength').each( function(){
                $('#attacker button').remove()
                $('#attacker #weapon_main figure').css("display","")
            });

            if (typeof dialogButton !== 'undefined' && typeof weapon_main !== 'undefined') {
                dialogButton.detach();
                dialogButton.css("height", "100%").css("width", "100%");
                wimg = weapon_main.find('figure');
                wimg.before(dialogButton);
                wimg.css("display", "none");
            }
        }
    };
    const startFightMove = new MutationObserver(startFightCallBack);
    const startFightMoveConfig = { attributes: false, childList: true, subtree: true };

    $( '#body' ).each(function(){
        if (logging) console.log("startFightMove: ", $( this[0] ))
        startFightMove.observe( $( this )[0], startFightMoveConfig);
    })
})();
