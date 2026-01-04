// ==UserScript==
// @name         Inquest - Quick Attack
// @description  Shows a visual red attack square on user list
// @version      0.0.1
// @author       Fruity [2259700] | Francois Robbertze
// @namespace    https://greasyfork.org/en/users/1156949
// @copyright    none
// @license      MIT
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514444/Inquest%20-%20Quick%20Attack.user.js
// @updateURL https://update.greasyfork.org/scripts/514444/Inquest%20-%20Quick%20Attack.meta.js
// ==/UserScript==

(function () {
  "use strict";

  setInterval(() => {
    const list = document.getElementsByClassName("user-info-list-wrap")[0];
    if (!list) return;

    for (const child of list.children) {
      if (child.getAttribute("read")) continue;

      const userId = child.className.split("user")?.[1];
      if (!userId) continue;

      const hyperlink = document.createElement("a");
      hyperlink.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`;
      hyperlink.text = "Attack";

      hyperlink.style.position = "absolute";
      hyperlink.style.background = "#b3382c";
      hyperlink.style.height = "100%";
      hyperlink.style.width = "4rem";
      hyperlink.style.right = "0";

      const divider = child.getElementsByClassName(
        "expander clearfix torn-divider divider-vertical",
      )[0];
      if (!divider) continue;
      divider.append(hyperlink);

      child.setAttribute("read", true);
    }
  }, 500);
})();
