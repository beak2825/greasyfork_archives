// ==UserScript==
// @name         MouseHunt - Tournament Recon
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      0.2.1 (beta)
// @description  Scout & analyze teams in active tournaments
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/418771/MouseHunt%20-%20Tournament%20Recon.user.js
// @updateURL https://update.greasyfork.org/scripts/418771/MouseHunt%20-%20Tournament%20Recon.meta.js
// ==/UserScript==

(function () {
  function xhrReq(url) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = function () {
        resolve(xhr.responseText);
      };
      xhr.onerror = function () {
        reject(xhr.statusText);
      };
      xhr.send();
    });
  }

  (function main() {
    const isTourney = document.querySelector(".scoreboardTableView");
    if (isTourney) {
      const currentTourneyID = isTourney.getAttribute("data-scoreboard");
      const tourneyOptgroup = document.querySelector(
        ".scoreboardTableView-availableScoreboards optgroup[label='Currently Active']"
      );
      if (tourneyOptgroup) {
        const activeTourneys = [];
        tourneyOptgroup.querySelectorAll("option").forEach(opt => {
          activeTourneys.push(opt.value);
        });
        if (activeTourneys.indexOf(currentTourneyID) >= 0) {
          // Only render for active tournament
          document
            .querySelectorAll(
              ".scoreboardTableView-row-name.scoreboardTableView-column"
            )
            .forEach(team => {
              const teamURL = team.querySelector("a").getAttribute("href");
              const reconSpan = document.createElement("span");
              reconSpan.style.float = "right";
              const reconButton = document.createElement("button");
              reconButton.innerText = "Recon";
              reconButton.onclick = function () {
                xhrReq(`https://www.mousehuntgame.com/${teamURL}`).then(res => {
                  let baseStyle = [
                    "color: #fff",
                    "background-color: #444",
                    "padding: 2px 4px",
                    "border-radius: 2px"
                  ].join(";");

                  const doc = new DOMParser().parseFromString(res, "text/html");

                  const teamName =
                    doc.querySelector(".teamPage-profile-header-name")
                      .textContent || "Team Name Unavailable";
                  console.group(
                    `%c${teamName}`,
                    baseStyle,
                    `${new Date(Date.now()).toLocaleString()}`
                  );

                  const hunters = [];
                  doc
                    .querySelectorAll(
                      ".teamPage-memberRow:not(.available):not(.teamPage-memberGroupTitle"
                    )
                    .forEach(member => {
                      const activeTourney = member.querySelector(
                        ".teamPage-memberRow-activeTournament a"
                      );
                      if (activeTourney) {
                        const tourneyID = activeTourney.getAttribute("href");
                        if (tourneyID.indexOf(currentTourneyID) >= 0) {
                          hunters.push(member.getAttribute("data-snuid"));
                        }
                      }
                    });

                  doc
                    .querySelectorAll(".teamPage-memberJournalContainer")
                    .forEach(journal => {
                      const jUser = journal
                        .querySelector(".teamPage-memberJournal-identity a")
                        .getAttribute("href")
                        .split("snuid=")[1];
                      const jIndex = hunters.indexOf(jUser);
                      if (jIndex >= 0) {
                        const snuid = hunters[jIndex];
                        let trapSetup = journal.querySelector(
                          ".teamPage-memberJournal-trapSetup"
                        ).textContent;
                        trapSetup = trapSetup.replace("Base:", "");
                        trapSetup = trapSetup.replace("Weapon:", " / ");
                        trapSetup = trapSetup.replace("Cheese:", " / ");
                        trapSetup = trapSetup.replace("Charm:", " / ");

                        let styleStr = `%c${snuid}\n%c${trapSetup}`;
                        const styleArr = [
                          "text-decoration: underline",
                          "color: default"
                        ];

                        journal
                          .querySelectorAll(
                            ".tournamentpoints, .tournamentpointswithloot"
                          )
                          .forEach(entry => {
                            const dateLoc = entry.querySelector(".journaldate")
                              .textContent;
                            const dlSplit = dateLoc.split(" - ");
                            const dateStr = dlSplit[0];
                            const locStr = dlSplit[1];
                            const mouseName = entry.querySelector(
                              ".journaltext a"
                            ).textContent;
                            const ptsEarned = entry
                              .querySelector(".journaltext")
                              .textContent.split(" earned ")[1]
                              .split(" Tournament")[0];
                            styleStr += `\n%c${dateStr}%c ${locStr} - ${mouseName} (${ptsEarned})`;

                            // Color code based on time window (:00-:14, :15-:29, :30-:44, :45-:59)
                            // TODO: More advanced helper function to parse time (xx:xx am/pm) and "hash" into consistent yet visually distinct hex colors
                            const timeWindow = parseInt(
                              dateLoc.match(/(:\d\d)/g)[0].split(":")[1]
                            );

                            let boxStyle = [
                              "color: #fff",
                              "padding: 2px 4px",
                              "border-radius: 5px"
                            ].join(";");

                            if (timeWindow >= 0 && timeWindow <= 14) {
                              styleArr.push(
                                `${boxStyle}; background-color: green`
                              );
                            } else if (timeWindow >= 15 && timeWindow <= 29) {
                              styleArr.push(
                                `${boxStyle}; background-color: orange`
                              );
                            } else if (timeWindow >= 30 && timeWindow <= 44) {
                              styleArr.push(
                                `${boxStyle}; background-color: red`
                              );
                            } else if (timeWindow >= 45 && timeWindow <= 59) {
                              styleArr.push(
                                `${boxStyle}; background-color: blue`
                              );
                            }

                            styleArr.push("color: default");
                          });

                        console.log(styleStr, ...styleArr);
                      }
                    });

                  console.groupEnd();
                });
              };
              reconSpan.appendChild(reconButton);
              team
                .querySelector("a")
                .insertAdjacentElement("afterend", reconSpan);
            });
        }
      }
    }
  })();

  /**
   * TODO LIST
   * Cache data, allow later deletion via tournament ID
   * "Refresh" button that refreshes current page in place? (F5 should work for now)
   *
   * DONE
   * Run on active scoreboard pages (e.g. https://www.mousehuntgame.com/scoreboards.php?tab=tournament&scoreboard=109643)
   * "Recon" button in team rows that uses team_id URL to fetch data
   * Output "Journals" data for each member that is in tourney ID = data-scoreboard
   * Names -> Hunter A/B/C/D, BWCC as per view, time/location/mousename/tourney points via querySelectorAll('.tournamentpointswithloot')
   * Color code hunt times per timeframes of :00-:14, :15-:29, :30-:44, :45-:59
   * Timestamp next to team name with last updated (console done)
   */
})();
