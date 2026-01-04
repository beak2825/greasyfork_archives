// ==UserScript==
// @name         made by taptenputzer (v1.1)
// @namespace    https://github.com/Tapetenputzer/Ome.tv-IP-geolocation
// @version      1.1
// @description  Ome.tv IP Geolocation by taptenputzer – srflx only, Panel + Chat-Ausgabe, 24/7 Refresh jede Sekunde
// @author       taptenputzer
// @match        https://ome.tv/
// @icon         https://www.google.com/s2/favicons?domain=ome.tv
// @license      MIT License
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537153/made%20by%20taptenputzer%20%28v11%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537153/made%20by%20taptenputzer%20%28v11%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //
    // 1) CSS für persistentes Ausgabe-Panel
    //
    const style = document.createElement('style');
    style.textContent = `
    #tap-geo-panel {
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 300px;
        max-height: 50%;
        overflow-y: auto;
        background: rgba(255,255,255,0.95);
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 99999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    #tap-geo-panel table {
        width: 100%;
        border-collapse: collapse;
    }
    #tap-geo-panel th {
        text-align: left;
        padding: 4px;
        font-weight: bold;
        color: #333;
        width: 45%;
    }
    #tap-geo-panel td {
        padding: 4px;
        color: #000;
    }
    #tap-geo-panel h4 {
        margin: 4px 0 8px;
        font-size: 14px;
        text-align: center;
        color: #111;
    }
    `;
    document.documentElement.appendChild(style);

    //
    // 2) Panel erzeugen
    //
    const panel = document.createElement('div');
    panel.id = 'tap-geo-panel';
    panel.innerHTML = '<h4>IP-Geolocation</h4>';
    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(panel);
    });

    //
    // 3) Chat-Ausgabe-Funktion
    //
    async function addMessage(msg) {
        const container = document.querySelector('.message-bubble');
        if (!container) return;
        const putData = container.firstChild;
        const div = document.createElement('div');
        div.className = 'logitem';
        const p = document.createElement('p');
        p.className = 'statuslog';
        p.innerText = msg;
        div.appendChild(p);
        putData.appendChild(div);
    }

    //
    // 4) Automatisches Neuladen blocken
    //
    try {
        window.location.reload = () => console.log('[taptenputzer] reload blocked');
        window.location.assign = () => console.log('[taptenputzer] assign blocked');
        Object.defineProperty(window.location, 'href', {
            set: v => console.log('[taptenputzer] href change blocked to', v)
        });
    } catch (e) {
        console.warn('[taptenputzer] konnte reload nicht überschreiben:', e);
    }

    //
    // 5) WebRTC–Hook via Prototype-Patch (nur srflx-Kandidaten)
    //
    const OriginalPC = window.RTCPeerConnection || window.webkitRTCPeerConnection;
    let lastIp = null;
    let currentIp = null;
    if (OriginalPC) {
        const origAdd = OriginalPC.prototype.addIceCandidate;
        Object.defineProperty(OriginalPC.prototype, 'addIceCandidate', {
            value: function(ice, ...rest) {
                try {
                    const cand = ice.candidate || '';
                    const typeMatch = cand.match(/typ\s(srflx)/);
                    const ipMatch  = cand.match(/([0-9]{1,3}(?:\.[0-9]{1,3}){3})/);
                    if (typeMatch && ipMatch) {
                        const ip = ipMatch[1];
                        if (ip !== lastIp) {
                            lastIp = ip;
                            currentIp = ip;
                            getLocation(ip);
                        }
                    }
                } catch (_){}
                return origAdd.call(this, ice, ...rest);
            },
            writable: true,
            configurable: true
        });
        OriginalPC.prototype.addIceCandidate.toString = () => 'function addIceCandidate() { [native code] }';
    }

    //
    // 6) API-Key und Region-Namen
    //
    const apiKey = "072a896dc04088";
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

    //
    // 7) Panel-Update
    //
    function addPanelEntry(dataObj) {
        panel.innerHTML = '<h4>IP-Geolocation</h4>';
        const table = document.createElement('table');
        for (const [key, val] of Object.entries(dataObj)) {
            const row = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = key;
            const td = document.createElement('td');
            td.textContent = val;
            row.appendChild(th);
            row.appendChild(td);
            table.appendChild(row);
        }
        panel.appendChild(table);
    }

    //
    // 8) IP-Geolocation holen & ausgeben
    //
    async function getLocation(ip) {
        try {
            const res  = await fetch(`https://ipinfo.io/${ip}?token=${apiKey}`);
            const json = await res.json();
            const data = {
                "IP":       json.ip,
                "Country":  regionNames.of(json.country),
                "State":    json.region,
                "City":     json.city,
                "Lat/Long": json.loc
            };
            // Panel
            addPanelEntry(data);
            // Chat
            const msg = `
IP       : ${data.IP}
Country  : ${data.Country}
State    : ${data.State}
City     : ${data.City}
Lat/Long : ${data["Lat/Long"]}
`.trim();
            addMessage(msg);
        } catch (e) {
            console.error('[taptenputzer] Geolocation error:', e);
        }
    }

    //
    // 9) 24/7-Refresh (jede 1 Sekunde)
    //
    setInterval(() => {
        if (currentIp) getLocation(currentIp);
    }, 1000);

    //
    // 10) Neustart-Button ausblenden
    //
    function hideRestartButtons() {
        ['button','a','div','span'].forEach(tag => {
            document.querySelectorAll(tag).forEach(el => {
                if (el.innerText && el.innerText.trim().toLowerCase() === 'neustart') {
                    el.style.display = 'none';
                }
            });
        });
    }
    document.addEventListener('DOMContentLoaded', hideRestartButtons);
    new MutationObserver(hideRestartButtons).observe(document.documentElement, { childList: true, subtree: true });

})();