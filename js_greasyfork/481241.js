// ==UserScript==
// @name         LZPT Loot Log
// @namespace    https://torn.report/userscripts/
// @version      0.91
// @description  Sends Loot to Discord.
// @author       Skeletron [318855], Lazerpent [2112641]
// @match        https://www.torn.com/loader.php?sid=attackLog&ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      GNU GPLv3
// @grant        GM_xmlhttpRequest
// @connect      api.lzpt.io
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/481241/LZPT%20Loot%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/481241/LZPT%20Loot%20Log.meta.js
// ==/UserScript==

const debugMode = false;
const devPort = null;

const version = 0.91;

const NPCs = ["10", "17", "20", "21", "4", "19", "15"];

const container = document.querySelector("div#top-page-links-list");
const button = document.createElement("div");
button.classList.add("torn-btn");
button.style.cssText =
  "margin-left: 10px; line-height: 25px; height: 25px; width: 95px; user-select: none";
button.innerHTML = "Send to Discord";

let key = localStorage.getItem("lzptKey");

!key && addKey();

(function () {
  "use strict";

  const logAttackers = {};
  const dupeCheck = new Set();
  const logLooters = [];

  const attackers = document.querySelectorAll(
    "ul.participants-list.overview li"
  );

  attackers.forEach((attacker) => {
    const attackerName = attacker
      .querySelector(".name")
      ?.querySelector("a").innerHTML;
    const attackerID = attacker
      .querySelector(".name")
      ?.querySelector("a")
      .href.replace(/^.*XID=/, "");
    const attackerHits = parseInt(
      attacker.querySelector(".attack-numb-hits")?.innerHTML
    );
    const attackerDamage = parseInt(
      attacker.querySelector(".attack-damage")?.innerHTML
    );
    if (attackerName) {
      logAttackers[attackerID] = {
        name: attackerName,
        hits: attackerHits,
        damage: attackerDamage,
      };
    }
  });

  if (key && NPCs.some((npc) => Object.keys(logAttackers).includes(npc))) {
    container.prepend(button);
  }

  button.addEventListener("click", (e) => {
    if (button.classList.contains("disabled")) {
      e.preventDefault();
    } else {
      try {
        const hospitalizeIcons = document.querySelectorAll(
          ".attacking-events-hospitalize"
        );

        let defeatNames, defeatTime;

        hospitalizeIcons.forEach((icon) => {
          let defeatMessage = icon.nextElementSibling;
          if (
            NPCs.includes(getID(defeatMessage.querySelectorAll("a")[1].href))
          ) {
            defeatNames = defeatMessage.querySelectorAll("a");
            const timeElement = icon
              .closest(".message-wrap")
              ?.querySelector(".time");
            defeatTime = timeElement.textContent.trim();
          }
        });
        const npc = getID(defeatNames[1].href);

        const logTime = attackers[attackers.length - 1].innerHTML;
        const startTimeStr = logTime.slice(1, 9);
        let dateStr = logTime.slice(26, 34).trim();

        if (
          defeatTime.slice(0, 2) === "00" &&
          startTimeStr.slice(0, 2) === "23"
        ) {
          const [day, month, year] = dateStr
            .split("/")
            .map((str) => parseInt(str));
          const startDate = new Date(`20${year}`, month - 1, day);
          dateStr = `${(startDate.getDate() + 1)
            .toString()
            .padStart(2, "0")}/${(startDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${startDate.getFullYear().toString().slice(-2)}`;
        }

        const looters = document.querySelectorAll(".attacking-events-loot");

        looters.forEach((looter) => {
          const message = looter.nextElementSibling;
          const name = message.querySelector("a");
          const id = parseInt(getID(name.href));
          let item = extractLootedItem(message.textContent);
          if (name && !dupeCheck.has(id)) {
            logLooters.push({ id, item });
            dupeCheck.add(id);
          }
          if (!(id in logAttackers)) {
            logAttackers[id] = {
              name: name.innerHTML,
              hits: null,
              damage: null,
            };
          }
        });

        const fields = {
          attack: getID(window.location.href),
          id: parseInt(npc),
          participants: logAttackers,
          defeater: parseInt(getID(defeatNames[0].href)),
          looters: logLooters,
          time: convertTime(dateStr, defeatTime),
          version,
        };
        const dataStr = JSON.stringify(fields);

        debugMode && console.log(dataStr);

        button.innerHTML = "Sending...";
        button.classList.add("disabled");

        sendLog(dataStr);
      } catch (err) {
        console.error(err);
        alert("Error: Invalid input data!");
      }
    }
  });
})();

function nextNPC(npc) {
  const nextURL = `https://www.torn.com/loader.php?sid=attack&user2ID=${npc}`;
  navigator.clipboard
    .writeText(nextURL)
    .then(() => {
      window.location.href = nextURL;
    })
    .catch((err) => {
      console.error(err);
      window.location.href = nextURL;
    });
}

function handleResponse(res) {
  try {
    const data = JSON.parse(res.responseText);
    if (res.status === 200 || res.status === 409) {
      if (data.next) {
        nextNPC(data.next.toString());
      } else {
        alert("Loot Log Sent!");
      }
    } else if (res.status === 401) {
      addKey(true);
    } else if (data.error && data.message) {
      console.error(`${data.error}: ${data.message}`);
      alert(data.message);
    } else {
      throw new Error(`Unknown error: ${res.status}`);
    }
  } catch (error) {
    console.error(error);
    alert(`Error ${res.status}, ping Lazerpent :P`);
  }
  button.innerHTML = "Send to Discord";
  button.classList.remove("disabled");
}

function sendLog(data) {
  GM_xmlhttpRequest({
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    url: devPort
      ? `http://localhost:${devPort}/loot_log`
      : "https://api.lzpt.io/loot_log",
    data: data,
    onload: (res) => {
      handleResponse(res);
    },
    onerror: () => {
      alert("Error sending log!");
      button.innerHTML = "Send to Discord";
      button.classList.remove("disabled");
    },
  });
}

function convertTime(date, time) {
  var dateComponents = date.split("/");

  if (dateComponents.length === 3) {
    var day = dateComponents[0];
    var month = dateComponents[1];
    var year = dateComponents[2];

    if (year.length === 2) {
      var currentYear = new Date().getFullYear();
      var currentCentury = Math.floor(currentYear / 100) * 100;
      year = String(currentCentury + parseInt(year, 10));
    }

    var formattedDateArray = [year, month, day];
    var formattedDate = formattedDateArray.join("-");

    return `${formattedDate} ${time}`;
  } else {
    return "Invalid date format";
  }
}

function getID(link) {
  return link.replace(/^.*ID=/, "");
}

function extractLootedItem(str) {
  const regex = /looted (.*) from/;
  const match = str.match(regex);
  if (match) {
    const item = match[1];
    return item;
  }
}

function addKey(error = false) {
  let promptText = "Please enter the key provided by Lazerpent:";
  if (error) {
    promptText =
      "Invalid key. Please enter the key provided by Lazerpent, then try submitting again.";
  }
  var input = prompt(promptText);

  if (input) {
    localStorage.setItem("lzptKey", input);
    key = input;
    alert("Key saved successfully!");
  } else {
    alert("No key entered!");
  }
}
