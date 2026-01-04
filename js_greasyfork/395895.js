// ==UserScript==
// @name         KimCartoon AutoNext AutoFullscreen AutoBetaServer
// @namespace    http://kimcartoon.to
// @version      0.1
// @description  Autonext Kimcartoons, option to skip intro.
// @author       Trystan Rivers
// @match        https://kimcartoon.to/Cartoon*
// @grant        GM.getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/395895/KimCartoon%20AutoNext%20AutoFullscreen%20AutoBetaServer.user.js
// @updateURL https://update.greasyfork.org/scripts/395895/KimCartoon%20AutoNext%20AutoFullscreen%20AutoBetaServer.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    var updateLink = "&s=beta";

    let introLength = await GM.getValue("IntroTime", 0);

    console.log(introLength);

    var btnPrev = $("#Img1").parent()[0];
    if (btnPrev !== undefined) {
        btnPrev.href += updateLink;
    }

    var btnNext = $("#Img2").parent()[0];
    if (btnNext !== undefined) {
        btnNext.href += updateLink;
    }

    if (myPlayer !== undefined) {
        myPlayer.on('ended', function() {
            if (btnNext !== undefined) {
                window.location.replace(btnNext.href);
            }
        });

        if (myPlayer.isReady_) {
            myPlayer.play();

            myPlayer.currentTime(introLength);

            // myPlayer.requestFullscreen();
            $(".vjs-fullscreen-control").click();
        }
    }
})();