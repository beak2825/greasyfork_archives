// ==UserScript==
// @name         aao-marker
// @namespace    lss.grisu118.ch
// @version      1.3.4
// @author       Grisu118
// @description  Markiert die AAO für die zum aktuellen Einsatz passt
// @license      MIT
// @icon         https://avatars.githubusercontent.com/u/4274139?s=40&v=4
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/511080/aao-marker.user.js
// @updateURL https://update.greasyfork.org/scripts/511080/aao-marker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  const styleCss = "body.dark .ls42-lss-aao-match,.ls42-lss-aao-match{border:1px solid yellow}.tab-pane.ls42-lss-aao-match-found:not(:first-child) .ls42-lss-aao-no-match{filter:brightness(.6)}.ls42-lss-aao-category-match{border:1px solid yellow!important}";
  importCSS(styleCss);
  const checkMedicIncluded = (elem) => {
    return elem.getAttribute("naw") != "0" || elem.getAttribute("rtw") != "0" || elem.getAttribute("naw_or_rtw_and_nef") != "0" || elem.getAttribute("naw_or_rtw_and_nef_or_rth") != "0" || elem.getAttribute("seg_elw") != "0" || elem.getAttribute("ktw_b") != "0";
  };
  const sanitizeString = (txt) => txt.replace(/[#-.]|[[-^]|[?|{}]/g, "\\$&");
  const CALCULATE_TIME = !!document.querySelector(".aao_timer");
  const MATCH_CLASS_NAME = "ls42-lss-aao-match";
  const applyAAOStatus = (statusBtn) => {
    aao_available(Number.parseInt(statusBtn.getAttribute("aao_id") ?? "-1"), CALCULATE_TIME);
    const aaoElem = document.querySelector(`.aao.${MATCH_CLASS_NAME}`);
    if (aaoElem) {
      const aaoAvailable = aaoElem.children.item(0)?.className?.includes("label-success") ?? false;
      const medicIncluded = checkMedicIncluded(aaoElem);
      statusBtn.classList.remove("btn-success");
      statusBtn.classList.remove("btn-danger");
      let text;
      if (aaoAvailable) {
        statusBtn.classList.add("btn-success");
        text = "✔️ AAO Available ✔️";
      } else {
        statusBtn.classList.add("btn-danger");
        text = "⚠️⚠️ AAO NOT COMPLETE ⚠️⚠️";
      }
      if (medicIncluded) {
        text = `🚑🚑 ${text} 🚑🚑`;
      }
      statusBtn.innerText = text;
    }
  };
  (() => {
    const missionGeneralInfoElem = document.getElementById("mission_general_info");
    const missionTitle = missionGeneralInfoElem?.getAttribute("data-mission-title")?.replace("[Verband]", "")?.replace("[Event]", "")?.replace("(Brandmeldeanlage)", "")?.replace("ß", "ss")?.trim()?.toLowerCase();
    if (missionTitle) {
      document.querySelectorAll(".aao").forEach((elem) => {
        const aaoText = elem.textContent?.replace("ß", "ss")?.trim()?.toLowerCase();
        if (aaoText?.match(`^${sanitizeString(missionTitle)}\\*?$`)) {
          elem.classList.add(MATCH_CLASS_NAME);
        } else {
          elem.classList.add("ls42-lss-aao-no-match");
        }
      });
    }
    const aaoTabPane = document.querySelector(`.tab-pane:has(.aao.${MATCH_CLASS_NAME})`);
    if (aaoTabPane) {
      const aaoCatId = aaoTabPane.id;
      const aaoTabElem = document.querySelector(`#aao-tabs a[href="#${aaoCatId}"]`);
      aaoTabElem?.classList?.add("ls42-lss-aao-category-match");
      document.querySelectorAll("#mission-aao-group .tab-pane").forEach((elem) => {
        elem.classList.add("ls42-lss-aao-match-found");
      });
    }
    const aaoElem = document.querySelector(`.aao.${MATCH_CLASS_NAME}`);
    let aaoStatusBtn;
    if (aaoElem) {
      const aaoId = Number.parseInt(aaoElem.getAttribute("aao_id") ?? "-1");
      const parentElem = document.getElementById("mission-aao-group");
      aaoStatusBtn = document.createElement("a");
      aaoStatusBtn.setAttribute("href", "#");
      aaoStatusBtn.setAttribute("aao_id", aaoId.toString());
      aaoStatusBtn.className = "btn btn-xs btn-block";
      aaoStatusBtn.addEventListener("click", () => applyMatchedAAO());
      applyAAOStatus(aaoStatusBtn);
      parentElem?.prepend(aaoStatusBtn);
    }
    const resetAAO = () => {
      document.querySelector(`.aao[reset="true"]`)?.click();
    };
    const applyMatchedAAO = () => {
      aaoElem?.click();
    };
    document.addEventListener("keypress", (ev) => {
      const target = ev.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      switch (ev.key) {
        case "r":
          resetAAO();
          ev.stopPropagation();
          break;
        case "v":
          applyMatchedAAO();
          ev.stopPropagation();
          break;
        case "n":
          if (aaoStatusBtn) {
            setTimeout(() => applyAAOStatus(aaoStatusBtn), 2e3);
            ev.stopPropagation();
          }
          break;
      }
    });
  })();

})();