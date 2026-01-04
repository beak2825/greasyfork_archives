// ==UserScript==
// @name        pokerogue.net type effectiveness helper
// @namespace   Violentmonkey Scripts
// @match       https://pokerogue.net/*
// @grant       none
// @version     1.0
// @author      sorenGu
// @license     MIT
// @homepageURL https://github.com/sorenGu/pokerogue.net-type-effectiveness-helper
// @description Shows a info panel at the left side of the screen to display the type effectiveness of attacks against all (most, some pokemon seem to not show up) pokemon on the field. The "i" key opens and closes the info window at the left.
// @downloadURL https://update.greasyfork.org/scripts/497460/pokeroguenet%20type%20effectiveness%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/497460/pokeroguenet%20type%20effectiveness%20helper.meta.js
// ==/UserScript==

function add_info_panel() {
  let infoDiv = document.createElement("div");
  infoDiv.style.position = "fixed";
  infoDiv.style.top = "60%";
  infoDiv.style.left = "10px";
  infoDiv.style.maxHeight = "350px";
  infoDiv.style.width = "300px";
  infoDiv.style.overflowY = "auto";
  infoDiv.style.transform = "translateY(-50%)";
  infoDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  infoDiv.style.color = "white";
  infoDiv.style.zIndex = "9998";
  infoDiv.style.fontSize = "12px";
  infoDiv.style.padding = "10px";
  infoDiv.style.borderRadius = "5px";
  document.body.appendChild(infoDiv);

  document.addEventListener("keydown", (event) => {
    if (event.key === "i") {
      if (infoDiv.style.display === "none") {
        infoDiv.style.display = "block";
        infoDiv.scrollTop = infoPanel.scrollHeight;
      } else {
        infoDiv.style.display = "none";
      }
      event.preventDefault();
    }
  });

  return infoDiv;
}

