// ==UserScript==
// @name         Shop by interest helper
// @version      0.1.0
// @description  corolho
// @author       lucassilvas1
// @match        https://task.taskassembly.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// jshint        esversion: 8
// @namespace https://greasyfork.org/users/846945
// @downloadURL https://update.greasyfork.org/scripts/455325/Shop%20by%20interest%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/455325/Shop%20by%20interest%20helper.meta.js
// ==/UserScript==

function check() {
  return new Promise((res, rej) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const shadow = document.getElementsByTagName("crowd-classifier")[0];
      if (shadow?.header) {
        clearInterval(interval);
        res(shadow);
      } else if (Date.now() - start > 60000) {
        clearInterval(interval);
        rej();
      }
    },300);
  });
}

check()
  .then((shadow) => {
    // const shadow = document.getElementsByTagName("crowd-classifier")?.[0];
    if (
      !shadow?.header?.startsWith("Is the below item relevant to the mentioned")
    )
      return;

    const choices = JSON.parse(GM_getValue("choices", null)) || {};

    const category = shadow.querySelector("classification-target").childNodes[1]
      .childNodes[0].childNodes[1].textContent;
    const imgSrc = shadow.querySelector("classification-target").childNodes[1]
      .childNodes[2].childNodes[0].src;
    const title = shadow.querySelector("classification-target").childNodes[1]
      .childNodes[2].childNodes[2].textContent;
    const id = category + "_" + imgSrc + "_" + title;

    const choice = choices[id];
    console.log(choices, category, imgSrc, title);

    function choose() {
      if (!choice) return;
      const button = shadow.shadowRoot.querySelector(
        "button[data-testid='" + choice + "']"
      );
      button.click();
      button.setAttribute("style", "background-color:darkgreen !important");
    }

    function main() {
      choose();

      const buttons = shadow.shadowRoot.querySelectorAll("button[data-testid]");

      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (!m.target.classList.contains("selected")) continue;
          choices[id] = m.target.dataset.testid;
          GM_setValue("choices", JSON.stringify(choices));
        }
      });

      buttons.forEach((b) =>
        observer.observe(b, { attributes: true, attributeFilter: ["class"] })
      );
    }

    main();
  })
  .catch();
