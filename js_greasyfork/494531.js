// ==UserScript==
// @name        wall-battlestats
// @namespace   seintz.torn.wall-battlestats
// @version     6.4
// @description show tornstats spies on faction wall page
// @author      finally [2060206], seintz [2460991], Shade [3129695], Kindly [1956699]
// @license     GNU GPLv3
// @run-at      document-end
// @match       https://www.torn.com/factions.php*
// @match       https://www.torn.com/war.php?step=rankreport&rankID=*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     tornstats.com
// @downloadURL https://update.greasyfork.org/scripts/494531/wall-battlestats.user.js
// @updateURL https://update.greasyfork.org/scripts/494531/wall-battlestats.meta.js
// ==/UserScript==
 
const apiKey = "TS_API_KEY";
 
/*
 * -------------------------------------------------------------------------
 * |    DO NOT MODIFY BELOW     |
 * -------------------------------------------------------------------------
 */
 
let myBSScore = localStorage.getItem("myBSScore") || 0;
let ff = 0;
const myStatsCacheSeconds = 21600;
let bsCache = JSONparse(localStorage["finally.torn.bs"]) || {};
let hospTime = {};
let previousSort =
  parseInt(localStorage.getItem("finally.torn.factionSort")) || 1;
let filterFrom =
  parseInt(localStorage.getItem("finally.torn.factionFilterFrom")) || undefined;
let filterTo =
  parseInt(localStorage.getItem("finally.torn.factionFilterTo")) || undefined;
 
let loadTSFactionLock = false;
let loadTSFactionBacklog = [];
let loadTSFactionDone = [];
let hospLoopCounter = 0;
const hospNodes = [];
 
const OKAY = "OKAY";
const HOSPITAL = "HOSPITAL";
const TRAVELING = "TRAVELING";
const ABROAD = "ABROAD";
 
function JSONparse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.log(e);
  }
  return null;
}
 
function loadTSFactionsDone() {
  loadTSFactionLock = false;
  loadTSFactions();
}
 
function loadTSFactions(id) {
  if (loadTSFactionLock) {
    if (
      id &&
      loadTSFactionDone.indexOf(id) === -1 &&
      loadTSFactionBacklog.indexOf(id) === -1
    )
      loadTSFactionBacklog.push(id);
    return;
  }
 
  if (!id && loadTSFactionBacklog.length == 0) {
    showStatsAll();
    return;
  }
 
  loadTSFactionLock = true;
  id = id || loadTSFactionBacklog.shift();
  loadTSFactionDone.push(id);
 
  GM_xmlhttpRequest({
    method: "GET",
    url: `https://www.tornstats.com/api/v2/${apiKey}/spy/faction/${id}`,
    onload: (r) => {
      let j = JSONparse(r.responseText);
      if (!j || !j.status || !j.faction) {
        loadTSFactionsDone();
        return;
      }
 
      Object.keys(j.faction.members).forEach((k) =>
        addSpy(k, j.faction.members[k].spy)
      );
      localStorage["finally.torn.bs"] = JSON.stringify(bsCache);
 
      loadTSFactionsDone();
    },
    onabort: () => loadTSFactionsDone(),
    onerror: () => loadTSFactionsDone(),
    ontimeout: () => loadTSFactionsDone(),
  });
}
 
function cacheMyBattleStats() {
  let myLink = document
    .querySelector(".settings-menu li:first-child a")
    .getAttribute("href");
  let myUserID = myLink.replace(/^\D+/g, "");
  let tsLink =
    "https://www.tornstats.com/api/v2/" + apiKey + "/spy/user/" + myUserID;
  let currentTimestamp = Math.floor(Date.now() / 1000);
  let lastUpdate = localStorage.getItem("lastMyBSUpdateTime");
  let cachedUntil = +lastUpdate + +myStatsCacheSeconds;
 
  if (myBSScore != 0 && lastUpdate != null && cachedUntil > currentTimestamp) {
    return;
  }
 
  localStorage.setItem("lastMyBSUpdateTime", currentTimestamp);
 
  GM_xmlhttpRequest({
    method: "GET",
    url: tsLink,
    onload: (r) => {
      let j = JSONparse(r.responseText);
      if (!j || !j.status || !j.spy) {
        return;
      }
 
      let myScore = j.spy.your_score;
      localStorage.setItem("myBSScore", myScore);
    },
  });
}
cacheMyBattleStats();
 
