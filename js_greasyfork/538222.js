// ==UserScript==
// @name         War Status Timers
// @namespace    nichtgersti.torn.war-status-timers
// @version      1.0.2
// @description  Hospital timers on the faction and war pages.
// @license      GNU GPLv3
// @author       NichtGersti [3380912]
// @author       finally [2060206], seintz [2460991], Shade [3129695], Kindly [1956699], Mr_Bob [479620], nao [2669774] (it's basically a stripped version of their script)
// @run-at       document-end
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/war.php?step=rankreport&rankID=*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538222/War%20Status%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/538222/War%20Status%20Timers.meta.js
// ==/UserScript==

const OKAY = 'OKAY';
const ABROAD = 'ABROAD';
const HOSPITAL = 'HOSPITAL';
const TRAVELING = 'TRAVELING';

let hospNodes = [];
const storeSort = localStorage.getItem('finally.torn.factionSort');

let previousSort = parseInt(storeSort) || 1;

let hospTime = {};

const statusOrder = {
  [OKAY]: 1,
  [HOSPITAL]: 2,
  [TRAVELING]: 3,
  [ABROAD]: 4,
};

function JSONparse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.log(e);
  }
  return null;
}

function isPDA() {
  return window.flutter_inappwebview !== undefined;
}

function getStatus(node) {
  var c = node.className;
  if (c.includes('okay')) {
    return OKAY;
  } else if (c.includes('hospital')) {
    return HOSPITAL;
  } else if (c.includes('traveling')) {
    return TRAVELING;
  } else if (c.includes('abroad')) {
    return ABROAD;
  } else {
    return ABROAD;
  }
}

function sortStatus(node, sort) {
  if (!node) node = document.querySelector('.f-war-list .members-list');
  if (!node) return;

  let sortIcon = node.parentNode.querySelector(".status > [class*='sortIcon']");

  if (sort) node.finallySort = sort;
  else if (node.finallySort == undefined) node.finallySort = 2;
  else if (++node.finallySort > 2) node.finallySort = sortIcon ? 1 : 0;

  if (sortIcon) {
    if (node.finallySort > 0) {
      let active = node.parentNode.querySelector("[class*='activeIcon']:not([class*='finally-status-activeIcon'])");
      if (active) {
        let activeClass = active?.className?.match(/(?:\s|^)(activeIcon(?:[^\s|$]+))(?:\s|$)/)?.[1];
        if (activeClass) active.classList.remove(activeClass);
      }

      sortIcon.classList.add('finally-status-activeIcon');
      if (node.finallySort == 1) {
        sortIcon.classList.remove('finally-status-desc');
        sortIcon.classList.add('finally-status-asc');
      } else {
        sortIcon.classList.remove('finally-status-asc');
        sortIcon.classList.add('finally-status-desc');
      }
    } else {
      sortIcon.classList.remove('finally-status-activeIcon');
    }
  }

  // default sort order is
  // ok
  // travelling
  // hospital
  // abroad

  let nodes = Array.from(node.querySelectorAll('.your:not(.row-animation-new), .enemy:not(.row-animation-new)'));
  for (let i = 0; i < nodes.length; i++) if (nodes[i].finallyPos == undefined) nodes[i].finallyPos = i;

  nodes = nodes.sort((a, b) => {
    let idA = a.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, '$1');
    let statusA = getStatus(a.querySelector('.status'));

    let posA = a.finallyPos;
    let idB = b.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, '$1');
    let statusB = getStatus(b.querySelector('.status'));
    let posB = b.finallyPos;

    let type = node.finallySort;
    switch (node.finallySort) {
      case 1:
        if (statusA !== HOSPITAL || statusB !== HOSPITAL) return statusOrder[statusA] - statusOrder[statusB];
        return hospTime[idA] - new Date().getTime() / 1000 - (hospTime[idB] - new Date().getTime() / 1000);
      case 2:
        if (statusA !== HOSPITAL || statusB !== HOSPITAL) return statusOrder[statusB] - statusOrder[statusA];
        return hospTime[idB] - new Date().getTime() / 1000 - (hospTime[idA] - new Date().getTime() / 1000);
      default:
        return posA > posB ? 1 : -1;
    }
  });

  for (let i = 0; i < nodes.length; i++) nodes[i].parentNode.appendChild(nodes[i]);

  if (!sort) {
    document.querySelectorAll('.members-list').forEach((e) => {
      if (node != e) sortStatus(e, node.finallySort);
    });
  }
}

