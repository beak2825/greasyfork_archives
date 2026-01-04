// ==UserScript==
// @name         Nitro Type NT Comps Top 60 Power Racers
// @version      1.7
// @description  Display Top 60 Power Racers on NT Race UI
// @author       TensorFlow - Dvorak
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.1/dexie.min.js#sha512-ybuxSW2YL5rQG/JjACOUKLiosgV80VUfJWs4dOpmSWZEGwdfdsy2ldvDSQ806dDXGmg9j/csNycIbqsrcqW6tQ==
// @license      MIT
// @namespace    https://greasyfork.org/users/1331131-tensorflow-dvorak

// @downloadURL https://update.greasyfork.org/scripts/500413/Nitro%20Type%20NT%20Comps%20Top%2060%20Power%20Racers.user.js
// @updateURL https://update.greasyfork.org/scripts/500413/Nitro%20Type%20NT%20Comps%20Top%2060%20Power%20Racers.meta.js
// ==/UserScript==

/* globals Dexie */

const findReact = (dom, traverseUp = 0) => {
    const key = Object.keys(dom).find(key => key.startsWith("__reactFiber$"));
    const domFiber = dom[key];
    if (!domFiber) return null;

    const getCompFiber = (fiber) => {
        let parentFiber = fiber?.return;
        while (parentFiber && typeof parentFiber.type === "string") {
            parentFiber = parentFiber.return;
        }
        return parentFiber;
    };

    let compFiber = getCompFiber(domFiber);
    for (let i = 0; i < traverseUp && compFiber; i++) {
        compFiber = getCompFiber(compFiber);
    }
    return compFiber?.stateNode || null;
};

const createLogger = (namespace) => {
    const logPrefix = (prefix = "") => {
        const formatMessage = `%c[${namespace}]${prefix ? `%c[${prefix}]` : ""}`;
        let args = [console, `${formatMessage}%c`, "background-color: #4285f4; color: #fff; font-weight: bold"];
        if (prefix) {
            args = args.concat("background-color: #4f505e; color: #fff; font-weight: bold");
        }
        return args.concat("color: unset");
    };

    const bindLog = (logFn, prefix) => Function.prototype.bind.apply(logFn, logPrefix(prefix));

    return {
        info: (prefix) => bindLog(console.info, prefix),
        warn: (prefix) => bindLog(console.warn, prefix),
        error: (prefix) => bindLog(console.error, prefix),
        log: (prefix) => bindLog(console.log, prefix),
        debug: (prefix) => bindLog(console.debug, prefix),
    };
};

const logging = createLogger("Top 60 Power Racers");

// Config storage
const db = new Dexie("PowerRacers");
db.version(1).stores({
    users: "id, &username, team, displayName, status, league",
});
db.open().catch(function (e) {
    logging.error("Init")("Failed to open up the config database", e);
});

//Race
if (window.location.pathname === "/race" || window.location.pathname.startsWith("/race/")) {
    const raceContainer = document.getElementById("raceContainer");
    const raceObj = raceContainer ? findReact(raceContainer) : null;
    if (!raceContainer || !raceObj) {
        logging.error("Init")("Could not find the race container or race object");
        return;
    }
    if (!raceObj.props.user.loggedIn) {
        logging.error("Init")("Extractor is not available for Guest Racing");
        return;
    }

    function createPowerRacersUI() {
        const powerRacersContainer = document.createElement("div");
        powerRacersContainer.id = "power-racers-container";
        powerRacersContainer.style.zIndex = "1000";
        powerRacersContainer.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
        powerRacersContainer.style.color = "#fff";
        powerRacersContainer.style.padding = "15px";
        powerRacersContainer.style.borderRadius = "8px";
        powerRacersContainer.style.fontFamily = "'Nunito', sans-serif";
        powerRacersContainer.style.fontSize = "14px";
        powerRacersContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        powerRacersContainer.style.width = "100%";
        powerRacersContainer.style.overflowY = "auto";
        powerRacersContainer.style.maxHeight = "70vh";
        powerRacersContainer.innerHTML = `
            <style>
                #power-racers-container::-webkit-scrollbar {
                    width: 8px;
                }
                #power-racers-container::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.5);
                }
                #power-racers-container::-webkit-scrollbar-thumb {
                    background: #00008B; /* Dark blue */
                    border-radius: 4px;
                }
            </style>
            <h2 style="margin: 0 0 10px; font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Top 60 Power Racers</h2>
            <table id='power-racers-table' style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="border-bottom: 1px solid #444;">
                        <th style="padding: 5px; color: #f4b400;">Rank</th>
                        <th style="padding: 5px; color: #e74c3c;">Name</th>
                        <th style="padding: 5px; color: #0f9d58;">Races Completed</th>
                        <th style="padding: 5px; color: #4285f4;">Team</th>
                    </tr>
                </thead>
                <tbody id='power-racers-list' style="color: #ddd;"></tbody>
            </table>
        `;
        const targetElement = document.querySelector("#raceContainer");
        if (targetElement) {
            targetElement.appendChild(powerRacersContainer);
        } else {
            document.body.appendChild(powerRacersContainer);
        }
    }

    function fetchPowerRacers() {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const targetUrl = `https://www.ntcomps.com/leaderboards/power_racers?tp=60m`;
        fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`)
            .then(response => response.json())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.contents, "text/html");
                const racers = Array.from(doc.querySelectorAll('table tr')).slice(0, 61); // Get top 60 racers

                const powerRacersList = document.getElementById('power-racers-list');
                powerRacersList.innerHTML = ''; // Clear any existing content

                racers.forEach((racer, index) => {
                    const cols = racer.querySelectorAll('td');
                    if (cols.length < 4) return; // Skip rows that don't have enough columns
                    const racerName = cols[1]?.textContent.split('Go to')[0].trim() || 'N/A'; // Extract name and remove unwanted text
                    const listItem = document.createElement("tr");
                    listItem.style.borderBottom = "1px solid #444";
                    listItem.style.fontWeight = "bold";
                    listItem.innerHTML = `
                        <td style="padding: 5px; color: #f4b400;">${index + 1}</td>
                        <td style="padding: 5px; color: #e74c3c;">${racerName}</td>
                        <td style="padding: 5px; color: #0f9d58;">${cols[3]?.textContent?.trim() || 'N/A'}</td>
                        <td style="padding: 5px; color: #4285f4;">${cols[2]?.textContent?.trim() || 'N/A'}</td>
                    `;
                    powerRacersList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error fetching power racers data:', error);
            });
    }

    function initializePowerRacersUI() {
        const raceContainer = document.getElementById("raceContainer");

        if (raceContainer) {
            createPowerRacersUI();
            fetchPowerRacers();

            const resultObserver = new MutationObserver(([mutation], observer) => {
                for (const node of mutation.addedNodes) {
                    if (node.classList?.contains("race-results")) {
                        observer.disconnect();
                        logging.info("Update")("Race Results received");

                        const powerRacersContainer = document.getElementById("power-racers-container");
                        const targetElement = document.querySelector("#raceContainer").parentElement;
                        if (powerRacersContainer && targetElement) {
                            targetElement.appendChild(powerRacersContainer);
                        }
                        break;
                    }
                }
            });
            resultObserver.observe(raceContainer, { childList: true, subtree: true });
        } else {
            logging.error("Init")("Race container not found, retrying...");
            setTimeout(initializePowerRacersUI, 1000);
        }
    }

    window.addEventListener("load", initializePowerRacersUI);
}
