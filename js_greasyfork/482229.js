/**
 * TM Value Variation Calculator - a.k.a. SIS (Should I sell?)
 * version 0.0.1 BETA - only English
 */

// ==UserScript==
// @name         TM Value Variation Calculator
// @namespace    http://tampermonkey.net/
// @version      0.0.1 Beta - English Only (2023-12-14)
// @description  Calculates sell to agent current and old values, based on the RatingR5 (ver5.4 for Season67) local storage.
// @author       Erik (ABC FC 4402678)
// @include      https://trophymanager.com/players/*
// @exclude      https://trophymanager.com/players/compare/*
// @exclude      https://trophymanager.com/players/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trophymanager.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482229/TM%20Value%20Variation%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/482229/TM%20Value%20Variation%20Calculator.meta.js
// ==/UserScript==

function calcSellToAgentPrice(ASI, ageMonths) {
  const MP = Math.pow;
  const notGK = player_fp != "gk" ? true : false;
  let staPrice; // Sell To Agent Price
  if (notGK) {
    staPrice = parseInt(ASI * 500 * MP(300 / ageMonths, 2.5));
  } else {
    staPrice = parseInt(ASI * 500 * MP(300 / ageMonths, 2.5) * 0.75);
  }
  const maxPrice = parseInt(ASI * (192400 / (ageMonths / 12) - 5200));
  if (maxPrice < staPrice) maxPrice = staPrice;
  return { staPrice, maxPrice };
}

/**
 * @param {string} age 'e.g. 30 Years 11 Months'
 * @returns {Object} { ageMonths, month, year }
 */
function formatAge(age) {
  const yearIndex = age.search(/\d\d/);
  const year = Number(age.substr(yearIndex, 2));
  age = age.slice(yearIndex + 2);
  const month = Number(age.replace(/\D+/g, ""));
  const ageMonths = year * 12 + month * 1;
  return { ageMonths, month, year };
}

/**
 * @returns {string} 'e.g. "30 Years 11 Months".'
 */
function getAge() {
  const getTr = document.getElementsByTagName("tr");
  let age = null;
  for (let i = 0; i < getTr.length; i++) {
    const currentTr = getTr[i]?.getElementsByTagName("td")[0]?.innerHTML;
    if (currentTr?.includes("Years")) {
      // Only english || currentTr.includes("Anos")
      age = currentTr;
      break;
    }
  }
  return age;
}

function getAsi() {
  const getTr = document.getElementsByTagName("tr");
  let asi = null;
  for (let i = 0; i < getTr.length; i++) {
    const currentTr = getTr[i]?.innerHTML;
    if (currentTr?.includes("Skill Index")) {
      const match = currentTr.match(/<td>([\d,]+)<\/td>/); // e.g. '<th>Skill Index</th><td>125,701</td>'
      if (match && match.length === 2) {
        const numberValue = match[1];
        asi = parseFloat(numberValue.replace(/,/g, ""));
      }
      break;
    }
  }
  return asi;
}

function getWage() {
  const getTr = document.getElementsByTagName("tr");
  let wage = null;
  for (let i = 0; i < getTr.length; i++) {
    const currentTr = getTr[i]?.innerHTML;
    if (currentTr?.includes("Wage")) {
      const match = currentTr.match(
        /<td><span class="coin">([\d,]+)<\/span><\/td>/
      );
      if (match && match.length === 2) {
        const numberValue = match[1];
        wage = parseFloat(numberValue.replace(/,/g, ""));
      }
      break;
    }
  }
  return wage;
}

