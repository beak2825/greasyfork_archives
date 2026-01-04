// ==UserScript==
// @name         Fantasy Moneyball
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Add sabermetrics to player data
// @author       mdd36
// @include      https://www.fantrax.com/fantasy/league/*
// @icon         https://www.passionweiss.com/wp-content/uploads/2018/10/jonah-hill-in-moneyball.jpg
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527867/Fantasy%20Moneyball.user.js
// @updateURL https://update.greasyfork.org/scripts/527867/Fantasy%20Moneyball.meta.js
// ==/UserScript==

// MARK: -- Utilities
function unwrapNodeList(nodeList) {
  const cells = [];
  let c = null;
  while ((c = nodeList.iterateNext())) {
    cells.push(c);
  }
  return cells;
}
function pickModel() {
  if (/fantasy\/league\/.+?\/players/.test(window.location.href)) {
    return playerPage;
  } else if (/fantasy\/league\/.+?\/draft/.test(window.location.href)) {
    return draftPage;
  }
  return undefined;
}

function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

function accentStrip(inStr) {
  return inStr.replace(
    /([àáâãäå])|([çčć])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g,
    function (str, a, c, e, i, n, o, s, u, y, ae) {
      if (a) return "a";
      if (c) return "c";
      if (e) return "e";
      if (i) return "i";
      if (n) return "n";
      if (o) return "o";
      if (s) return "s";
      if (u) return "u";
      if (y) return "y";
      if (ae) return "ae";
    },
  );
}

// MARK: -- API Fetching + Extracking
function extractStats(player) {
  const result = {
    hydrated: true,
    name: accentStrip(player.fullName),
    id: player.id,
    fip: -1000,
    war: -1000,
    woba: -1000,
  };
  player.stats?.forEach((s) => {
    if (s.group.displayName === "pitching" && s.splits) {
      result.fip = Math.max(...s.splits.map((sp) => sp.stat.fip || -1000));
      result.war = Math.max(result.war, ...s.splits.map((sp) => sp.stat.war));
    }

    if (s.group.displayName === "hitting" && s.splits) {
      result.woba = Math.max(...s.splits.map((sp) => sp.stat.woba));
      result.war = Math.max(result.war, ...s.splits.map((sp) => sp.stat.war));
    }
  });
  return result;
}

async function getStats(playerIds) {
  const params = new URLSearchParams({
    personIds: playerIds.join(","),
    hydrate: "stats(group=[hitting,pitching],season=2024,type=[sabermetrics])",
  });
  const url = "https://statsapi.mlb.com/api/v1/people?" + params.toString();
  const response = await fetch(url);
  return (await response.json()).people.map(extractStats);
}

async function hydratePlayers(playerStats, players) {
  const needsFetch = players
    .filter((player) => playerStats[player] && !playerStats[player].hydrated)
    .map((player) => playerStats[player].id);
  if (needsFetch.length === 0) return;
  const hydration = await getStats(needsFetch);
  hydration.forEach((stats) => {
    playerStats[stats.name] = stats;
  });
  window.localStorage.setItem("stats", JSON.stringify(playerStats));
}

async function getPlayers() {
  const players = window.localStorage.getItem("stats");
  if (!players) {
    try {
      const players = (
        await Promise.all(
          ["2024"].map(async (season) => {
            const url = `https://statsapi.mlb.com/api/v1/sports/1/players?season=${season}`;
            const response = await fetch(url);
            const json = await response.json();
            return json.people.reduce(
              (acc, player) => ({
                ...acc,
                [accentStrip(player.fullName)]: {
                  id: player.id,
                  hydrated: false,
                },
              }),
              {},
            );
          }),
        )
      ).reduce((acc, val) => ({ ...acc, ...val }), {});
      window.localStorage.setItem("stats", JSON.stringify(players));
      return players;
    } catch (e) {
      console.error(`Failed to get players: ${e}`);
      return {};
    }
  } else {
    return JSON.parse(players);
  }
}