function loadFactions() {
  let factionIds = Array.from(
    document.querySelectorAll("[href^='/factions.php?step=profile&ID=']")
  )
    .map((a) => a.href.replace(/.*?ID=(\d+)$/, "$1"))
    .filter((v, i, a) => a.indexOf(v) === i);
  factionIds.forEach((id) => loadTSFactions(id));
}
 
const statusOrder = {
  [OKAY]: 1,
  [HOSPITAL]: 2,
  [TRAVELING]: 3,
  [ABROAD]: 4,
};
 
const getStatus = (node) => {
  var c = node.className;
  if (c.includes("okay")) {
    return OKAY;
  } else if (c.includes("hospital")) {
    return HOSPITAL;
  } else if (c.includes("traveling")) {
    return TRAVELING;
  } else if (c.includes("abroad")) {
    return ABROAD;
  } else {
    return ABROAD;
  }
};
 
function sortStatus(node, sort) {
  if (!node) node = document.querySelector(".f-war-list .members-list");
  if (!node) return;
 
  let sortIcon = node.parentNode.querySelector(".status > [class*='sortIcon']");
 
  if (sort) node.finallySort = sort;
  else if (node.finallySort == undefined) node.finallySort = 2;
  else if (++node.finallySort > 2) node.finallySort = sortIcon ? 1 : 0;
 
  if (sortIcon) {
    if (node.finallySort > 0) {
      let active = node.parentNode.querySelector(
        "[class*='activeIcon']:not([class*='finally-status-activeIcon'])"
      );
      if (active) {
        let activeClass = active.className.match(
          /(?:\s|^)(activeIcon(?:[^\s|$]+))(?:\s|$)/
        )[1];
        active.classList.remove(activeClass);
      }
 
      sortIcon.classList.add("finally-status-activeIcon");
      if (node.finallySort == 1) {
        sortIcon.classList.remove("finally-status-desc");
        sortIcon.classList.add("finally-status-asc");
      } else {
        sortIcon.classList.remove("finally-status-asc");
        sortIcon.classList.add("finally-status-desc");
      }
    } else {
      sortIcon.classList.remove("finally-status-activeIcon");
    }
  }
 
  // default sort order is
  // ok
  // travelling
  // hospital
  // abroad
 
  let nodes = Array.from(
    node.querySelectorAll(
      ".your:not(.row-animation-new), .enemy:not(.row-animation-new)"
    )
  );
  for (let i = 0; i < nodes.length; i++)
    if (nodes[i].finallyPos == undefined) nodes[i].finallyPos = i;
 
  nodes = nodes.sort((a, b) => {
    let idA = a
      .querySelector('a[href*="XID"]')
      .href.replace(/.*?XID=(\d+)/i, "$1");
    let statusA = getStatus(a.querySelector(".status"));
 
    let posA = a.finallyPos;
    let idB = b
      .querySelector('a[href*="XID"]')
      .href.replace(/.*?XID=(\d+)/i, "$1");
    let statusB = getStatus(b.querySelector(".status"));
    let posB = b.finallyPos;
 
    let type = node.finallySort;
    switch (node.finallySort) {
      case 1:
        if (statusA !== HOSPITAL || statusB !== HOSPITAL)
          return statusOrder[statusA] - statusOrder[statusB];
        return (
          hospTime[idA] -
          new Date().getTime() / 1000 -
          (hospTime[idB] - new Date().getTime() / 1000)
        );
      case 2:
        if (statusA !== HOSPITAL || statusB !== HOSPITAL)
          return statusOrder[statusB] - statusOrder[statusA];
        return (
          hospTime[idB] -
          new Date().getTime() / 1000 -
          (hospTime[idA] - new Date().getTime() / 1000)
        );
      default:
        return posA > posB ? 1 : -1;
    }
  });
 
  for (let i = 0; i < nodes.length; i++)
    nodes[i].parentNode.appendChild(nodes[i]);
 
  if (!sort) {
    document.querySelectorAll(".members-list").forEach((e) => {
      if (node != e) sortStatus(e, node.finallySort);
    });
  }
}
 
