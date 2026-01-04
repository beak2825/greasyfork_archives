// ==UserScript==
// @name         Scenexe2 QOL
// @version      0.1-270825
// @license MIT
// @namespace    https://tampermonkey.net/
// @description  Adding quality of life features to Scenexe2.io.
// @author       lserine
// @match        *://scenexe2.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scenexe2.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547398/Scenexe2%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/547398/Scenexe2%20QOL.meta.js
// ==/UserScript==

/* Currently has: */
// - Additional death screen information

(() => {
    const log = (message) => {
        const style = `
        font-size: 16px;
        background: linear-gradient(to right, purple, black);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    `;
        const labelStyle = `
        font-size: 20px;
        font-weight: bold;
        background: linear-gradient(to right, purple, black);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    `;
        console.log(`%c[QOL] %c${message}`, labelStyle, style);
    }

    const retrieve = {
        elementData: (element) => {
            return document.querySelector(element)
        },
        accountData: (username) => fetch(`https://scenexe2.io/account?u=${username}`)
        .then(r => {
            if (r.ok) {
                return r.json()
            } else {
                return new Error('Did not respond')
            }
        })
        .catch(e => console.error(e)),
    };
    const elements = {
        "respawnPanel": retrieve.elementData('#respawnPanel'),
        "respawnTitle": retrieve.elementData('#respawnTitle'),
        "respawnCanvas": retrieve.elementData('#respawnCanvas'),
        "killer": retrieve.elementData('#killer'),
        "tankScoreDisplay": retrieve.elementData('#tankScoreDisplay'),
        "tankLevel": retrieve.elementData('#tankLevel'),
    };
    console.log(elements.killer, document.querySelector('#killer'), retrieve.elementData('#killer'));
    let records = {
        "username": null,
        "initial": {
            "stars": 0,
            "timePlayed": 0,
            "kills": {
                "tanks": 0,
                "celestials": 0,
                "polygons": 0,
                "radiantPolygons": 0,
            },
        },
    };

    const loop = () => {
        var username = document.querySelector("#accountContent > div:nth-child(5)");
        if (username) {
            records.username = username.innerHTML.split('<br>')[0].match(/Username: (.+)/)[1];
            retrieve.accountData(records.username)
                .then(data => {
                records.initial.stars = data.stars
                records.initial.timePlayed = data.timePlayed
                records.initial.kills = {
                    "tanks": data.tankKills,
                    "celestials": data.celestialKills,
                    "polygons": data.polygonKills,
                    "radiantPolygons": data.radiantPolygonKills,
                };
                log('Updated initial');
            });
            setup();
        } else {
            setTimeout(loop, 500);
        };
    };

    const setup = () => {
        log('Setup running');
        const deathObserver = new MutationObserver((list) => {
            for (const mutation of list) {
                if (mutation.target.style.top === "0px") {
                    retrieve.accountData(records.username)
                        .then(data => {
                        var timePlayed = `${String(Math.floor((data.timePlayed - records.initial.timePlayed) / 3600)).padStart(2, '0')}:${String(Math.floor(((data.timePlayed - records.initial.timePlayed) % 3600) / 60)).padStart(2, '0')}:${String((data.timePlayed - records.initial.timePlayed) % 60).padStart(2, '0')}`;
                        var tankKills = data.tankKills - records.initial.kills.tanks;
                        var celestialKills = data.celestialKills - records.initial.kills.celestials;
                        var starsGained = data.stars - records.initial.stars;
                        var score = elements.tankScoreDisplay.innerHTML.split(': ')[1];
                        elements.killer.innerHTML += `<br><br>Time Played: ${timePlayed}`
                            + `<br>Score: ${score}`
                            + `<br>Stars Gained: ${starsGained}`
                            + `<br>Kills: ${tankKills}`
                            + `${celestialKills !== 0 ? '<br>Celestial Kills: ' + celestialKills : ''}`
                            + `<br><br>${elements.tankLevel.textContent}`;
                        log('Updated respawnPanel');
                        records.initial.stars = data.stars
                        records.initial.timePlayed = data.timePlayed
                        records.initial.kills = {
                            "tanks": data.tankKills,
                            "celestials": data.celestialKills,
                            "polygons": data.polygonKills,
                            "radiantPolygons": data.radiantPolygonKills,
                        };
                        log('Updated initial');
                    });
                }
            }
        });

        deathObserver.observe(elements.respawnPanel, {
            attributes: true,
            attributeFilter: ['style'],
        });
    };
    loop();
})();