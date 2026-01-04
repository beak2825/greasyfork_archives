// ==UserScript==
// @name        Alt names
// @namespace   finally.idle-pixel.altnames
// @match       https://idle-pixel.com/login/play/*
// @grant       GM_addStyle
// @version     1.4
// @author      finally
// @description Show main name in chat & alt name on hover
// @downloadURL https://update.greasyfork.org/scripts/525321/Alt%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/525321/Alt%20names.meta.js
// ==/UserScript==

const altNames = {
  "a good idea": "darkroot",
  "amybear": "amyjane1991",
  "axe": "luxferre",
  "blade": "amyjane1991",
  "demonlily": "amyjane1991",
  "dralin notp": "dralina",
  "dralina6lhc": "dralina",
  "dralina7lhc": "dralina",
  "dralina8lhc": "dralina",
  "dralins": "dralina",
  "f1nally": "finally",
  "feralamy": "amyjane1991",
  "feralcammy": "amyjane1991",//"cammyrock",
  "feralhobnob": "luxferre",
  "feraljay": "zpmjay",
  "feralofnades": "godofnades",
  "feralpiet": "pietateip",
  "feralzlef": "amyjane1991",//"zlef",
  "freeamyhugs": "amyjane1991",
  "g3ab": "glab",
  "glabbo": "glab",
  "glabby": "glab",
  "glabislav": "glab",
  "glabstein": "glab",
  "hannes1": "hannes",
  "hannes1 1": "hannes",
  "idkwat2put": "amyjane1991",
  "iloveamy": "amyjane1991",
  "jimboobs": "jimbob",
  "jimbooobs": "jimbob",
  "lux": "luxferre",
  "ologram": "fatalerror",
  "prinny 1": "totoro 47",
  "prinny 2": "froza",
  "prinny 3": "monke3",
  "prinny 4": "glab",
  "prinny 5": "swimispro",
  "prinny6" : "blacksight6",
  "prinny 7": "fatalerror",
  "prinny8" : "zpmjay",
  "rngisbetter": "rngisbad",
  "scpez": "scpey",
  "shartcore": "shart",
  "shartcore1l": "shart",
  "sharter": "shart",
  "skyedemon": "amyjane1991",
  "toastoro": "totoro 47",
  "toto 1hc": "totoro 47",
  "totoro 1hc": "totoro 47",
  "totoro 1ihc": "totoro 47",
  "zoraline": "totoro 47",
  "zoraline 1hc": "totoro 47",
  "zoraline hc": "totoro 47",
  "toastedbread": "totoro 47",
  "uriel": "amyjane1991",
  "youallsuck": "amyjane1991",
  "zombiebunny": "amyjane1991",
};

(() => {
  return new Promise((resolve) => {
    function check() {
      if (document.getElementById("chat-area")) {
        resolve();
        return;
      }
      setTimeout(check, 200);
    }
    check();
  });
})().then(() => {
  GM_addStyle(`
  .alt-tooltip {
    position: relative;
    border-bottom: 1px dotted black;
  }

  .alt-tooltip .alt-tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: #000c;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;

    position: absolute;
    z-index: 1;
  }

  .alt-tooltip:hover .alt-tooltiptext {
    visibility: visible;
  }

  .alt-tooltip .alt-tooltiptext {
    width: 120px;
    bottom: 105%;
    left: 50%;
    margin-left: -60px;
  }
  `);

  let chatArea = document.getElementById("chat-area");

  new MutationObserver(_ => {
    Array.from(document.querySelectorAll("#chat-area a.chat-username:not(.alt)")).forEach(node => {
      node.classList.add("alt");

      let altName = node.innerText.trim();
      let mainName = altNames[altName];
      if (!mainName) return;

      node.classList.add("alt-tooltip");
      node.innerHTML = `${mainName} <span class="alt-tooltiptext">${altName}</span>`;
    });
  }).observe(chatArea, {characterData: false, childList: true, attributes: false});
});