function updateHospTimer(node, force = false) {
  if (!node) return;
  
  let [id, , ] = hospNodes.find((h) => h && h[1] == node);
  let totalSeconds = hospTime[id] - new Date().getTime() / 1000;
  
  if (!totalSeconds || totalSeconds <= 1) return; 

  if (totalSeconds >= 10 * 60 && totalSeconds % 10 >= 0.1) {
    if (!force) return;
    totalSeconds = Math.ceil(totalSeconds / 10) * 10;
  }
  else if (totalSeconds >= 5 * 60 && totalSeconds % 5 >= 1) {
    if (!force) return;
    totalSeconds = Math.ceil(totalSeconds / 5) * 5;
  }

  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);

  node.textContent = `${hours.toString().padLeft(2, '0')}:${minutes
    .toString()
    .padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}`;
}

//TODO: initial shown value can still be "Hospital"
//mabe look into replacing the for loop to only run over hospTime instead of hospNodes
function updateHospTimerAll() {
  hospNodes.forEach(([, node, ]) => updateHospTimer(node));
}

function collectStatusNode(node) {
  if (!node) return;

  let statusNode = node.querySelector('.status');
  if (!statusNode) return;

  let id = node.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, '$1');
  let inWarPage = node.classList.contains("your")  || node.classList.contains("enemy"); //when viewing the war page from other factions there are 2 status field for every member
  if (hospNodes.find((h) => h && h[0] == id && h[2] == inWarPage)) return;

  hospNodes.push([id, statusNode, inWarPage]);
  updateHospTimer(statusNode, true);
}

function collectStatusNodeAll(node) {
  if (!node) node = Array.from(document.querySelectorAll('.f-war-list .members-list, .members-list'));
  if (!node) return;

  if (!(node instanceof Array)) {
    node = [node];
  }

  node.forEach((n) =>
    n
      .querySelectorAll('.your:not(.row-animation-new), .enemy:not(.row-animation-new), .table-body > .table-row')
      .forEach((e) => collectStatusNode(e)),
  );
}

function forgetStatusNode(node, filter = true) {
  if (!node) return;

  let statusNode = node.querySelector('.status');
  if (!statusNode) return;

  let id = node.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, '$1');
  let inWarPage = node.classList.contains("your")  || node.classList.contains("enemy"); //when viewing the war page from other factions there are 2 status field for every member
  const index = hospNodes.findIndex((h) => h && h[0] == id && h[2] == inWarPage);
  if (index < 0) return;
  delete hospNodes[index];
  if (filter) hospNodes = hospNodes.filter(Boolean);
}

function forgetStatusNodeAll(node) {
  if (!node) return;

  if (!(node instanceof Array)) {
    node = [node];
  }

  node.forEach((n) =>
    n
      .querySelectorAll('.your:not(.row-animation-new), .enemy:not(.row-animation-new), .table-body > .table-row')
      .forEach((e) => forgetStatusNode(e, false)),
  );
  hospNodes = hospNodes.filter(Boolean);
}

function watchWall(observeNode) {
  if (!observeNode) return;
  
  let parentNode = observeNode.parentNode.parentNode.parentNode;
  let factionNames = parentNode.querySelector('.faction-names');

  //first run
  if (factionNames && !factionNames.querySelector('.faction-side-swap')) {
    //Faction swapping
    let swapNode = document.createElement('div');
    swapNode.className = 'faction-side-swap';
    swapNode.innerHTML = '&lt;&gt;';
    factionNames.appendChild(swapNode);
    swapNode.addEventListener('click', () => {
      parentNode.querySelectorAll('.name.left, .name.right, .tab-menu-cont.right, .tab-menu-cont.left').forEach((e) => {
        if (e.classList.contains('left')) {
          e.classList.remove('left');
          e.classList.add('right');
        } else {
          e.classList.remove('right');
          e.classList.add('left');
        }
      });
    });
  }

  let titleNode = observeNode.parentNode.querySelector('.title, .c-pointer');
  let oldStatusNode = titleNode.querySelector('.status');
  if (oldStatusNode && !oldStatusNode.classList.contains("custom-hosp-timer")) {
    // sort by status replacement button, maybe look into removing the click handler another way without needing to replace the button
    // cloning node to remove existing click event handler, remove default order class, add new click-listener, then replace
    let statusNode = oldStatusNode.cloneNode(true);
    statusNode.classList.add('custom-hosp-timer');
    let orderClass = statusNode.childNodes[1].className.match(/(?:\s|^)((?:asc|desc)(?:[^\s|$]+))(?:\s|$)/)[1];
    statusNode.childNodes[1].classList.remove(orderClass);
    oldStatusNode.replaceWith(statusNode);
    statusNode.addEventListener('click', () => {
      sortStatus(observeNode);
    });

    //hide status sorting arrow when sorting by something else than status
    for (let i = 0; i < titleNode.children.length; i++) {
      titleNode.children[i].addEventListener('click', (e) => {
        setTimeout(() => {
          let sort = i + 1;
          let sortIcon = e.target.querySelector("[class*='sortIcon']");
          let desc = sortIcon ? sortIcon.className.indexOf('desc') === -1 : false;
          sort = desc ? sort : -sort;
          localStorage.setItem('finally.torn.factionSort', sort);

          if (!e.target.classList.contains('status'))
            document
              .querySelectorAll("[class*='finally-status-activeIcon']")
              .forEach((e) => e.classList.remove('finally-status-activeIcon'));

        }, 100);
      });
    }

    //restore previous sorting on page load
    let title = titleNode.children[Math.abs(previousSort) - 1];
    let sortIcon = title.querySelector("[class*='sortIcon']");
    let desc = sortIcon ? sortIcon.className.indexOf('desc') !== -1 : false;
    let active = sortIcon ? sortIcon.className.indexOf('activeIcon') !== -1 : false;

    let x = 0;
    if (!active && previousSort < 0) x = 1;
    else if (!active) x = 2;
    else if (previousSort < 0 && !desc) x = 1;
    else if (previousSort > 0 && desc) x = 1;

    for (; x > 0; x--) title.click();
  }

  collectStatusNodeAll(observeNode);

  const mo = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      for (const node of mutation.addedNodes) {
        if (node.classList && (node.classList.contains('your') || node.classList.contains('enemy'))) {
          collectStatusNode(node);
        }
      }
      for (const node of mutation.removedNodes) {
        if (node.classList && (node.classList.contains('your') || node.classList.contains('enemy'))) {
          forgetStatusNode(node);
        }
      }
    });
  });

  mo.observe(observeNode, { childList: true, subtree: true });
}

