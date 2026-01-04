// ==UserScript==
// @name         King Gizzard Heardle Time Changer
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Adds some buttons to change the time.
// @author       Swishilicious
// @match        https://king-gizz-heardle.glitch.me/
// @icon         http://clipart-library.com/img1/1514134.jpg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463873/King%20Gizzard%20Heardle%20Time%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/463873/King%20Gizzard%20Heardle%20Time%20Changer.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const dateOffset = localStorage.getItem("dateOffset") ?? 0;
  console.log(dateOffset);

  ((OriginalDate) => Date = class extends OriginalDate {
    constructor(...args) {
      if (!args[0]) {
        // increment via 24 hours (fuck daylight savings)
        return super(new OriginalDate().getTime() + dateOffset * 86400000);
      }

      return super(...args);
    }
  })(Date);

  const createButton = (text, action, color) => {
    return Object.assign(document.createElement("button"), {
      id: text.split(" ")[0].toLowerCase(),
      innerText: text,
      onclick: action,
      style: Object.entries({
        "background-color": color,
        "border-radius": "5px",
        "border": "medium none",
        "color": "white",
        "cursor": "pointer",
        "font-size": "1rem",
        "font-weight": "800",
        "padding": "12.5px 20px",
        "width": "max-content",
      }).reduce((acc, cur) => `${acc}${cur[0]}: ${cur[1]}; `, "")
    });
  };

  const offsetDate = (offset) => () => {
    localStorage.setItem("dateOffset", +dateOffset + offset);
    location.reload();
  };

  void async function onLoad() {
    // cba to implement a proper webpage init waiter
    while (!document.querySelectorAll("button").length) {
      await new Promise(res => setTimeout(res, 100));
    }

    const firstButton = document.querySelector("button");
    const nextButton = createButton("Next Heardle", offsetDate(1), "rgb(77, 116, 187)");
    const lastButton = createButton("Last Heardle", offsetDate(-1), "rgb(187, 77, 77)");

    const heading = document.querySelector("h1");
    if (heading.innerText.length <= 20) {
      heading.innerText += ` ${new Date().toLocaleDateString()}`;
    }

    switch (document.querySelectorAll("button").length) {
      /* Failure Page */
      case 0: {
        const container = document.createElement("div");
        container.style = "display: flex; justify-content: space-between; gap: 36px;";

        document.querySelector("h4").before(container);

        container.appendChild(lastButton);
        container.appendChild(nextButton);

        break;
      }

      /* Results Page */
      case 1: {
        const container = document.createElement("div");
        container.style = "display: flex; justify-content: space-between; gap: 36px;";

        // Move button into container
        firstButton.after(container);
        container.appendChild(firstButton);

        firstButton.after(nextButton);
        firstButton.before(lastButton);

        break;
      }

      /* Guessing Page */
      case 2: {
        firstButton.after(lastButton, nextButton);

        // Pressing the "Submit" button doesn't reload to the page so this is a bandaid fix
        const submitButton = firstButton.parentElement.lastElementChild;
        ((original) => submitButton.onclick = function (...args) {
          original.apply(this, args);
          setTimeout(onLoad, 1000);
        })(submitButton.onclick);
      }
    }
  }();
}());