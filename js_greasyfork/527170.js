// ==UserScript==
// @name         nyaa_tosho_archive_404
// @version      1.0.0
// @namespace    guyman
// @description  nyaa 404 go to tosho
// @author       guyman
// @license      MIT
// @match        https://nyaa.si/view/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/527170/nyaa_tosho_archive_404.user.js
// @updateURL https://update.greasyfork.org/scripts/527170/nyaa_tosho_archive_404.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_xmlhttpRequest({
        method: 'HEAD',
        url: window.location.href,
        onload: function (response) {
            if (response.status === 404) {
                const banner = document.createElement('div');
                banner.innerHTML = '<div style="background-color: blue; color: white; padding: 10px; position: fixed; top: 0; left: 0; width: 100%; z-index: 9999;" id="404toarchive-banner">Redirecting to archived version, please wait...</div>';
                document.body.appendChild(banner);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://cache.animetosho.org/nyaasi/view/${window.location.href.replace("https://nyaa.si/view/", "")}`,
                    onload: function (response) {
                        const text = response.responseText;
                        if (text) {
                            if (text.includes("Specified ID not found")) {
                                document.getElementById('404toarchive-banner').innerText = 'This torrent is not archived on animetosho.';
                            } else {
                                window.location.replace(`https://cache.animetosho.org/nyaasi/view/${window.location.href.replace("https://nyaa.si/view/", "")}`);
                            }
                        }
                    },
                    onerror: function (error) {
                        console.error('Error fetching data:', error);
                    }
                });
            }
        },
        onerror: function (error) {
            console.error('Error:', error);
        }
    });
})();
