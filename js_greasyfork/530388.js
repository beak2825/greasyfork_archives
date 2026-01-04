// ==UserScript==
// @name        Collect OC 2.0 success rates
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/factions.php*
// @grant       none
// @version     0.1.0
// @license     MIT
// @author      Kabamgamer
// @description 20-3-2025, 23:07:24
// @downloadURL https://update.greasyfork.org/scripts/530388/Collect%20OC%2020%20success%20rates.user.js
// @updateURL https://update.greasyfork.org/scripts/530388/Collect%20OC%2020%20success%20rates.meta.js
// ==/UserScript==

function ocCollectRates() {
  const scenarios = document.querySelectorAll('#faction-crimes-root >div div:nth-child(6) > div');

  const scenarioCollection = []
  for (scenario of scenarios) {
    const scenarioInfoContainer = scenario.querySelector('div:nth-child(3) > div > div:nth-child(2) > div');
    const positions = scenario.querySelectorAll('div:nth-child(3) > div:nth-child(2) > div');

    if (!scenarioInfoContainer || !positions) {
      continue
    }

    const scenarioData = {
      name: scenarioInfoContainer.querySelector('p').innerText,
      level: scenarioInfoContainer.querySelector('div').innerText.replaceAll('\n', ''),
    };

    if (!scenarioData.name || !scenarioData.level) {
      continue;
    }

    const positionsData = []
    let totalRate = 0;
    for (position of positions) {
      if (!position.className.includes('waitingJoin')) {
        continue
      }

      const positionTitle = position.querySelector('button > :nth-child(2)').innerText;
      const successRate = position.querySelector('button > :nth-child(3)').innerText;
      if (positionTitle && successRate) {
        positionsData.push({
          title: positionTitle,
          successRate: parseInt(successRate),
        })
        totalRate += parseInt(successRate)
      }
    }

    if (!positionsData.length > 0) {
      continue
    }

    scenarioData.average = totalRate / positionsData.length;
    scenarioData.positions = positionsData;

    scenarioCollection.push(scenarioData)
  }

  if (scenarioCollection.length < 1) {
    alert("No OC data found. Make sure to verify that you're on the recruiting page")
  }

  return scenarioCollection;
}

function ocCopyRates() {
  ocSuccessRates = ocCollectRates();

  if (ocSuccessRates.length < 1) {
    return
  }

  ocSuccessRates.sort(function (a, b) {
    if (a.average < b.average) {
      return 1;
    } else if (a.average > b.average) {
      return -1;
    }

    return 0;
  })

  const hardestReliableScenario = ocSuccessRates.find((scenario) => scenario.average < 70)
  if (!hardestReliableScenario) {
    alert("It appears all success rates are higher then 70")
    return;
  }

  const highestReliableScenarioLevel = parseInt(hardestReliableScenario.level)

  const filteredScenarios = {}
  for (scenario of ocSuccessRates) {
    const scenarioLevel = parseInt(scenario.level);
    if (scenarioLevel === highestReliableScenarioLevel || scenarioLevel === highestReliableScenarioLevel - 1) {
      filteredScenarios[scenario.name] = filteredScenarios[scenario.name] || {
        level: scenario.level,
        positions: {}
      }

      for (position of scenario.positions) {
        filteredScenarios[scenario.name].positions[position.title] = position.successRate
      }
    }
  }

  console.log(ocSuccessRates)
  console.log(filteredScenarios)

  navigator.clipboard.writeText(JSON.stringify(filteredScenarios, undefined, 4));
}

window.addEventListener('load', function () {
  const titleElement = document.getElementById('skip-to-content');

  const cta = document.createElement("button");
  cta.innerHTML = "Copy pass rates"
  cta.type = "button"
  cta.className = "torn-btn"
  cta.onclick = ocCopyRates

  titleElement.append(cta)
});