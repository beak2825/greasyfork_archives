// ==UserScript==
// @name         Reddit Desmos Viewer
// @version      1.1
// @description  Inline graphs for desmos on reddit
// @author       You
// @match        https://www.reddit.com/*
// @grant        none
// @namespace https://greasyfork.org/users/299403
// @downloadURL https://update.greasyfork.org/scripts/396606/Reddit%20Desmos%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/396606/Reddit%20Desmos%20Viewer.meta.js
// ==/UserScript==

document.querySelectorAll(".thing.link").forEach(i => {
  const target = new URL(i.querySelector("a").href);
  if (
    target.hostname == "www.desmos.com" &&
    target.pathname.match(/^\/calculator\/[a-z0-9]{10}/)
  ) {
    const show = document.createElement("button");
    show.textContent = "Show Graph";
    let hider;
    let visible = false;
    const newel = document.createElement("iframe");
    newel.classList.add("graph");
    newel.style.width = "500px";
    newel.style.height = "400px";
    newel.style.borderRadius = "20px";
    newel.style.border = 0;
    newel.style.boxShadow = "0 2px 5px #0003";
    newel.style.background =
      "url(https://upload.wikimedia.org/wikipedia/commons/a/a0/Desmos_logo.svg) center / auto 25px, #fff";
    newel.style.backgroundRepeat = "no-repeat";
    newel.style.display = "none";
    newel.style.margin = "15px";
    newel.src = `about:blank`;
    i.querySelector(".entry").appendChild(show);
    i.querySelector(".entry").appendChild(newel);
    show.onclick = () =>
      requestAnimationFrame(() => {
        if (visible) {
          show.textContent = "Show Graph";
          newel.style.display = "none";
          hider = setTimeout(() => (newel.src = "about:blank"), 10000);
        } else {
          show.textContent = "Hide Graph";
          newel.style.display = "block";
          clearTimeout(hider);
          if (newel.src == "about:blank") newel.src = `${target.href}?embed`;
        }
        visible = !visible;
      });
  }
});
