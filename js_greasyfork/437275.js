// ==UserScript==
// @name        Paste Image Into tl;draw
// @namespace   Violentmonkey Scripts
// @match       https://www.tldraw.com/
// @grant       none
// @version     1.1
// @author      dutzi
// @license     MIT
// @description 12/19/2021, 11:52:14 AM
// @downloadURL https://update.greasyfork.org/scripts/437275/Paste%20Image%20Into%20tl%3Bdraw.user.js
// @updateURL https://update.greasyfork.org/scripts/437275/Paste%20Image%20Into%20tl%3Bdraw.meta.js
// ==/UserScript==

window.addEventListener("paste", (e) => {
  const file = e.clipboardData.items[0].getAsFile();
  const reader = new FileReader();

  reader.onloadend = function () {
    const src = reader.result;
    const img = document.createElement("img");
    img.src = src;
    document.querySelector("#home").appendChild(img);

    let size = 1;

    img.style.height = "90vh";
    img.style.width = "90vw";
    img.style.position = "absolute";
    img.style.zIndex = "-1";
    const bounds = img.getBoundingClientRect();
    img.style.left = window.innerWidth / 2 - bounds.width / 2 + "px";
    img.style.top = window.innerHeight / 2 - bounds.height / 2 + "px";
    img.style.objectFit = "contain";
    img.style.transformOrigin = "50% 50%";

    function handleKeyDown(e) {
      if (e.key === "-") {
        size *= 0.975;
        img.style.transform = `scale(${size})`;
      }

      if (e.key === "=") {
        size *= 1.025;
        img.style.transform = `scale(${size})`;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        img.remove();
        window.removeEventListener("keydown", handleKeyDown);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
  };
  reader.readAsDataURL(file);
});
