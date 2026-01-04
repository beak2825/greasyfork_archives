// ==UserScript==
// @name       Youtube Funny Country Codes
// @name:ru    Youtube Веселый Коды Стран
// @author     KN13KOMETA
// @version    1.0.0
// @namespace  https://violentmonkey.github.io

// @description       Changes Youtube Country Codes that appears near Youtube logo to random junk
// @description:ru    Изменяет коды стран Youtube, которые появляются рядом с логотипом Youtube, на случайный мусор

// @supportURL  https://discord.gg/d4rKqZs
// @homepageURL https://discord.gg/d4rKqZs

// @match  https://www.youtube.com/*
// @run-at document-end
// @inject-into page

// @license UNLICENSE
// @downloadURL https://update.greasyfork.org/scripts/546683/Youtube%20Funny%20Country%20Codes.user.js
// @updateURL https://update.greasyfork.org/scripts/546683/Youtube%20Funny%20Country%20Codes.meta.js
// ==/UserScript==

const countryCodes = [
  "AMONGOS",
  "AMOGUS",
  "SUS",

  "ASS",
  "BUTT",
  "COCK",
  "CUM",
  "SEX",
  "SEGS",
  "ULTRASEX",
  "SAY GEX",
  "SESBIAN LEX",

  "TRAP",
  "FEMBOY",
  "FELIX",
  "ASTOLFO",
  "BOY KISSER",
  "BOY PUSSY",

  "FEETS",

  "NYA",
  "KEK",
  "JOJ",
  "YAY",
  "LMFAO",

  "USER666",
];

console.log("Youtube Funny Country Codes loaded");

document.getElementById("country-code").innerText = ` ${countryCodes[Math.floor(Math.random() * countryCodes.length)]} `;