// ==UserScript==
// @name         ant sac logger
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  ant sac logger for synergism
// @author       Kewne
// @match        https://v1011testing.vercel.app/
// @include      https://game320578.konggames.com/gamez/0032/0578/live/*
// @include      https://v1011testing.vercel.app/
// @include      https://pseudonian.github.io/SynergismOfficial/*
// @connect      https://www.kongregate.com/games/Platonic/synergism/*
// @connect      https://game320578.konggames.com/gamez/0032/0578/live/*
// @connect      https://pseudonian.github.io/SynergismOfficial/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407139/ant%20sac%20logger.user.js
// @updateURL https://update.greasyfork.org/scripts/407139/ant%20sac%20logger.meta.js
// ==/UserScript==

(function () {
    let scriptData = {
        lastSacs: []
    };
    window.userjsLoggingThingy = scriptData;

    let hook = (name, pre, post) => {
        let original = window[name];
        window[name] = (...args) => {
            if (pre) {
                pre(...args);
            }
            let ret = original.apply(this, args);
            if (post) {
                post(ret, ...args);
            }
            return ret;
        };
    };

    // from ants.js
    let antPointsToMulti = (points) => Math.pow(1 + points / 5000, 2);

    let logging = {
        button: null,
        display: null,
        visible: () => logging.display.style.display !== "none",
        clicked: () => {
            if (logging.visible()) {
                logging.hide();
            } else {
                logging.refresh();
                logging.show();
            }
        },
refresh: () => {
            let tbody = logging.display.querySelector("tbody");
            tbody.innerHTML = "";
            for (let i = scriptData.lastSacs.length - 1; i >= 0; i--) {
                let data = scriptData.lastSacs[i];
                let gainedMulti = window.format(antPointsToMulti(data.pointsAfter) - antPointsToMulti(data.pointsBefore), 3, false);
                let gainedMultiRelative = window.format(antPointsToMulti(data.pointsAfter) / antPointsToMulti(data.pointsBefore), 3, false)
                let rowHtml = `
                <td><img src="Pictures/Offering Upgrade.png" alt=""> ${data.date.toLocaleTimeString()} [${data.timeTaken}]</td>
                <td><img src="Pictures/AntSacrifice.png" alt=""> ${data.antMultiplier} [+${gainedMulti}, x${gainedMultiRelative}]</td>
                <td title="${data.totalOfferings} total"><img src="Pictures/Offering.png" alt=""> ${data.offerings}</td>
                <td title="${data.totalObtainium} total"><img src="Pictures/Obtainium.png" alt=""> ${data.obtainium}</td>
                <td>${data.crumbs} [+${data.crumbSpeed}/s]</td>
                <td>${data.elo} ${data.effectiveElo}</td>
                `;
                let tr = document.createElement('tr');
                tr.innerHTML = rowHtml;
                tbody.appendChild(tr);
            }
        },
        show: () => logging.display.style.display = "block",
        hide: () => logging.display.style.display = "none"
    };
    scriptData.logging = logging;

    logging.button = document.createElement("button");
    logging.button.id = "userjs-loggingThingy-logbutton";
    logging.button.innerText = "Log";
    logging.button.addEventListener("click", logging.clicked);
    document.body.appendChild(logging.button);

    logging.display = document.createElement("div");
    logging.display.id = "userjs-loggingThingy-logdisplay";
    logging.display.style.display = "none";
    logging.display.innerHTML = "<table><thead><tr><th>When</th><th>Multi</th><th>Off</th><th>Obt</th><th>Crumbs</th><th>ELO</th></tr></thead><tbody></tbody></table>";
    document.body.appendChild(logging.display);

    // Add our stylesheet
    logging.css = document.createElement("style");
    logging.css.textContent = `
    #userjs-loggingThingy-logbutton {
        position: absolute;
        left: 660px;
        top: 55px;
        border: 1px solid hotpink;
        font-size: 16px;
        cursor: pointer;
        z-index: 999;
    }
    #userjs-loggingThingy-logdisplay {
        position: absolute;
        width: 1200px;
        top: 170px;
        left: 50px;
        background: #121212;
        color: lightgray;
    }
    #userjs-loggingThingy-logdisplay table {
        width: 100%;
    }
    #userjs-loggingThingy-logdisplay table td img {
        vertical-align: middle;
        height: 20px;
    }
    #userjs-loggingThingy-logdisplay table td[title] {
        text-decoration: dotted underline 2px;
    }
    `;
    document.head.appendChild(logging.css);

    // Hook to get data
    hook("sacrificeAnts", () => {
        let thisSac = {
            date: new Date(),
            pointsBefore: player.antSacrificePoints,
            timeTaken: document.getElementById('antSacrificeTimer').textContent,
            antMultiplier: document.getElementById('antSacrificeMultiplier').textContent.replace("Ant Multiplier ", ""),
            offerings: document.getElementById('antSacrificeOffering').textContent,
            obtainium: document.getElementById('antSacrificeObtainium').textContent,
            crumbs: window.format(player.antPoints, 2),
            crumbSpeed: window.format(antOneProduce, 3),
            elo: document.getElementById('ELO').textContent,
            effectiveElo: document.getElementById('effectiveELO').textContent,
        };

        if (scriptData.lastSacs.length >= 10) {
            scriptData.lastSacs.shift();
        }
        scriptData.lastSacs.push(thisSac);
    }, () => {
        scriptData.lastSacs[scriptData.lastSacs.length - 1].pointsAfter = player.antSacrificePoints;
        scriptData.lastSacs[scriptData.lastSacs.length - 1].totalOfferings = window.format(player.runeshards);
        scriptData.lastSacs[scriptData.lastSacs.length - 1].totalObtainium = window.format(player.researchPoints);

        if (logging.visible()) {
            logging.refresh();
        }
    });
})();