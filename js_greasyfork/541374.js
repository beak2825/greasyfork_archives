// ==UserScript==
// @name         Neopets - Quest Log Simplify
// @namespace    karla@neopointskarla
// @license GPL3
// @version      0.0.2
// @description  Displays all quests, daily, streak, neopass daily, and neopass weekly all on a single page! Plus quick link to complete each quest!
// @author       Karla
// @match        *://*.neopets.com/questlog/
// @homepage     https://neopointskarla.com
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/541374/Neopets%20-%20Quest%20Log%20Simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/541374/Neopets%20-%20Quest%20Log%20Simplify.meta.js
// ==/UserScript==

GM_addStyle("#QuestLogStreakRewards { display: block !important; }");
GM_addStyle("#QuestLogStreakBonus { margin-left: 40px !important; }");
GM_addStyle("#QuestLogBonusRewards { padding-bottom: 20px !important; }");
GM_addStyle(
  ".ql-bonus-img { width: 40px !important; height: 40px !important; margin-right: 0.5em !important; }",
);
GM_addStyle(".ql-bonus-img img { width: 100% !important; }");
GM_addStyle(
  ".questlog-header, .questlog-info, .ql-dots, .ql-bonus-label, .ql-progress-bar, .ql-skip, #QuestLogQuests .ql-tasks { display: none !important; }",
);
GM_addStyle(".ql-bonus-reward { flex-direction: row !important; }");
GM_addStyle(".questlog-quest { height: auto !important; }");
GM_addStyle(
  ".ql-reward img { height: 50px !important; width: 50px !important; }",
);
GM_addStyle(".ql-reward { gap: 0 !important; padding: 0 !important; }");
GM_addStyle(
  ".ql-quest-buttons { width: auto !important; margin: 0 !important; display: inline-block !important; float: right !important; }",
);
GM_addStyle(".ql-quest-description { display: inline-block !important; }");
GM_addStyle(".ql-progress { margin-top: 0 !important; }");
GM_addStyle(".questlog-bonus-rewards { padding: 0 !important; }");
GM_addStyle("#QuestLogStreakRewards { padding-bottom: 20px !important; }");
GM_addStyle(".questlog-tabs { display: none !important; }");
GM_addStyle(".ql-quest-details::after { pointer-events: none; }");

let questLogBody;
let questLogTracker;
let neopassDailyHTML;
let neopassWeeklyHTML;

{
  const formData = new FormData();
  formData.append("_ref_ck", getCK());
  formData.append("tab", "3");
  formData.append("tabGroup", "3");
  GM.xmlHttpRequest({
    method: "POST",
    url: "https://www.neopets.com/np-templates/ajax/questlog/retrieveQuests.php",
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
    data: formData,
    onload: function (response) {
      neopassDailyHTML = JSON.parse(response.responseText).output;
    },
    onerror: function (error) {
      console.error("Request failed:", error);
    },
  });
}

{
  const formData = new FormData();
  formData.append("_ref_ck", getCK());
  formData.append("tab", "3");
  formData.append("tabGroup", "4");
  GM.xmlHttpRequest({
    method: "POST",
    url: "https://www.neopets.com/np-templates/ajax/questlog/retrieveQuests.php",
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
    data: formData,
    onload: function (response) {
      neopassWeeklyHTML = JSON.parse(response.responseText).output;
    },
    onerror: function (error) {
      console.error("Request failed:", error);
    },
  });
}

const interval = setInterval(() => {
  if (document.querySelector("#QuestLogStreakBonus")) {
    clearInterval(interval);
    $(".ql-quest-details .ql-task-num").each(function (e) {
      $(this)
        .parent()
        .parent()
        .parent()
        .find(".ql-quest-title")
        .append(" - " + $(this).text());
    });

    questLogBody = document.querySelector("#QuestLogBody");
    questLogTracker = document.querySelector(
      "#QuestLogBody .questlog-bonus-rewards",
    );

    const questDescriptionEls = document.querySelectorAll(
      ".ql-quest-description",
    );
    for (let i = 0; i < questDescriptionEls.length; i += 1) {
      const qdEl = questDescriptionEls[i];
      const description = qdEl.textContent.trim();
      let link = "";
      switch (description) {
        case "Spin the Wheel of Mediocrity in Tyrannia":
          link = "https://www.neopets.com/prehistoric/mediocrity.phtml";
          break;
        case "Spin the Wheel of Excitement in Faerieland":
          link = "https://www.neopets.com/faerieland/wheel.phtml";
          break;
        case "Spin the Wheel of Misfortune in the Haunted Woods":
          link = "https://www.neopets.com/halloween/wheel/index.phtml";
          break;
        case "Spin the Wheel of Knowledge in Brightvale":
          link = "https://www.neopets.com/medieval/knowledge.phtml";
          break;
        case "Play any Game or Classic Game in the Games Room":
          link =
            "https://www.neopets.com/games/game.phtml?game_id=805&size=regular&quality=high&play=true";
          break;
        case "Purchase item(s) from any Neopian Shop":
          link = "https://www.neopets.com/generalstore.phtml";
          break;
        case "Feed any food item to one of your Neopets":
          link = "https://www.neopets.com/inventory.phtml";
          break;
        case "Customise one of your Neopets":
          link = "https://www.neopets.com/customise";
          break;
        case "Groom one of your Neopets with any grooming item":
          link = "https://www.neopets.com/inventory.phtml";
          break;
      }
      if (link) {
        const anchor = document.createElement("a");
        anchor.href = link;
        anchor.target = "_blank";
        anchor.innerHTML = description;
        qdEl.innerHTML = "";
        qdEl.append(anchor);
      }
    }
  }
}, 100);

const interval2 = setInterval(() => {
  console.log(
    questLogBody,
    questLogTracker,
    neopassDailyHTML,
    neopassWeeklyHTML,
  );
  if (
    questLogBody &&
    questLogTracker &&
    neopassDailyHTML &&
    neopassWeeklyHTML
  ) {
    {
      const outerDiv = document.createElement("div");
      outerDiv.innerHTML = neopassDailyHTML;
      const trackerEl = outerDiv.querySelector(".questlog-bonus-rewards");
      const questsEl = outerDiv.querySelector("#QuestLogQuests");
      questsEl.id = "QuestLogQuestsNPDaily";
      questLogTracker.append(trackerEl);
      questLogBody.append(questsEl);
    }
    {
      const outerDiv = document.createElement("div");
      outerDiv.innerHTML = neopassWeeklyHTML;
      const trackerEl = outerDiv.querySelector(".questlog-bonus-rewards");
      const questsEl = outerDiv.querySelector("#QuestLogQuests");
      questsEl.id = "QuestLogQuestsNPWeekly";
      questLogTracker.append(trackerEl);
      questLogBody.append(questsEl);
    }
    clearInterval(interval2);
  }
}, 100);