function sortStats(node, sort) {
  if (!node) node = document.querySelector(".f-war-list .members-list");
  if (!node) return;
 
  let sortIcon = node.parentNode.querySelector(".bs > [class*='sortIcon']");
 
  if (sort) node.finallySort = sort;
  else if (node.finallySort == undefined) node.finallySort = 2;
  else if (++node.finallySort > 2) node.finallySort = sortIcon ? 1 : 0;
 
  if (sortIcon) {
    if (node.finallySort > 0) {
      let active = node.parentNode.querySelector(
        "[class*='activeIcon']:not([class*='finally-bs-activeIcon'])"
      );
      if (active) {
        let activeClass = active.className.match(
          /(?:\s|^)(activeIcon(?:[^\s|$]+))(?:\s|$)/
        )[1];
        active.classList.remove(activeClass);
      }
 
      sortIcon.classList.add("finally-bs-activeIcon");
      if (node.finallySort == 1) {
        sortIcon.classList.remove("finally-bs-desc");
        sortIcon.classList.add("finally-bs-asc");
      } else {
        sortIcon.classList.remove("finally-bs-asc");
        sortIcon.classList.add("finally-bs-desc");
      }
    } else {
      sortIcon.classList.remove("finally-bs-activeIcon");
    }
  }
 
  let nodes = Array.from(
    node.querySelectorAll(
      ".table-body > .table-row, .your:not(.row-animation-new), .enemy:not(.row-animation-new)"
    )
  );
  for (let i = 0; i < nodes.length; i++)
    if (nodes[i].finallyPos == undefined) nodes[i].finallyPos = i;
 
  nodes = nodes.sort((a, b) => {
    let posA = a.finallyPos;
    let idA = a
      .querySelector('a[href*="XID"]')
      .href.replace(/.*?XID=(\d+)/i, "$1");
    let totalA =
      (bsCache[idA] &&
        typeof bsCache[idA].total == "number" &&
        bsCache[idA].total) ||
      posA;
    let posB = b.finallyPos;
    let idB = b
      .querySelector('a[href*="XID"]')
      .href.replace(/.*?XID=(\d+)/i, "$1");
    let totalB =
      (bsCache[idB] &&
        typeof bsCache[idB].total == "number" &&
        bsCache[idB].total) ||
      posB;
 
    let type = node.finallySort;
    switch (node.finallySort) {
      case 1:
        if (totalA <= 100 && totalB <= 100) return totalB > totalA ? 1 : -1;
        return totalA > totalB ? 1 : -1;
      case 2:
        return totalB > totalA ? 1 : -1;
      default:
        return posA > posB ? 1 : -1;
    }
  });
 
  for (let i = 0; i < nodes.length; i++)
    nodes[i].parentNode.appendChild(nodes[i]);
 
  if (!sort) {
    document.querySelectorAll(".members-list").forEach((e) => {
      if (node != e) sortStats(e, node.finallySort);
    });
  }
}
 
function addSpy(id, spy) {
  if (!spy) return;
  bsCache[id] = spy;
}
 
