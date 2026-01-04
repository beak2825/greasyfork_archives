
// ==UserScript==
// @name         EH – SearchNav Click UI
// @namespace    fabulous.cupcake.jp.net
// @version      2022.11.05.1
// @description  Make SearchNav more mouse-friendly; also easier method to search by date
// @author       FabulousCupcake (the one who made it), JoGaTo (the uploader)
// @license      MIT
// @runat        document-start
// @include      /https?:\/\/(e-|ex)hentai\.org\/.*/
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/454311/EH%20%E2%80%93%20SearchNav%20Click%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/454311/EH%20%E2%80%93%20SearchNav%20Click%20UI.meta.js
// ==/UserScript==

const stylesheet = `
#ujumpbox {
  position: relative;
}
#ujumpbox .preset-inputs {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0.5em;
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
}
#ujumpbox .row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
#ujumpbox .preset-inputs input {
  width: 33px;
}
/* Date Input Width Fix */
.jumpbox { width: auto !important; }
`;

const hasSearchNav = () => {
  return !!document.querySelector(".searchnav");
}

const addStylesheet = () => {
  const stylesheetEl = document.createElement("style");
  stylesheetEl.innerHTML = stylesheet;
  document.body.appendChild(stylesheetEl);
}

const addElements = () => {
  const hook = document.querySelector("#ujumpbox");
  const el = `
<div class="preset-inputs stuffbox">
  <div class="row" style="margin-bottom: 0.25em;">
    <button class="date-input">Use Date Input</button>
  </div>
  <div class="row">
    <input type="button" value="1d"/>
    <input type="button" value="3d"/>
    <input type="button" value="1w"/>
    <input type="button" value="2w"/>
  </div>
  <div class="row">
    <input type="button" value="1m"/>
    <input type="button" value="6m"/>
    <input type="button" value="1y"/>
    <input type="button" value="2y"/>
  </div>
</div>
`;
  
  hook.insertAdjacentHTML("beforeend", el);
}

const addEventListeners = () => {
  // Preset Button Events
  const presetInputButtons = document.querySelectorAll("#ujumpbox .preset-inputs input");
  const handler = e => {
    const mainInput = document.querySelector("#ujump");
    const value = e.target.getAttribute("value");

    mainInput.value = value;
    mainInput.dispatchEvent(new Event('change'));
  }

  Array.from(presetInputButtons).forEach(el => el.addEventListener("click", handler));

  // Date Input Event
  const dateButton = document.querySelector("#ujumpbox .date-input");
  dateButton.addEventListener("click", () => {
    const mainInput = document.querySelector("#ujump");
    mainInput.setAttribute("type", "date");

    // Disable preset inputs
    Array.from(presetInputButtons).forEach(el => el.setAttribute("disabled", ""));
  });
}

const addSearchJumpButtonCallback = callbackFn => {
  const origFn = unsafeWindow.enable_jump_mode;
  unsafeWindow.enable_jump_mode = function() {
    origFn.apply(this, arguments);
    callbackFn();
  }
}

const main = () => {
  if (!hasSearchNav()) return;
  addStylesheet();

  addSearchJumpButtonCallback(() => {
    addElements();
    addEventListeners();
  });
}

main();


