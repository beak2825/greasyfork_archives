// ==UserScript==
// @name        MouseHunt - Empyrean Sky Palace Treasure Map Mice Categorizer
// @namespace   https://greasyfork.org/en/scripts/445341-mousehunt-empyrean-sky-palace-treasure-map-mice-categorizer
// @match       http://www.mousehuntgame.com/*
// @match       https://www.mousehuntgame.com/*
// @version     1.2
// @author      viettrung9012
// @description Categorize missing mice
// @include	http://apps.facebook.com/mousehunt/*
// @include	https://apps.facebook.com/mousehunt/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/445341/MouseHunt%20-%20Empyrean%20Sky%20Palace%20Treasure%20Map%20Mice%20Categorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/445341/MouseHunt%20-%20Empyrean%20Sky%20Palace%20Treasure%20Map%20Mice%20Categorizer.meta.js
// ==/UserScript==

const spMaps = [
  "Empyrean Sky Palace Treasure Chest",
  "Rare Empyrean Sky Palace Treasure Chest"
];

const lookUp = {
  1019: ['launchPad'],
  1037: ['launchPad'],
  1055: ['launchPad'],
  1060: ['launchPad'],
  1045: ['wardens'],
  1029: ['wardens'],
  1031: ['wardens'],
  1069: ['wardens'],
  1014: ['pirates', 'common'],
  1022: ['pirates', 'common'],
  1023: ['pirates', 'common'],
  1066: ['pirates', 'common'],
  1048: ['pirates', 'common'],
  1040: ['pirates', 'common'],
  1084: ['pirates', 'sp'],
  1032: ['physical', 'common'],
  1034: ['physical', 'common'],
  1059: ['physical', 'common'],
  1057: ['physical', 'hai'],
  1044: ['physical', 'hai'],
  1083: ['physical', 'sp'],
  1017: ['shadow', 'common'],
  1043: ['shadow', 'common'],
  1065: ['shadow', 'common'],
  1051: ['shadow', 'hai'],
  1050: ['shadow', 'hai'],
  1085: ['shadow', 'sp'],
  1070: ['tactical', 'common'],
  1033: ['tactical', 'common'],
  1049: ['tactical', 'common'],
  1018: ['tactical', 'hai'],
  1067: ['tactical', 'hai'],
  1086: ['tactical', 'sp'],
  1052: ['arcane', 'common'],
  1053: ['arcane', 'common'],
  1054: ['arcane', 'common'],
  1056: ['arcane', 'hai'],
  1016: ['arcane', 'hai'],
  1074: ['arcane', 'sp'],
  1062: ['forgotten', 'common'],
  1063: ['forgotten', 'common'],
  1020: ['forgotten', 'common'],
  1061: ['forgotten', 'hai'],
  1030: ['forgotten', 'hai'],
  1078: ['forgotten', 'sp'],
  1042: ['hydro', 'common'],
  1058: ['hydro', 'common'],
  1021: ['hydro', 'common'],
  1041: ['hydro', 'hai'],
  1035: ['hydro', 'hai'],
  1079: ['hydro', 'sp'],
  1068: ['dragon', 'common'],
  1028: ['dragon', 'common'],
  1027: ['dragon', 'common'],
  1046: ['dragon', 'hai'],
  1026: ['dragon', 'hai'],
  1077: ['dragon', 'sp'],
  1025: ['law', 'common'],
  1064: ['law', 'common'],
  1039: ['law', 'common'],
  1015: ['law', 'hai'],
  1038: ['law', 'hai'],
  1080: ['law', 'sp'],
  1047: ['others', 'common'],
  1075: ['others', 'sp'],
  1076: ['others', 'sp'],
  1081: ['others', 'sp'],
  1082: ['others', 'sp'],
  1087: ['others', 'sp']
}

function buildMiceDiv(parentEl, title, els) {
  let miceDiv = document.createElement('div');
  miceDiv.innerHTML = "<div style=\"font-weight: bold; font-size: 12px;\">" + title + "</div>";
  els.forEach(el => miceDiv.appendChild(el));
  parentEl.appendChild(miceDiv);
}

function buildCategoryDiv(parentEl, title, els) {
  if (els.length > 0) {
    let catDiv = document.createElement('div');
    buildMiceDiv(catDiv, title, els);
    catDiv.innerHTML = catDiv.innerHTML + "<br />"
    parentEl.appendChild(catDiv);
  }
}

const commonTitle = "Common (available in LAI, HAI and SP)";
const haiTitle = "HAI only";
const spTitle = "Sky Palace only"

