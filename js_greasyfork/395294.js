// ==UserScript==
// @name         Quick Skin Changer
// @namespace    Quick Skin Changer
// @version      1.0
// @description  Skin quick change
// @homepage     http://agarioforums.net/member.php?action=profile&uid=21263
// @author       Samira
// @license      MIT
// @match        http://agma.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395294/Quick%20Skin%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/395294/Quick%20Skin%20Changer.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var useSkin = function(skinId) {
        window.azad(true)

        setTimeout(function(){

            $('#skinExampleMenu').click();

            var checkLoaded = function() {
                var loaded = ($('#skinsFree tr').length > 1);
                if (loaded) {
                    toggleSkin(skinId);

                    setTimeout(function(){
                        $('#shopModalDialog button.close').click();

                        setTimeout(function(){
                            setNick(document.getElementById('nick').value);
                        }, 200);
                    }, 200);
                } else {
                    setTimeout(checkLoaded, 300);
                }
            };
            checkLoaded();
        }, 200);
    }

    window.addEventListener('keydown', function(event)
    {
        // Do nothing if a menu is open
        if (document.getElementById('overlays').style.display != 'none' || document.getElementById('advert').style.display != 'none') {
            return;
        }
        // Ignore text input field so typing in them is possible
        if (document.activeElement.type == 'text' || document.activeElement.type == 'password') {
            return;
        }

        if (event.keyCode == 49) {
            useSkin(3828);
        }
        if (event.keyCode == 50) {
            useSkin(3704);
        }
        if (event.keyCode == 51) {
            useSkin(2535);
        }
        if (event.keyCode == 52) {
            useSkin(1826);
        }
    });
})();


console.log('Quick skin changer successfully loaded!');