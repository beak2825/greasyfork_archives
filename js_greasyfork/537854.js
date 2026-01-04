// ==UserScript==
// @name         Internet Roadtrip Permanent Radio - Folk'd Up
// @description  Overrides Internet Roadtrip radio with Folk'd Up Radio and shows live song info
// @namespace    http://tampermonkey.net/
// @match        https://neal.fun/internet-roadtrip/
// @version      1.2
// @author       TotallyNotSamm(+pilotdestroy +jdranczewski)
// @license      MIT
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp6FXUbqkbw2he_TMhL-eLNqZjPJqa3A0rrw&s
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/537854/Internet%20Roadtrip%20Permanent%20Radio%20-%20Folk%27d%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/537854/Internet%20Roadtrip%20Permanent%20Radio%20-%20Folk%27d%20Up.meta.js
// ==/UserScript==
 
(async function () {
  if (!IRF.isInternetRoadtrip) return;

  // Check if we've shown the migration alert before
  const hasShownMigrationAlert = await GM.getValue("hasShownMigrationAlert", false);
  if (!hasShownMigrationAlert) {
    alert("⚠️ Important Notice ⚠️\n\nThis radioscript will no longer receive updates.\n\nThe new version is available on GreasyFork. You can find it by:\n1. Opening the Updates tab in settings\n2. Checking pins in #mod-dev in the discord server.");
    await GM.setValue("hasShownMigrationAlert", true);
  }

  // Create the update notice tab
  const updateTab = await IRF.ui.panel.createTabFor(GM.info, { tabName: "Updates" });
  const updateContainer = document.createElement("div");
  updateContainer.style.padding = "1rem";

  const warningDiv = document.createElement("div");
  warningDiv.style.backgroundColor = "#fff3cd";
  warningDiv.style.color = "#856404";
  warningDiv.style.padding = "1rem";
  warningDiv.style.borderRadius = "0.25rem";
  warningDiv.style.marginBottom = "1rem";
  warningDiv.style.border = "1px solid #ffeeba";

  const warningTitle = document.createElement("h3");
  warningTitle.textContent = "⚠️ Important: Script Migration Required";
  warningTitle.style.marginTop = "0";
  warningTitle.style.marginBottom = "0.5rem";

  const warningText = document.createElement("p");
  warningText.innerHTML = `This version of Internet Roadtrip Folk'd Up Radio will no longer receive updates.<br><br>
                         The new version "Internet Roadtrip Permanent Radios" is available on GreasyFork.<br><br>
                         You can get the new version in one of two ways:`;
  warningText.style.marginBottom = "1rem";

  const optionsList = document.createElement("ul");
  optionsList.style.marginBottom = "1rem";
  optionsList.style.paddingLeft = "1.5rem";

  const option1 = document.createElement("li");
  option1.innerHTML = `Click this direct link to the new script on GreasyFork:<br>
                      <a href="https://greasyfork.org/en/scripts/538771-internet-roadtrip-permanent-radios" target="_blank" style="color: #004085; text-decoration: underline; word-break: break-all;">
                        https://greasyfork.org/en/scripts/538771-internet-roadtrip-permanent-radios
                      </a>`;
  option1.style.marginBottom = "0.5rem";

  const option2 = document.createElement("li");
  option2.innerHTML = `Look for <strong>"Internet Roadtrip Permanent Radios"</strong> in pins in #mod-dev`;

  optionsList.appendChild(option1);
  optionsList.appendChild(option2);

  warningDiv.appendChild(warningTitle);
  warningDiv.appendChild(warningText);
  warningDiv.appendChild(optionsList);
  updateContainer.appendChild(warningDiv);
  updateTab.container.appendChild(updateContainer);

  let nowPlayingText;
  let isPopupOpen = false;
 
  async function fetchNowPlaying() {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://public.radio.co/api/v2/s129fcc067/track/current",
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          // The title contains both artist and song, e.g. "Artist - Song"
          const title = data.data?.title || "Unknown Title";
          nowPlayingText = title;
        } catch (e) {
          console.error("[Folk'd Up Radio] JSON parse error:", e);
          nowPlayingText = "Unknown Track – Unknown Artist";
        } finally {
          resolve();
        }
      },
      onerror: function (e) {
        console.error("[Folk'd Up Radio] GM_xmlhttpRequest failed:", e);
        nowPlayingText = "Unknown Track – Unknown Artist";
        resolve();
      }
    });
  });
}
 
  async function updateAllInfo() {
    await Promise.all([fetchNowPlaying()]);
  }
  await updateAllInfo();
  setInterval(updateAllInfo, 30000);
 
  const container = await IRF.vdom.container;
  const originalUpdateData = container.methods.updateData;
 
  container.state.updateData = new Proxy(originalUpdateData, {
    apply: (target, thisArg, args) => {
      const currentStation = args[0].station?.name;
      const alreadySet = currentStation === "Folk'd Up Radio";
 
      if (!alreadySet) {
        args[0].station = {
          name: "Folk'd Up Radio",
          url: "https://s4.radio.co/s129fcc067/listen",
          distance: 0
        };
      }
 
      IRF.vdom.radio.then(radio => {
        if (radio.state.isPoweredOn) {
          radio.state.stationInfo = nowPlayingText;
        } else {
          radio.state.stationInfo = "TUNE IN";
        }
      });
 
      return Reflect.apply(target, thisArg, args);
    }
  });
 
