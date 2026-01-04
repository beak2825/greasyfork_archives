// ==UserScript==
// @name         EduArte Betere Cijferlijst
// @description  Verandert cijferlijst, fixt gemiddelde cijfers, voegt kleuren en extra opties toe
// @version      2.0
// @author       Ardyon
// @match        *://*.educus.nl/resultaten*
// icon          https://www.google.com/s2/favicons?sz=64&domain=educus.nl
// @namespace    Violentmonkey Scripts
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447574/EduArte%20Betere%20Cijferlijst.user.js
// @updateURL https://update.greasyfork.org/scripts/447574/EduArte%20Betere%20Cijferlijst.meta.js
// ==/UserScript==

const main = async () => {
  'use strict';

  const settings = loadSettings();
  const table = await waitFor(".result-overview--table");
  const courses = table.querySelectorAll("tr");

  addMenu(settings);
  courses.forEach((course) => {
    const grades = course.querySelectorAll(".result-overview--grades .result-overview--grade");
    const averageGrade = course.querySelector(".result-overview--grade.is-average");

    if(settings.fixAverages && averageGrade !== null) {
      fixAverages(grades, averageGrade);
    }

    if(settings.useCustomColours) {
      applyCustomColors(grades, averageGrade);
    }

    if(settings.compactMode) {
      applyCompactMode(course);
    }
  });
};

const fixAverages = (grades, averageGrade) => {
  let total = 0;
  let amountOfGrades = 0;

  grades.forEach((grade, i) => {
    if(grade.innerText === "VD") {
      return;
    }

    total += convertToNumber(grade.innerText);
    amountOfGrades++;
  });

  if(amountOfGrades === 0) {
    return;
  }

  averageGrade.querySelector("span").innerText = (total / amountOfGrades).toFixed(1).replace(".", ",");
};

const applyCustomColors = (grades, averageGrade) => {
  const red = "#d40000";
  const yellow = "#fd8e00";
  const green = "#0bca6a";
  const blue = "#4177ff";

  grades = [...grades, averageGrade];

  grades.forEach((grade) => {
    if(!grade) {
      return;
    }

    // Make new colours easier to see by making the background lighter
    grade.style.backgroundColor = "#eeeeee";

    const numericValue = convertToNumber(grade.innerText);

    // Change to new colours
    if(numericValue < 5.5) {
      if(grade.classList.contains("is-average")) {
        grade.style.backgroundColor = red;
      } else {
        grade.querySelector("span").style.color = red;
      }
    } else if(numericValue < 6) {
      if(grade.classList.contains("is-average")) {
        grade.style.backgroundColor = yellow;
      } else {
        grade.querySelector("span").style.color = yellow;
      }
    } else if(numericValue < 8 || grade.innerText === "VD") {
      if(grade.classList.contains("is-average")) {
        grade.style.backgroundColor = green;
      } else {
        grade.querySelector("span").style.color = green;
      }
    } else if(numericValue <= 10) {
      if(grade.classList.contains("is-average")) {
        grade.style.backgroundColor = blue;
      } else {
        grade.querySelector("span").style.color = blue;
      }
    }
  });
};

const applyCompactMode = (course) => {
  const style = document.createElement("style");

  style.innerHTML = `
      table.result-overview--table {
        width: 70%;
      }

      table.result-overview--table td {
        padding: 4px 15px;
      }

      .result-overview--course,
      .result-overview--grades {
        width: auto;
      }
  `;
  document.documentElement.append(style);

  // Remove spacer
  course.querySelector(".result--overview-structure").remove();
};

const addMenu = (settings) => {
  const headerRow = document.querySelector("div.filter.signal--filter");
  const menuHtml = `
      <div id="ebc-menu">
        <button id="ebc-menu-title">Cijferlijst Opties</button>

        <div id="ebc-menu-container">
          <p id="ebc-menu-container-title">Betere Cijferlijst</p>

          <table>
            <tr>
              <td><p>Gemiddelde fixen:</p></td>
              <td><button id="fixAverages">Aan</button></td>
            </tr>
            <tr>
              <td><p>Meer kleuren:</p></td>
              <td><button id="useCustomColours">Aan</button></td>
            </tr>
            <tr>
              <td><p>Compacte modus:</p></td>
              <td><button id="compactMode">Aan</button></td>
            </tr>
          </table>
        </div>
      </div>`;

  const menuCss = `
      #ebc-menu {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
      }

      #ebc-menu * {
        margin: 0;
        padding: 0;
        text-transform: none;
      }

      #ebc-menu-container {
        z-index: 100;
        display: none;
        flex-direction: column;
        position: absolute;
        top: 40px;
        left: 10px;
        padding: 10px;
        border: 2px solid black;
        border-radius: 10px;
        text-align: start;
        background-color: rgba(233, 234, 235);
      }

      #ebc-menu-container table {
        display: flex;
        flexDirection: row;
        align-items: center;
        margin-bottom: 10px;
      }

      #ebc-menu-container p,
      #ebc-menu-container tr,
      #ebc-menu-container td {
        margin-right: 10px;
        width: auto;
        background-color: rgba(0, 0, 0, 0);
      }

      #ebc-menu-container button {
        padding: 1px 3px;
        width: 40px;
      }

      #ebc-menu-title {
        width: 90%;
        padding: 2px 5px;
        text-align: center;
        user-select: none;
        cursor: pointer;
      }

      #ebc-menu-container-title {
        padding-bottom: 2px;
        margin-bottom: 10px;
        border-bottom: 1px solid black;
        text-align: center;
      }
  `;

  const styleElement = document.createElement("style");
  styleElement.innerHTML = menuCss;
  document.documentElement.append(styleElement);
  headerRow.style.display = "flex";
  headerRow.innerHTML = menuHtml + headerRow.innerHTML;

  const title = document.querySelector("#ebc-menu-title");
  const container = document.querySelector("#ebc-menu-container");
  const options = container.querySelectorAll("button");

  title.addEventListener("click", () => {
      if(getComputedStyle(container).display === "none") {
        container.style.display = "flex";
      } else {
        container.style.display = "none";
      }
    });

  options.forEach((button) => {
    button.innerText = settings[button.id] ? "Aan" : "Uit";

    button.addEventListener("click", () => {
      settings[button.id] = !settings[button.id];
      button.innerText = settings[button.id] ? "Aan" : "Uit";

      saveSettings(settings);
      location.reload();
    });
  });
};

const convertToNumber = (str) => {
  switch(str) {
    case "O": return 4;
    case "V": return 6;
    case "G": return 8;
    default: return parseFloat(str.replace(",", "."));
  }
};

const waitFor = (selector) => new Promise(resolve => {
  const delayInMillis = 10;
  const timeoutTimeInMillis = 10000;
  const startTime = Date.now();
  const f = () => {
      if(Date.now() - startTime >= timeoutTimeInMillis) {
        console.log("Interval Timeout");
        resolve(null);
        return;
      }

      const element = document.querySelector(selector);
      if (element != null) {
        resolve(element);
      } else {
        setTimeout(f, delayInMillis);
      }
  };
  f();
});

const loadSettings = () => {
  const ls = JSON.parse(window.localStorage.EBC ?? '{}');
  let settings = {
    "fixAverages": ls.fixAverages ?? true,
    "useCustomColours": ls.useCustomColours ?? true,
    "compactMode": ls.compactMode ?? false,
  };

  return settings;
};

const saveSettings = (settings) => {
  window.localStorage.EBC = JSON.stringify(settings);
};

main();