function updateStats(id, node, parentNode) {
  if (!node) return;
  let stats = ["N/A", "N/A", "N/A", "N/A", "N/A"];
  let time = "";
  if (bsCache[id]) {
    if (
      (filterFrom && bsCache[id].total <= filterFrom) ||
      (filterTo && bsCache[id].total >= filterTo)
    ) {
      parentNode.style.display = "none";
    } else {
      parentNode.style.display = "";
    }
 
    stats[0] = bsCache[id].total;
    stats[1] = bsCache[id].strength;
    stats[2] = bsCache[id].defense;
    stats[3] = bsCache[id].speed;
    stats[4] = bsCache[id].dexterity;
 
    let enemy_stat_score =
      Math.sqrt(+stats[1]) +
      Math.sqrt(+stats[2]) +
      Math.sqrt(+stats[3]) +
      Math.sqrt(+stats[4]);
    let myScore = localStorage.getItem("myBSScore");
    if (myScore > 0 && enemy_stat_score > 0) {
      ff = 1 + (8 / 3) * (enemy_stat_score / myScore);
      ff = Math.round(ff * 100) / 100;
      if (ff > 3) {
        ff = 3.0;
      }
    } else {
      ff = "-";
    }
 
    let difference = new Date().getTime() / 1000 - bsCache[id].timestamp;
    if (difference < 0) {
      delete bsCache[id];
      localStorage["finally.torn.bs"] = JSON.stringify(bsCache);
      return;
    }
    if (difference > 365 * 24 * 60 * 60)
      time = Math.floor(difference / (365 * 24 * 60 * 60)) + " years ago";
    else if (difference > 30 * 24 * 60 * 60)
      time = Math.floor(difference / (30 * 24 * 60 * 60)) + " months ago";
    else if (difference > 24 * 60 * 60)
      time = Math.floor(difference / (24 * 60 * 60)) + " days ago";
    else if (difference > 60 * 60)
      time = Math.floor(difference / (60 * 60)) + " hours ago";
    else if (difference > 60)
      time = Math.floor(difference / 60) + " minutes ago";
    else time = Math.floor(difference) + " seconds ago";
  }
 
  let units = ["K", "M", "B", "T", "Q"];
  for (let i = 0; i < stats.length; i++) {
    let stat = Number.parseInt(stats[i]);
    if (Number.isNaN(stat) || stat == 0) continue;
 
    for (let j = 0; j < units.length; j++) {
      stat = stat / 1000;
      if (stat > 1000) continue;
 
      stat = stat.toFixed(i == 0 ? (stat >= 100 ? 0 : 1) : 2);
      stats[i] = `${stat}${units[j]}`;
      break;
    }
  }
 
  node.innerHTML = stats[0];
  node.title = `
    <div class="finally-bs-stat">
        <b>FF</b> <span class="finally-bs-stat">${ff}</span><br/>
        <b>STR</b> <span class="finally-bs-stat">${stats[1]}</span><br/>
        <b>DEF</b> <span class="finally-bs-stat">${stats[2]}</span><br/>
        <b>SPD</b> <span class="finally-bs-stat">${stats[3]}</span><br/>
        <b>DEX</b> <span class="finally-bs-stat">${stats[4]}</span><br/>
        ${time}
    </div>`;
}
 
function updateHospTimers() {
  for (let i = 0, n = hospNodes.length; i < n; i++) {
    const hospNode = hospNodes[i];
    const id = hospNode[0];
    const node = hospNode[1];
    if (!node) continue;
    if (!hospTime[id]) continue;
 
    let totalSeconds = hospTime[id] - new Date().getTime() / 1000;
    if (!totalSeconds || totalSeconds <= 0) continue;
    else if (totalSeconds >= 10 * 60 && hospLoopCounter % 10 != 0) continue;
    else if (
      totalSeconds < 10 * 60 &&
      totalSeconds >= 5 * 60 &&
      hospLoopCounter % 5 != 0
    )
      continue;
 
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
 
    node.textContent = `${hours.toString().padLeft(2, "0")}:${minutes
      .toString()
      .padLeft(2, "0")}:${seconds.toString().padLeft(2, "0")}`;
  }
  if (hospNodes.length > 0) hospLoopCounter++;
  setTimeout(updateHospTimers, 1000);
}
 
function updateStatus(id, node) {
  if (!node) return;
  if (hospNodes.find((h) => h[0] == id)) return;
  hospNodes.push([id, node]);
}

