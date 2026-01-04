// ==UserScript==
// @name         hide-employed
// @namespace    hide-employed.zero.nao
// @version      0.1
// @description  hides anyone in sa job or company in advanced search
// @author       nao [2669774]
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/524051/hide-employed.user.js
// @updateURL https://update.greasyfork.org/scripts/524051/hide-employed.meta.js
// ==/UserScript==

const filterIcons = [
  "icon21",
  "icon22",
  "icon23",
  "icon24",
  "icon25",
  "icon26",
  "icon73",
  "icon27",
  "icon83",
];
function hide() {
  $("li[class^='user:not([processed])']").each(function () {
    const icons = $("#iconTray", this);
    $(this).attr("processed", true);
    for (const icon of icons) {
      const iconId = icon.id;
      const iconNumber = iconId.slice(0, 6);
      if (filterIcons.includes(iconNumber)) {
        $(this).remove();
        return;
      }
    }
  });
}

setInterval(hide, 1000);