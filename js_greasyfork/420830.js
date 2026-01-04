// ==UserScript==
// @name         Sort cities select
// @namespace    March of history
// @version      0.1
// @description  Sort the cities list on select, based on priority and then alphabetical order
// @author       Gohan89
// @match        http://www.marchofhistory.com/EcranPrincipal.php
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/420830/Sort%20cities%20select.user.js
// @updateURL https://update.greasyfork.org/scripts/420830/Sort%20cities%20select.meta.js
// ==/UserScript==
console.log("script run");

// TODO change here your priority list
window.priority = [
  "bekes",
  "brasso",
  "alba iulia",
  "truda",
  "des",
  "zilah",
  "kolozsvar",
  "dlamoc",
  "garic grad",
  "metkovic",
  "orahovica",
];
window.populations = [];

window.sortType = "populations";

document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM loaded");
  window.startScript();
});

window.startScript = startScript = () => {
  const checkForReady = checkMutation("body", "#contenu", () => {
    checkMutation("#contenu", "#ecranCarte", () => {
      window.collectPopulation();
    });
    checkMutation("#contenu", "#ecranVille", () => {
      window.sortCities(window.sortType);
      window.setArrows();
    });
    checkForReady.disconnect();
  });
};

window.collectPopulation = () => {
  let populations = [];
  console.log("collection populations");
  const list = document.querySelector(".tabsCarte #tabs-1 .accordion");
  const citiesElement = list.querySelectorAll("h3");
  const dataElements = list.querySelectorAll(".accordeonItem");
  citiesElement.forEach((el) => {
    const id = window.cleanText(el.id);
    const cityName = window
      .cleanText(el.querySelector("a.accordeonTitre").innerText)
      .replace("seignory of ", "");
    const found = Array.from(dataElements).find((el) => {
      const aria = window.cleanText(el.getAttribute("aria-labelledby"));
      return aria === id;
    });
    if (found) {
      const wrapper = found.querySelector(".accordeonItemWrapper");
      const action = wrapper.querySelector(".action[data-idville]");
      const idCity = action.getAttribute("data-idville");
      const population = Number(
        found.querySelector(".menuVillageRessourcesElement").innerText.trim()
      );
      populations.push({ cityName, population, idCity });
    }
  });
  populations = [...populations].sort((a, b) => {
    if (a.population < b.population) return 1;
    if (a.population > b.population) return -1;
    return 0;
  });
  window.populations = populations;
  console.log("collected populations");
};

window.sortCities = (type) => {
  console.log("started");
  const list = document.querySelector("#villeListeVilles ul");
  const elements = list.querySelectorAll("li");
  console.log(`sorting by ${type}`);
  const sorted = [...elements].sort((a, b) => {
    const textA = window
      .cleanText(a.querySelector(".deroulantVillesNomProvince").innerText)
      .replace("seignory of ", "");
    const textB = window
      .cleanText(b.querySelector(".deroulantVillesNomProvince").innerText)
      .replace("seignory of ", "");
    if (type === "priority") {
      const found = window.priority.reduce((prev, curr) => {
        if (typeof prev !== "undefined") return prev;
        if (textA.includes(curr)) return -1;
        if (textB.includes(curr)) return 1;
        return prev;
      }, undefined);
      if (typeof found !== "undefined") {
        console.log(type, "found");
        return found;
      }
      if (textA < textB) return -1;
      if (textA > textB) return 1;
      if (textA === textB) return 0;
    } else if (type === "populations" && window.populations.length) {
      const found = window.populations.reduce((prev, curr) => {
        if (typeof prev !== "undefined") return prev;
        if (textA.includes(curr.cityName)) return -1;
        if (textB.includes(curr.cityName)) return 1;
        return prev;
      }, undefined);
      return found ? found : 0;
    } else {
      if (textA < textB) return -1;
      if (textA > textB) return 1;
      if (textA === textB) return 0;
    }
  });
  elements.forEach((el) => el.remove());
  sorted.forEach((el) => {
    const action = el.querySelector(".action");
    el.title = `${window.cleanText(action.innerText)} - ${action.getAttribute(
      "data-idville"
    )}`;
    list.append(el);
  });
};

window.setArrows = () => {
  const currentCityElement = document.querySelector(
    "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > div.deroulantVilles > div > div > span.deroulantVillesNomProvince"
  );
  const currentCityName = window
    .cleanText(currentCityElement.innerHTML)
    .replace("seignory of ", "");
  const currentCity_index = window.populations.findIndex((pop) => {
    return pop.cityName === currentCityName;
  });

  const prev_city =
    window.populations[currentCity_index - 1] ??
    window.populations[window.populations.length - 1];
  const prev_id = prev_city.idCity;

  const next_city =
    window.populations[currentCity_index + 1] ?? window.populations[0];
  const next_id = next_city.idCity;

  if (next_id && prev_id) {
    const left = document.querySelector(
      "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelLeft.action"
    );
    left.setAttribute("data-idville", prev_id);
    left.setAttribute("title", prev_city.cityName);
    const right = document.querySelector(
      "#villageWrapper > div.modaleCarte > div > div > div.menuVillageVilles > button.btnDirectionnelRight.action"
    );
    right.setAttribute("data-idville", next_id);
    right.setAttribute("title", next_city.cityName);
  }
};

window.cleanText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

window.checkMutation = (target, id, callback) => {
  var targetNode = document.querySelector(target);
  var config = { attributes: true, childList: true };

  var observer = new MutationObserver((mutationsList, observer) => {
    for (var mutation of mutationsList) {
      if (mutation.type == "childList") {
        const element = targetNode.querySelector(id);
        if (element) {
          console.log(`Found ${id}`);
          callback();
        }
      }
    }
  });
  observer.observe(targetNode, config);

  return observer;
};
