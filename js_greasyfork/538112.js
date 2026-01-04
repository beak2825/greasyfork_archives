// ==UserScript==
// @name        [CS] Show Pet Rarity Count in Trades
// @namespace   https://www.chickensmoothie.com/Forum/memberlist.php?mode=viewprofile&u=1123970
// @match       https://www.chickensmoothie.com/trades/edittrade.php*
// @match       https://www.chickensmoothie.com/trades/viewtrade.php*
// @description Shows you how many pets of each rarity are in a trade.
// @author      nuz
// @version     1.1
// @license     MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538112/%5BCS%5D%20Show%20Pet%20Rarity%20Count%20in%20Trades.user.js
// @updateURL https://update.greasyfork.org/scripts/538112/%5BCS%5D%20Show%20Pet%20Rarity%20Count%20in%20Trades.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

const RARITY_EMOJI = {
  "unknown": "❔",
  "omgsocommon": "🔹",
  "extremelycommon": "🔷",
  "verycommon": "🔵",
  "common": "🟢",
  "uncommon": "💚",
  "veryuncommon": "💛",
  "extremelyuncommon": "🧡",
  "rare": "❤️",
  "veryrare": "💗",
  "extremelyrare": "💜",
  "omgsorare": "🌈",
};

const RARITIES = Object.keys(RARITY_EMOJI);

const RARITY_COUNT_CLASS = "rarity-count";
const RARITY_TOOLTIP_CLASS = "rarity-tooltip";
const RARITY_CONTAINER_CLASS = "rarity-container";

const TOOLTIP_FG_COLOR = "#111";
const TOOLTIP_BG_COLOR = "#eee";

const RARITY_COUNT_CSS = `
.petsection, .section.panel.bg4 {
  position: relative;
}

.petsection .${RARITY_COUNT_CLASS} {
  top: 2px;
}

.section.panel.bg4 .${RARITY_COUNT_CLASS} {
  top: 6px;
}

.${RARITY_COUNT_CLASS} {
  display: flex;
  position: absolute;
  right: 4px;
  font-size: 11px;
}

.${RARITY_COUNT_CLASS} > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 18px;
  padding: 0 6px;
  gap: 1px;
  cursor: help;
}

.${RARITY_COUNT_CLASS} > div:hover .${RARITY_TOOLTIP_CLASS} {
  opacity: 1;
}

.${RARITY_TOOLTIP_CLASS} {
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
  position: absolute;
  top: calc(-100% - 3px);
  right: 50%;
  padding: 6px 10px;
  border-radius: 6px 6px 0 6px;
  text-align: center;
  white-space: nowrap;
  color: ${TOOLTIP_FG_COLOR};
  background-color: ${TOOLTIP_BG_COLOR};
}

.${RARITY_TOOLTIP_CLASS}::after {
  content: "";
  position: absolute;
  top: 100%;
  right: 0;
  border: 3px solid;
  border-color: ${TOOLTIP_BG_COLOR} ${TOOLTIP_BG_COLOR} #0000 #0000;
}

.cs-CSMobile .petsection.${RARITY_CONTAINER_CLASS} .${RARITY_COUNT_CLASS} {
  top: 50px;
}

.cs-CSMobile .petsection.${RARITY_CONTAINER_CLASS} .petbox {
  padding-top: 50px;
}

.cs-CSMobile .section.panel.bg4.${RARITY_CONTAINER_CLASS} {
  padding-top: 32px;
}

.cs-CSMobile .section.panel.bg4.${RARITY_CONTAINER_CLASS} .corners-top {
  transform: translateY(-32px);
}

.cs-CSMobile .${RARITY_COUNT_CLASS} > div {
  user-select: none;
}
`;

function updateRarityCount(petSection, attachElement) {
  const rarityMap = new Map();

  petSection.querySelectorAll(".pet").forEach((pet) => {
    const rarityMatch = pet
      .querySelector(".rarity-bar")
      ?.className.match(/ rarity-bar-(\w+) /)[1];
    const rarity = (!rarityMatch || rarityMatch === "stillgrowing") ?
      "unknown" : rarityMatch;

    rarityMap.set(rarity, (rarityMap.get(rarity) ?? 0) + 1);
  });
  petSection.querySelector(`.${RARITY_COUNT_CLASS}`)?.remove();

  if (!rarityMap.size) {
    petSection.classList.remove(RARITY_CONTAINER_CLASS);
    return;
  }

  const outerDiv = document.createElement("div");
  outerDiv.classList.add(RARITY_COUNT_CLASS);

  const entries = [...rarityMap.entries()].sort(
    (a, b) => RARITIES.indexOf(a[0]) - RARITIES.indexOf(b[0])
  );

  entries.forEach(([rarity, count]) => {
    const innerDiv = document.createElement("div");

    const tooltipText = rarity
      .replace(/^omgso/, "OMG so ")
      .replace(/^(extremely|very)/, "$& ")
      .replace(/^(\w)/, (match) => match.toUpperCase());

    [RARITY_EMOJI[rarity], count, tooltipText].forEach((text) => {
      const span = document.createElement("span");
      span.append(document.createTextNode(text));
      innerDiv.append(span);
    });

    innerDiv.lastElementChild.classList.add(RARITY_TOOLTIP_CLASS);
    outerDiv.append(innerDiv);
  });

  petSection.classList.add(RARITY_CONTAINER_CLASS);
  attachElement(outerDiv);
}

(function() {
  GM_addStyle(RARITY_COUNT_CSS);

  if (window.location.href.includes("viewtrade")) {
    document.querySelectorAll(".section.panel.bg4").forEach((section) => {
      updateRarityCount(section, (rarityCount) => {
        section.querySelector(".trade-things").before(rarityCount);
      });
    });
    return;
  }

  document.querySelectorAll(".petsection").forEach((section) => {
    const onMutate = () => {
      updateRarityCount(section, (rarityCount) => {
        section.append(rarityCount);
      });
    };
    onMutate(); // Initialize the rarity count.

    const petBox = section.querySelector(".petbox");
    new MutationObserver(onMutate).observe(petBox, {childList: true});
  });
})();