function getLast(arr) {
  return arr[arr.length - 1];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function transform(arr) {
  return arr.map(el => el.querySelectorAll("span")[0].textContent);
}

function categorize() {
  const categorized = {
    launchPad: [],
    wardens: [],
    pirates: {
      common: [],
      sp: []
    },
    others: {
      common: [],
      sp: []
    }
  };

  const types = ['physical', 'shadow', 'tactical', 'arcane', 'forgotten', 'hydro', 'dragon', 'law'];

  types.forEach(type => categorized[type] = {
    common: [],
    hai: [],
    sp: []
  })
  
  const missingMiceParentDiv = document.querySelector('.treasureMapView-goals-groups');
  const missingMiceDiv = missingMiceParentDiv.children[1];
  const categorizedMissingMiceDiv = document.createElement('div');
  categorizedMissingMiceDiv.className = "hidden";
  categorizedMissingMiceDiv.innerHTML = `
  <div><span style="font-weight: bold; font-size: 12px;">Legends</span></div>
  <div class="treasureMapView-goals-group-goal" style="background-color: #E4E4E4; height: 39px; padding: 3px; pointer-events: none;">
    Launchpad, Wardens and Common (available on LAI, HAI and SP)
  </div>
  <div class="treasureMapView-goals-group-goal" style="background-color: #C466B0; height: 39px; padding: 3px; pointer-events: none;">
    Only available on High Altitude Islands
  </div>
  <div class="treasureMapView-goals-group-goal" style="background-color: #E2A521; height: 39px; padding: 3px; pointer-events: none;">
    Only available on Sky Palace
  </div>
  <div><br /></div>
  `;
  const missingMiceHeadingDiv = missingMiceParentDiv.children[0];
  const toggle = document.createElement('a');
  toggle.className="mousehuntActionButton tiny lightBlue";
  toggle.innerHTML = "<span>Toggle category</span>"
  toggle.style.cssText += "margin-left: 10px";
  missingMiceHeadingDiv.appendChild(toggle);
  toggle.addEventListener('click', () => {
    if (missingMiceDiv.className === "hidden") {
      missingMiceDiv.className = "";
      categorizedMissingMiceDiv.className = "hidden";
    } else {
      missingMiceDiv.className = "hidden";
      categorizedMissingMiceDiv.className = "";
    }
  });
  
  const exportMouseList = document.createElement('a');
  exportMouseList.className="mousehuntActionButton tiny lightBlue";
  exportMouseList.innerHTML = "<span>Mouse list</span>"
  exportMouseList.style.cssText += "margin-left: 10px";
  missingMiceHeadingDiv.appendChild(exportMouseList);
  exportMouseList.addEventListener('click', () => {
    let mouseList = [];
    types.forEach(type => {
      if (categorized[type].common.length > 0 || categorized[type].hai.length > 0 || categorized[type].sp.length > 0) {
        mouseList.push(capitalize(type));
        if (categorized[type].common.length > 0 || categorized[type].hai.length > 0) {
          mouseList.push("P&F");
          mouseList = mouseList.concat(transform(categorized[type].common)).concat(transform(categorized[type].hai));
        }
        if (categorized[type].sp.length > 0) {
          mouseList.push("SP");
          mouseList = mouseList.concat(transform(categorized[type].sp));
        }
        mouseList.push("");
      }
    });
    if (categorized.pirates.common.length > 0 || categorized.pirates.sp.length > 0) {
      mouseList.push("Pirates");
      mouseList = mouseList.concat(transform(categorized.pirates.common)).concat(transform(categorized.pirates.sp));
      mouseList.push("");
    }
    if (categorized.others.common.length > 0 || categorized.others.sp.length > 0) {
      mouseList.push("Richard and other SP mice");
      mouseList = mouseList.concat(transform(categorized.others.common)).concat(transform(categorized.others.sp));
      mouseList.push("");
    }
    if (categorized.wardens.length > 0) {
      mouseList.push("Wardens");
      mouseList = mouseList.concat(transform(categorized.wardens));
      mouseList.push("");
    }
    if (categorized.launchPad.length > 0) {
      mouseList.push("Launchpad");
      mouseList = mouseList.concat(transform(categorized.launchPad));
      mouseList.push("");
    }
    navigator.clipboard.writeText(mouseList.join("\n"));
    alert('Mouse list copied to clipboard!');
  });

  Array.from(missingMiceDiv.children).forEach(child => {
    let miceId = parseInt(child.getAttribute('data-unique-id'));
    let mouseCategories = lookUp[miceId];
    let arr = mouseCategories.reduce((curVal, path) => {
        return curVal[path];
      }, categorized);
    let clonedNode = child.cloneNode(true);
    if (getLast(mouseCategories) === 'hai') {
      clonedNode.style.cssText += "background-color: #C466B0";
    } else if (getLast(mouseCategories) === 'sp') {
      clonedNode.style.cssText += "background-color: #E2A521";
    } else {
      clonedNode.style.cssText += "background-color: #E4E4E4";
    }
    clonedNode.style.cssText += "pointer-events: none;";
    arr.push(clonedNode);
  });
  
  types.forEach(type => {
    var typeDiv;
    let { common , hai , sp  } = categorized[type];
    const mice = [].concat(common).concat(hai).concat(sp);
    buildCategoryDiv(categorizedMissingMiceDiv, capitalize(type), mice);
  });
  
  buildCategoryDiv(categorizedMissingMiceDiv, "Wardens", categorized.wardens);
  
  let pirates = [].concat(categorized.pirates.common).concat(categorized.pirates.sp);
  buildCategoryDiv(categorizedMissingMiceDiv, "Pirates", pirates);
  
  let others = [].concat(categorized.others.common).concat(categorized.others.sp);
  buildCategoryDiv(categorizedMissingMiceDiv, "Richard and rest of Sky Palace", others);
  
  buildCategoryDiv(categorizedMissingMiceDiv, "Launchpad", categorized.launchPad);
  
  missingMiceParentDiv.appendChild(categorizedMissingMiceDiv);
}

// Listen to XHRs, opening a map always at least triggers board.php
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, async) {
    this.addEventListener("load", function () {
      if (url.endsWith("board.php")) {
        const mapEl = document.querySelector(".treasureMapView-mapMenu-rewardName");
        if (mapEl) {
          const mapName = mapEl.textContent;
          if (mapName && spMaps.indexOf(mapName) > -1) {
            categorize();
          }
        }
      }
  });
  originalOpen.apply(this, arguments);
};
