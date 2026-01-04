// ==UserScript==
// @name         HN Anonymizer
// @author       booleandilemma
// @description  Anonymize your Hacker News username
// @homepageURL  https://github.com/booleandilemma/hn-anonymizer
// @match        https://news.ycombinator.com/*
// @version      1.0.0
// @grant        none
// @license      GPL-3.0
// @namespace https://greasyfork.org/users/777592
// @downloadURL https://update.greasyfork.org/scripts/521891/HN%20Anonymizer.user.js
// @updateURL https://update.greasyfork.org/scripts/521891/HN%20Anonymizer.meta.js
// ==/UserScript==

"use strict";

/* ========================== Configuration Info Starts Here ========================== */

/*
 * Customize your username with this variable
 * or leave it empty for asterisks.
 */
const customUsername = "";

/*
 * Customize your profile url with this variable,
 * or leave it blank to leave your profile url as is.
 */
const customProfileUrl = "";

/*
 * Customize your HN karma with this variable.
 */
const karma = "47974";

/* ========================== Configuration Info Ends Here ========================== */

const UserScriptName = "HN Anonymizer";

/**
 * Logs an info message to the console.
 * @param {string} message - Specifies the message to log.
 */
function logInfo(message) {
  console.info(`${UserScriptName}: ${message}`);
}

/**
 * Logs an error message to the console.
 * @param {string} message - Specifies the message to log.
 */
function logError(message) {
  console.error(`${UserScriptName}: ${message}`);
}

function main() {
  const usernameElement = document.getElementById("me");

  if (usernameElement != null) {
    if (customUsername !== "") {
      usernameElement.innerHTML = customUsername;
    } else {
      usernameElement.innerHTML = "*****";
    }

    logInfo("Username anonymized");

    if (customProfileUrl !== "") {
      usernameElement.setAttribute("href", customProfileUrl);

      logInfo("Profile URL anonymized");
    }
  } else {
    logError("No username element found.");
  }

  const karmaElement = document.getElementById("karma");

  if (karmaElement != null) {
    karmaElement.innerText = karma;

    logInfo("Karma anonymized");
  } else {
    logError("No karma element found.");
  }

  const asteriskElements = document.querySelectorAll('[color="#ff6600"]');

  for (let i = 0; i < asteriskElements.length; i++) {
    const asteriskElement = asteriskElements[i];

    const voteArrow = document.createElement("div");
    voteArrow.classList.add("votearrow");
    voteArrow.title = "upvote";

    asteriskElement.innerText = "";
    asteriskElement.appendChild(voteArrow);
  }

  if (asteriskElements.length > 0) {
    logInfo("Comments anonymized");
  }
}

main();
