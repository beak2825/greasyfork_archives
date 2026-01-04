// ==UserScript==
// @name         Nitro Type Current Race Tracker w/ Leagues and NT Comps
// @version      1.8
// @description  Nitro Type Current Race Tracker w/ Leagues and NT Comps WIP
// @author       TensorFlow - Dvorak
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.1/dexie.min.js#sha512-ybuxSW2YL5rQG/JjACOUKLiosgV80VUfJWs4dOpmSWZEGwdfdsy2ldvDSQ806dDXGmg9j/csNycIbqsrcqW6tQ==
// @license      MIT
// @namespace    https://greasyfork.org/users/1331131-tensorflow-dvorak

// @downloadURL https://update.greasyfork.org/scripts/500178/Nitro%20Type%20Current%20Race%20Tracker%20w%20Leagues%20and%20NT%20Comps.user.js
// @updateURL https://update.greasyfork.org/scripts/500178/Nitro%20Type%20Current%20Race%20Tracker%20w%20Leagues%20and%20NT%20Comps.meta.js
// ==/UserScript==

/* globals Dexie */

const findReact = (dom, traverseUp = 0) => {
  const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"));
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
    let args = [
      console,
      `${formatMessage}%c`,
      "background-color: #4285f4; color: #fff; font-weight: bold",
    ];
    if (prefix) {
      args = args.concat(
        "background-color: #4f505e; color: #fff; font-weight: bold"
      );
    }
    return args.concat("color: unset");
  };

  const bindLog = (logFn, prefix) =>
    Function.prototype.bind.apply(logFn, logPrefix(prefix));

  return {
    info: (prefix) => bindLog(console.info, prefix),
    warn: (prefix) => bindLog(console.warn, prefix),
    error: (prefix) => bindLog(console.error, prefix),
    log: (prefix) => bindLog(console.log, prefix),
    debug: (prefix) => bindLog(console.debug, prefix),
  };
};

const logging = createLogger("Nitro Type Current Race Tracker");

// Config storage
const db = new Dexie("CurrentRaceTracker");
db.version(1).stores({
  users: "id, &username, team, displayName, status, league",
});
db.open().catch(function (e) {
  logging.error("Init")("Failed to open up the config database", e);
});

