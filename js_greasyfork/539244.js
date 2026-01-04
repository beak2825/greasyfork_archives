// ==UserScript==
// @name         MZ - Player Ages and Avg Value in Match Pages
// @namespace    douglaskampl
// @version      3.0
// @description  Shows player ages and team values in match pages
// @author       Douglas
// @match        https://www.managerzone.com/?p=match&sub=result*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539244/MZ%20-%20Player%20Ages%20and%20Avg%20Value%20in%20Match%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/539244/MZ%20-%20Player%20Ages%20and%20Avg%20Value%20in%20Match%20Pages.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const MasterOrchestrator = {
    init() {
      OrchestrationFlow.startAllOperations();
    },
  };

  const OrchestrationFlow = {
    startAllOperations() {
      const { playerTableDivs, matchFactsWrapper, sport } = DomAccessorPhaseOne.getInitialElements();
      if (!playerTableDivs.length) return;
      let shouldAppendLoading = false;
      for (const table of playerTableDivs) {
        if (
          table.querySelector("table.hitlist.soccer.statsLite.marker.tablesorter") ||
          table.querySelector("table.hitlist.hockey.statsLite.marker.tablesorter")
        ) {
          shouldAppendLoading = true;
          break;
        }
      }
      shouldAppendLoading && matchFactsWrapper.appendChild(DomUselessUtilities.getLoadingMessage());
      OverEngineeredTeamProcessor.processTeams(playerTableDivs, sport, matchFactsWrapper);
    },
  };

  const DomAccessorPhaseOne = {
    getInitialElements() {
      const e1 = document.getElementsByClassName("team-table block");
      const e2 = document.getElementById("match-tactic-facts-wrapper");
      const e3 = new URL(document.querySelector("#shortcut_link_thezone").href).searchParams.get("sport");
      return {
        playerTableDivs: e1,
        matchFactsWrapper: e2,
        sport: e3,
      };
    },
  };

  const OverEngineeredTeamProcessor = {
    chaosMachine: {
      ageCounters: [{}, {}],
      playerValues: [[], []],
      playerSalaries: [[], []],
      teamRanks: [null, null],
      teamNames: [],
      currency: "",
      totalRequests: 0,
      completedRequests: 0,
      totalPlayers: undefined,
    },

    async processTeams(teamDivs, sport, matchFactsWrapper) {
      for (let i = 0; i < teamDivs.length; i++) {
        const tableDiv = teamDivs[i];
        const theTeamLink = tableDiv.querySelector("a");
        if (!tableDiv.querySelector("table") || !theTeamLink) continue;
        const name = theTeamLink.textContent;
        this.chaosMachine.teamNames.push(name);
        const match = /tid=(\d+)/.exec(theTeamLink.href);
        if (match) {
          this.chaosMachine.totalRequests++;
          const tid = match[1];
          this.fetchTeamRank(tid, i, matchFactsWrapper);
        }
        const playerRows = Array.from(tableDiv.querySelector("tbody")?.querySelectorAll("tr") || []);
        for (const row of playerRows) {
          this.handleSinglePlayerRow(row, i, sport, playerRows.indexOf(row), playerRows);
        }
      }
    },

    async fetchTeamRank(teamId, index, matchFactsWrapper) {
      try {
        const doc = await OverEngineeredNetworker.fetchAndParseHTML(`https://www.managerzone.com/?p=team&tid=${teamId}`);
        const rankElement = doc.querySelector("#infoAboutTeam dd:nth-child(3) span[title]");
        if (rankElement) {
          this.chaosMachine.teamRanks[index] = parseInt(rankElement.textContent);
        } else {
          this.chaosMachine.teamRanks[index] = "N/A";
        }
      } catch (e) {
        this.chaosMachine.teamRanks[index] = "Erro";
      } finally {
        this.chaosMachine.completedRequests++;
        if (this.chaosMachine.completedRequests === this.chaosMachine.totalRequests) {
          DisplayFinalHorror.displayFinalTable(this.chaosMachine, matchFactsWrapper);
        }
      }
    },

    handleSinglePlayerRow(row, tableIndex, sport, rowIndex, playerRows) {
      const link = row.querySelector("a");
      if (!link) return;
      const match = link.href.match(/pid=(\d+)/);
      const subIcon = row.querySelector(".fa-arrow-circle-up");
      this.chaosMachine.totalPlayers = sport === "soccer" ? 11 : 21;
      if (match && (rowIndex < this.chaosMachine.totalPlayers || subIcon)) {
        const playerId = match[1];
        this.chaosMachine.totalRequests++;
        OverEngineeredNetworker
          .fetchAndParseHTML(`https://www.managerzone.com/?p=players&pid=${playerId}`)
          .then((doc) => {
            OverEngineeredTeamProcessor.parsePlayerData(doc, tableIndex, this.chaosMachine);
          })
          .finally(() => {
            this.chaosMachine.completedRequests++;
            if (this.chaosMachine.completedRequests === this.chaosMachine.totalRequests) {
              DisplayFinalHorror.displayFinalTable(this.chaosMachine, document.getElementById("match-tactic-facts-wrapper"));
            }
          })
          .catch(() => {
            this.chaosMachine.completedRequests++;
            if (this.chaosMachine.completedRequests === this.chaosMachine.totalRequests) {
              DisplayFinalHorror.displayFinalTable(this.chaosMachine, document.getElementById("match-tactic-facts-wrapper"));
            }
          });
      }
    },

    parsePlayerData(doc, tableIndex, data) {
      const ageElement = doc.querySelector("#thePlayers_0 .mainContent .dg_playerview .dg_playerview_info table tr:first-child strong");
      if (ageElement) {
        const age = parseInt(ageElement.textContent);
        if (!isNaN(age)) {
          data.ageCounters[tableIndex][age] = (data.ageCounters[tableIndex][age] || 0) + 1;
        }
      }
      const container = doc.querySelector("#thePlayers_0 .mainContent .dg_playerview .dg_playerview_info");
      if (!container) return;
      let valueElement = container.querySelector("table tr:nth-child(5) span.bold");
      let salaryElement = container.querySelector("table tr:nth-child(6) span.bold");
      if (!valueElement || valueElement.textContent.trim() === "") {
        valueElement = container.querySelector("table tr:nth-child(6) span.bold");
        salaryElement = container.querySelector("table tr:nth-child(7) span.bold");
      }
      if (!valueElement || valueElement.textContent.trim() === "") {
        valueElement = container.querySelector("table tr:nth-child(7) span.bold");
        salaryElement = container.querySelector("table tr:nth-child(8) span.bold");
      }
      if (valueElement) {
        const valueText = valueElement.textContent;
        const valNum = parseInt(valueText.replace(/\D/g, ""));
        if (!isNaN(valNum)) {
          data.playerValues[tableIndex].push(valNum);
        }
        data.currency = valueText.replace(/\d/g, "").trim();
      }
      if (salaryElement && salaryElement.textContent.trim() !== "") {
        const salaryTxt = salaryElement.textContent;
        let sNum = parseInt(salaryTxt.replace(/\D/g, ""));
        if (isNaN(sNum)) sNum = 0;
        data.playerSalaries[tableIndex].push(sNum);
      } else {
        data.playerSalaries[tableIndex].push(0);
      }
    },
  };

  const OverEngineeredNetworker = {
    async fetchAndParseHTML(url) {
      const r = await fetch(url);
      const t = await r.text();
      return new DOMParser().parseFromString(t, "text/html");
    },
  };

  const DisplayFinalHorror = {
    displayFinalTable(chaos, container) {
      const loadingMsg = document.querySelector(".player-stats-container-loading");
      if (loadingMsg && loadingMsg.parentNode === container) container.removeChild(loadingMsg);

      const bigBox = document.createElement("div");
      bigBox.style.display = "flex";
      bigBox.style.justifyContent = "center";
      bigBox.style.alignItems = "center";
      bigBox.className = "player-stats-container";

      for (let i = 0; i < 2; i++) {
        const subBox = MultiBoxerFactory.createSubBox();
        subBox.appendChild(MultiBoxerFactory.createTableBlock(chaos, i));
        subBox.appendChild(MultiBoxerFactory.createStatStuff(chaos, i));
        bigBox.appendChild(subBox);
      }
      container.appendChild(bigBox);
      StyleInjector.injectStyles();
    },
  };

  const DomUselessUtilities = {
    getLoadingMessage() {
      const m = document.createElement("div");
      m.textContent = "Loading…";
      m.style.display = "flex";
      m.style.justifyContent = "center";
      m.style.alignItems = "center";
      m.style.height = "40px";
      m.style.animation = "fadeIn 1s";
      m.className = "player-stats-container-loading";
      return m;
    },
  };

  const MultiBoxerFactory = {
    createSubBox() {
      const d = document.createElement("div");
      d.style.display = "flex";
      d.style.flexDirection = "column";
      d.style.alignItems = "center";
      return d;
    },
    createTableBlock(data, index) {
      const tableWrapper = this.createSubBox();
      const table = document.createElement("table");
      table.style.border = "1px solid black";
      table.style.borderCollapse = "collapse";
      table.style.margin = "2px 16px 4px";
      table.style.animation = "fadeIn 1s";
      const cap = document.createElement("caption");
      let name = data.teamNames[index]?.substring(0, 8) || `Time${index + 1}`;
      if (
        data.teamNames[0]?.substring(0, 8) === data.teamNames[1]?.substring(0, 8) &&
        data.teamNames[0] &&
        data.teamNames[1]
      ) {
        name = data.teamNames[index].substring(data.teamNames[index].length - 8);
      }
      cap.textContent = name;
      cap.style.padding = "4px";
      cap.style.whiteSpace = "nowrap";
      cap.style.overflow = "hidden";
      cap.style.textOverflow = "ellipsis";
      table.appendChild(cap);
      const header = document.createElement("tr");
      const th1 = document.createElement("th");
      th1.textContent = "Age";
      th1.style.border = "1px solid black";
      th1.style.padding = "4px";
      header.appendChild(th1);
      const th2 = document.createElement("th");
      th2.textContent = "n";
      th2.style.fontStyle = "italic";
      th2.style.border = "1px solid black";
      th2.style.padding = "4px";
      header.appendChild(th2);
      table.appendChild(header);

      const ages = Object.keys(data.ageCounters[index]).sort((a, b) => b - a);
      for (const age of ages) {
        const r = document.createElement("tr");
        const c1 = document.createElement("td");
        c1.textContent = age;
        c1.style.border = "1px solid black";
        c1.style.padding = "4px";
        r.appendChild(c1);
        const c2 = document.createElement("td");
        c2.textContent = data.ageCounters[index][age];
        c2.style.border = "1px solid black";
        c2.style.padding = "4px";
        r.appendChild(c2);
        table.appendChild(r);
      }
      tableWrapper.appendChild(table);
      return tableWrapper;
    },
    createStatStuff(data, index) {
      const container = this.createSubBox();
      let totalAge = 0;
      let count = 0;
      for (const age in data.ageCounters[index]) {
        totalAge += parseInt(age) * data.ageCounters[index][age];
        count += data.ageCounters[index][age];
      }
      const avgAge = totalAge / count || 0;
      const ageLabel = document.createElement("div");
      ageLabel.textContent = "AvgAge: ";
      container.appendChild(ageLabel);
      const ageVal = document.createElement("div");
      ageVal.textContent = avgAge.toFixed(1);
      ageVal.style.marginBottom = "4px";
      container.appendChild(ageVal);

      const sumVal = data.playerValues[index].reduce((a, b) => a + b, 0);
      const avgVal = sumVal / (data.playerValues[index].length || 1);
      const valLabel = document.createElement("div");
      valLabel.textContent = "AvgValue: ";
      container.appendChild(valLabel);
      const valVal = document.createElement("div");
      valVal.textContent = `${Number(avgVal.toFixed(0)).toLocaleString()} ${data.currency}`;
      valVal.style.marginBottom = "4px";
      container.appendChild(valVal);

      const sumSal = data.playerSalaries[index].reduce((a, b) => a + b, 0);
      const avgSal = sumSal / (data.playerSalaries[index].length || 1);
      if (avgSal > 0) {
        const salLabel = document.createElement("div");
        salLabel.textContent = "AvgSalary: ";
        container.appendChild(salLabel);
        const salVal = document.createElement("div");
        salVal.textContent = `${Number(avgSal.toFixed(0)).toLocaleString()} ${data.currency}`;
        salVal.style.marginBottom = "4px";
        container.appendChild(salVal);
      }
      const rank = data.teamRanks[index];
      const rankEl = document.createElement("p");
      rankEl.textContent = "Rank: " + rank;
      rankEl.style.width = "100%";
      container.appendChild(rankEl);
      return container;
    },
  };

  const StyleInjector = {
    injectStyles() {
      const st = document.createElement("style");
      st.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .player-stats-container div,
        .player-stats-container table,
        .player-stats-container th,
        .player-stats-container td,
        .player-stats-container p {
          color: black;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
        }
      `;
      document.head.appendChild(st);
    },
  };

  MasterOrchestrator.init();

})();