function main() {
  // localStorage from RatingR5 extension(version 5.4 used as reference)
  const ASIObjdata = JSON.parse(localStorage.getItem(player_id + "_SI")); // variable from TM: player_id
  if (!ASIObjdata) {
    console.log(
      "Not enough data recorded from this player. Local storage empty"
    );
    return "Not enough data recorded from this player. Make sure you have R5/R6 installed and that you have visualized this player in the last 6 weeks.\n\nMore info in the <a href='https://github.com/erik-ymmt/TM-Value-Variation-Calculator' target='_blank'>script documentation</a>.";
  }

  const curAge = getAge();
  const curAgeFormated = formatAge(curAge);
  const currentAgeInMonths = curAgeFormated.ageMonths;
  const curAgeString = curAgeFormated.year + "." + curAgeFormated.month;
  const agesASI = Object.keys(ASIObjdata);

  const lastRecordedAgeIndex = agesASI.indexOf(curAgeString);
  if (lastRecordedAgeIndex > -1) agesASI.splice(lastRecordedAgeIndex, 1);

  if (agesASI.length == 0) {
    console.log(
      "Not enough data recorded from this player. Local storage empty"
    );
    return "Not enough data recorded from this player. Make sure you have R5 installed and that you have visualized this player on the last 6 weeks";
  }

  const lastAgeRecorded = agesASI[agesASI.length - 1];
  const lastAgeRecordedInMonths =
    Number(lastAgeRecorded.split(".")[0]) * 12 +
    Number(lastAgeRecorded.split(".")[1]);

  const ageDif = currentAgeInMonths - lastAgeRecordedInMonths;
  if (ageDif > 8) {
    console.log("Data is too old for this player");
    return "Data is too old for this player";
  }

  const lastASI = ASIObjdata[lastAgeRecorded];
  const curASI = getAsi();
  const lastStaPrice = calcSellToAgentPrice(
    lastASI,
    lastAgeRecordedInMonths
  ).staPrice;
  const currentStaPrice = calcSellToAgentPrice(
    curASI,
    currentAgeInMonths
  ).staPrice;
  const wage = getWage();
  const difference = currentStaPrice - lastStaPrice;
  const differencePerWeek = Math.round(difference / ageDif);

  let extraMsg = "";

  if (differencePerWeek < 0) {
    extraMsg += "Your player is losing value. You could consider selling him.";
  } else if (differencePerWeek == 0) {
    extraMsg +=
      "Your player kept his value. You could consider selling him, if his wage is an issue.";
  } else {
    extraMsg += "Your player is gaining value";
    if (wage > differencePerWeek)
      extraMsg +=
        ", but not more than his wage. You could consider selling him.";
    if (wage === differencePerWeek) extraMsg += " that pays his wage.";
    if (wage < differencePerWeek)
      extraMsg +=
        " more than his wage, consider keeping him for a little longer.";
  }

  const message = `
  - Last price recorded: ${lastStaPrice.toLocaleString(
    "en"
  )} (${ageDif} week(s) ago)
  - Total Value Variation: ${difference.toLocaleString(
    "en"
  )} (${ageDif} week(s))
  - Week Value Variation: ${differencePerWeek.toLocaleString("en")}
  - Weekly Wage: ${wage.toLocaleString("en")}
  - Should I sell? ${extraMsg}`;

  const messageDiv = document.createElement("div");
  messageDiv.innerText = `
    ${differencePerWeek - wage > 0 ? "+" : ""}${(
    differencePerWeek - wage
  ).toLocaleString("en")}
    (Week Variation vs. Wage)`;
  messageDiv.style = "text-align: center; font-weight: bold; margin: 16px,0;";
  $("#transferbox").append(messageDiv);

  const messageP = document.createElement("p");
  messageP.innerText = message;
  messageP.style = "text-align: left";
  sisBtn.id = "sisCalculationsInfo";
  $("#transferbox").append(messageP);

  return 0;
}

const sisBtn = document.createElement("button");
sisBtn.textContent = "Calculate Value Variation";
sisBtn.id = "sisBtn";
sisBtn.class = "button button_border";
sisBtn.style =
  "width:168px; height:24px; padding: 1; color:white; background-color:#4A6C1F; cursor:pointer; border:1px solid #6c9922;";
sisBtn.addEventListener("click", function () {
  const sisCalculationsInfo = document.getElementById("sisCalculationsInfo");
  if (!sisCalculationsInfo) {
    const execute = main();
    if (execute != 0) {
      alert(execute);
    }
  } else {
    alert("Calculations already done!");
  }
});

$("#transferbox").append(sisBtn);
