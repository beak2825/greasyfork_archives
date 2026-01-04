// ==UserScript==
// @name         Invert all colors
// @namespace    -
// @version      1.3
// @description  lol its funny
// @author       Stew
// @match        *://sandbox.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sploop.io/*
// @match        *://discord.com/*
// @match        https://*.youtube.com/*
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://mope.io/*
// @match        *://beta.mope.io/*
// @match        *://m0pe.io/*
// @match        *://learninganimals.club/*
// @match        *://beta.tailbite.me/*
// @match        *://beta.zooeducation.space/*
// @match        *://tailbite.me/*
// @match        *://animalfun.club/*
// @match        *://zooeducation.space/*
// @match        *://experimental.mope.io/*
// @match        *://krunker.io/*
// @match        *://diep.io/*
// @match        *://arras.io/
// @match        *://arras.netlify.app/
// @match        *://woomy-arras.io/
// @match       *.popsplit.us/*
// @match       *.xgar.io/*
// @match       *.5bz.esy.es/*
// @match       *.3rb.be/*
// @match       *.flaresserver.tk/*
// @match       *.cellcraft.io/*
// @match       *.agar.pro/*
// @match       *.cellcraft.io/*
// @match       *.agarios.com/*
// @match       *.agarz.com/*
// @match       *.mgar.io/*
// @match       *.agariogame.club/*
// @match       *.old.ogarul.io/*
// @match       *.agarly.com/*
// @match       *.bubble.am/*
// @match       *.gota.io/*
// @match       *.vincebots.ovh/*
// @match       *.agariohub.io/client/*
// @match       *.agarserv.com/*
// @match       *.agarioservers.ga/*
// @match       *.alis.io/*
// @match       *.astr.io/*
// @match       *.agarioplay.org/*
// @match       *.agario.city/*
// @match       *.germs.io/*
// @match       *.agarioforums.io/*
// @match       *.agariofun.com/*
// @match       *.agar.pro/*
// @match       *.agarabi.com/*
// @match       *.warball.co/*
// @match       *.agariom.net/*
// @match       *.agar.re/*
// @match       *.www.agardark.com/*
// @match       *.easyagario.com/*
// @match       *.playagario.org/*
// @match       *.agariofr.com/*
// @match       *.agariowun.com/*
// @match       *.agarios.org/*
// @match       *.agariowun.com/*
// @match       *.usagar.com/*
// @match       *.agarioplay.com/*
// @match       *.privateagario.net/*
// @match       *.agariorage.com/*
// @match       *.blong.io/*
// @match       *.agar.blue/*
// @match       *.agar.bio/*
// @match       *.agario.se/*
// @match       *.nbkio.com/*
// @match       *.agariohit.com/*
// @match       *.agariomultiplayer.com/*
// @match       *.agariogameplay.com/*
// @match       *.agariowow.com/*
// @match       *.bestagario.net/*
// @match       *.tytio.com/*
// @match       *.kralagario.com/*
// @match       *.agario.zafer2.com/*
// @match       *.agarprivateserver.net/*
// @match       *.agarca.com/*
// @match       *.agarioplay.mobi/*
// @match       *.agario.mobi*
// @match       *.abs0rb.me/*
// @match       *.agario.us/*
// @match       *.agariojoy.com/*
// @match       *.agario.ch/*
// @match       *.ioagar.us/*
// @match       *.play.agario0.com/*
// @match       *.agario.run/*
// @match       *.agarpvp.us/*
// @match       *.agario.pw/*
// @match       *.ogario.net/*
// @match       *.ogario.net/*
// @match       *.nbk.io/*
// @match       *.agariofly.com/*
// @match       *.agario.info/*
// @match       *.inciagario.com/*
// @match       *.agar.io.biz.tr/*
// @match       *.agariown.com/*
// @match       *.agario.dk/*
// @match       *.agarioo.lol/*
// @match       *.agario.gen.tr/*
// @match       *.agarioprivateserver.us/*
// @match       *.agariot.com/*
// @match       *.agarw.com/*
// @match       *.agario.city/*
// @match       *.agario.ovh/*
// @match       *.feedy.io/*
// @match       *.agar.io/*
// @match       *.agar.zircon.at/*
// @match       *.minemoorealt.github.io/*
// @match       *.agario.bz/*
// @match       *.cell.sh/*
// @match       *.c0nsume.me/*
// @match       *.agar.red/*
// @match       *.trydox.com/*
// @match       *.agarix.esy.es/*
// @match       *.blobsonline.com/*
// @match       *.agr-game.ml/*
// @match       *.xgar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430225/Invert%20all%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/430225/Invert%20all%20colors.meta.js
// ==/UserScript==

"use strict";
!function () {
    var e = "html {-webkit-filter: invert(100%);-moz-filter: invert(100%);-o-filter: invert(1" +
                "00%);-ms-filter: invert(100%); }",
        t = document.getElementsByTagName("head")[0],
        i = document.createElement("style");
    window.counter
        ? (window.counter++, window.counter % 2 == 0 && (e = "html {-webkit-filter: invert(0%); -moz-filter: invert(0%); -o-filter: invert(0%)" +
                "; -ms-filter: invert(0%); }"))
        : window.counter = 1,
    i.type = "text/css",
    i.styleSheet
        ? i.styleSheet.cssText = e
        : i.appendChild(document.createTextNode(e)),
    t.appendChild(i)
}();