//Race
if (
  window.location.pathname === "/race" ||
  window.location.pathname.startsWith("/race/")
) {
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

  const displayedUserIDs = new Set();

  const leagueTierText = {
    0: "None",
    1: "Learner",
    2: "Novice",
    3: "Rookie",
    4: "Pro",
    5: "Ace",
    6: "Expert",
    7: "Champion",
    8: "Master",
    9: "Epic",
    10: "Legend",
    11: "Tournament",
    12: "Semi-Finals",
    13: "Finals",
  };

  function createLeagueInfoUI() {
    const leagueInfoContainer = document.createElement("div");
    leagueInfoContainer.id = "league-info-container";
    leagueInfoContainer.style.zIndex = "1000";
    leagueInfoContainer.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
    leagueInfoContainer.style.color = "#fff";
    leagueInfoContainer.style.padding = "15px";
    leagueInfoContainer.style.borderRadius = "8px";
    leagueInfoContainer.style.fontFamily = "'Nunito', sans-serif";
    leagueInfoContainer.style.fontSize = "14px";
    leagueInfoContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    leagueInfoContainer.style.width = "100%";
    leagueInfoContainer.style.overflowY = "auto";
    leagueInfoContainer.style.maxHeight = "70vh";
    leagueInfoContainer.innerHTML = `
            <h2 style="margin: 0 0 10px; font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Racers Info</h2>
            <table id='league-info-table' style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="border-bottom: 1px solid #444;">
                        <th style="padding: 5px; color: #f4b400;">Name</th>
                        <th style="padding: 5px; color: #e74c3c;">Level</th>
                        <th style="padding: 5px; color: #0f9d58;">League</th>
                        <th style="padding: 5px; color: #4285f4;">Session Races</th>
                        <th style="padding: 5px; color: #ff5722;">Races This Week</th>
                    </tr>
                </thead>
                <tbody id='league-info-list' style="color: #ddd;"></tbody>
            </table>
        `;
    const targetElement = document.querySelector("#raceContainer");
    if (targetElement) {
      targetElement.appendChild(leagueInfoContainer);
    } else {
      document.body.appendChild(leagueInfoContainer);
    }
  }

  function fetchAdditionalData(username, listItem) {
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const targetUrl = `https://www.ntcomps.com/racers/${username}`;
    fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`)
      .then((response) => response.json())
      .then((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, "text/html");
        const foundIndicator = "<td>This week</td>";

        if (!data.contents.includes(foundIndicator)) {
          listItem.querySelector(".races-this-week").textContent = "N/A";
          return;
        }

        let racesCompleted = doc
          .querySelector("tr:nth-child(4) td:nth-child(2)")
          .textContent.trim();
        racesCompleted = racesCompleted.replace(/,/g, "");
        let racesCompletedInt = parseInt(racesCompleted, 10);
        if (isNaN(racesCompletedInt) || racesCompletedInt > 100000) {
          racesCompleted = "N/A";
        } else {
          racesCompleted = racesCompletedInt.toLocaleString();
        }

        listItem.querySelector(".races-this-week").textContent = racesCompleted;
      })
      .catch((error) => {
        console.error("Error fetching additional data:", error);
        listItem.querySelector(".races-this-week").textContent = "N/A";
      });
  }
  function updateLeagueInfoUI(user) {
    const leagueInfoList = document.getElementById("league-info-list");
    if (!leagueInfoList || displayedUserIDs.has(user.userID)) return;
    displayedUserIDs.add(user.userID);
    const listItem = document.createElement("tr");
    const leagueText = leagueTierText[user.profile.leagueTier] || "Unknown";
    listItem.style.borderBottom = "1px solid #444";
    listItem.style.fontWeight = "bold";
    listItem.innerHTML = `
            <td style="padding: 5px; color: #f4b400;">${user.profile.displayName}</td>
            <td style="padding: 5px; color: #e74c3c;">${user.profile.level}</td>
            <td style="padding: 5px; color: #0f9d58;">${leagueText}</td>
            <td style="padding: 5px; color: #4285f4;">${user.profile.sessionRaces}</td>
            <td style="padding: 5px; color: #ff5722;" class="races-this-week">Loading...</td>
        `;
    leagueInfoList.appendChild(listItem);
    fetchAdditionalData(user.profile.userID, listItem);
  }

  function logPlayerIDsAndLeagues() {
    const server = raceObj.server;

    server.on("joined", (user) => {
      if (!user.robot) {
        updateLeagueInfoUI(user);
      }
    });

    server.on("update", (e) => {
      if (e && e.racers) {
        e.racers.forEach((racer) => {
          if (!racer.robot && !displayedUserIDs.has(racer.userID)) {
            updateLeagueInfoUI(racer);
          }
        });
      }
    });
  }

  function initializeRaceObj() {
    const raceContainer = document.getElementById("raceContainer");

    if (raceContainer) {
      createLeagueInfoUI();
      logPlayerIDsAndLeagues();

      const resultObserver = new MutationObserver(([mutation], observer) => {
        for (const node of mutation.addedNodes) {
          if (node.classList?.contains("race-results")) {
            observer.disconnect();
            logging.info("Update")("Race Results received");

            const leagueInfoContainer = document.getElementById(
              "league-info-container"
            );
            const targetElement =
              document.querySelector("#raceContainer").parentElement;
            if (leagueInfoContainer && targetElement) {
              targetElement.appendChild(leagueInfoContainer);
            }
            break;
          }
        }
      });
      resultObserver.observe(raceContainer, { childList: true, subtree: true });
    } else {
      logging.error("Init")("Race container not found, retrying...");
      setTimeout(initializeRaceObj, 1000);
    }
  }

  window.addEventListener("load", initializeRaceObj);
}
