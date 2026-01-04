// ==UserScript==
// @name         Reserve room table
// @namespace    http://tampermonkey.net/
// @version      2025-04-10
// @description  Reserva mesa en los cafes de santander
// @author       You
// @match        https://comunidadworkcafe.workcafe.es/es/room-booking/room-detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workcafe.es
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539962/Reserve%20room%20table.user.js
// @updateURL https://update.greasyfork.org/scripts/539962/Reserve%20room%20table.meta.js
// ==/UserScript==

(function() {
    'use strict';

const MY_HTML_CLASS = "xxxx-timeframes-table";

/**
 * @param {string} officeCode 68
 * @param {string} fromTime 2025-04-10T15:00:00
 * @param {string} toTime 2025-04-10T15:00:00
 * @param {string} auth ey...
 * @returns {Promise<Array<{
 *     "id": number,
 *     "idBranch": number,
 *     "name": string,
 *     "capacity": number,
 *     "projectorService": 1|0,
 *     "wifiService": 1|0,
 *     "videoService": 1|0,
 *     "removeDate": null
 * }>>}
 */
function getSingleTimeframe(officeCode, fromTime, toTime, auth) {
  return fetch(
    `https://comunidadworkcafe.workcafe.es/gw/api/v1/branches/${officeCode}/availability?startDate=${fromTime}&endDate=${toTime}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: "Bearer " + localStorage.getItem("authToken"),
        "x-clientid": "wkcafe",
      },
    }
  ).then((r) => r.json());
}

function generateTimeFrames() {
  const TIME_LIMITS = { START: { H: 8, M: 30 }, END: { H: 19, M: 0 } };
  const currentDate = new Date().toISOString().slice(0, 11);

  let currentTime = { ...TIME_LIMITS.START };
  /**
   * @type {[string, string][]}
   */
  const results = [];

  while (true) {
    const nextTime = { ...currentTime };
    if (currentTime.M === 30) {
      nextTime.H++;
      nextTime.M = 0;
    } else {
      nextTime.M = 30;
    }

    if (
      currentTime.H === TIME_LIMITS.END.H &&
      currentTime.M === TIME_LIMITS.END.M
    ) {
      break;
    }

    results.push([
      `${currentDate}${currentTime.H.toString().padStart(
        2,
        "0"
      )}:${currentTime.M.toString().padStart(2, "0")}:00`,
      `${currentDate}${nextTime.H.toString().padStart(
        2,
        "0"
      )}:${nextTime.M.toString().padStart(2, "0")}:00`,
    ]);

    currentTime = nextTime;
  }

  return results;
}

function getOfficeFromUrl() {
  const currentUrl = window.location.href;
  const parsedUrl =
    /https:\/\/comunidadworkcafe\.workcafe\.es\/(?:es\/)room-booking\/room-detail\/([0-9]+)$/.exec(
      currentUrl
    );

  if (parsedUrl === null) return null;
  if (typeof parsedUrl[1] !== "string") return null;
  return parsedUrl[1];
}

/**
 * @param {Array<{fromTime: string, toTime: string, availableRooms: string[]}>} data
 * @returns {string}
 */
function createTimeGridHTML(data) {
  function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const uniqueRooms = [];
  data.forEach((slot) => {
    slot.availableRooms.forEach((room) => {
      if (!uniqueRooms.includes(room)) {
        uniqueRooms.push(room);
      }
    });
  });

  uniqueRooms.sort();

  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Horario</th>
  `;

  uniqueRooms.forEach((room) => {
    tableHTML += `<th>Sala ${room}</th>`;
  });

  tableHTML += `
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach((slot, index) => {
    const fromTime = formatTime(slot.fromTime);
    const toTime = formatTime(slot.toTime);
    const timeRange = `${fromTime} - ${toTime}`;

    tableHTML += `
      <tr>
        <td class="time-cell">${timeRange}</td>
    `;

    uniqueRooms.forEach((room) => {
      const isAvailable = slot.availableRooms.includes(room);
      const cellClass = isAvailable ? "available" : "unavailable";
      tableHTML += `<td class="${cellClass}" data-timeframe="${JSON.stringify({
        index,
        room,
      }).replaceAll('"', "&quot;")}"></td>`;
    });

    tableHTML += `</tr>`;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  return tableHTML;
}

function appendCss() {
  const styles = `
  .${MY_HTML_CLASS} {
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
    }
    th {
      font-weight: bold;
    }
    .time-cell {
      text-align: left;
      width: 150px;
    }
    .available {
      background-color: #4CAF50;
      cursor: pointer;
    }
    .unavailable {
      background-color: #F44336;
    }
    h1 {
      color: #333;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }
  }
  `;

  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

async function main() {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    throw new Error("No authToken found");
  }

  const officeCode = getOfficeFromUrl();
  if (!officeCode) {
    throw new Error("No office code found in URL");
  }

  /**
   * @type {Array<{fromTime: string, toTime: string, availableRooms: string[]}>}
   */
  const results = [];
  for (const [fromTime, toTime] of generateTimeFrames()) {
    const result = await getSingleTimeframe(
      officeCode,
      fromTime,
      toTime,
      authToken
    );
    results.push({
      fromTime,
      toTime,
      availableRooms: result.map((e) => e.name),
    });
  }

  const htmlTable = createTimeGridHTML(results);
  const $container = document.createElement("div");
  $container.classList.add(MY_HTML_CLASS);
  $container.innerHTML = htmlTable;
  appendCss();
  document.querySelector(".room-detail__content-info").prepend($container);

  Array.from(document.querySelectorAll(`.${MY_HTML_CLASS} td`)).forEach(
    ($cell) => {
      $cell.addEventListener("click", () => {
        const { index: startIndex, room } = JSON.parse($cell.dataset.timeframe);
        const chosenStartTimeframe = results[startIndex];
        let lastTimeframe = chosenStartTimeframe;
        for (let index = startIndex; index < results.length; index++) {
          const nextTimeframe = results[index];
          if (!nextTimeframe.availableRooms.includes(room)) break;
          lastTimeframe = results[index];
        }

        const $day = document.getElementById("day");
        const $startHour = document.getElementById("startHour");
        const $endHour = document.getElementById("endHour");

        $day.value = new Date().toISOString().slice(0, 10);
        $startHour.value = chosenStartTimeframe.fromTime.slice(11, 16);
        $endHour.value = lastTimeframe.toTime.slice(11, 16);
      });
    }
  );
}

main();



})();