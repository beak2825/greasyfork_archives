// ==UserScript==
// @name         lmsys-enhancer
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Optimize your experience on the chat.lmsys.org with the `lmsys-enhancer` Tampermonkey script.
// @author       joshlee
// @match        https://chat.lmsys.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lmsys.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480237/lmsys-enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/480237/lmsys-enhancer.meta.js
// ==/UserScript==

const scriptConfig = {
  model: "gpt-4-turbo",
  loadLatestSession: true,
  firstMeetSessionHash: true,
  firstSend: true,
  currentSessionHash: "",
  dataKey: "session_hash_history",
  mainColor: "#DE6B2F",
  drawerWidth: 250,
  position: {
    main: "#component-1",
    changeModel: "#model_selector_row label",
    directChat: ".tab-nav.scroll-hide button:nth-child(3)",
    maxOutputTokenInput: "//span[text()='Max output tokens']/../../input",
    maxOutputTokenBar: "//span[text()='Max output tokens']/../../../../input",
    sendBtn: '//button[text()="Send"]',
    unnecessaryList: ["#component-93", "#component-83"],
  },
};

const originalSend = WebSocket.prototype.send;

var itemList;

function $x(xpathToExecute) {
  var result = [];
  var nodesSnapshot = document.evaluate(
    xpathToExecute,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
    result.push(nodesSnapshot.snapshotItem(i));
  }
  return result;
}

function removeUselessElements() {
  // Remove unnecessary notices and components
  document
    .querySelectorAll("#notice_markdown")
    .forEach((elem) => elem.remove());
  scriptConfig.position.unnecessaryList.forEach((v) => {
    const componentToRemove = document.querySelector(v);
    if (componentToRemove) componentToRemove.remove();
  });
}

function setMaxOutputToken(maxValue = 4096) {
  // Set the maximum token output to the desired value
  const [, , input] = $x(scriptConfig.position.maxOutputTokenInput);
  const [, , bar] = $x(scriptConfig.position.maxOutputTokenBar);

  if (!input || !bar) {
    console.error("Set max output token failure!");
    return;
  }

  input.value = String(maxValue);
  bar.max = String(maxValue);
  bar.value = String(maxValue);

  const changeEvent = new Event("change", { bubbles: true, cancelable: true });
  bar.dispatchEvent(changeEvent);
}

function changeModel(model) {
  document.querySelector(scriptConfig.position.changeModel).click();
  document.querySelector(`li[data-value=${model}]`).dispatchEvent(
    new MouseEvent("mousedown", {
      view: window,
      bubbles: true,
      cancelable: true,
    })
  );
}

function hackWsSend(data) {
  let d = JSON.parse(data);
  // get session_hash
  if (d.session_hash) {
    // first create session
    if (scriptConfig.firstMeetSessionHash) {
      scriptConfig.currentSessionHash = d.session_hash;
      scriptConfig.firstMeetSessionHash = false;
    }
    if (
      scriptConfig.loadLatestSession &&
      d.fn_index === 38 &&
      getLastestSessionToggleBtn()
    ) {
      // skip creat new session
      d.fn_index = 41;
      d.data = [null, scriptConfig.model, ""];
      originalSend.call(this, data);
      toggleLastestSession();
      return;
    }
    // first send message
    if (scriptConfig.firstSend && d.fn_index === 39) {
      saveCurrentSession();
      scriptConfig.firstSend = false;
    }

    // modify session_hash
    if (scriptConfig.currentSessionHash) {
      d.session_hash = scriptConfig.currentSessionHash;
      data = JSON.stringify(d);
    }
  }
  originalSend.call(this, data);
}

