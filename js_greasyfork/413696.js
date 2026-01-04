// ==UserScript==
// @name         DH3 Zeragon's Flippers
// @namespace    com.anwinity.dh3
// @version      1.0.1
// @description  Forget your woes <3
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413696/DH3%20Zeragon%27s%20Flippers.user.js
// @updateURL https://update.greasyfork.org/scripts/413696/DH3%20Zeragon%27s%20Flippers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        if(!window.var_username) {
            setTimeout(init, 1000);
            return;
        }

        if(!["zeragon", "anwinity"].includes(window.var_username.toLowerCase())) {
            return;
        }

        $("#item-box-flippers").show();
        $("#item-box-flippers > item-flipers").text("1");
        setTimeout(function() {
            $("#item-box-flippers").show();
            $("#item-box-flippers > item-flipers").text("1");
        }, 5000);

        $("body").prepend(`<div id="z-flippers" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; opacity: 0; display: none;"><img src="images/flippers.png" style="width: 100%; height: 100%" /></div>`);

        const originalNavigate = window.navigate;
        window.navigate = function() {
            originalNavigate.apply(this, arguments);
            if(Math.random() < 0.05) {
                let z = $("#z-flippers");
                z.show();
                z.animate({opacity: 0.8}, 1000, function() {
                    setTimeout(function() {
                        z.animate({opacity: 0}, 1000, function() {
                            z.hide();
                        });
                    }, 500);
                });
            }
        };
    }



    $(init);

})();