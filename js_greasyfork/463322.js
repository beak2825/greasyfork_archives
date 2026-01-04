// ==UserScript==
// @name         漫画图片网站自动触发懒加载
// @namespace    http://tampermonkey/auto-scroll
// @version      1.0
// @author       ChatGpt
// @description  Automatically scroll down a webpage at a set interval and distance, with the option to pause and resume scrolling using a button
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463322/%E6%BC%AB%E7%94%BB%E5%9B%BE%E7%89%87%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E8%A7%A6%E5%8F%91%E6%87%92%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/463322/%E6%BC%AB%E7%94%BB%E5%9B%BE%E7%89%87%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E8%A7%A6%E5%8F%91%E6%87%92%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    // Default settings
    let time = 200; // Time in milliseconds
    let distance = 500; // Distance in pixels
    let scrollInterval = null; // Interval ID for scroll timer

    // Create a div for the button and input fields
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "50%";
    div.style.left = "0";
    div.style.width = "100px";
    div.style.transform = "translateY(-50%)";
    div.style.padding = "10px";
    div.style.zIndex = "9999";
    div.innerHTML = `
      <button id="autoScrollButton">Pause</button>
      <div>
        <label for="timeInput">Time (ms): </label>
        <input type="number" id="timeInput" value="${time}" style="width: 100%;">
      </div>
      <div>
        <label for="distanceInput">Distance (px): </label>
        <input type="number" id="distanceInput" value="${distance}" style="width: 100%;">
      </div>
    `;
    document.body.appendChild(div);

    // Get button and input elements
    const button = document.getElementById("autoScrollButton");
    const timeInput = document.getElementById("timeInput");
    const distanceInput = document.getElementById("distanceInput");

    // Function to scroll the page down by a certain distance
    const scrollPage = () => {
      window.scrollBy(0, distance);

      // If reached the bottom of the page, scroll back to top and stop scrolling
      if (window.innerHeight + window.pageYOffset + 10 >= document.body.offsetHeight) {
        clearInterval(scrollInterval);
        scrollInterval = null;
        window.scrollTo(0, 0);
        button.textContent = "Resume";
      }
    };

    // Function to start auto-scrolling
    const startScroll = () => {
      if (!scrollInterval) {
        time = Number(timeInput.value);
        distance = Number(distanceInput.value);
        scrollInterval = setInterval(scrollPage, time);
        button.textContent = "Pause";
      }
    };

    // Function to stop auto-scrolling
    const stopScroll = () => {
      clearInterval(scrollInterval);
      scrollInterval = null;
      button.textContent = "Resume";
    };

    // Add event listener to button
    button.addEventListener("click", () => {
      if (scrollInterval) {
        stopScroll();
      } else {
        startScroll();
      }
    });

    // Start auto-scrolling on page load
    startScroll();
})();
