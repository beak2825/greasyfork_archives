// ==UserScript==
// @name          MZ Player Evaluator
// @namespace     MZPlayerEvaluator
// @version       1.0.4
// @description   Adds player's estimated skill level to the player card
// @author        Petri Liuska
// @match         *://*.managerzone.com/*
// @grant         GM_getValue
// @grant         GM_setValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/523683/MZ%20Player%20Evaluator.user.js
// @updateURL https://update.greasyfork.org/scripts/523683/MZ%20Player%20Evaluator.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /***** Global constants *****/

  /**
   * Invidual ball weights
   */
  const ballWeights = {
    speed: {
      goalkeeper: 0.09,
      defender: 0.2,
      anchorman: 0.1,
      midfielder: 0.1,
      winger: 0.25,
      forward: 0.2,
      poacher: 0.15,
    },
    stamina: {
      goalkeeper: 0.09,
      defender: 0.16,
      anchorman: 0.18,
      midfielder: 0.15,
      winger: 0.2,
      forward: 0.15,
      poacher: 0.15,
    },
    play_intelligence: {
      goalkeeper: 0.09,
      defender: 0.07,
      anchorman: 0.05,
      midfielder: 0.1,
      winger: 0.15,
      forward: 0.05,
      poacher: 0.05,
    },
    passing: {
      goalkeeper: 0.02,
      defender: 0.02,
      anchorman: 0.05,
      midfielder: 0.15,
      winger: 0.04,
      forward: 0.08,
      poacher: 0.02,
    },
    shooting: {
      goalkeeper: 0.0,
      defender: 0.0,
      anchorman: 0.0,
      midfielder: 0.05,
      winger: 0.0,
      forward: 0.28,
      poacher: 0.25,
    },
    heading: {
      goalkeeper: 0.0,
      defender: 0.03,
      anchorman: 0.0,
      midfielder: 0.0,
      winger: 0.0,
      forward: 0.03,
      poacher: 0.25,
    },
    keeping: {
      goalkeeper: 0.55,
      defender: 0.0,
      anchorman: 0.0,
      midfielder: 0.0,
      winger: 0.0,
      forward: 0.0,
      poacher: 0.0,
    },
    ball_control: {
      goalkeeper: 0.09,
      defender: 0.08,
      anchorman: 0.1,
      midfielder: 0.12,
      winger: 0.2,
      forward: 0.15,
      poacher: 0.1,
    },
    tackling: {
      goalkeeper: 0.0,
      defender: 0.3,
      anchorman: 0.3,
      midfielder: 0.2,
      winger: 0.05,
      forward: 0.02,
      poacher: 0.0,
    },
    aerial_passing: {
      goalkeeper: 0.02,
      defender: 0.15,
      anchorman: 0.12,
      midfielder: 0.08,
      winger: 0.5,
      forward: 0.0,
      poacher: 0.0,
    },
    set_plays: {
      goalkeeper: 0.0,
      defender: 0.0,
      anchorman: 0.0,
      midfielder: 0.0,
      winger: 0.0,
      forward: 0.0,
      poacher: 0.0,
    },
    experience: {
      goalkeeper: 0.05,
      defender: 0.05,
      anchorman: 0.05,
      midfielder: 0.05,
      winger: 0.05,
      forward: 0.05,
      poacher: 0.05,
    },
    form: {
      goalkeeper: 0, // this should be 0.05 but it interfers at times so its commented out for now
      defender: 0, // this should be 0.05 but it interfers at times so its commented out for now
      anchorman: 0, // this should be 0.05 but it interfers at times so its commented out for now
      midfielder: 0, // this should be 0.05 but it interfers at times so its commented out for now
      winger: 0, // this should be 0.05 but it interfers at times so its commented out for now
      forward: 0, // this should be 0.05 but it interfers at times so its commented out for now
      poacher: 0, // this should be 0.05 but it interfers at times so its commented out for now
    },
  };

  /**
   * Invidual skill keys
   */
  const skillKeys = [
    "speed",
    "stamina",
    "play_intelligence",
    "passing",
    "shooting",
    "heading",
    "keeping",
    "ball_control",
    "tackling",
    "aerial_passing",
    "set_plays",
    "experience",
    "form",
  ];

  /**
   * Invidual puck weights
   */
  const puckWeights = {
    form: {
      goalkeeper: 0, // this should be 0.05 but it interfers at times so its commented out for now
      defender: 0,
      center: 0,
      forward: 0,
    },
    play_intelligence: {
      goalkeeper: 0.04,
      defender: 0.06,
      center: 0.05,
      forward: 0.06,
    },
    power: {
      goalkeeper: 0,
      defender: 0.17,
      center: 0.17,
      forward: 0.2,
    },
    skating: {
      goalkeeper: 0.01,
      defender: 0.1,
      center: 0.12,
      forward: 0.1,
    },
    passing: {
      goalkeeper: 0.03,
      defender: 0.03,
      center: 0.03,
      forward: 0.03,
    },
    quickness: {
      goalkeeper: 0.1,
      defender: 0.17,
      center: 0.14,
      forward: 0.18,
    },
    shooting: {
      goalkeeper: 0,
      defender: 0.08,
      center: 0.19,
      forward: 0.16,
    },
    keeping: {
      goalkeeper: 0.8,
      defender: 0,
      center: 0,
      forward: 0,
    },
    puck_control: {
      goalkeeper: 0.01,
      defender: 0.04,
      center: 0.04,
      forward: 0.05,
    },
    checking: {
      goalkeeper: 0,
      defender: 0.21,
      center: 0.12,
      forward: 0.09,
    },
    stamina: {
      goalkeeper: 0.1,
      defender: 0.14,
      center: 0.14,
      forward: 0.14,
    },
  };

  /**
   * Invidual puck skill keys
   */
  const puckSkillKeys = [
    "form",
    "play_intelligence",
    "power",
    "skating",
    "passing",
    "quickness",
    "shooting",
    "keeping",
    "puck_control",
    "checking",
    "stamina",
  ];

  /**
   * Player table selectors
   */
  const playerTableSelectors = ["table.player_skills"];
  /***** /Global constants *****/

  /***** Functions *****/

  /**
   * Get player balls from the player table
   *
   * @param {object} table Player table
   *
   * @returns {object} Player's balls as an object
   */
  function getPlayerBalls(table) {
    const skillvals = table.querySelectorAll("td.skillval span");

    const balls = {};

    if (!skillvals.length) {
      return balls;
    }

    skillvals.forEach((skillval, index) => {
      const skillKey = skillKeys[index];
      const ball = parseInt(skillval.textContent);

      balls[skillKey] = ball;
    });

    return balls;
  }

  /**
   * Get player pucks from the player table
   *
   * @param {object} table Player table
   *
   * @returns {object} Player's pucks as an object
   */
  function getPlayerPucks(table) {
    const skillvals = table.querySelectorAll("td.skillval span");

    const pucks = {};

    if (!skillvals.length) {
      return pucks;
    }

    skillvals.forEach((skillval, index) => {
      const skillKey = puckSkillKeys[index];
      const puck = parseInt(skillval.textContent);

      pucks[skillKey] = puck;
    });

    return pucks;
  }

  /**
   * Get player info (balls, age, name, ID)
   *
   * @param {object} playerContainer Player container
   *
   * @returns {object} Player info
   */
  function getPlayerInfo(playerContainer) {
    const infoElement = playerContainer.querySelector(".dg_playerview_info");
    const ageRow = infoElement.querySelector("tr:nth-child(1)");
    const age = parseInt(ageRow.querySelector("td:nth-child(1) strong").textContent);

    // Find the player name from the table, it is in the .player_name
    const nameElement = playerContainer.querySelector(".player_name");
    const name = nameElement.textContent;

    // Find the player ID from the table, it is in the .player_id_span
    const idElement = playerContainer.querySelector(".player_id_span");
    const id = parseInt(idElement.textContent);

    // Get the player balls
    const table = playerContainer.querySelector("table.player_skills");
    const balls = getPlayerBalls(table);

    return {
      id,
      name,
      age,
      balls,
    };
  }

  /**
   * Evaluate player's level in a role
   *
   * @param {object} balls Player's balls
   * @param {string} role Player's role key
   */
  function evaluatePlayerLevel(balls, role) {
    let level = 0;

    for (const skillKey in balls) {
      const ball = balls[skillKey];

      level += ball * ballWeights[skillKey][role];
    }

    return level.toFixed(2);
  }

  /**
   * Evaluate player's level in a role (hockey version)
   *
   * @param {object} pucks Player's pucks
   * @param {string} role Player's role key
   */
  function evaluatePlayerLevelHockey(pucks, role) {
    let level = 0;

    for (const skillKey in pucks) {
      const puck = pucks[skillKey];

      level += puck * puckWeights[skillKey][role];
    }

    return level.toFixed(2);
  }

  /**
   * Create a skill level element
   *
   * @param {string} label Role label
   * @param {number} level Skill level
   */
  function createSkillLevelElement(label, level) {
    const element = document.createElement("span");
    element.classList.add("mzpe-level");
    element.classList.add("mzpe-level-" + label.toLowerCase());
    element.textContent = label + ": " + level;

    return element;
  }

  /**
   * Create a player evaluation element
   *
   * @param {object} balls Player's balls
   *
   * @returns {object} Player evaluation element
   */
  function createPlayerEvaluationElement(balls) {
    const element = document.createElement("div");
    element.classList.add("mzpe-skill-levels");

    // Create the save button
    const saveButton = createSaveButton();
    element.appendChild(saveButton);

    const goalkeeperLevel = evaluatePlayerLevel(balls, "goalkeeper");
    const goalkeeperElement = createSkillLevelElement("GK", goalkeeperLevel);
    element.appendChild(goalkeeperElement);

    const defenderLevel = evaluatePlayerLevel(balls, "defender");
    const defenderElement = createSkillLevelElement("CB", defenderLevel);
    element.appendChild(defenderElement);

    const anchormanLevel = evaluatePlayerLevel(balls, "anchorman");
    const anchormanElement = createSkillLevelElement("DM", anchormanLevel);
    element.appendChild(anchormanElement);

    const midfielderLevel = evaluatePlayerLevel(balls, "midfielder");
    const midfielderElement = createSkillLevelElement("CM", midfielderLevel);
    element.appendChild(midfielderElement);

    const wingerLevel = evaluatePlayerLevel(balls, "winger");
    const wingerElement = createSkillLevelElement("W", wingerLevel);
    element.appendChild(wingerElement);

    const forwardLevel = evaluatePlayerLevel(balls, "forward");
    const forwardElement = createSkillLevelElement("ST", forwardLevel);
    element.appendChild(forwardElement);

    const poacherLevel = evaluatePlayerLevel(balls, "poacher");
    const poacherElement = createSkillLevelElement("CF", poacherLevel);
    element.appendChild(poacherElement);

    return element;
  }

  /**
   * Create a player evaluation element
   *
   * @param {object} pucks Player's pucks
   *
   * @returns {object} Player evaluation element
   */
  function createPlayerEvaluationElementHockey(pucks) {
    const element = document.createElement("div");
    element.classList.add("mzpe-skill-levels");

    // Create the save button
    const saveButton = createSaveButton();
    element.appendChild(saveButton);

    const goalkeeperLevel = evaluatePlayerLevelHockey(pucks, "goalkeeper");
    const goalkeeperElement = createSkillLevelElement("GK", goalkeeperLevel);
    element.appendChild(goalkeeperElement);

    const defenderLevel = evaluatePlayerLevelHockey(pucks, "defender");
    const defenderElement = createSkillLevelElement("DEF", defenderLevel);
    element.appendChild(defenderElement);

    const forwardLevel = evaluatePlayerLevelHockey(pucks, "forward");
    const forwardElement = createSkillLevelElement("FW", forwardLevel);
    element.appendChild(forwardElement);

    const centerLevel = evaluatePlayerLevelHockey(pucks, "center");
    const centerElement = createSkillLevelElement("C", centerLevel);
    element.appendChild(centerElement);

    return element;
  }

  /**
   * Create a save player button
   */
  function createSaveButton() {
    const button = document.createElement("button");
    button.textContent = "Save";
    button.classList.add("mzpe-save-button");

    button.addEventListener("click", function () {
      const playerContainer = this.closest(".playerContainer");
      const player = getPlayerInfo(playerContainer);

      // Save the player to the Tampermonkey storage
      const players = JSON.parse(GM_getValue("players", "[]"));

      // Check if the player is already saved, and remove duplicates
      const playerIndex = players.findIndex((p) => p.id === player.id);

      if (playerIndex === -1) {
        players.push(player);
      } else {
        players[playerIndex] = player;
      }

      GM_setValue("players", JSON.stringify(players));
    });

    return button;
  }

  /**
   * Create style element
   */
  function createStyleElement() {
    const style = document.createElement("style");
    style.textContent = `
			.mzpe-skill-levels {
				display: flex;
				margin: 5px 0;
				flex-wrap: wrap;
				gap: 10px;
				margin-top: 10px;
				max-width: 280px;
			}
		`;

    return style;
  }

  /**
   * The observer
   */
  let observer = null;

  /**
   * Detect changes on the page
   */
  function observeDOMChanges() {
    const cfg = {
      childList: true,
      subtree: true,
    };

    const cb = function (mutations) {
      let shouldInit = false;

      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
          shouldInit = true;
        }
      });

      if (shouldInit) {
        observer.disconnect();

        init();

        observer.observe(document.body, cfg);
      }
    };

    observer = new MutationObserver(cb);

    observer.observe(document.body, cfg);
  }

  function getSportByMessenger() {
    if (document.getElementById("messenger")) {
      if (
        document.getElementById("messenger").className === "soccer" ||
        document.getElementById("messenger").className === "hockey"
      ) {
        return document.getElementById("messenger").className;
      }
    }

    return "";
  }

  /**
   * Initialize the script
   */
  function init() {
    const sport = getSportByMessenger();

    const tables = document.querySelectorAll(playerTableSelectors.join(", "));

    if (!tables.length) {
      return;
    }

    tables.forEach((table) => {
      let element = null;

      if (sport === "soccer") {
        const balls = getPlayerBalls(table);

        element = createPlayerEvaluationElement(balls);
      } else if (sport === "hockey") {
        const pucks = getPlayerPucks(table);

        element = createPlayerEvaluationElementHockey(pucks);
      }

      // Append or replace the element
      if (table.nextElementSibling && table.nextElementSibling.classList.contains("mzpe-skill-levels")) {
        table.nextElementSibling.replaceWith(element);
      } else {
        table.parentNode.insertBefore(element, table.nextSibling);
      }
    });

    const style = createStyleElement();
    document.head.appendChild(style);
  }
  /***** /Functions *****/

  /***** Initialization *****/
  init();
  observeDOMChanges();
  /***** /Initialization *****/
})();
