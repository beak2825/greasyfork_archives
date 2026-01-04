// ==UserScript==
// @name         Heritage Chinese Cheat
// @namespace    s_ambigious
// @version      69
// @license      MIT
// @description  Hacks including a activity skipper and other tools for Heritage Chinese.
// @author       @ambigious
// @match        *://*.heritagechinese.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heritagechinese.com
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/541132/Heritage%20Chinese%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/541132/Heritage%20Chinese%20Cheat.meta.js
// ==/UserScript==

window.addEventListener("load", () => {
  //  === UTILITIES ===
  const win = unsafeWindow; // access mlp chinese script functions
  const registerCommand = GM_registerMenuCommand;
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min); // both inclusive
  const vals = win.getTuleFromTemplateOrUrlParams(); // https://heritagechinese.com/static/common/activity_base.js

  //  === HACKS ===
  registerCommand("Skip Activity", () => {
    if (location.pathname.endsWith("game_runner.html")) {
      // register game score
      win.completeGame({
        stars: 3,
        time: parseInt(prompt("Enter time: (in seconds)") || random(68, 78)),
        score: parseInt(1),
        totalScore: parseInt(prompt("Enter score:") || random(195, 210))
      });
    }

    win.nextActivity();
  });

  registerCommand("Show next button", () => {
    window.document
      .querySelector("#next-btn")
      .style.display = "inline-block";

    const hint = window.document.querySelector("#hint");
    if (hint) hint.style.display = "none";
  });

  registerCommand("Bypass Character Check", () =>
    win.submitAnswer(
      document.querySelector("#answer").value,
      document.querySelector("#answer").value,
      confirm("Give print option?"),
      `${win.getUsername()}-answer-${vals.textbook}-${vals.unit}-${vals.lesson}-${vals.exercise}`
    )
  );

  registerCommand("Highlight Words", () =>
    window.document
      .querySelectorAll("vocab")
      .forEach(e => (e.classList.contains("found") ? null : (e.style.color = "red")))
  );

  registerCommand("Get Full Article", async () => {
    window.open().document.body.innerHTML = `
      <style>${await (await fetch("https://cdn.jsdelivr.net/npm/water.css@2/out/water.css")).text()}</style>
      <h1>Article Text</h1>
      <p>${
        JSON.parse(
          document.querySelector("#activity-data").value
        ).map(d => d.text)
        .join("")
        .replace(/\\n/g, "<br>") // add line breaks
        .replace(/\\(t|f|[0-9]+)/g, "") // remove special escape chars
        .replace(/(<br>){2,}/g, "<br>") // merge multiple line breaks
      }</p>
    `
  });
});