// ==UserScript==
// @name         CDC Booking Script v0
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Refresh the page
// @author       afjw
// @match        https://bookingportal.cdc.com.sg/*
// @include      https://bookingportal.cdc.com.sg/NewPortal/Booking/BookingPL.aspx
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/534486/CDC%20Booking%20Script%20v0.user.js
// @updateURL https://update.greasyfork.org/scripts/534486/CDC%20Booking%20Script%20v0.meta.js
// ==/UserScript==

const isTesting = false;
let stop = false;

const getPreferredTimeSlots = () => {
  return JSON.parse(localStorage.getItem("preferredTimeSlots") || "[]");
};

const isLoading = () => {
  const loadingSpinner = document.querySelector(
    "#ctl00_ContentPlaceHolder1_UpdateProgress1"
  );

  return loadingSpinner && loadingSpinner.style.display !== "none";
};

const toggleSelector = async () => {
  const s = document.querySelector("#ctl00_ContentPlaceHolder1_ddlCourse");
  s.value = s.children[1].value;
  s.dispatchEvent(new Event("change"));

  await sleep(1);
  while (isLoading()) {
    sendMessage("reloading");
    await sleep(1000);
    window.location.reload()
 }

  return Promise.resolve();
};

const isTimeSlotPreferred = ({ date = "", day = "", slot = "" }) => {
  if (!date) {
    return false;
  }
  const preferredTimeSlots = getPreferredTimeSlots();
  const matched = preferredTimeSlots.find(
    (timeSlot) => timeSlot.day === day && timeSlot.slot === slot
  );

  return !!matched;
};

const getAvailableSlots = () => {
  const table = document.querySelector("#ctl00_ContentPlaceHolder1_gvLatestav");

  if (!table) {
    return [];
  }

  const rows = table.querySelectorAll("tr");
  const timeSlotRow = rows[0];
  let allSlots = [];
  rows.forEach((row, index) => {
    if (index !== 0) {
      const slots = [];
      const cells = row.querySelectorAll("td");
      const timeSlotCells = timeSlotRow.querySelectorAll("th");
      cells.forEach((cell, index) => {
        const slotInput = cell.querySelector("input");
        if (slotInput) {
          const src = slotInput.src || "";
          if (src.includes("Images1")) {
            const date = cells[0].textContent;
            const day = cells[1].textContent;
            const slot = timeSlotCells[index].textContent.slice(1);
            slots.push({
              slotInput,
              date,
              day,
              slot,
            });
          }
        }
      });
      allSlots = allSlots.concat(slots);
    }
  });

  return allSlots;
};

const reserve = (availableSlots) => {
  const timeAvailableSlot = availableSlots.find((slot) =>
    isTimeSlotPreferred(slot)
  );

  if (timeAvailableSlot) {
    const slotInput = timeAvailableSlot.slotInput;
    if (slotInput) {
      slotInput.click();
      return timeAvailableSlot;
    }
  }

  return false;
};

const run = async () => {
  try {
    await toggleSelector();
    console.log(`Refreshed at`, new Date().toLocaleTimeString());
    const availableSlots = getAvailableSlots();
    const hasResult = !!availableSlots.length;
    if (hasResult) {
      const reservedSlot = reserve(availableSlots);
      let msg;
      if (reservedSlot) {
        msg = `Slot is reserved\n${reservedSlot.date} ${reservedSlot.day} ${reservedSlot.slot}`;
      } else {
        const slotsMsg = `${availableSlots
          .map(({ date, day, slot }) => `${date} ${day} ${slot}`)
          .join("\n")}`;
        msg = `Slots are available\n${slotsMsg}`;
      }

      sendMessage(`[${new Date().toLocaleString("en-ca")}] ${msg}`);
    }
    return Promise.resolve(hasResult);
  } catch (e) {
    return Promise.reject(`error: ${e}`);
  }
};

const sleep = (interval) => {
  return new Promise((resolve) => {
    const jitter = Math.random() * 3 * 1000; // ±10s
    window.setTimeout(resolve, interval + jitter);
  });
};

// https://simpleguics2pygame.readthedocs.io/en/latest/_static/links/snd_links.html

const audio = new Audio(
  "http://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3"
);

const sendMessage = (msg) => {
  console.log(msg);
  audio.play();
};

let startButton;
let settingButton;
let settingPopup;

const start = async () => {
  const hasResult = await run();

  if (hasResult) {
    await sleep(1);
  } else {
    await sleep(30 * 1000);
  }
  if (!stop) {
    start();
  } else {
    console.log('stopped');
  }
};

const insertStartButton = () => {
  startButton = document.createElement("button");

  startButton.className = "start-button";

  startButton.textContent = "running...";

  const startButtonStyle = document.createElement("style");

  startButtonStyle.innerHTML = `
    .start-button {
      position: fixed;
      bottom: 1670px;
      right: 150px;
      width: 100px;
      padding: 5px;
      line-height: 1;
      background-color: #ff9933;
      border: none;
      border-radius: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  `;

  document.head.appendChild(startButtonStyle);
  document.body.appendChild(startButton);

  startButton.addEventListener("click", async () => {
    try {
      stop = true;
      startButton.textContent = "stopped";
    } catch (e) {
      startButton.textContent = "error";

      console.log("error", e);
    }
  });
};