// MARK: -- Player page
const playerPage = {
  selectTable: () => {
    return document.evaluate(
      "//ultimate-table",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
  },
  selectHeaderRow: (table) => {
    return document.evaluate(
      ".//tbody//tr",
      table,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
  },
  createHeaderCell: (text, id) => {
    const header = document.createElement("th");
    header.setAttribute("class", "ng-star-inserted");
    header.style["min-width"] = "80px";
    header.setAttribute("id", id);
    header.appendChild(document.createTextNode(text));
    return header;
  },
  selectPlayerCells: (table) => {
    return unwrapNodeList(
      document.evaluate(
        ".//td//a",
        table,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null,
      ),
    );
  },
  selectDataRows: (table) => {
    return unwrapNodeList(
      document.evaluate(
        ".//table//tr",
        table,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null,
      ),
    );
  },
  selectStatCell: (row, stat) => {
    return document.evaluate(
      `.//table-cell[@saber="${stat}"]`,
      row,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
  },
  createStatCell: (stat) => {
    const cell = document.createElement("table-cell");
    cell.setAttribute("class", "ng-star-inserted");
    cell.setAttribute("saber", stat);
    cell.appendChild(document.createTextNode(""));
    return cell;
  },
};

// MARK: Draft page
const draftPage = {
  selectTable: () => {
    return document.evaluate(
      "//league-draft-stats-table",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
  },
  selectHeaderRow: (table) => {
    return document.evaluate(
      ".//div[@itableheader]",
      table,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
  },
  createHeaderCell: (text, id) => {
    const header = document.createElement("div");
    header.setAttribute("itablecolumn", id);
    header.setAttribute("id", id);
    header.setAttribute("class", "i-table__cell i-table__cell--center");
    header.style.width = "8rem";
    header.appendChild(document.createTextNode(text));
    return header;
  },
  selectPlayerCells: (table) => {
    return unwrapNodeList(
      document.evaluate(
        ".//div[@itablerow]/div[@itablecell='name']//a",
        table,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null,
      ),
    );
  },
  selectDataRows: (table) => {
    return unwrapNodeList(
      document.evaluate(
        ".//div[@itablerow]",
        table,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null,
      ),
    );
  },
  selectStatCell: (row, stat) => {
    return document.evaluate(
      `./div[@itablecell='${stat}']`,
      row,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
  },
  createStatCell: (stat) => {
    const cell = document.createElement("div");
    cell.setAttribute(
      "class",
      "i-table__cell i-table__cell--center ng-star-inserted",
    );
    cell.setAttribute("itablecell", stat);
    cell.style.width = "8rem";
    cell.appendChild(document.createTextNode(""));
    return cell;
  },
};

// MARK: -- DOM Manipulation
function addHeader(model, table, text, id) {
  const headerRow = model.selectHeaderRow(table);
  if (headerRow && !document.getElementById(id)) {
    headerRow.appendChild(model.createHeaderCell(text, id));
  }
}

function addPlayerStats(model, player, stats, row) {
  ["war", "fip", "woba"].forEach((stat) => {
    let cell = model.selectStatCell(row, stat);
    if (!cell) {
      cell = model.createStatCell(stat);
      row.appendChild(cell);
    }
    const stringStat =
      !stats?.[player]?.[stat] || stats[player][stat] === -1000
        ? "-"
        : `${stats[player][stat]}`;
    cell.firstChild.nodeValue = stringStat;
  });
}

async function addSabermetrics(model, table, stats) {
  const playerCells = model.selectPlayerCells(table);
  const dataRows = model.selectDataRows(table);
  await hydratePlayers(
    stats,
    playerCells.map((c) => c.textContent),
  );
  for (let i in playerCells) {
    const playerCell = playerCells[i];
    const dataRow = dataRows[i];
    const playerName = playerCell.textContent;
    if (playerCell.getAttribute("saber") !== playerName) {
      addPlayerStats(model, playerName, stats, dataRow);
      playerCell.setAttribute("saber", playerName);
    }
  }
}

// MARK: -- Observers
function observeTable(model, stats, table) {
  const config = { childList: true, subtree: true };
  const ob = new MutationObserver(
    debounce((_, observer) => {
      observer.disconnect();
      addSabermetrics(model, table, stats);
      observer.observe(table, config);
    }, 100),
  );
  ob.observe(table, config);
  return ob;
}

function waitForTable(models) {
  return new Promise((resolve) => {
    const table = models.selectTable();
    if (table) {
      return resolve(table);
    }
    new MutationObserver((_, observer) => {
      const table = models.selectTable();
      if (table) {
        observer.disconnect();
        resolve(table);
      }
    }).observe(document, { childList: true, subtree: true });
  });
}

// MARK: -- Main
(function main() {
  const stats = getPlayers();
  let models = undefined;
  let ob = undefined;
  setInterval(async () => {
    const newModels = pickModel();
    if (!newModels || newModels === models) return;
    ob?.disconnect();
    models = newModels;
    const table = await waitForTable(models);
    addHeader(models, table, "WAR", "war");
    addHeader(models, table, "FIP", "fip");
    addHeader(models, table, "wOBA", "woba");
    ob = observeTable(models, await stats, table);
  }, 100);
})();
