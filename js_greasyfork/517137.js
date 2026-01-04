// ==UserScript==
// @name         Redirect Bing Maps to Mapy.cz
// @name:cs      Načtení Mapy.cz místo Bing map
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redirects Bing Maps URLs to Mapy.cz with the same coordinates and optional search query
// @description:cs Při načtení Bing map z výsledků bing vyhledávání se stránka automaticky přepošle na Mapy.cz
// @author       T0biasCZe
// @match        https://www.bing.com/maps*
// @downloadURL https://update.greasyfork.org/scripts/517137/Redirect%20Bing%20Maps%20to%20Mapycz.user.js
// @updateURL https://update.greasyfork.org/scripts/517137/Redirect%20Bing%20Maps%20to%20Mapycz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);

    const query = urlParams.get('q') || "";
    const latLong = urlParams.get('cp');
    const level = urlParams.get('lvl') || "13";

    if (latLong) {
        const [lat, long] = latLong.split('~');

        let mapyUrl = `https://mapy.cz/zakladni?x=${long}&y=${lat}&z=${level}`;
        if (query) {
            mapyUrl += `&q=${encodeURIComponent(query)}`;
        }

        window.location.replace(mapyUrl);
    }
})();