const insertSettingButton = () => {
  settingButton = document.createElement("button");
  settingButton.className = "setting-button";
  settingButton.textContent = "setting";
  const settingButtonStyle = document.createElement("style");

  settingButtonStyle.innerHTML = `
    .setting-button {
      position: fixed;
      bottom: 1030px;
      right: 150px;
      width: 100px;
      padding: 5px;
      line-height: 1;
      background-color: #ff9933;
      border: none;
      border-radius: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  `;

  document.head.appendChild(settingButtonStyle);
  document.body.appendChild(settingButton);

  settingButton.addEventListener("click", async () => {
    toggleSettingPopup();
  });
};

const toggleSettingPopup = () => {
  if (window.getComputedStyle(settingPopup).display === "none") {
    settingPopup.style.display = "initial";
  } else {
    settingPopup.style.display = "none";
  }
};

const insertSettingPopup = () => {
  settingPopup = document.createElement("div");
  settingPopup.className = "setting-popup";
  const settingPopupStyle = document.createElement("style");

  settingPopupStyle.innerHTML = `

    .setting-popup {
      display: none;
      position: fixed;
      bottom: 865px;
      right: 50px;
      width: 900px;
      padding: 10px;
      background-color: #ff9933;
      border: none;
      border-radius: 10px;
      font-size: 22px;
    }

    .setting-popup label {
      margin-bottom: 10px;
      display: block;
    }

    .setting-popup table {
      width: 100%;
      table-layout: auto;
      border-collapse: collapse;
    }

    .setting-popup table th,
    .setting-popup table td {
      text-align: center;
      border: 1px solid black;
    }

    .setting-popup table th {
      padding: 5px;
    }

    .setting-popup table td {
      height: 35px;

    }

    .setting-popup table img {
      width: 30px;
    }

    .setting-popup table .selectable {
      cursor: pointer;
    }

    .setting-buttons {
      display: flex;
      flex-wrap: wrap;
    }

    .setting-buttons .toggle-button {
      border: none;
      padding: 5px;
      border-radius: 5px;
      margin-right: 5px;
      margin-bottom: 5px;
      cursor: pointer;
    }

    .setting-buttons .toggle-button.active {
      background-color: red;
    }

  `;

  document.head.appendChild(settingPopupStyle);
  document.body.appendChild(settingPopup);
  renderSettingTable();
};

const toggleTimeSlot = (day, slot) => {
  const savedPreferredTimeSlots = getPreferredTimeSlots();

  const matched = savedPreferredTimeSlots.find(
    (timeSlot) => timeSlot.day === day && timeSlot.slot === slot
  );

  if (matched) {
    savedPreferredTimeSlots.splice(savedPreferredTimeSlots.indexOf(matched), 1);
  } else {
    savedPreferredTimeSlots.push({
      day,
      slot,
    });
  }

  localStorage.setItem(
    "preferredTimeSlots",
    JSON.stringify(savedPreferredTimeSlots)
  );

  renderSettingTable();
};

const renderSettingTable = () => {
  const slots = [
    "08:30 - 10:10",
    "10:20 - 12:00",
    "12:45 - 14:25",
    "14:35 - 16:15",
    "16:25 - 18:05",
    "18:50 - 20:30",
    "20:40 - 22:20",
  ];

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  window.toggleTimeSlot = toggleTimeSlot;

  const savedPreferredTimeSlots = getPreferredTimeSlots();

  const table = `

    <label>Preferred Time Slots</label>
    <table>
      <thead>
        <tr>
          <th>Day</th>
          ${slots.map((slot) => `<th>${slot}</th>`).join("\n")}
        </tr>
      </thead>

      ${days
        .map((day) => {
          return `
          <tr>
            <td>${day}</td>
            ${slots
              .map((slot) => {
                const isSelected = !!savedPreferredTimeSlots.find(
                  (timeSlot) => timeSlot.day === day && timeSlot.slot === slot
                );

                return `
                <td class="selectable" onclick="toggleTimeSlot('${day}', '${slot}', '${isSelected}')">

                  ${
                    isSelected
                      ? '<img src="data:image/gif;base64,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" />'
                      : ""
                  }

                </td>

              `;
              })
              .join("\n")}

          </tr>`;
        })
        .join("\n")}
    </table>
  `;

  settingPopup.innerHTML = table;
};

const main = async () => {
  insertStartButton();
  insertSettingButton();
  insertSettingPopup();
  start();
};


function isTargetPage() {
  return location.href === 'https://bookingportal.cdc.com.sg/NewPortal/Booking/BookingPL.aspx';
}

if (isTargetPage()) {
  (function () {
    "use strict";
    main();
    (function () {
      setInterval(() => {
        sendMessage("reloading");
        sleep(1000);
        window.location.reload();
    }, 27 * 60 * 1000); 
    })();
  })();
}
