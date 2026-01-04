// ==UserScript==
// @name         ARES Room Monitoring
// @version      1.0
// @description  ARES Room Monitoring'i aktif eder.
// @author       ARES
// @match        https://gartic.io/
// @match        https://gartic.io/?Ares*
// @grant        none
// @namespace https://greasyfork.org/users/1372148
// @downloadURL https://update.greasyfork.org/scripts/518396/ARES%20Room%20Monitoring.user.js
// @updateURL https://update.greasyfork.org/scripts/518396/ARES%20Room%20Monitoring.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Eğer link "?Ares" içeriyorsa, özel işlevi başlat
    if (window.location.href.includes("?Ares")) {
        alert("ARES Room Monitoring aktif edildi!");
        // Burada istediğiniz özelliği başlatabilirsiniz:
        initAresRoomMonitoring();
    }

    // ARES Room Monitoring için işlev
    function initAresRoomMonitoring() {
        document.body.innerHTML = `
            <div class="kullanicilar-container">
                <h1>ARES ROOM MONITORING <span id="online">Online: <b>0</b></span></h1>
                <p>Bu, ARES Room Monitoring sisteminin aktif olduğunu gösterir.</p>
            </div>`;
        console.log("ARES Room Monitoring başlatıldı!");
    }
})();