// ==UserScript==
// @name                ЧАСЫ
// @namespace           Violentmonkey Scripts
// @match               http*://*/*
// @grant               none
// @version             2.5.0
// @author              DELFION + ChatGPT
// @license             MIT
// @run-at              document-start
// @description Показывает текущее время и день недели на странице
// @downloadURL https://update.greasyfork.org/scripts/527014/%D0%A7%D0%90%D0%A1%D0%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/527014/%D0%A7%D0%90%D0%A1%D0%AB.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const createTimeDisplay = () => {
    const timeElement = document.createElement("div");
    timeElement.classList.add("time-display");

    const timeLine = document.createElement("div");
    const dateLine = document.createElement("div");
    dateLine.classList.add("date-line");

    const hoursSpan = document.createElement("span");
    const minutesSpan = document.createElement("span");
    const dayOfWeekSpan = document.createElement("span");
    const dateSpan = document.createElement("span");

    timeLine.append(hoursSpan, ":", minutesSpan, ", ", dayOfWeekSpan);
    dateLine.append(dateSpan);

    timeElement.append(timeLine, dateLine);

    const style = createStyle();
    document.head.appendChild(style);

    return {
      element: timeElement,
      hours: hoursSpan,
      minutes: minutesSpan,
      dayOfWeek: dayOfWeekSpan,
      date: dateSpan
    };
  };

  const createStyle = () => {
    const style = document.createElement("style");
    style.textContent = `
      .time-display {
        position: fixed;
        top: 77px;
        right: 7px;
        padding: 8px;
        font-size: 24px;
        font-weight: bold;
        z-index: 2147483647;
        pointer-events: none;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        background: rgba(245, 245, 245, 0.7);
        box-shadow: 0 0 6px rgba(0,0,0,0.1);
        transition: background 1s ease, color 1s ease, text-shadow 1s ease;
        max-width: 180px;
      }
      .time-display span {
        transition: color 1s ease;
      }
      .date-line {
        font-size: 12px;
        margin-top: 2px;
        text-align: right;
      }
      .morning-theme {
        background: rgba(255, 250, 240, 0.7);
        text-shadow: 1px 1px 1px white;
      }
      .day-theme {
        background: rgba(245, 245, 255, 0.6);
        text-shadow: 1px 1px 2px white;
      }
      .evening-theme {
        background: rgba(255, 239, 200, 0.6);
        text-shadow: 1px 1px 2px #553300;
      }
      .night-theme {
        background: rgba(10, 10, 10, 0.7);
        text-shadow: 0 0 6px rgba(255, 180, 100, 0.9);
      }
    `;
    return style;
  };

  const updateDisplayTime = (display) => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const hoursStr = hour.toString().padStart(2, "0");
    const dayOfWeek = new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(now);

    const day = now.getDate().toString().padStart(2, "0");
    const month = new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(now);
    const year = now.getFullYear().toString().slice(-2);

    const formattedDate = `${day}=${month.charAt(0).toUpperCase() + month.slice(1)}=${year}`;

    const color = getColorForPeriod(hour);

    display.hours.textContent = hoursStr;
    display.minutes.textContent = minutes;
    display.dayOfWeek.textContent = dayOfWeek;
    display.date.textContent = formattedDate;

    display.hours.style.color = color;
    display.minutes.style.color = color;
    display.dayOfWeek.style.color = color;
    display.date.style.color = color;

    updateTheme(display.element, hour);
  };

  const getColorForPeriod = (hour) => {
    let r, g, b;
    if (hour >= 5 && hour < 9) {
      r = 250 - Math.floor(Math.random() * 30);
      g = 200 + Math.floor(Math.random() * 30);
      b = 170 + Math.floor(Math.random() * 30);
    } else if (hour >= 9 && hour < 17) {
      r = Math.floor(Math.random() * 80);
      g = Math.floor(Math.random() * 100);
      b = 150 + Math.floor(Math.random() * 105);
    } else if (hour >= 17 && hour < 21) {
      r = 200 + Math.floor(Math.random() * 55);
      g = 120 + Math.floor(Math.random() * 70);
      b = Math.floor(Math.random() * 60);
    } else {
      r = 255;
      g = 180 + Math.floor(Math.random() * 50);
      b = 100 + Math.floor(Math.random() * 60);
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  const updateTheme = (element, hour) => {
    element.classList.remove("morning-theme", "day-theme", "evening-theme", "night-theme");
    if (hour >= 5 && hour < 9) element.classList.add("morning-theme");
    else if (hour >= 9 && hour < 17) element.classList.add("day-theme");
    else if (hour >= 17 && hour < 21) element.classList.add("evening-theme");
    else element.classList.add("night-theme");
  };

  const display = createTimeDisplay();
  document.documentElement.appendChild(display.element);

  const tryMoveToBody = () => {
    if (document.body && !document.body.contains(display.element)) {
      document.body.appendChild(display.element);
    } else {
      requestAnimationFrame(tryMoveToBody);
    }
  };
  tryMoveToBody();

  updateDisplayTime(display);
  setInterval(() => updateDisplayTime(display), 5000);

})();
