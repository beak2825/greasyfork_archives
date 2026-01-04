// ==UserScript==
// @name         Attack Refresh Button
// @namespace    https://www.torn.com/
// @version      1.0.0
// @description  Refresh button when target is in the hospital.
// @author       PhilMe
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461591/Attack%20Refresh%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/461591/Attack%20Refresh%20Button.meta.js
// ==/UserScript==

function createRefreshButton(dialog) {
  console.log(dialog);
  let title = dialog.querySelector("div[class*='title_']");
  if (
    title.innerHTML.includes(
      "This person is currently in hospital and cannot be attacked"
    )
  ) {
    let dialogButtons = dialog.querySelector("div[class*='dialogButtons_']");
    let refreshButton = document.createElement("button");
    refreshButton.setAttribute("class", "torn-btn undefined silver");
    refreshButton.innerHTML = "Refresh page";
    refreshButton.onclick = function () {
      //location.reload();
      location.href = location.href;
    };
    dialogButtons.appendChild(refreshButton);
    title.innerHTML = "";
  }
}

const observer = new MutationObserver((mutations, mutationInstance) => {
  const dialog = document.querySelector(
    "div[class*='defender_'] div div[class*='colored_']"
  );
  if (dialog) {
    if (dialog.className.includes(" red_")) {
      createRefreshButton(dialog);
      mutationInstance.disconnect();
    }
  }
});

observer.observe(document, { childList: true, subtree: true });