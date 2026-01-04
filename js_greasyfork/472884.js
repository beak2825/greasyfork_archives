// ==UserScript==
// @name         Gold stop loss clicker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  converts to stop loss and auto selects Contract size for hankotrade
// @author       You
// @match        https://www.cashbackforex.com/tools/position-size-calculator/XAUUSD
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cashbackforex.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472884/Gold%20stop%20loss%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/472884/Gold%20stop%20loss%20clicker.meta.js
// ==/UserScript==

(function() {
     console.log("Running script for SP500")

const MouseEnterEvent = (mousevent) => {
  return new MouseEvent(mousevent, {
    view: window,
    bubbles: true,
    cancelable: true,
  });
};

const main = () => {
  //simulate mouse hover entering stop loss price label
  document
    .querySelector(
      '#psc-widget-top-pane > div > div > div:nth-child(4) > div:nth-child(1) > label'
    )
    .dispatchEvent(MouseEnterEvent('mouseover'));

  //Clicking Switch to stop loss pips
  document.querySelector('#psc-stop-loss-popover-link').click();

  //Simulate mouse hover leaving stop loss price label
  document
    .querySelector(
      '#psc-widget-top-pane > div > div > div:nth-child(4) > div:nth-child(1) > label'
    )
    .dispatchEvent(MouseEnterEvent('mouseout'));

  //Click "Calculate lot size in MT4/MT5?"
  document.querySelector('#psc-contract-size-link').click();

  //Set contract size (units per lot to )
  document.querySelector('#pscContractSize').value = 10;

  //Click calculate
  document.querySelector("#psc-calculate-button").click();
};

setTimeout(main, 2000);
})();