function createSessionItem(text, sessionHash) {
  var itemContainer = document.createElement("div");
  itemContainer.style.display = "flex";
  itemContainer.style.justifyContent = "space-between";
  itemContainer.style.alignItems = "center";
  itemContainer.style.padding = "10px";
  itemContainer.style.borderBottom = "1px solid #ccc";
  itemContainer.className = "session-item-container";
  itemContainer.setAttribute("data-session-hash", sessionHash);

  var itemText = document.createElement("div");
  itemText.textContent = text;
  itemContainer.appendChild(itemText);

  // Create toggle session button
  var toggleButton = document.createElement("button");
  toggleButton.textContent = "⇢";
  toggleButton.style.marginLeft = "5px";
  toggleButton.style.padding = "5px 10px";
  toggleButton.style.border = "none";
  toggleButton.style.borderRadius = "4px";
  toggleButton.style.backgroundColor = "#4CAF50";
  toggleButton.style.color = "white";
  toggleButton.style.cursor = "pointer";
  // Button hover effect
  toggleButton.addEventListener("mouseover", function () {
    this.style.backgroundColor = "#45a049";
  });
  toggleButton.addEventListener("mouseout", function () {
    this.style.backgroundColor = "#4CAF50";
  });
  toggleButton.addEventListener("click", function () {
    scriptConfig.currentSessionHash = sessionHash;
    clickSendBtn();
  });
  itemContainer.appendChild(toggleButton);

  // Create Delete button
  var deleteButton = document.createElement("button");
  deleteButton.textContent = "✖";
  deleteButton.style.marginLeft = "5px";
  deleteButton.style.padding = "5px 10px";
  deleteButton.style.border = "none";
  deleteButton.style.borderRadius = "4px";
  deleteButton.style.backgroundColor = "#f44336";
  deleteButton.style.color = "white";
  deleteButton.style.cursor = "pointer";
  // Button hover effect
  deleteButton.addEventListener("mouseover", function () {
    this.style.backgroundColor = "#e53935";
  });
  deleteButton.addEventListener("mouseout", function () {
    this.style.backgroundColor = "#f44336";
  });
  deleteButton.addEventListener("click", function () {
    removeSessionHash(sessionHash);
    itemContainer.remove();
  });

  itemContainer.appendChild(deleteButton);

  itemContainer.highlight = function () {
    itemContainer.classList.add("highlighted-session");
    toggleButton.classList.add("disabled-button");
    deleteButton.classList.add("disabled-button");
  };

  itemContainer.unhighlight = function () {
    itemContainer.classList.remove("highlighted-session");
    toggleButton.classList.remove("disabled-button");
    deleteButton.classList.remove("disabled-button");
  };

  if (sessionHash === scriptConfig.currentSessionHash) {
    itemContainer.highlight();
  }

  itemList.appendChild(itemContainer);
  updateHighlightedSessions();
}

function createHistorySessionElement() {
  // Create Float Button
  var floatButton = document.createElement("button");
  floatButton.textContent = "☰";
  floatButton.style.position = "fixed";
  floatButton.style.left = "20px";
  floatButton.style.top = "50%";
  floatButton.style.transform = "translateY(-50%)";
  floatButton.style.zIndex = "9999";
  floatButton.style.padding = "15px";
  floatButton.style.borderRadius = "100%";
  floatButton.style.backgroundColor = "#212936";
  floatButton.style.color = "white";
  floatButton.style.border = "none";
  floatButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
  floatButton.style.transition = "left 0.3s ease";
  floatButton.style.cursor = "pointer";
  floatButton.addEventListener("click", function () {
    if (drawer.style.left === `-${scriptConfig.drawerWidth}px`) {
      drawer.style.left = "0";
      floatButton.style.left = `${scriptConfig.drawerWidth}px`;
    } else {
      drawer.style.left = `-${scriptConfig.drawerWidth}px`;
      floatButton.style.left = "20px";
    }
  });
  document.body.appendChild(floatButton);

  // Create drawer container
  var drawer = document.createElement("div");
  drawer.style.position = "fixed";
  drawer.style.left = "-250px";
  drawer.style.top = "0";
  drawer.style.width = `${scriptConfig.drawerWidth}px`;
  drawer.style.height = "100%";
  drawer.style.backgroundColor = "#212936";
  drawer.style.transition = "0.3s";
  drawer.style.zIndex = "9998";
  drawer.style.padding = "15px";
  drawer.style.boxSizing = "border-box";
  drawer.style.color = "white";
  drawer.style.overflowY = "auto";
  document.body.appendChild(drawer);

  // Create Deawer Title
  var drawerTitle = document.createElement("h2");
  drawerTitle.textContent = "History Session";
  drawerTitle.style.padding = "10px";
  drawerTitle.style.marginTop = "0";
  drawerTitle.style.color = "white";
  drawerTitle.style.backgroundColor = "#2c3e50";
  drawerTitle.style.borderBottom = "1px solid #ccc";
  drawer.appendChild(drawerTitle);

  // Create session item container
  itemList = document.createElement("div");
  drawer.appendChild(itemList);

  // Click outside the drawer to turn off the drawer's function
  document.addEventListener("click", function (event) {
    // Check if the click is happening outside of the drawer or floating button
    if (!drawer.contains(event.target) && !floatButton.contains(event.target)) {
      updateHighlightedSessions();
      // Opened
      if (drawer.style.left === "0px") {
        drawer.style.left = `-${scriptConfig.drawerWidth}px`; // hidden
        floatButton.style.left = "20px"; // restore
      }
    }
  });

  // Create New Chat Button
  const newChatButton = document.createElement("button");
  newChatButton.textContent = "New Chat";
  newChatButton.style.position = "absolute";
  newChatButton.style.bottom = "20px";
  newChatButton.style.left = "50%";
  newChatButton.style.transform = "translateX(-50%)";
  newChatButton.style.padding = "10px 30px";
  newChatButton.style.border = "none";
  newChatButton.style.borderRadius = "5px";
  newChatButton.style.backgroundColor = scriptConfig.mainColor;
  newChatButton.style.color = "white";
  newChatButton.style.cursor = "pointer";
  newChatButton.addEventListener("click", function () {
    handleNewChatClick();
  });
  drawer.appendChild(newChatButton);
  loadSessionHashHistory();
}