function onClickCopyStatus(event) {
    const name = event.target.parentNode.querySelector('.honor-text:not([class*=" "])')?.textContent;
    const status = event.target.textContent;
    const bs = event.target.parentNode.querySelector(".bs").textContent;
    const id = event.target.parentNode.querySelector('a[href*="XID"]')
    .href.replace(/.*?XID=(\d+)/i, "$1");

    const text = `${name} ${bs} ${status} https://torn.com/loader.php?sid=attack&user2ID=${id}`;

    navigator.clipboard.writeText(text)
}
 
function showStats(node) {
  if (!node) return;
 
  let id = node
    .querySelector('a[href*="XID"]')
    .href.replace(/.*?XID=(\d+)/i, "$1");
  let bsNode = node.querySelector(".bs") || document.createElement("div");
  let statusNode = node.querySelector(".status");

  statusNode.addEventListener("click", (event) => {onClickCopyStatus(event)});
 
  updateStats(id, bsNode, node);
  updateStatus(id, statusNode);
 
  if (bsNode.classList.contains("bs")) {
    return;
  }
 
  bsNode.className = "table-cell bs level lvl left iconShow finally-bs-col";
  let iconsNode = node.querySelector(".user-icons, .member-icons, .points");
  iconsNode.parentNode.insertBefore(bsNode, iconsNode);
  let isMobile = false;
  bsNode.addEventListener("touchstart", () => (isMobile = true));
  bsNode.addEventListener("click", () => {
    if (isMobile) return;
    window.open(`loader.php?sid=attack&user2ID=${id}`, "_newtab");
  });
  bsNode.addEventListener("dblclick", () => {
    window.open(`loader.php?sid=attack&user2ID=${id}`, "_newtab");
  });
}
 
function showStatsAll(node) {
  if (!node)
    node = Array.from(
      document.querySelectorAll(".f-war-list .members-list, .members-list")
    );
  if (!node) return;
 
  if (!(node instanceof Array)) {
    node = [node];
  }
 
  node.forEach((n) =>
    n
      .querySelectorAll(
        ".your:not(.row-animation-new), .enemy:not(.row-animation-new), .table-body > .table-row"
      )
      .forEach((e) => showStats(e))
  );
}
 
