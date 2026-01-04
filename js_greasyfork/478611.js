// ==UserScript==
// @name         invidious.lunar.icu to youtube
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Redirect invidious.lunar.icu to youtube
// @author       S30N1K
// @license      MIT
// @match        *://yewtu.be/watch?v=*
// @match        *://invidious.snopyta.org/watch?v=*
// @match        *://vid.puffyan.us/watch?v=*
// @match        *://yt.artemislena.eu/watch?v=*
// @match        *://invidious.flokinet.to/watch?v=*
// @match        *://invidious.projectsegfau.lt/watch?v=*
// @match        *://inv.bp.projectsegfau.lt/watch?v=*
// @match        *://invidious.slipfox.xyz/watch?v=*
// @match        *://invidious.privacydev.net/watch?v=*
// @match        *://vid.priv.au/watch?v=*
// @match        *://iv.melmac.space/watch?v=*
// @match        *://iv.ggtyler.dev/watch?v=*
// @match        *://invidious.lunar.icu/watch?v=*
// @match        *://inv.zzls.xyz/watch?v=*
// @match        *://inv.tux.pizza/watch?v=*
// @match        *://invidious.protokolla.fi/watch?v=*
// @match        *://onion.tube/watch?v=*
// @match        *://inv.in.projectsegfau.lt/watch?v=*
// @match        *://inv.citw.lgbt/watch?v=*
// @match        *://yt.oelrichsgarcia.de/watch?v=*
// @match        *://invidious.no-logs.com/watch?v=*
// @match        *://invidious.io.lol/watch?v=*
// @match        *://iv.nboeck.de/watch?v=*
// @match        *://invidious.private.coffee/watch?v=*
// @match        *://yt.drgnz.club/watch?v=*
// @match        *://invidious.asir.dev/watch?v=*
// @match        *://iv.datura.network /watch?v=*
// @match        *://invidious.fdn.fr/watch?v=*
// @match        *://anontube.lvkaszus.pl/watch?v=*
// @match        *://invidious.perennialte.ch/watch?v=*
// @match        *://yt.cdaut.de/watch?v=*
// @match        *://invidious.drgns.space/watch?v=*
// @match        *://inv.us.projectsegfau.lt/watch?v=*
// @match        *://invidious.einfachzocken.eu/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lunar.icu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478611/invidiouslunaricu%20to%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/478611/invidiouslunaricu%20to%20youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const [,videoId] = location.href.match(/v=(.*)/)
    if (videoId){
        console.log(videoId)
        location.href = "https://www.youtube.com/watch?v=" + videoId
    }
})();