function handleNewChatClick() {
  scriptConfig.currentSessionHash = Math.random().toString(36).substring(2);
  scriptConfig.firstMeetSessionHash = true;
  scriptConfig.firstSend = true;
  scriptConfig.loadLatestSession = false;
  clickSendBtn();
}

// Update the highlighted state of the session list
function updateHighlightedSessions() {
  const sessionItems = itemList.getElementsByClassName(
    "session-item-container"
  );
  for (const item of sessionItems) {
    item.unhighlight(); // remove all highlight state
  }

  const newItem = itemList.querySelector(
    `[data-session-hash="${scriptConfig.currentSessionHash}"]`
  );
  if (newItem) {
    newItem.highlight();
    return;
  }
}

function getLastestSessionToggleBtn() {
  const gotoBtn = document.querySelectorAll(
    ".session-item-container button"
  )[0];
  return gotoBtn;
}

function toggleLastestSession() {
  scriptConfig.firstSend = false;
  scriptConfig.firstMeetSessionHash = false;
  getLastestSessionToggleBtn().click();
}

function loadSessionHashHistory() {
  itemList.innerHTML = "";
  const list = JSON.parse(localStorage.getItem(scriptConfig.dataKey)) || [];
  for (let i = list.length - 1; i >= 0; i--) {
    let e = list[i];
    createSessionItem(e.time, e.session_hash);
  }
  updateHighlightedSessions();
}

function getCurrentFormattedTime() {
  const now = new Date();
  const year = now.getFullYear().toString(); // year
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // month
  const date = now.getDate().toString().padStart(2, "0"); // day
  const hours = now.getHours().toString().padStart(2, "0"); // hout
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${date} ${hours}:${minutes}`;
}

function removeSessionHash(targetSessionHash) {
  const list = JSON.parse(localStorage.getItem(scriptConfig.dataKey));
  let filteredList = list.filter(
    (item) => item.session_hash !== targetSessionHash
  );
  localStorage.setItem(scriptConfig.dataKey, JSON.stringify(filteredList));
}

function clickSendBtn() {
  $x(scriptConfig.position.sendBtn)[2].click();
}

function saveCurrentSession() {
  const value = localStorage.getItem(scriptConfig.dataKey);
  let list = [];
  if (value) {
    list = JSON.parse(value);
  }
  list.push({
    time: getCurrentFormattedTime(),
    session_hash: scriptConfig.currentSessionHash,
  });
  localStorage.setItem(scriptConfig.dataKey, JSON.stringify(list));
  loadSessionHashHistory();
}

function initialize() {
  window.alert = null;
  WebSocket.prototype.send = hackWsSend;
  document.querySelector(scriptConfig.position.directChat).click();

  removeUselessElements();
  setMaxOutputToken();
  changeModel(scriptConfig.model);
}

(function main() {
  // Add a style to highlight the current session
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = `
  .highlighted-session {
    background-color: #e0e0e0;
    color: #333;
    border-left: 3px solid #ffeb3b;
  }
  .disabled-button {
    pointer-events: none;
    opacity: 0.6; 
  }
  `;
  document.head.appendChild(style);
  createHistorySessionElement();
  // Create a MutationObserver instance and pass the callback function
  const observer = new MutationObserver((mutations, observer) => {
    // Find the target element using its ID (you may adjust the selector according to your needs)
    const targetElement = document.querySelector(scriptConfig.position.main);
    if (targetElement) {
      // If the target element exists, execute the optimize function and stop observing
      initialize();
      observer.disconnect(); // Stop observing
    }
  });

  // Configuration for the observer:
  const observerConfig = { childList: true, subtree: true };

  // Select the node that will be observed for mutations
  const targetNode = document.body; // You may specify a more specific parent node to reduce the scope of observation

  // Call the observer's observe method to start observing the target node
  observer.observe(targetNode, observerConfig);
})();
