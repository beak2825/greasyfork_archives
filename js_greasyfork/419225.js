// ==UserScript==
// @name         Copy TrueGaming achievement list
// @namespace    https://damirscorner.com
// @version      1.0.1
// @description  Copies the achievements/trophies from the True Achievements, TrueTrophies, and TrueSteamAchievements game page to clipboard as a table for further processing elsewhere.
// @author       Damir Arh
// @license      MIT
// @supportURL   https://github.com/damirarh/GreasyForkScripts
// @match        https://www.trueachievements.com/game/*/achievements*
// @match        https://www.truetrophies.com/game/*/trophies*
// @match        https://truesteamachievements.com/game/*/achievements*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419225/Copy%20TrueGaming%20achievement%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/419225/Copy%20TrueGaming%20achievement%20list.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function getSite() {
    switch (location.host) {
      case "www.trueachievements.com":
        return "TA";
      case "www.truetrophies.com":
        return "TT";
      case "truesteamachievements.com":
        return "TSA";
    }
  }

  function getScoreCaption(site) {
    switch (site) {
      case "TA":
        return "\tGamerscore";
      case "TT":
        return "\tTrophy";
      case "TSA":
        return "";
    }
  }

  function getScoreValue(achievement, site) {
    switch (site) {
      case "TA":
        return `\t${achievement.score}`;
      case "TT":
        return `\t${achievement.trophy}`;
      case "TSA":
        return "";
    }
  }

  const site = getSite();

  function copyToClipboard() {
    const achievements = [];

    const imageViewElements = document.querySelectorAll(
      ".ach-panels, .pnl-hd.no-pr.game"
    );

    let currentDlc;
    for (const element of imageViewElements) {
      if (element.classList.contains("ach-panels")) {
        const achievementElements = element.querySelectorAll("li");
        for (const achievementElement of achievementElements) {
          const achievement = {
            dlc: currentDlc,
          };

          const titleElement = achievementElement.querySelector(".title");
          if (titleElement) {
            achievement.name = titleElement.textContent;
            achievement.trueScore = titleElement.dataset.af;
            achievement.url = titleElement.href.match(/^([^?])+/g)[0];
          }

          const descriptionElement = achievementElement.querySelector("p");
          if (descriptionElement) {
            achievement.description = descriptionElement.textContent;
            const scoreData = descriptionElement.dataset.bf;
            achievement.score = scoreData && scoreData.replace(" - ", "");
            if (descriptionElement.classList.contains("t")) {
              if (descriptionElement.classList.contains("b")) {
                achievement.trophy = "Bronze";
              } else if (descriptionElement.classList.contains("s")) {
                achievement.trophy = "Silver";
              } else if (descriptionElement.classList.contains("g")) {
                achievement.trophy = "Gold";
              } else if (descriptionElement.classList.contains("p")) {
                achievement.trophy = "Platinum";
              }
            }
          }

          const progressElement = achievementElement.querySelector(
            ".progress-bar"
          );
          if (progressElement) {
            achievement.ratio = progressElement.dataset.af.match(
              /= (([\d\.])+)\)$/
            )[1];
          }

          const lockElement = achievementElement.querySelector(".lock");
          achievement.unlocked = !!(
            lockElement && lockElement.classList.contains("u")
          );

          achievements.push(achievement);
        }
      } else if (!element.classList.contains("gamer")) {
        const dlcTypeElement = element.querySelector(".info .img span");
        const dlcTitleElement = element.querySelector("h2 a");

        currentDlc = {
          type: dlcTypeElement && dlcTypeElement.textContent,
          title: dlcTitleElement && dlcTitleElement.textContent,
        };
      }
    }

    const listViewElements = document.querySelectorAll(
      "#oGameItems .even, #oGameItems .odd"
    );

    for (const rowElement of listViewElements) {
      const achievement = {};

      const cellElements = rowElement.querySelectorAll("td");

      if (cellElements[0]) {
        const titleElement = cellElements[0].querySelector("a");
        if (titleElement) {
          achievement.dlc = {
            title: titleElement.getAttribute("title"),
          };
        }
      }

      if (cellElements[2]) {
        const titleElement = cellElements[2].querySelector("a");
        if (titleElement) {
          achievement.name = titleElement.textContent;
          achievement.url = titleElement.href.match(/^([^?])+/g)[0];
        }
        const descriptionElement = cellElements[2].querySelector(".achdesc");
        if (descriptionElement) {
          achievement.description = descriptionElement.textContent;
        }
      }

      if (cellElements[3]) {
        achievement.trueScore = cellElements[3].textContent;
      }

      if (site === "TA" && cellElements[4]) {
        const scoreElement = cellElements[4].querySelector(".small");
        if (scoreElement) {
          achievement.score = scoreElement.textContent.match(/\d+/g)[0];
        }
      }

      const cellIndexOffset = site === "TA" ? 1 : 0;

      if (cellElements[4 + cellIndexOffset]) {
        achievement.ratio = cellElements[4 + cellIndexOffset].textContent;
      }

      if (site === "TT") {
        const trophyScore =
          Number.parseInt(achievement.trueScore.replace(",", "")) /
          Number.parseFloat(achievement.ratio);

        if (Math.abs(15 - trophyScore) < 1) {
          achievement.trophy = "Bronze";
        } else if (Math.abs(30 - trophyScore) < 1) {
          achievement.trophy = "Silver";
        } else if (Math.abs(90 - trophyScore) < 1) {
          achievement.trophy = "Gold";
        } else if (Math.abs(300 - trophyScore) < 1) {
          achievement.trophy = "Platinum";
        }
      }

      if (cellElements[5 + cellIndexOffset]) {
        achievement.unlocked = !!cellElements[5 + cellIndexOffset].textContent;
      }

      achievements.push(achievement);
    }

    const achievementsTable =
      `DLC type\tDLC title\tName\tDescription${getScoreCaption(
        site
      )}\t${site}\t${site} ratio\tUnlocked\tURL\n` +
      achievements
        .map(function (achievement) {
          return (
            `${(achievement.dlc && achievement.dlc.type) || ""}` +
            `\t${(achievement.dlc && achievement.dlc.title) || ""}` +
            `\t${achievement.name}` +
            `\t${achievement.description}` +
            getScoreValue(achievement, site) +
            `\t${achievement.trueScore}` +
            `\t ${achievement.ratio}` + // leading space helps Excel not to recognize it as a date
            `\t${achievement.unlocked ? "Yes" : "No"}` +
            `\t${achievement.url}`
          );
        })
        .join("\n");
    navigator.clipboard.writeText(achievementsTable);
  }

  const filterDropdownTitleElement = document.querySelector(
    "#btnFlagFilter_Options .title"
  );

  if (!filterDropdownTitleElement) {
    return;
  }

  const iconLabel =
    site === "TT"
      ? "Copy trophies to clipboard"
      : "Copy achievements to clipboard";

  const copyIcon = document.createElement("img");
  copyIcon.setAttribute("src", "/images/icons/copy.png");
  copyIcon.setAttribute("alt", iconLabel);

  const copyAnchor = document.createElement("a");
  copyAnchor.setAttribute("href", "#");
  copyAnchor.setAttribute("title", iconLabel);
  copyAnchor.style.marginLeft = "0";
  copyAnchor.appendChild(copyIcon);

  copyAnchor.addEventListener("click", copyToClipboard);

  filterDropdownTitleElement.appendChild(copyAnchor);
})();
