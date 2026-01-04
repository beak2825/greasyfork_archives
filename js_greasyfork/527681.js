// ==UserScript==
// @name         xdigma.com Galaxy systems parser
// @namespace    http://tampermonkey.net/
// @version      2025-03-18(2)
// @description  Galaxy systems parser
// @author       Valter0ff
// @match        https://xdigma.com/game.php*
// @match        https://xdigma.net/game.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/527681/xdigmacom%20Galaxy%20systems%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/527681/xdigmacom%20Galaxy%20systems%20parser.meta.js
// ==/UserScript==

(function () {
  'use strict';

function sendGalaxyRequests({
  timeout,
  galaxy,
  direction,
  count,
  start,
  pirateRate,
  lomAmount,
  targetNickname = null
}) {
  let system = start;
  const baseUrl = window.location.origin; 
  const url = `${baseUrl}/game.php?page=galaxy&ajax=2`;
  let foundSystems = [];
  let debrisData = {};
  let pirateData = {};
  let requestsCompleted = 0;
  let foundPlayer = [];

  function sendRequest() {
    if (requestsCompleted >= count) {
      console.log("Найдены кометы:", foundSystems);
      console.log("Найден лом:", debrisData);
      console.log("Найдены пираты:", pirateData);
      return;
    }

    const data = {
      galaxy: galaxy,
      system: system.toString(),
    };

    if (direction === "right") {
      data.systemRight = "dr";
      system += 1;
    } else if (direction === "left") {
      data.systemLeft = "dr";
      system -= 1;
    } else {
      console.error("Invalid direction: must be 'right' or 'left'");
      return;
    }

    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function (response) {
        let system_number = data.systemRight
          ? Number(data.system) + 1
          : Number(data.system) - 1;
        console.log(`System: ${galaxy}:${system_number}`);

        if ($(response).find('[data-tooltip-content*="Комета"]').length > 0) {
          foundSystems.push(system_number);
          console.log(
            `%c Найдена комета системе: ${galaxy}:${system_number}`,
            "color: red; font-weight: bold;"
          );
          console.log(
            `https://xdigma.com/game.php?page=galaxy&galaxy=${galaxy}&system=${system_number}`
          );
        }

        $(response)
          .find("img[data-tooltip-content*='Обломки на орбите:']")
          .each(function () {
            const tooltipContent = $(this).attr("data-tooltip-content");
            const metalMatch = tooltipContent.match(/Мет:\s*([\d\.]+)/);
            const crystalMatch = tooltipContent.match(/Крис:\s*([\d\.]+)/);

            if (metalMatch) {
              const metalAmount = parseFloat(metalMatch[1].replace(/\./g, ""));
              if (metalAmount > lomAmount) {
                if (!debrisData[system_number]) {
                  debrisData[system_number] = [];
                }
                debrisData[system_number].push(
                  `Металл: ${metalMatch[1]}, Кристалл: ${
                    crystalMatch ? crystalMatch[1] : "0"
                  }`
                );
              }
            }
          });
        if (debrisData[system_number]) {
          console.log(
            `%c Найден лом в системе: ${galaxy}:${system_number}`,
            "color: blue;",
            debrisData[system_number]
          );
          console.log(
            `https://xdigma.com/game.php?page=galaxy&galaxy=${galaxy}&system=${system_number}`
          );
        }

        $(response)
          .find("img[src$='bazapirov.png']")
          .each(function () {
            const tooltipContent = $(this).attr("data-tooltip-content");
            const fleetScoreMatch = tooltipContent.match(
              /Очков флота:\s*<span.*?>(\d+)<\/span>/
            );
            const pirateNameMatch = tooltipContent.match(/пират\s+([^<]+)/i);

            if (fleetScoreMatch && pirateNameMatch) {
              const fleetScore = parseInt(fleetScoreMatch[1], 10);
              const pirateName = pirateNameMatch[1].trim();
              if (fleetScore > pirateRate) {
                if (!pirateData[system_number]) {
                  pirateData[system_number] = [];
                }
                pirateData[system_number].push(`${pirateName}: ${fleetScore}`);
              }
            }
          });
        if (pirateData[system_number]) {
          console.log(
            `Найдены пираты в системе: ${galaxy}:${system_number}. `,
            pirateData[system_number]
          );
        }

        if (targetNickname) {
            $(response)
                .find('[class^="planet"]').each(function() {
                if ($(this).text().includes(targetNickname)) {
                    let planetNumber = $(this).attr("class").match(/\d+/)?.[0]
                    console.log(`Found ${targetNickname} planet: ${galaxy}:${system_number}:${planetNumber}`);
                    foundPlayer.push(`${galaxy}:${system_number}:${planetNumber}`)
                }
            });
        }

        requestsCompleted += 1;

        if (requestsCompleted >= count) {
          console.log("Найдены кометы:", foundSystems);
          console.log("Найден лом:", debrisData);
          console.log("Найдены пираты:", pirateData);
          console.log(`Найдены планеты игрока: ${targetNickname}`, foundPlayer);
        } else {
          // Randomize timeout for next request
          const randomizedTimeout = timeout + (Math.random() * 10 - 5);
          setTimeout(sendRequest, randomizedTimeout);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error submitting request:", error);
        requestsCompleted += 1;
        if (requestsCompleted >= count) {
          console.log("Найдены кометы:", foundSystems);
          console.log("Найден лом:", debrisData);
          console.log("Найдены пираты:", pirateData);
          console.log(`Найдены планеты игрока: ${targetNickname}`, foundPlayer);
        }
      },
    });
  }

  sendRequest();
}
  // Expose function to global scope
  window.sendGalaxyRequests = sendGalaxyRequests;

})();