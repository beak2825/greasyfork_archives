// ==UserScript==
// @name        蜜柑计划快速切换季度
// @namespace   Violentmonkey Scripts
// @match       https://mikanani.me/
// @grant       none
// @version     1.0
// @license MIT
// @description 2023/12/13 23:34:39
// @downloadURL https://update.greasyfork.org/scripts/482131/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E5%AD%A3%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/482131/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E5%AD%A3%E5%BA%A6.meta.js
// ==/UserScript==

var prevBtn = createButton("上一季", "fixed", "10px", "80px");
var nextBtn = createButton("下一季", "fixed", "10px", "10px");

document.body.appendChild(prevBtn);
document.body.appendChild(nextBtn);

prevBtn.addEventListener("click", function() {
  updateSeason(getLast());
});

nextBtn.addEventListener("click", function() {
  updateSeason(getNext());
});

function createButton(text, position, bottom, right) {
  var button = document.createElement("button");
  button.textContent = text;
  button.style.position = "fixed";
  button.style.bottom = bottom;
  button.style.right = right;
  return button;
}

function getNow() {
  var nowInfo = document.querySelector("#sk-data-nav > div > ul.navbar-nav.date-select > li > div > div.sk-col.date-text").textContent.trim();
  return extractYearAndSeason(nowInfo);
}
function getNext() {
  var current = getNow();
  var order = ['冬', '春', '夏', '秋'];
  var index = order.indexOf(current.season);
  return (index !== order.length - 1) ? { year: current.year, season: order[index + 1] } : { year: parseInt(current.year, 10) + 1, season: order[0] };
}
function getLast() {
  var current = getNow();
  var order = ['冬', '春', '夏', '秋'];
  var index = order.indexOf(current.season);
  return (index !== 0) ? { year: current.year, season: order[index - 1] } : { year: parseInt(current.year, 10) - 1, season: order[order.length - 1] };
}

function extractYearAndSeason(inputString) {
  var match = inputString.match(/(\d{4})\s*([春夏秋冬]+)/);
  return match ? { year: match[1], season: match[2] } : null;
}

function updateSeason(result) {
  var element = document.createElement("div");
  element.setAttribute("data-year", result.year);
  element.setAttribute("data-season", result.season);
  UpdateBangumiCoverFlow(element, true);
}
