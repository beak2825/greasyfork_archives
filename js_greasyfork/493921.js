/**
 * TM Value Variation Calculator - a.k.a. SIS (Should I sell?)
 * version 0.0.1 BETA - CN
 */
 
// ==UserScript==
// @name         TM Value Variation Calculator CN
// @namespace    http://tampermonkey.net/
// @version      0.0.1.2024050211
// @description  比较代理商价格与工资，决定是否卖出球员。Trophymanager script: calculates and compares 'sell to agent' current and old values.
// @author       Erik (ABC FC 4402678); fix by 太原龙城
// @include      https://trophymanager.com/players/*
// @exclude      https://trophymanager.com/players/compare/*
// @exclude      https://trophymanager.com/players/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trophymanager.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/493921/TM%20Value%20Variation%20Calculator%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/493921/TM%20Value%20Variation%20Calculator%20CN.meta.js
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
    if (currentTr?.includes("岁")) {
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
    if (currentTr?.includes("技能评值")) {
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
    if (currentTr?.includes("工资")) {
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
      "没有足够的球员记录，本地记录为空！"
    );
    return "没有足够的球员记录，请确保R5脚本已安装，并且至少需要6周的球员数据。";
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
      "没有足够的球员记录，本地记录为空！"
    );
    return "没有足够的球员记录，请确保R5脚本已安装，并且至少需要6周以内的球员数据。";
  }
 
  const lastAgeRecorded = agesASI[agesASI.length - 1];
  const lastAgeRecordedInMonths =
    Number(lastAgeRecorded.split(".")[0]) * 12 +
    Number(lastAgeRecorded.split(".")[1]);
 
  const ageDif = currentAgeInMonths - lastAgeRecordedInMonths;
  if (ageDif > 8) {
    console.log("球员数据太旧！");
    return "球员数据太旧！";
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
    extraMsg += "此球员正在贬值，可以考虑卖出！";
  } else if (differencePerWeek == 0) {
    extraMsg +=
      "此球员的价值保持稳定。如果球队工资过高，可以考虑卖出！";
  } else {
    extraMsg += "此球员正在增值";
    if (wage > differencePerWeek)
      extraMsg +=
        ", 但是没有支付的工资高。可以考虑卖出。";
    if (wage === differencePerWeek) extraMsg += "，正好抵消的他工资。";
    if (wage < differencePerWeek)
      extraMsg +=
        "并且比支付的工资高。可以考虑留队一段时间。 ";
  }
 
  const message = `
  - 最近的价值记录：${lastStaPrice.toLocaleString(
    "en"
  )} (${ageDif} 周前)
  - 总价值的变化：${difference.toLocaleString(
    "en"
  )} (${ageDif} 周前)
  - 周价值的变化： ${differencePerWeek.toLocaleString("en")}
  - 周工资的支付：${wage.toLocaleString("en")}
  - 建议： ${extraMsg}`;
 
  const messageDiv = document.createElement("div");
  messageDiv.innerText = `
    ${differencePerWeek - wage > 0 ? "+" : ""}${(
    differencePerWeek - wage
  ).toLocaleString("en")}
    (本周价值变动 vs 工资)`;
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
sisBtn.textContent = "球员的代理商价值计算";
sisBtn.id = "sisBtn";
sisBtn.class = "button_border";
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
    alert("计算完成！");
  }
});
 
$("#transferbox").append(sisBtn);