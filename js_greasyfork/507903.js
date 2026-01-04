// ==UserScript==
// @name         Anime Time Details
// @icon         https://www.google.com/s2/favicons?domain=shikimori.me
// @namespace    https://shikimori.one
// @version      1.1
// @description  Показывает продолжительность франшизы и аниме
// @author       LifeH
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507903/Anime%20Time%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/507903/Anime%20Time%20Details.meta.js
// ==/UserScript==
(function () {
  "use strict";

  function page() {
    return window.location.href.includes("/achievements/franchise/");
  }

  function аnimPage() {
    return window.location.href.includes("/animes/");
  }

  let time = 0;
  let watchTime = 0;
  let types = {};

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
async function details(animeUrl, isWatched) {
  try {
      const animeIdMatch = animeUrl.match(/\/animes\/[a-z]?(\d+)/);
      if (!animeIdMatch) return;

      const animeId = animeIdMatch[1];
      const apiUrl = `https://shikimori.one/api/animes/${animeId}`;

      const response = await fetch(apiUrl);
      const animeData = await response.json();

      let episodes = animeData.episodes ? animeData.episodes : "1";
      const duration = animeData.duration ? animeData.duration : "Неизвестно";
      const animeType = animeData.kind ? formatTypes(animeData.kind) : "Неизвестно";

      if (animeType === "Фильм") {
          episodes = 1;
      }

      if (types[animeType]) {
          types[animeType]++;
      } else {
          types[animeType] = 1;
      }

      const durationM = parseDur(`${duration} мин`);
      if (durationM && episodes !== "Неизвестно") {
          const totalTime = parseInt(episodes) * durationM;
          time += totalTime;

          if (isWatched) {
              watchTime += totalTime;
          }
      }

      updateInfo();
  } catch (error) {
    //console.error(error);
  }
}


  async function аnimDetails() {
    try {
      const typeElement = elementFinder(document, "Тип");
      const episodesElement = elementFinder(document, "Эпизоды");
      const durationElement = elementFinder(document, "Длительность эпизода");

      if (!episodesElement || episodesElement.textContent.trim() === "") {
        return;
      }

      let episodes = episodesElement.textContent.trim();
      const duration = durationElement? durationElement.textContent.trim(): "Неизвестно";

      const duratonM = parseDur(duration);
      if (duratonM && episodes !== "Неизвестно") {
        const totalTime = parseInt(episodes) * duratonM;

        if (!document.querySelector(".time-block")) {
          const timeBlock = document.createElement("div");
          timeBlock.classList.add("line", "time-block");
          timeBlock.innerHTML = `
                    <div class="key">Время просмотра:</div>
                    <div class="value"><span>${formatTime(
                      totalTime
                    )}</span></div>
                `;

          if (durationElement && durationElement.parentNode) {
            durationElement.parentNode.parentNode.appendChild(timeBlock);
          }
        }
      }
    } catch (error) {
    //   console.error(error);
    }
  }

  function elementFinder(doc, keyText) {
    const lines = doc.querySelectorAll(".b-entry-info .line-container .line");
    for (let line of lines) {
      const key = line.querySelector(".key");
      if (key && key.textContent.includes(keyText)) {
        return line.querySelector(".value");
      }
    }
    return null;
  }

  function animeUrls(articleElement) {
    const linkElement = articleElement.querySelector("a.cover");
    if (linkElement) {
      const relativeUrl = linkElement.getAttribute("href");
      return relativeUrl.startsWith("http")
        ? relativeUrl
        : `https://shikimori.one${relativeUrl}`;
    }
    return null;
  }

  function isCompleted(articleElement) {
    return articleElement.classList.contains("completed");
  }

  function parseDur(durationText) {
    const hoursMatch = /(\d+)\s*час/.exec(durationText);
    const minsMatch = /(\d+)\s*мин/.exec(durationText);

    return (hoursMatch ? parseInt(hoursMatch[1]) * 60 : 0) +
           (minsMatch ? parseInt(minsMatch[1]) : 0);
  }

function rotEbal(number, one, two, five) {
  const n1 = Math.abs(number) % 10;
  if (number > 10 && number < 20) return five;
  if (n1 > 1 && n1 < 5) return two;
  if (n1 === 1) return one;
  return five;
}
  function formatTime(totalMins, zero = false) {
    const days = Math.floor(totalMins / (24 * 60));
    const hours = Math.floor((totalMins % (24 * 60)) / 60);
    const mins = totalMins % 60;

    const dayText = rotEbal(days, "день", "дня", "дней");
    const hourText = rotEbal(hours, "час", "часа", "часов");
    const minsText = rotEbal(mins, "минута", "минуты", "минут");

    if (zero) {
      return `${days} ${dayText}, ${hours} ${hourText}, ${mins} ${minsText}`;
    } else {
      let result = "";
      if (days > 0) result += `${days} ${dayText}, `;
      if (hours > 0 || days > 0) result += `${hours} ${hourText}, `;
      result += `${mins} ${minsText}`;
      return result.trim();
    }
  }

  function createInfBlock() {
    if (document.getElementById("info-block")) {
      return;
    }

    const header = document.querySelector(".head.misc");
    const infoBlock = document.createElement("div");
    infoBlock.id = "info-block";
    infoBlock.style.padding = "20px";
    infoBlock.style.backgroundColor = "#f0f0f0";
    infoBlock.style.border = "1px solid #ccc";
    infoBlock.style.marginTop = "10px";

    const status = document.createElement("div");
    status.id = "status";
    status.textContent = "Обработка...";
    status.style.fontWeight = "bold";
    status.style.marginBottom = "10px";
    infoBlock.appendChild(status);

    header.appendChild(infoBlock);
    return infoBlock;
  }

function formatTypes(kind) {
  const form = {
      "tv": "TV Сериал",
      "tv_special": " TV Спецвыпуск",
      "movie": "Фильм",
      "ova": "OVA",
      "ona": "ONA",
      "special": "Спецвыпуск",
  };

  return form[kind] || "Неизвестно";
}

function updateInfo() {
  const infoBlock = document.getElementById("info-block");
  const remainingTime = time - watchTime;

  infoBlock.innerHTML = `
    <div id="status">Обработка...</div>
    <h3>Информация</h3>
    <p>Общее время просмотра: ${formatTime(time, true)}</p>
    <p>Осталось смотреть: ${formatTime(remainingTime, true)}</p>
    <h4>Количество типов:</h4>
    <ul>
        ${Object.entries(types)
          .map(([type, count]) => `<li>${type}: ${count}</li>`)
          .join("")}
    </ul>
`;
}
  function done() {
    const status = document.getElementById("status");
    status.textContent = "Обработано";
    status.style.color = "green";
  }

  async function processAnimes() {
    time = 0;
    watchTime = 0;
    types = {};

    const animeList = document.querySelectorAll(".b-catalog_entry");

    for (const article of animeList) {
      const animeUrl = animeUrls(article);
      const isWatched = isCompleted(article);
      if (animeUrl) {
        await details(animeUrl, isWatched);
        await delay(80);
      }
    }

    updateInfo();
    done();
  }

  async function main() {
    if (page()) {
      createInfBlock();
      await processAnimes();
    } else if (аnimPage()) {
      await аnimDetails();
    }
  }

  function ready(fn) {
    document.addEventListener("page:load", fn);
    document.addEventListener("turbolinks:load", fn);
    if (document.attachEvent? document.readyState === "complete": document.readyState !== "loading")
        {
            fn();
        }
    else {
        document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {main();});
})();
