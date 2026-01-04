// ==UserScript==
// @name         Hustler Helper
// @namespace    xenon.hustler
// @version      0.1
// @description  try to take over the world
// @author       XeNON
// @match        https://www.torn.com/loader.php?sid=crimes
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/481141/Hustler%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/481141/Hustler%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  setInterval(() => {
    let totalAudience = 0;
    let attentions = [];
    let suspicions = [];
    const audience = document.getElementsByClassName(
      "audienceMemberWrapper___qyC3X"
    );
    if (!audience.length) return;
    console.log(`Found ${audience.length} audience members`);
    for (let i = 0; i < audience.length; i++) {
      try {
        const element = audience[i];
        const attention =
          element.getElementsByClassName("attention___eQaV5")[0];
        const suspicion =
          element.getElementsByClassName("suspicion___aopfO")[0];
        const attentionWidth = parseInt(attention.style.width.replace("%", ""));
        const suspicionWidth = parseInt(suspicion.style.width.replace("%", ""));
        totalAudience++;
        attentions.push(attentionWidth);
        suspicions.push(suspicionWidth);
      } catch (error) {
        console.log(`Hustler Helper Error: ${error}`);
      }
    }
    if (audience.length > 0) {
      try {
        const myDiv = document.getElementById("hustlerHelper");
        if (!myDiv) {
          const el = document.getElementsByClassName("audience___H5oBC")[0];
          const div = document.createElement("div");
          div.id = "hustlerHelper";
          div.style.fontFamily = "inherit";
          div.innerText = `Attentions: ${attentions.join(
            ", "
          )}\nSuspicions: ${suspicions.join(", ")}`;
          el.append(div);
        } else {
          myDiv.innerText = `Attentions: ${attentions.join(
            ", "
          )}\nSuspicions: ${suspicions.join(", ")}`;
        }
      } catch (error) {
        console.log(`Hustler Helper Error: ${error}`);
      }
    } else {
      const myDiv = document.getElementById("hustlerHelper");
      if (myDiv) myDiv.remove();
    }
  }, 1000);
})();