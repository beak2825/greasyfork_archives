// ==UserScript==
// @name        Identify development environment
// @description Display an alert on your work environment for disambiguation
// @author      Deuchnord
// @version     1.0.0
// @namespace   https://deuchnord.fr/userscripts/#all_sites/identify-environment
// @match       http*://*/*
// @license     AGPL-3.0
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/527431/Identify%20development%20environment.user.js
// @updateURL https://update.greasyfork.org/scripts/527431/Identify%20development%20environment.meta.js
// ==/UserScript==

(function () {

  let ENVIRONMENTS = GM_getValue("environments", null);

  if (ENVIRONMENTS === null) {
    // set default value
    ENVIRONMENTS =  [{
      hostname: "example.com",
      name: "Production",
      background: "red",
      textColor: "white"
    }];

    GM_setValue("environments", ENVIRONMENTS);
  }

  let environment = null;

  for (let env of ENVIRONMENTS) {
    if (window.location.hostname !== env.hostname) {
      continue;
    }

    environment = env;
    break;
  }

  if (environment === null) {
    return;
  }

  let signal = document.createElement("aside");
  signal.setAttribute("aria-role", "status");
  signal.innerText = environment.name;
  signal.style.borderBottom = "2px solid black";
  signal.style.background = environment.background;
  signal.style.color = environment.textColor;
  signal.style.fontFamily = "sans-serif";
  signal.style.fontSize = "16px";
  signal.style.padding = "5px 15px";
  signal.style.position = "fixed";
  signal.style.left = 0;
  signal.style.right = 0;
  signal.style.top = 0;
  signal.style.zIndex = 10000000;
  signal.style.cursor = "default";
  signal.style.textAlign = "center";

  document.body.appendChild(signal);
  document.body.style.marginTop = "36px";

})();