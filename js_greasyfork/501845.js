// ==UserScript==
// @name         questlog links
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license MIT
// @description  direct links to where you can to go to complete each daily quest
// @author       isabellawy
// @match        http://www.neopets.com/questlog/
// @match        https://www.neopets.com/questlog/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501845/questlog%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/501845/questlog%20links.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const PURCHASE_ITEM_TITLE = "Purchase an Item";
  const SPIN_WHEEL_TITLE = "Spin the Wheel";
  const PLAY_GAME_TITLE = "Play a Game";
  const GROOM_PET_TITLE = "Groom a Pet";
  const FEED_PET_TITLE = "Feed a Pet";
  const CUSTOMISE_PET_TITLE = "Customise a Pet";

  function getquests() {
    var quests = document.getElementsByClassName("ql-quest-details");

    for (let i = 0; i < quests.length; i++) {
      let top = quests[i].querySelector(".ql-quest-top");
      top.style.gridTemplate = "auto / 5% 30% calc(60% - 3em) 5%";

      let questTitle = quests[i].querySelector(".ql-quest-title");
      let questDesc = quests[i].querySelector(".ql-quest-description");
      let linkAttrs = getlinkattrs(questTitle.innerText, questDesc.innerText);

      for (let j = 0; j < linkAttrs.length; j++) {
        let link = document.createElement("a");
        link.style.marginLeft = "8px";
        let linkText = document.createTextNode(linkAttrs[j].text);
        link.appendChild(linkText);
        link.href = linkAttrs[j].href;
        questTitle.appendChild(link);
      }
    }
  }

  function getlinkattrs(title, desc) {
    switch (title) {
      case PURCHASE_ITEM_TITLE:
        return [
          {
            text: "Spings",
            href: "https://www.neopets.com/faerieland/springs.phtml",
          },
          {
            text: "General",
            href: "https://www.neopets.com/generalstore.phtml",
          },
        ];
      case SPIN_WHEEL_TITLE:
        return [{ text: "Wheel", href: getwheellink(desc) }];
      case PLAY_GAME_TITLE:
        return [
          {
            text: "MeercaChaseII",
            href: "https://www.neopets.com/games/game.phtml?game_id=500&size=regular&quality=high&play=true",
          },
        ];
      case GROOM_PET_TITLE:
        return [
          {
            text: "Inventory",
            href: "https://www.neopets.com/inventory.phtml",
          },
        ];
      case FEED_PET_TITLE:
        return [
          {
            text: "Inventory",
            href: "https://www.neopets.com/inventory.phtml",
          },
        ];
      case CUSTOMISE_PET_TITLE:
        return [
          { text: "Customise", href: "https://www.neopets.com/customise/" },
        ];
      default:
        console.log(title);
        return [];
    }
  }

  function getwheellink(desc) {
    if (desc.indexOf("Excitement") > -1) {
      return "https://www.neopets.com/faerieland/wheel.phtml";
    } else if (desc.indexOf("Knowledge") > -1) {
      return "https://www.neopets.com/medieval/knowledge.phtml";
    } else if (desc.indexOf("Mediocrity") > -1) {
      return "https://www.neopets.com/prehistoric/mediocrity.phtml";
    } else if (desc.indexOf("Misfortune") > -1) {
      return "https://www.neopets.com/halloween/wheel/index.phtml";
    } else return "#errorGetWheelLink";
  }

  getquests();
})();