function watchWall(observeNode) {
  if (!observeNode) return;
 
  loadFactions();
 
  let parentNode = observeNode.parentNode.parentNode.parentNode;
  let factionNames = parentNode.querySelector(".faction-names");
  if (factionNames && !factionNames.querySelector(".finally-bs-swap")) {
    let swapNode = document.createElement("div");
    swapNode.className = "finally-bs-swap";
    swapNode.innerHTML = "&lt;&gt;";
    factionNames.appendChild(swapNode);
    swapNode.addEventListener("click", () => {
      parentNode
        .querySelectorAll(
          ".name.left, .name.right, .tab-menu-cont.right, .tab-menu-cont.left"
        )
        .forEach((e) => {
          if (e.classList.contains("left")) {
            e.classList.remove("left");
            e.classList.add("right");
          } else {
            e.classList.remove("right");
            e.classList.add("left");
          }
        });
    });
 
    let filterNode = document.createElement("div");
    filterNode.className = "finally-bs-filter input-money-group no-max-value";
    let filterFromInput = document.createElement("input");
    filterFromInput.className = "input-money";
    filterFromInput.placeholder = "Filter BS from";
    filterFromInput.value =
      localStorage.getItem("finally.torn.factionFilterFrom") || "";
    let filterToInput = document.createElement("input");
    filterToInput.className = "input-money";
    filterToInput.placeholder = "Filter BS to";
    filterToInput.value =
      localStorage.getItem("finally.torn.factionFilterTo") || "";
    filterNode.appendChild(filterFromInput);
    filterNode.appendChild(filterToInput);
    factionNames.appendChild(filterNode);
 
    function filterFromTo() {
      function formatInput(input) {
        let value = input.value.toLowerCase();
        let valueNum = value.replace(/[^\d]/g, "");
 
        let multiplier = 1;
        if (value.indexOf("k") !== -1) multiplier = 1000;
        else if (value.indexOf("m") !== -1) multiplier = 1000000;
        else if (value.indexOf("b") !== -1) multiplier = 1000000000;
        else if (value.indexOf("t") !== -1) multiplier = 1000000000000;
 
        valueNum *= multiplier;
        input.value = valueNum > 0 ? valueNum.toLocaleString("en-US") : "";
 
        return valueNum;
      }
 
      filterFrom = formatInput(filterFromInput);
      filterTo = formatInput(filterToInput);
      localStorage.setItem("finally.torn.factionFilterFrom", filterFrom || "");
      localStorage.setItem("finally.torn.factionFilterTo", filterTo || "");
 
      showStatsAll();
    }
    filterFromTo();
 
    filterFromInput.addEventListener("keyup", filterFromTo);
    filterToInput.addEventListener("keyup", filterFromTo);
  }
 
  let titleNode = observeNode.parentNode.querySelector(".title, .c-pointer");
  let lvNode = titleNode.querySelector(".level");
  lvNode.childNodes[0].nodeValue = "Lv";
 
  // sort by status
  let oldStatusNode = titleNode.querySelector(".status");
  if (oldStatusNode) {
    // cloning node to remove existing click event handler
    let statusNode = oldStatusNode.cloneNode(true);
    // finding default order class and removing it
    let orderClass = statusNode.childNodes[1].className.match(
      /(?:\s|^)((?:asc|desc)(?:[^\s|$]+))(?:\s|$)/
    )[1];
    statusNode.childNodes[1].classList.remove(orderClass);
    // replacing old node with cloned node and adding click handler
    oldStatusNode.replaceWith(statusNode);
    statusNode.addEventListener("click", () => {
      sortStatus(observeNode);
    });
  }
 
  if (!titleNode.querySelector(".bs")) {
    let bsNode = lvNode.cloneNode(true);
    bsNode.classList.add("bs");
    bsNode.childNodes[0].nodeValue = "BS";
    titleNode.insertBefore(
      bsNode,
      titleNode.querySelector(".user-icons, .points")
    );
    if (bsNode.childNodes.length > 1) {
      let orderClass = bsNode.childNodes[1].className.match(
        /(?:\s|^)((?:asc|desc)(?:[^\s|$]+))(?:\s|$)/
      )[1];
      bsNode.childNodes[1].classList.remove(orderClass);
      for (let i = 0; i < titleNode.children.length; i++) {
        titleNode.children[i].addEventListener("click", (e) => {
          setTimeout(() => {
            let sort = i + 1;
            let sortIcon = e.target.querySelector("[class*='sortIcon']");
            let desc = sortIcon
              ? sortIcon.className.indexOf("desc") === -1
              : false;
            sort = desc ? sort : -sort;
            localStorage.setItem("finally.torn.factionSort", sort);
 
            if (!e.target.classList.contains("status"))
              document
                .querySelectorAll("[class*='finally-status-activeIcon']")
                .forEach((e) =>
                  e.classList.remove("finally-status-activeIcon")
                );
 
            if (!e.target.classList.contains("bs"))
              document
                .querySelectorAll("[class*='finally-bs-activeIcon']")
                .forEach((e) => e.classList.remove("finally-bs-activeIcon"));
            //if (Math.abs(sort) != 3) document.querySelectorAll("[class*='finally-bs-activeIcon']").forEach((e) => e.classList.remove("finally-bs-activeIcon"));
          }, 100);
        });
      }
      bsNode.addEventListener("click", () => {
        sortStats(observeNode);
      });
 
      let title = titleNode.children[Math.abs(previousSort) - 1];
      let sortIcon = title.querySelector("[class*='sortIcon']");
      let desc = sortIcon ? sortIcon.className.indexOf("desc") !== -1 : false;
      let active = sortIcon
        ? sortIcon.className.indexOf("activeIcon") !== -1
        : false;
 
      let x = 0;
      if (title.classList.contains("bs") && observeNode.querySelector(".enemy"))
        x = 0; //funny edge case, dont ask :)
      //if (Math.abs(previousSort) == 3 && observeNode.querySelector(".enemy")) x = 0; //funny edge case, dont ask :)
      else if (!active && previousSort < 0) x = 1;
      else if (!active) x = 2;
      else if (previousSort < 0 && !desc) x = 1;
      else if (previousSort > 0 && desc) x = 1;
 
      for (; x > 0; x--) {
        title.click();
      }
    }
  }
 
  showStatsAll(observeNode);
 
  let prevSortCheck = "";
  const mo = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      for (const node of mutation.addedNodes) {
        if (
          node.classList &&
          (node.classList.contains("your") || node.classList.contains("enemy"))
        ) {
          showStats(node);
        }
      }
    });
 
    let sort = Array.from(observeNode.querySelectorAll('a[href*="XID"]'))
      .map((a) => a.href)
      .join(",");
    if (
      prevSortCheck != sort &&
      observeNode.parentNode.querySelector(".finally-bs-activeIcon")
    ) {
      mo.disconnect();
      sortStats(observeNode, observeNode.finallySort);
      prevSortCheck = Array.from(observeNode.querySelectorAll('a[href*="XID"]'))
        .map((a) => a.href)
        .join(",");
      mo.takeRecords();
      mo.observe(observeNode, { childList: true, subtree: true });
    }
  });
 
  mo.observe(observeNode, { childList: true, subtree: true });
}
 
