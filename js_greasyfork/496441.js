// ==UserScript==
// @name            Stop Bilibili Auto Play (invalid)
// @namespace       SBAP
// @license         MPL-2.0
// @version         1.2.1-20250418
// @description     Turn off Bilibili automatic Play.
// @description:zh  关闭 Bilibili 自动连播。
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAGuSURBVFhH7VZNLwRBEJ0TB44kxH/AwUH8A/6Ao7+EMwlB4uO22JOLxG/YtYuRyOIkVoRYa6b06+jRU8r2rkzP7MFLatKpqn7vzUwnXQEVjP4x0IpiWq480MxRSEM75xRsVjINcIIbGtAy0AYaL22aKoXiRh8xfRhqTW3g7SOmydKV2Ogz8MLQDlbUJ5Ea8gitPVu+TiUXTm6Sz5Ml7l/bmtvW0trD7MCh0RfuFLetNbBVpcBOIHyD6/0b6H8Dx41nmjio09h+Xa9dcPVzPacBEJnauFq74Oo3tSR4gsNV53D183r/G8BnNLVufoGr39SS4AmOsjpIIEJg7YKrn+s5DWQNrle8gcFtdSFYCVwYviBeRvw6nldXpg8T4AS3raW1V6vFDSRaG2NRnvOgCcyFGE6ToRQJqdFHpIZS/VSAG8xo+C98SsoiwAluaPwYyyU0WxHNsQOKQO7pPfrq+kav/QaiATj8C1knE/Zb2xANrF08iiSdxA3QI5lYV5wSRAMbl83U5m7FDSQT4JQgGmjHMS2d3dLIbo0WTxs9iRtgD/aO7tU0Fzgl/HoI8wHRJ18MTgtfdrMcAAAAAElFTkSuQmCC

// @grant           none
// @run-at          document-idle
// @sandbox         DOM
// @noframes
// @match           https://www.bilibili.com/video/**

// @source          https://gist.github.com/uiolee/729b0f0e791b7f57eda3be76a2b7eee5
// @author          Uiolee
// @homepage        https://github.com/uiolee

// @downloadURL https://update.greasyfork.org/scripts/496441/Stop%20Bilibili%20Auto%20Play%20%28invalid%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496441/Stop%20Bilibili%20Auto%20Play%20%28invalid%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const NAME = "[SB]:";
  const VERSION = "7";

  console.debug(NAME, VERSION, "start");

  const nextTxt = document.querySelector(".next-button .txt");
  const swtBtn = document.querySelector(".next-button .switch-button");

  const main = () => {
    if (swtBtn.classList.contains("on")) {
      swtBtn.click();
//       swtBtn.classList.remove("on");
      console.debug(NAME, "turn off auto-play");
    }
    nextTxt.textContent = "Stop Bilibili";
    console.debug(NAME, "do");
  };

  try {
    console.debug(NAME, "inject");
    setTimeout(() => {
      main();
    }, 1 * 1000);
    setTimeout(() => {
      main();
    }, 5 * 1000);
    setTimeout(() => {
      main();
    }, 15 * 1000);
    setInterval(() => {
      main();
    }, 60 * 1000);
  } catch (err) {
    alert([NAME, err].join("\n"));
    console.trace(NAME, err);
    throw err;
  } finally {
    console.debug(NAME, "end");
  }
})();
