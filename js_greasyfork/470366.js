

    // ==UserScript==
    // @name         progra_hockey
    // @namespace    mz
    // @version      1.0
    // @description  Hockey Managerzone federation help
    // @author       DouglasyProgra
    // @match        https://www.managerzone.com/?p=federations*
    // @grant        GM_xmlhttpRequest
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470366/progra_hockey.user.js
// @updateURL https://update.greasyfork.org/scripts/470366/progra_hockey.meta.js
    // ==/UserScript==
     
    (function () {
      "use strict";
     
      const sport = new URL(
        document.querySelector("#shortcut_link_thezone").href
      ).searchParams.get("sport");
     
      const sportId = sport === "hockey" ? 1 : 2;
     
      let fid;
     
      let userTeamIdMap = {};
     
      let totalRequests = 0;
      let completedRequests = 0;
     
      window.addEventListener("hashchange", function () {
        setTimeout(getFederationId, 2000);
      });
     
      setTimeout(function () {
        let federationLogoDiv = document.getElementById("federation_logo");
        federationLogoDiv.style.cursor = "pointer";
        setupClickableFedBadge(federationLogoDiv);
      }, 5000);
     
      function getFederationId() {
        const url = new URL(window.location.href);
        const hash = url.hash;
        const fid = hash.split("=")[1];
        return fid;
      }
     
      function setupClickableFedBadge(federationLogoDiv) {
        federationLogoDiv.style.cursor = "pointer";
        federationLogoDiv.onclick = function () {
          displayModal("Loading…");
     
          fid = getFederationId();
          GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.managerzone.com/ajax.php?p=federations&sub=federation&fid=${fid}&sport=${sport}`,
            onload: function (resp) {
              const parser = new DOMParser();
              const htmlDoc = parser.parseFromString(
                resp.responseText,
                "text/html"
              );
     
              const fedFirstTeamMembers = htmlDoc.querySelectorAll(
                "#federation_clash_members_list tbody tr"
              );
     
              if (
                fedFirstTeamMembers[0].innerText ===
                "This Federation has no first team members."
              ) {
                displayModal("No first team members found.");
                console.log(userTeamIdMap);
                return;
              }
     
              fedFirstTeamMembers.forEach((row) => {
                const username = row.querySelector("a").innerText;
                totalRequests++;
                getUserData(username, sportId);
              });
            },
          });
        };
      }
     
      function getUserData(user, sportId) {
        GM_xmlhttpRequest({
          method: "GET",
          url: `https://www.managerzone.com/xml/manager_data.php?sport_id=${sportId}&username=${user}`,
          onload: function (resp) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(resp.responseText, "text/xml");
     
            const teamId = xmlDoc
              .querySelector(`Team[sport="${sport}"]`)
              .getAttribute("teamId");
     
            const country = xmlDoc
              .querySelector("UserData")
              .getAttribute("countryShortname");
     
            const teamName = xmlDoc
              .querySelector(`Team[sport="${sport}"]`)
              .getAttribute("teamName");
     
            const league = xmlDoc
              .querySelector(`Team[sport="${sport}"]`)
              .getAttribute("seriesName");
     
            const seriesId = xmlDoc
              .querySelector(`Team[sport="${sport}"]`)
              .getAttribute("seriesId");
     
            const rank = xmlDoc
              .querySelector(`Team[sport="${sport}"]`)
              .getAttribute("rankPos");
     
            GM_xmlhttpRequest({
              method: "GET",
              url: `https://www.managerzone.com/xml/team_league.php?sport_id=${sportId}&league_id=${seriesId}`,
              onload: function (leagueResp) {
                const leagueDoc = parser.parseFromString(
                  leagueResp.responseText,
                  "text/xml"
                );
     
                const teams = leagueDoc.querySelectorAll("Team");
                let position;
                for (const team of teams) {
                  if (team.getAttribute("teamId") === teamId) {
                    position = team.getAttribute("pos");
                    break;
                  }
                }
     
                userTeamIdMap[user] = {
                  teamName,
                  teamId,
                  country,
                  league,
                  position,
                  rank,
                };
                getPlayerData(teamId, user);
              },
            });
          },
        });
      }
     
      function getPlayerData(teamId, user) {
        GM_xmlhttpRequest({
          method: "GET",
          url: `https://www.managerzone.com/xml/team_playerlist.php?sport_id=1&team_id=${teamId}`,
          onload: function (resp) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(resp.responseText, "text/xml");
            const players = Array.from(
              xmlDoc.querySelectorAll("Player[junior='0']")
            );
            const sortedPlayers = players.sort(
              (a, b) =>
                Number(b.getAttribute("value")) - Number(a.getAttribute("value"))
            );
     
            let totalValue = 0;
            const count = Math.min(11, sortedPlayers.length);
            for (let i = 0; i < count; i++) {
              totalValue += Number(sortedPlayers[i].getAttribute("value"));
            }
            const avgValue = totalValue / (count || 1);
            const currency = xmlDoc
              .querySelector("TeamPlayers")
              .getAttribute("teamCurrency");
     
            userTeamIdMap[user].avgValue = `${avgValue.toFixed(0)} ${currency}`;
     
            completedRequests++;
            if (completedRequests === totalRequests) {
              modalContent.innerHTML = "";
     
              const table = document.createElement("table");
              modalContent.appendChild(table);
     
              const headerRow = document.createElement("tr");
              table.appendChild(headerRow);
     
              const usernameHeader = document.createElement("th");
              usernameHeader.textContent = "Username";
              headerRow.appendChild(usernameHeader);
     
              const teamNameHeader = document.createElement("th");
              teamNameHeader.textContent = "Team Name";
              headerRow.appendChild(teamNameHeader);
     
              const countryHeader = document.createElement("th");
              countryHeader.textContent = "Country";
              headerRow.appendChild(countryHeader);
     
              const divisionHeader = document.createElement("th");
              divisionHeader.textContent = "Division";
              headerRow.appendChild(divisionHeader);
     
              const positionHeader = document.createElement("th");
              positionHeader.textContent = "Position";
              headerRow.appendChild(positionHeader);
     
              const valueHeader = document.createElement("th");
              valueHeader.textContent = "Avg. Value (currency may vary)";
              headerRow.appendChild(valueHeader);
     
              const rankHeader = document.createElement("th");
              rankHeader.textContent = "Team Rank (maybe useless)";
              headerRow.appendChild(rankHeader);
     
              let sortedUserTeamIdMap = Object.entries(userTeamIdMap).sort(
                (a, b) => parseFloat(b[1].avgValue) - parseFloat(a[1].avgValue)
              );
              for (const [user, data] of sortedUserTeamIdMap) {
                const row = document.createElement("tr");
     
                const userCell = document.createElement("td");
                userCell.textContent = user;
                userCell.style.border = "1px solid #000";
                userCell.style.padding = "10px";
                row.appendChild(userCell);
     
                const teamCell = document.createElement("td");
                teamCell.textContent = data.teamName;
                teamCell.style.border = "1px solid #000";
                teamCell.style.padding = "10px";
                row.appendChild(teamCell);
     
                const countryCell = document.createElement("td");
                countryCell.textContent = data.country;
                countryCell.style.border = "1px solid #000";
                countryCell.style.padding = "10px";
                row.appendChild(countryCell);
     
                const divisionCell = document.createElement("td");
                divisionCell.textContent = data.league;
                divisionCell.style.border = "1px solid #000";
                divisionCell.style.padding = "10px";
                row.appendChild(divisionCell);
     
                const positionCell = document.createElement("td");
                positionCell.textContent = data.position;
                positionCell.style.border = "1px solid #000";
                positionCell.style.padding = "10px";
                row.appendChild(positionCell);
     
                const valueCell = document.createElement("td");
                valueCell.textContent = data.avgValue;
                valueCell.style.border = "1px solid #000";
                valueCell.style.padding = "10px";
                row.appendChild(valueCell);
     
                const rankCell = document.createElement("td");
                rankCell.textContent = data.rank;
                rankCell.style.border = "1px solid #000";
                rankCell.style.padding = "10px";
                row.appendChild(rankCell);
     
                table.appendChild(row);
              }
              console.log(userTeamIdMap);
            }
          },
        });
      }
     
      const fedDropdownMenu = document.querySelector("select.valignMiddle");
      fedDropdownMenu.addEventListener("change", function () {
        setTimeout(function () {
          let federationLogoDiv = document.getElementById("federation_logo");
          setupClickableFedBadge(federationLogoDiv);
        }, 5000);
      });
     
      const modal = document.createElement("div");
      modal.style.display = "none";
      modal.style.position = "fixed";
      modal.style.zIndex = "1";
      modal.style.left = "0";
      modal.style.top = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.overflow = "auto";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
     
      const modalContent = document.createElement("div");
      modalContent.style.backgroundColor = "#fefefe";
      modalContent.style.margin = "15% auto";
      modalContent.style.padding = "20px";
      modalContent.style.border = "1px solid #888";
      modalContent.style.width = "80%";
      modal.appendChild(modalContent);
     
      document.body.appendChild(modal);
     
      function displayModal(msg) {
        modalContent.textContent = msg;
        modal.style.display = "block";
      }
     
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
          modalContent.textContent = "";
        }
      };
    })();