function watchWalls(observeNode) {
  if (!observeNode) return;
 
  observeNode.querySelectorAll(".members-list").forEach((e) => watchWall(e));
 
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      for (const node of mutation.addedNodes) {
        node.querySelector &&
          node.querySelectorAll(".members-list").forEach((w) => watchWall(w));
      }
    });
  }).observe(observeNode, { childList: true, subtree: true });
}
 
function memberList(observeNode) {
  if (!observeNode) return;
 
  loadFactions();
 
  let titleNode = observeNode.querySelector(".table-header");
 
  if (!titleNode || titleNode.querySelector(".bs")) return;
 
  let bsNode = document.createElement("li");
  bsNode.className = "table-cell bs torn-divider divider-vertical";
  bsNode.innerHTML = "BS";
  titleNode.insertBefore(bsNode, titleNode.querySelector(".member-icons"));
  for (let i = 0; i < titleNode.children.length; i++) {
    titleNode.children[i].addEventListener("click", (e) => {
      let sort = i + 1;
      sort = e.target.querySelector("[class*='asc']") ? -sort : sort;
      localStorage.setItem("finally.torn.factionSort", sort);
    });
  }
  bsNode.addEventListener("click", () => {
    sortStats(observeNode);
  });
 
  if (previousSort >= 0) {
    titleNode.children[previousSort - 1].click();
    titleNode.children[previousSort - 1].click();
  } else if (previousSort < 0) titleNode.children[-previousSort - 1].click();
 
  observeNode
    .querySelectorAll(".table-body > .table-row")
    .forEach((e) => showStats(e));
}
 
updateHospTimers();
memberList(document.querySelector(".members-list"));
watchWalls(document.querySelector(".f-war-list"));
 
new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    for (const node of mutation.addedNodes) {
      memberList(node.querySelector && node.querySelector(".members-list"));
      watchWalls(node.querySelector && node.querySelector(".f-war-list"));
    }
  });
}).observe(document.body, { childList: true, subtree: true });
 
