// ==UserScript==
// @name         MouseHunt - Event Reward Tracker
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      2.0
// @description  Tool that tracks bespoke event rewards (e.g. GWH & Birthday) for analysis
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/394034/MouseHunt%20-%20Event%20Reward%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/394034/MouseHunt%20-%20Event%20Reward%20Tracker.meta.js
// ==/UserScript==

(function() {
  // Generate toast popup UI
  const toast = document.createElement("fieldset");
  toast.style.visibility = "hidden";
  toast.style.position = "fixed";
  toast.style.left = "40px";
  toast.style.top = "40px";
  toast.style.width = "250px";
  toast.style.height = "auto";
  toast.style.textAlign = "center";
  toast.style.fontSize = "16px";
  toast.style.border = "2px dotted black";

  const toastLegend = document.createElement("legend");
  toastLegend.style.fontSize = "10px";
  toastLegend.innerText = "MH Event Reward Tracker v2.0";

  const toastText = document.createElement("span");
  toast.appendChild(toastText);
  toast.appendChild(toastLegend);
  document.body.appendChild(toast);

  /**
   * Shows custom toast message
   * @param {string} message Message to be displayed inside <span>
   * @param {string} color Background color of the toast <fieldset> element
   */
  function generateToast(message, color) {
    toastText.innerText = message;
    toast.style.backgroundColor = color;
    toast.style.visibility = "visible";
    setTimeout(() => {
      toast.style.visibility = "hidden";
    }, 3000);
  }

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener("load", function() {
      if (
        this.responseURL.indexOf(
          "mousehuntgame.com/managers/ajax/events/birthday_factory.php"
        ) >= 0 &&
        Date.now() < 1585699200000 // (GMT): Wednesday, April 1, 2020 12:00:00 AM [Birthday 2020 definitive end]
      ) {
        try {
          const data = JSON.parse(this.responseText);
          if (data) bday2020Parse(data);
        } catch (error) {
          console.log("Failed to parse server response for Birthday 2020");
          console.error(error.stack);
        }
      }
    });

    this.addEventListener("load", function() {
      if (
        this.responseURL.indexOf(
          "mousehuntgame.com/managers/ajax/events/winter_hunt.php"
        ) >= 0 &&
        Date.now() < 1579219200000 // (GMT): Friday, January 17, 2020 12:00:00 AM [GWH 2019 definitive end]
      ) {
        try {
          const data = JSON.parse(this.responseText);
          if (data) gwh2019Parse(data);
        } catch (error) {
          console.log("Failed to parse server response for GWH 2019");
          console.error(error.stack);
        }
      }
    });

    originalOpen.apply(this, arguments);
  };

  /**
   * Parses Birthday 2020 server response and fires POST to Aard's endpoint
   * @param {object} data JSON-parsed server response
   */
  function bday2020Parse(data) {
    const msgs = data.messageData.message_model.messages;
    if (msgs && msgs.length > 0) {
      for (let msg of msgs) {
        const content = msg.messageData.content;
        if (content) {
          const title = content.title;
          if (title.indexOf("claimed my cheese crate") >= 0) {
            // Initialize data object
            const userID = data.user.user_id;
            const obj = {};
            obj[userID] = [];

            // Initialize DOM parsing of HTML string
            const body = content.body;
            const dom = new DOMParser();
            const doc = dom.parseFromString(body, "text/html");

            doc
              .querySelectorAll(".birthday2020ClaimReward-item-details")
              .forEach(el => {
                const item = el.textContent;
                if (
                  item.indexOf("to unlock") >= 0 ||
                  item.indexOf("brie+") >= 0
                ) {
                  // Skip locked boxes as well as [Emp] SB+
                } else {
                  obj[userID].push(item);
                }
              });

            if (obj[userID].length > 0) {
              // Send payload to Google Forms
              const xhr = new XMLHttpRequest();
              xhr.open(
                "POST",
                "https://script.google.com/macros/s/AKfycbwdxCoJwShmV5CcUBWpq_8Y6joww29cdIZrH2XO/exec"
              );
              xhr.setRequestHeader(
                "content-type",
                "application/x-www-form-urlencoded"
              );
              xhr.onload = function() {
                const response = xhr.responseText;
                if (
                  response.indexOf("success") >= 0 &&
                  response.indexOf("Thanks") >= 0
                ) {
                  generateToast(
                    `${Date(
                      Date.now()
                    ).toLocaleString()}\n\nBirthday 2020 crate data submitted successfully!`,
                    "#caf4ae"
                  );
                }
              };
              xhr.onerror = function() {
                console.error(xhr.statusText);
                generateToast(
                  `${Date(
                    Date.now()
                  ).toLocaleString()}\n\nBirthday 2020 crate data submission failed`,
                  "#ffc0cb"
                );
              };
              xhr.send(`crateCheese=${JSON.stringify(obj)}`);
            }
          }
        }
      }
    }
  }

  /**
   * Parses GWH 2019 server response and fires POST to Aard's endpoint
   * @param {object} data JSON-parsed server response
   */
  function gwh2019Parse(data) {
    const msgs = data.messageData.message_model.messages;
    if (msgs && msgs.length > 0) {
      for (let msg of msgs) {
        const content = msg.messageData.content;
        if (content) {
          const title = content.title;
          if (title.indexOf("Snow Golem reward") >= 0) {
            // Parse location name
            let locationName = "N/A";
            if (title.indexOf(" from the ") >= 0) {
              locationName = title.split("from the ")[1].split("!")[0];
            } else {
              locationName = title.split("from ")[1].split("!")[0];
            }

            // Miscellaneous tidbits
            // const level = title
            //   .split("claimed a Level ")[1]
            //   .split(" Snow Golem")[0];
            // parseInt(level);
            // const journalID =
            //   msg.messageData.stream_publish_data.params.journal_id;
            // msg.messageDate;

            // Initialize data object
            const userID = msg.messageData.stream_publish_data.params.user_id;
            const obj = {};
            obj[userID] = {};
            obj[userID][locationName] = {};

            // Initialize DOM parsing of HTML string
            const body = content.body;
            const dom = new DOMParser();
            const doc = dom.parseFromString(body, "text/html");
            const itemDiv = doc.querySelector(
              ".winterHunt2019-claimRewardPopup-content"
            );
            itemDiv
              .querySelectorAll(".winterHunt2019-claimRewardPopup-item")
              .forEach(el => {
                const rarityEl = el.querySelector(
                  ".winterHunt2019-claimRewardPopup-item-rarity"
                );
                const qtyEl = el.querySelector(".quantity");
                const itemEl = el.querySelector(
                  ".winterHunt2019-claimRewardPopup-item-name"
                );
                if (rarityEl && qtyEl && itemEl) {
                  let rarity = rarityEl.textContent;
                  rarity = rarity == "Magical Hat" ? "Hat" : rarity;
                  rarity = rarity.charAt(0).toUpperCase() + rarity.slice(1);
                  const quantity = parseInt(
                    qtyEl.textContent.replace(/,/g, "") // Trim commas (e.g. for gold qty)
                  );
                  let item = itemEl.textContent;

                  // Item name edge cases
                  if (item.indexOf("SUPER|brie") >= 0) item = "SUPER|brie+";

                  // Fixed qty rolls -> Avg/Raw = % Chance
                  // e.g. total qty of 20 in 40 rolls -> 20/40 = 0.5 avg -> 0.5 / 5 per roll = 10% chance
                  if (obj[userID][locationName][rarity] === undefined) {
                    obj[userID][locationName][rarity] = {};
                    obj[userID][locationName][rarity].count = 1;
                    obj[userID][locationName][rarity][item] = quantity;
                  } else {
                    if (obj[userID][locationName][rarity][item] === undefined) {
                      obj[userID][locationName][rarity][item] = quantity;
                    } else {
                      obj[userID][locationName][rarity][item] += quantity;
                    }
                    obj[userID][locationName][rarity].count += 1;
                  }
                }
              });

            if (Object.keys(obj).length > 0) {
              // Send payload to Google Forms
              const xhr = new XMLHttpRequest();
              xhr.open(
                "POST",
                // "https://cors-anywhere.herokuapp.com/",
                "https://script.google.com/macros/s/AKfycbz1JH5rngtwVGoMx_5550TALj4WFdoTxqYbCQjFS-pIGToIA6Q/exec"
              );
              xhr.setRequestHeader(
                "content-type",
                "application/x-www-form-urlencoded"
              );
              xhr.onload = function() {
                const response = xhr.responseText;
                if (
                  response.indexOf("success") >= 0 &&
                  response.indexOf("Thanks") >= 0
                ) {
                  generateToast(
                    `${Date(
                      Date.now()
                    ).toLocaleString()}\n\n[${locationName}]\n\nGolem data submitted successfully!`,
                    "#caf4ae"
                  );
                }
              };
              xhr.onerror = function() {
                console.error(xhr.statusText);
                generateToast(
                  `${Date(
                    Date.now()
                  ).toLocaleString()}\n\nGolem data submission failed`,
                  "#ffc0cb"
                );
              };
              xhr.send(`golemString=${JSON.stringify(obj)}`);
            }
          }
        }
      }
    }
  }
})();
