// ==UserScript==
// @name         Daily Quest Links
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Zahjar2
// @match        https://www.neopets.com/questlog/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478530/Daily%20Quest%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/478530/Daily%20Quest%20Links.meta.js
// ==/UserScript==

const USE_DIRECT_LINK = false;

var description_to_link = {
  "Purchase item(s) from any Neopian Shop":
    "https://www.neopets.com/faerieland/springs.phtml",

  "Play any Game or Classic Game in the Games Room":
    "https://www.neopets.com/games/game.phtml?game_id=805&size=regular&quality=high&play=true",

  "Spin the Wheel of Excitement in Faerieland":
    "https://www.neopets.com/faerieland/wheel.phtml",

  "Spin the Wheel of Mediocrity in Tyrannia":
    "https://www.neopets.com/prehistoric/mediocrity.phtml",

  "Spin the Wheel of Knowledge in Brightvale":
    "https://www.neopets.com/medieval/knowledge.phtml",

  "Spin the Wheel of Misfortune in the Haunted Woods":
    "https://www.neopets.com/halloween/wheel/index.phtml",

  "Feed any food item to one of your Neopets": {
    "Pet list": "https://www.neopets.com/home/index.phtml",
    "SDB Food": "https://www.neopets.com/safetydeposit.phtml?obj_name=&category=18",
    "General Store (Coffee and Marshmallows)": "https://www.neopets.com/generalstore.phtml#:~:text=Coffee%20and%20Marshmallows",
  },

  "Groom one of your Neopets with any grooming item": {
    "Pet list": "https://www.neopets.com/home/index.phtml",
    "SDB Grooming": "https://www.neopets.com/safetydeposit.phtml?obj_name=&category=10",
    "General Store (Blue Short Hair Brush)": "https://www.neopets.com/generalstore.phtml#:~:text=Blue%20Short%20Hair%20Brush",
  },

  "Customise one of your Neopets": "https://www.neopets.com/customise/",
};

if (USE_DIRECT_LINK) {
    description_to_link["Purchase item(s) from any Neopian Shop"] = {"Purchase Icy Snowball": "https://www.neopets.com/faerieland/process_springs.phtml?obj_info_id=8428"};
    description_to_link["Spin the Wheel of Excitement in Faerieland"] = {"Spin it!": "https://www.neopets.com/amfphp/json.php/WheelService.spinWheel/2"};
    description_to_link["Spin the Wheel of Mediocrity in Tyrannia"] = {"Spin it!": "https://www.neopets.com/amfphp/json.php/WheelService.spinWheel/3"};
    description_to_link["Spin the Wheel of Knowledge in Brightvale"] = {"Spin it!": "https://www.neopets.com/amfphp/json.php/WheelService.spinWheel/1"};
    description_to_link["Spin the Wheel of Misfortune in the Haunted Woods"] = {"Spin it!": "https://www.neopets.com/amfphp/json.php/WheelService.spinWheel/4"};
}

(function () {
  "use strict";
  let quests = document.querySelectorAll(".ql-quest-description");

  quests.forEach(function (quest) {
    let description = quest.textContent.trim();
    if (description_to_link.hasOwnProperty(description)) {
      let link = description_to_link[description];
      if (typeof link === "string") {
        // If the link is a string, create a single link
        let linkElement = document.createElement("a");
        linkElement.href = link;
        linkElement.textContent = description;
        quest.innerHTML = "";
        quest.appendChild(linkElement);
      } else if (typeof link === "object") {
        // If the link is an object, create a list of links
        let list = document.createElement("ul");
        for (let linkDescription in link) {
          let listItem = document.createElement("li");
          let linkElement = document.createElement("a");
          linkElement.href = link[linkDescription];
          linkElement.textContent = linkDescription;
          listItem.appendChild(linkElement);
          list.appendChild(listItem);
        }
        quest.innerHTML = description;
        quest.appendChild(list);
      }
    }
  });
})();