const oldFetch = unsafeWindow.fetch;
unsafeWindow.fetch = async (url, init) => {
  if (
    !url.includes("step=getwarusers") &&
    !url.includes("step=getProcessBarRefreshData")
  )
    return oldFetch(url, init);
 
  let response = await oldFetch(url, init);
  let clone = response.clone();
  clone.json().then((json) => {
    let members = null;
    if (json.warDesc) members = json.warDesc.members;
    else if (json.userStatuses) members = json.userStatuses;
    else return;
 
    Object.keys(members).forEach((id) => {
      let status = members[id].status || members[id];
      id = members[id].userID || id;
      if (status.text == "Hospital") hospTime[id] = status.updateAt;
      else delete hospTime[id];
    });
 
    showStatsAll();
  });
 
  return response;
};
 
const oldWebSocket = unsafeWindow.WebSocket;
unsafeWindow.WebSocket = function (...args) {
  const socket = new oldWebSocket(...args);
  socket.addEventListener("message", (event) => {
    let json = JSONparse(event.data);
 
    if (
      !json?.result?.data?.data?.message?.namespaces?.users?.actions
        ?.updateStatus?.status
    )
      return;
    // console.log(json);
    let id =
      json.result.data.data.message.namespaces.users.actions.updateStatus
        .userId;
    let status =
      json.result.data.data.message.namespaces.users.actions.updateStatus
        .status;
    if (status.text == "Hospital") hospTime[id] = status.updateAt;
    else delete hospTime[id];
 
    showStatsAll();
  });
  return socket;
};
 
GM_addStyle(`
    @media screen and (max-width: 1000px) {
        .members-cont .bs {
            display: none;
        }
    }
 
    .members-cont .level {
        width: 27px !important;
    }
 
    .members-cont .id {
        padding-left: 5px !important;
        width: 28px !important;
    }
 
    .members-cont .points {
        width: 42px !important;
    }
 
    .finally-bs-stat {
        font-family: monospace;
    }
 
    .finally-bs-stat > span {
        display: inline-block;
        width: 55px;
        text-align: right;
    }
 
    .faction-names {
        position: relative;
    }
 
    .finally-status-filter {
        position: absolute !important;
        top: 25px !important;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 120px;
        cursor: pointer;
    }
    .finally-status-filter > input {
        display: block !important;
        width: 100px;
    }
 
    .finally-status-swap {
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 100px;
        cursor: pointer;
    }
 
    .finally-status-activeIcon {
        display: block !important;
    }
 
    .finally-status-asc {
        border-bottom: 6px solid var(--sort-arrow-color);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 0 solid transparent;
        height: 0;
        top: -8px;
        width: 0;
    }
 
    .finally-status-desc {
        border-bottom: 0 solid transparent;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--sort-arrow-border-color);
        height: 0;
        top: -1px;
        width: 0;
    }
 
    .finally-status-col {
        text-overflow: clip !important;
    }
 
 
    .finally-bs-filter {
        position: absolute !important;
        top: 25px !important;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 120px;
        cursor: pointer;
    }
    .finally-bs-filter > input {
        display: block !important;
        width: 100px;
    }
 
    .finally-bs-swap {
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 100px;
        cursor: pointer;
    }
 
    .finally-bs-activeIcon {
        display: block !important;
    }
 
    .finally-bs-asc {
        border-bottom: 6px solid var(--sort-arrow-color);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 0 solid transparent;
        height: 0;
        top: -8px;
        width: 0;
    }
 
    .finally-bs-desc {
        border-bottom: 0 solid transparent;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--sort-arrow-border-color);
        height: 0;
        top: -1px;
        width: 0;
    }
 
    .finally-bs-col {
        text-overflow: clip !important;
    }
 
    .raid-members-list .level:not(.bs) {
        width: 16px !important;
    }
 
    .raid-members-list .level:not(.status) {
        width: 16px !important;
    }
 
    div.desc-wrap:not([class*='warDesc']) .finally-bs-swap {
    display: none;
    }
 
    div.desc-wrap:not([class*='warDesc']) .finally-status-swap {
    display: none;
    }
 
    div.desc-wrap:not([class*='warDesc']) .faction-names {
    padding-top: 100px !important;
    }
 
    .re_spy_title, .re_spy_col {
    display: none !important;
    }
`);