const radioBody = document.querySelector(".radio-body");
if (!radioBody) {
  console.warn("[Folk'd Up].radio-body not found. The info button won't be displayed.");
  return;
}
 
radioBody.style.position = "relative";
 
  const infoButton = document.createElement("button");
  infoButton.textContent = "i";
  infoButton.setAttribute("aria-label", "Show Folk'd Up Info");
  Object.assign(infoButton.style, {
    position: "absolute",
      top: "8px",
    left: "8px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "none",
    background: "transparent",
    color: "white",
    fontWeight: "bold",
    fontFamily: "inherit",
    cursor: "pointer",
    padding: "0",
    lineHeight: "18px",
    textAlign: "center",
    userSelect: "none",
    zIndex: "9999",
  });
  radioBody.appendChild(infoButton);
 
  const tooltipSpan = document.createElement("div");
  tooltipSpan.textContent = "Show more info";
  Object.assign(tooltipSpan.style, {
    position: "fixed",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: "inherit",
    opacity: "0",
    visibility: "hidden",
    transition: "opacity 0.2s ease",
    whiteSpace: "nowrap",
    zIndex: "9998",
  });
  document.body.appendChild(tooltipSpan);
 
  const infoPopup = document.createElement("div");
  const refStyles = getComputedStyle(radioBody.querySelector(".station-name"));
  Object.assign(infoPopup.style, {
    position: "fixed",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "6px",
    fontFamily: refStyles.fontFamily,
    fontWeight: "normal",
    fontSize: "14px",
    maxWidth: "240px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.8)",
    opacity: "0",
    visibility: "hidden",
    transition: "opacity 0.25s ease",
    userSelect: "none",
    zIndex: 9998,
  });
  document.body.appendChild(infoPopup);
 
  function updatePopupContent() {
  infoPopup.innerHTML = `
    <div><strong>Now Playing:</strong> ${nowPlayingText}</div>
  `;
}
 
 
  function positionPopup() {
    const btnRect = infoButton.getBoundingClientRect();
    const popupRect = infoPopup.getBoundingClientRect();
    let left = btnRect.left - popupRect.width - 8;
    let top = btnRect.top + (btnRect.height / 2) - (popupRect.height / 2);
 
    if (left < 8) {
      left = btnRect.right + 8;
    }
    if (top < 8) top = 8;
    if (top + popupRect.height > window.innerHeight - 8)
      top = window.innerHeight - popupRect.height - 8;
 
    infoPopup.style.left = `${left}px`;
    infoPopup.style.top = `${top}px`;
  }
 
  infoButton.addEventListener("mouseenter", () => {
    if (isPopupOpen) return;
    const rect = infoButton.getBoundingClientRect();
    tooltipSpan.style.left = `${rect.left - tooltipSpan.offsetWidth - 8}px`;
    tooltipSpan.style.top = `${rect.top + (rect.height / 2) - 10}px`;
    tooltipSpan.style.opacity = "1";
    tooltipSpan.style.visibility = "visible";
  });
 
  infoButton.addEventListener("mouseleave", () => {
    tooltipSpan.style.opacity = "0";
    tooltipSpan.style.visibility = "hidden";
  });
 
  infoButton.addEventListener("click", () => {
    isPopupOpen = !isPopupOpen;
    if (isPopupOpen) {
      updatePopupContent();
      infoPopup.style.opacity = "1";
      infoPopup.style.visibility = "visible";
      tooltipSpan.style.opacity = "0";
      tooltipSpan.style.visibility = "hidden";
      positionPopup();
    } else {
      infoPopup.style.opacity = "0";
      infoPopup.style.visibility = "hidden";
    }
  });
 
  document.addEventListener("click", (e) => {
    if (!infoPopup.contains(e.target) && e.target !== infoButton) {
      infoPopup.style.opacity = "0";
      infoPopup.style.visibility = "hidden";
      isPopupOpen = false;
    }
  });
 
  window.addEventListener("resize", () => {
    if (infoPopup.style.visibility === "visible") {
      positionPopup();
    }
  });
})();