function add_debug_panel(logDiv) {
  logDiv = document.createElement("div");
  logDiv.style.position = "fixed";
  logDiv.style.bottom = "0";
  logDiv.style.right = "0";
  logDiv.style.maxHeight = "200px";
  logDiv.style.overflowY = "auto";
  logDiv.style.width = "300px";
  logDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  logDiv.style.color = "white";
  logDiv.style.zIndex = "9999";
  logDiv.style.fontSize = "12px";
  logDiv.style.padding = "10px";
  logDiv.style.borderRadius = "5px";
  document.body.appendChild(logDiv);
  return logDiv;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function parse_effectiveness(obj) {
  var newObj = {};

  for (var key in obj) {
    var value = obj[key];
    if (value === 100) {
      continue;
    }
    key = capitalizeFirstLetter(key);

    if (!newObj[value]) {
      newObj[value] = [key];
    } else {
      newObj[value].push(key);
    }
  }


  var sortedKeys = Object.keys(newObj).sort(function(a, b) {
    return parseFloat(a) - parseFloat(b);
  });

  var sortedObj = {};
  sortedKeys.forEach(function(key) {
    sortedObj[key] = newObj[key];
  });

  return sortedObj;
}

function calculateTypeEffectiveness(pokemonTypes, typeDamageRelationsMap) {

  const effectiveness = {};

  function add_to_effectiveness(name, value) {
    const previous_value = effectiveness[name] || 100;
    effectiveness[name] = value * previous_value;
  }

  pokemonTypes.forEach(function(pokemonType) {
    const typeData = typeDamageRelationsMap[pokemonType];
    typeData.double_damage_from.forEach(function(type) {
      add_to_effectiveness(type.name, 2);
    });
    typeData.no_damage_from.forEach(function(type) {
      add_to_effectiveness(type.name, 0);
    });
    typeData.half_damage_from.forEach(function(type) {
      add_to_effectiveness(type.name, 0.5);
    });
  });

  return parse_effectiveness(effectiveness);
}

(function() {
  "use strict";
  const debug = false;
  let pokemonIdMap = JSON.parse(localStorage.getItem("pokemonIdMap")) || {};
  let typeDamageRelationsMap = JSON.parse(localStorage.getItem("typeDamageRelationsMap")) || {};

  let debugPanel;
  if (debug) {
    debugPanel = add_debug_panel(debugPanel);
  }


  function debugLog(message) {
    if (!debug) return;

    const logEntry = document.createElement("div");
    logEntry.textContent = message;
    debugPanel.appendChild(logEntry);
    debugPanel.scrollTop = debugPanel.scrollHeight;
  }


  const infoPanel = add_info_panel();

  function displayInfo(text, title = false) {
    const infoLine = document.createElement("div");
    infoLine.textContent = text;
    if (title) {
      infoLine.style.fontWeight = "bold";
      infoLine.style.fontSize = "1.5rem";
      infoLine.style.borderBottom = "white solid 2px"
    }
    infoPanel.appendChild(infoLine);
    infoPanel.scrollTop = infoPanel.scrollHeight;
  }

  debugLog("Script is running");
  let last_shown_pokemon = [];

  function addToLastShow(name) {
    last_shown_pokemon.push(name);

    if (last_shown_pokemon.length > 3) {
      last_shown_pokemon.shift();
    }
  }

  function getPokemonTypes(pokemonId, pokemonData, callback) {
    fetch(pokemonData.url)
      .then(response => response.json())
      .then(data => {
        debugLog("Fetched types for: " + pokemonData.name);
        pokemonIdMap[pokemonId]["types"] = data.types.map(function(item) {
          return item.type.name;
        });
        localStorage.setItem("pokemonIdMap", JSON.stringify(pokemonIdMap));
        callback(pokemonIdMap[pokemonId]);
      })
      .catch(error => {
        debugLog("Error fetching Pokémon types: " + error);
      });
  }

  function displayPokemonEffectiveness(pokemonData) {
    displayInfo(capitalizeFirstLetter(pokemonData.name), true);
    const effectiveness = calculateTypeEffectiveness(pokemonData.types, typeDamageRelationsMap);
    const effectiveness_display = { "0": "0", "25": "1/4", "50": "1/2", "200": "2", "400": "4" };
    Object.keys(effectiveness).forEach(function(key) {
      let effectivenessKey = effectiveness_display[key] || "?" + key;
      let textColor = "white";

      const effectivenessLine = document.createElement("div");
      if (key === "400") {
        effectivenessLine.style.border = "lightblue solid 1px";
      } else if (key === "200") {
        effectivenessLine.style.border = "lightgreen solid 1px";
      }
      effectivenessLine.style.color = textColor;
      effectivenessLine.style.padding = "5px";
      const effectivenessValues = effectiveness[key].map(function(type) {
        let color = "";
        const colorMap = {
          "Normal": "#a7a778",
          "Fire": "#ee7f31",
          "Water": "#678fef",
          "Grass": "#7bce52",
          "Electric": "#f6ce31",
          "Ice": "#97d6d7",
          "Fighting": "#be3029",
          "Poison": "#9f3fa0",
          "Ground": "#debe68",
          "Flying": "#9cadf7",
          "Psychic": "#ef4179",
          "Bug": "#adbd21",
          "Rock":"#b79f39",
          "Ghost":"#6f5798",
          "Dragon": "#6f38f7",
          "Dark": "#6f5748",
          "Steel": "#b7b7cf",
          "Fairy": "#ec98ac",
        };
        color = colorMap[type] || "white";
        return `<span style="color: ${color}; border: 1px solid black; padding: 2px; margin: 1px;">${type}</span>`;
      });
      effectivenessLine.innerHTML = `${effectivenessKey}X : ${effectivenessValues.join(", ")}`;
      infoPanel.appendChild(effectivenessLine);
      infoPanel.scrollTop = infoPanel.scrollHeight;
    });
  }

  function handlePokemonId(pokemonId) {
    const pokemonData = pokemonIdMap[pokemonId];
    if (!pokemonData) {
      displayInfo("Pokemon data not found for ID: " + pokemonId);
      return;
    }
    if (last_shown_pokemon.includes(pokemonData.name)) return;
    addToLastShow(pokemonData.name);


    if (!pokemonData.types) {
      getPokemonTypes(pokemonId, pokemonData, displayPokemonEffectiveness);
    } else {
      displayPokemonEffectiveness(pokemonData);
    }
  }

  function fetchAllPokemonData(url) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.results.forEach(pokemon => {
          const pokemonId = pokemon.url.match(/\/(\d+)\//)[1];
          pokemonIdMap[pokemonId] = pokemon;
        });
        if (data.next !== null) {
          fetchAllPokemonData(data.next);
        }

      })
      .catch(error => {
        debugLog("Error fetching Pokémon data: " + error);
      });

  }

  function fetchTypeDamageRelations(typeId) {
    fetch(`https://pokeapi.co/api/v2/type/${typeId}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        typeDamageRelationsMap[typeId] = data.damage_relations;
        typeDamageRelationsMap[data.name] = data.damage_relations;
        debugLog(`Fetched damage relations for type ${typeId}`);
      })
      .catch(error => {
        debugLog(`Error fetching damage relations for type ${typeId}: ${error}`);
      });
  }

  if (Object.keys(pokemonIdMap).length === 0) {
    fetchAllPokemonData("https://pokeapi.co/api/v2/pokemon/?limit=200");
  } else {
    debugLog("Using Pokémon data from localStorage");
  }
  localStorage.setItem("pokemonIdMap", JSON.stringify(pokemonIdMap));


  if (debug) window.pokemonIdMap = pokemonIdMap;
  debugLog(Object.keys(pokemonIdMap).length);

  for (let typeId = 1; typeId <= 20; typeId++) {
    if (!typeDamageRelationsMap[typeId]) {
      fetchTypeDamageRelations(typeId);
    } else {
      debugLog(`Using damage relations for type ${typeId} from localStorage`);
    }
  }

  localStorage.setItem("typeDamageRelationsMap", JSON.stringify(typeDamageRelationsMap));
  if (debug) window.typeDamageRelationsMap = typeDamageRelationsMap;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      const url = new URL(entry.name);
      const pathname = url.pathname;
      const matches = pathname.match(/\/(\d+)\.json/);
      if (matches) {
        handlePokemonId(Number(matches[1]));
      }
    });
  });

  observer.observe({ entryTypes: ["resource"] });

  debugLog("Script setup complete");
})();