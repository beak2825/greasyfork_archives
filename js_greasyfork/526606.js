// ==UserScript==
// @name         Reload on HTTP Error - GF
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Recharger automatiquement en cas d'erreur HTTP
// @author       Zinedeen
// @match        https://*.joa.fr/*
// @icon         https://www.joa.fr/app/img/favicon-32x32.png
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526606/Reload%20on%20HTTP%20Error%20-%20GF.user.js
// @updateURL https://update.greasyfork.org/scripts/526606/Reload%20on%20HTTP%20Error%20-%20GF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_log("✅ Script Tampermonkey chargé");

    // Vérification du statut HTTP avec GM_xmlhttpRequest
    GM_xmlhttpRequest({
        method: "HEAD",
        url: window.location.href,
        onload: function(response) {
            GM_log(`📡 Statut HTTP détecté : ${response.status}`);

            if (response.status >= 400) {
                const error_page = `
                        <body style="width: 100%; height: 100%; margin: 0; background-color: #222F;">
                            <div style='background-color: #222F; width: 100%; height: 100%;
                             background-image: url("https://www.joa.fr/app/img/cocarde_logo_blanc.svg");
                             background-position: center; background-repeat: no-repeat; background-size: 35%;
                             '>
                            
                            </div>
                        </body>                 
                `;
                GM_log(`❌ Erreur HTTP ${response.status} détectée, changement de dom`);
                document.documentElement.innerHTML = error_page;
                document.documentElement.setAttribute("style", "width: 100%; height: 100%");
                checkPageStatus()

                // setTimeout(() => {
                //     location.reload();
                // }, 5000);
            }
        },
        onerror: function (error) {
            GM_log("⚠️ Erreur lors de la requête HTTP :", error);
        }
    });
})();

function checkPageStatus() {
    GM_xmlhttpRequest({
        method: "HEAD",
        url: window.location.href,
        onload: function(response) {
            GM_log(`📡 Statut HTTP détecté : ${response.status}`);

            if (response.status < 400) {
                window.location.href = window.location.href;
            } else {
                setTimeout(checkPageStatus, 5000);
            }
        },
        onerror: function (error) {
            GM_log("⚠️ Erreur lors de la requête HTTP :", error);
        }
    });
}