//observe both members lists
function watchWalls(observeNode) {
  if (!observeNode) return;

  observeNode.querySelectorAll('.members-list').forEach((e) => watchWall(e));

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      for (const node of mutation.addedNodes) {
        node.querySelector && node.querySelectorAll('.members-list').forEach((w) => watchWall(w));
      }
    });
  }).observe(observeNode, { childList: true, subtree: true });
}

setInterval(updateHospTimerAll, 1000);
watchWalls(document.querySelector('.f-war-list'));

new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    for (const node of mutation.addedNodes) {
      watchWalls(node.querySelector && node.querySelector('.f-war-list'));
    }
    for (const node of mutation.removedNodes) {
      node.querySelector && node.querySelectorAll('.members-list').forEach((w) => forgetStatusNodeAll(w));
    }
  });
}).observe(document.body, { childList: true, subtree: true });



const targetWindow = isPDA() ? window : unsafeWindow;
const oldFetch = targetWindow.fetch;
targetWindow.fetch = async (...args) => {
  const url = args[0]?.url || args[0];
  const notWarPage = !url.includes('step=getwarusers') && !url.includes('step=getProcessBarRefreshData');
  if (notWarPage) return oldFetch(...args);

  const response = await oldFetch(...args);
  const clone = response.clone();

  clone.json().then((json) => {
    let members = null;
    if (json.warDesc) members = json.warDesc.members;
    else if (json.userStatuses) members = json.userStatuses;
    else return;

    Object.keys(members).forEach((id) => {
      const status = members[id].status || members[id];
      id = members[id].userID || id;
      if (status.text === 'Hospital') hospTime[id] = status.updateAt;
      else delete hospTime[id];
    });

    collectStatusNodeAll();
  });

  return response;
};

const targetWindowSoc = isPDA() ? window : unsafeWindow;
const oldWebSocket = targetWindowSoc.WebSocket;
targetWindowSoc.WebSocket = function (...args) {
  const socket = new oldWebSocket(...args);
  socket.addEventListener('message', (event) => {
    const json = JSONparse(event.data);
    //dunno if the first one is necessary. it's the original but didn't work for me
    const statusUpdate = json?.result?.data?.data?.message?.namespaces?.users?.actions?.updateStatus
      || json?.push?.pub?.data?.message?.namespaces?.users?.actions?.updateStatus;
    
    if (!statusUpdate?.status) return;
    const id = statusUpdate.userId;
    const status = statusUpdate.status;

    if (status.text === 'Hospital') {
      hospTime[id] = status.updateAt;
      setTimeout(() => hospNodes.filter((h) => h && h[0] == id).forEach((h) => updateHospTimer(h[1], true)), 500);
    }
    else delete hospTime[id];
    collectStatusNodeAll();
  });
  return socket;
};

const addStyle = (style) => {
  if (isPDA()) {
    const elem = document.createElement('style');
    elem.innerText = style;
    document.head.appendChild(elem);
    return;
  }
  GM_addStyle(style);
};

addStyle(`

    .faction-names {
        position: relative;
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

    .faction-side-swap {
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 100px;
        cursor: pointer;
    }

`);