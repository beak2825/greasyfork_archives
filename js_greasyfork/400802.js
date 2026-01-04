// ==UserScript==
// @name           Enhance Advance Wars By Web gameplay
// @namespace      https://openuserjs.org/users/clemente
// @match          https://awbw.amarriner.com/game.php
// @grant          GM_openInTab
// @grant          GM_notification
// @grant          GM_xmlhttpRequest
// @version        1.0
// @author         clemente
// @license        MIT
// @description    Add "your turn" notifications, style improvements and more to Advance Wars By Web
// @icon           https://awbw.amarriner.com/favicon.ico
// @connect        awbw.amarriner.com
// @inject-into    content
// @noframes
// @homepageURL    https://openuserjs.org/scripts/clemente/Enhance_Advance_Wars_By_Web_gameplay
// @supportURL     https://openuserjs.org/scripts/clemente/Enhance_Advance_Wars_By_Web_gameplay/issues
// @downloadURL https://update.greasyfork.org/scripts/400802/Enhance%20Advance%20Wars%20By%20Web%20gameplay.user.js
// @updateURL https://update.greasyfork.org/scripts/400802/Enhance%20Advance%20Wars%20By%20Web%20gameplay.meta.js
// ==/UserScript==

const NOTIFICATION_POLL_DELAY = 10000; // 10 seconds

const yourTurnMessage = {
  de: 'Sie sind an der Reihe',
  en: 'Your turn to play',
  es: 'Es tu turno de jugar',
  fr: 'À votre tour de jouer',
  it: 'Tocca a te giocare',
};

const language = getUserLanguage();

/**
 * Utils functions
 */

function getUserLanguage() {
  const language = (navigator.language || 'en').slice(0, 2);
  return ['de', 'en', 'es', 'fr', 'it'].includes(language) ? language : 'en';
}

function gm_fetch(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function({ status, responseText }) {
        if (status < 200 && status >= 300) return reject();
        resolve(responseText);
      },
      onerror: function() { reject(); },
    });
  });
}

/**
 * On Retina display, the buildings have a strange sub-pixel black gap.
 * This fixes it by scaling a bit the buildings
 */
function fixBuildingStylingIssue() {
  if (window.window.devicePixelRatio >= 2) {
    const buildingStyle = document.createElement('style');
    buildingStyle.textContent = ".s { transform: scale(1.05); }";
    document.head.append(buildingStyle);
  }
}

/**
 * Periodically checks if a "your turn" is detected.
 * If it is, then notify the user.
 */
async function checkAndNotifyWaitingGames() {

  async function getWaitingGames() {
    // Your turn page is used because it is one of the fastest pages on the website and allows the game name to be retrieved
    const yourTurnPageHtml = await gm_fetch('https://awbw.amarriner.com/yourturn.php');
    const parser = new DOMParser();
    const yourTurnPageDocument = parser.parseFromString(yourTurnPageHtml, "text/html");
    const waitingGameNodeLinks = yourTurnPageDocument.querySelectorAll('a[href^="game.php?games_id="]');
    const waitingGames = Array.from(waitingGameNodeLinks).map(node => ({ name: node.textContent.trim(), link: node.href }));

    return waitingGames;
  }

  async function notifyNewWaitingGames(waitingGames, alreadyNotifiedWaitingGames) {
    waitingGames.filter(game => !alreadyNotifiedWaitingGames.includes(game.name)).forEach(game => {
      GM_notification(yourTurnMessages[languages], game.name, 'https://awbw.amarriner.com/favicon.ico', () => GM_openInTab(game.link));
      alreadyNotifiedWaitingGames.push(game.name);
    })
  }

  const alreadyNotifiedWaitingGames = await getWaitingGames();

  setInterval(async () => notifyNewWaitingGames(await getWaitingGames(), alreadyNotifiedWaitingGames), NOTIFICATION_POLL_DELAY);
}

fixBuildingStylingIssue();
checkAndNotifyWaitingGames();
