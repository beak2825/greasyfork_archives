// ==UserScript==
// @name         Internet Roadtrip Permanent Radio - KLOU
// @description  Overrides Internet Roadtrip radio with KLOU and shows live song and show info. Might work, but I'm not sure. I just copied the code from someone else doing this for WBOR.
// @namespace    http://tampermonkey.net/
// @match        https://neal.fun/internet-roadtrip/
// @version      1.3.1
// @author       AGuy
// @license      MIT
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.0-beta
// @grant        GM_xmlhttpRequest
// @connect      azura.wbor.org
// @connect      playlists.wbor.org
// @icon         https://neal.fun/favicons/internet-roadtrip.png
// @downloadURL https://update.greasyfork.org/scripts/537393/Internet%20Roadtrip%20Permanent%20Radio%20-%20KLOU.user.js
// @updateURL https://update.greasyfork.org/scripts/537393/Internet%20Roadtrip%20Permanent%20Radio%20-%20KLOU.meta.js
// ==/UserScript==
 
(async function () {
  if (!IRF.isInternetRoadtrip) return;
 
  let nowPlayingText = "Loading...";
  let liveShowName = null;
  let liveDjName = null;
  let isPopupOpen = false;
 
  async function fetchNowPlaying() {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://azura.wbor.org/api/nowplaying/1",
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            const song = data[0]?.now_playing?.song || {};
            const artist = song.artist || "Unknown Artist";
            const title = song.title || "Unknown Title";
            nowPlayingText = `${title} – ${artist}`;
          } catch (e) {
            console.error("[WBOR] JSON parse error:", e);
            nowPlayingText = "Unknown Track – Unknown Artist";
          } finally {
            resolve();
          }
        },
        onerror: function (e) {
          console.error("[KLOU] GM_xmlhttpRequest failed:", e);
          nowPlayingText = "Unknown Track – Unknown Artist";
          resolve();
        }
      });
    });
  }
 
  async function fetchLiveShowInfo() {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://tunein.com/radio/1033-KLOU-s33827/",
        onload: function (response) {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
 
            const showTitleEl = doc.querySelector("h3.show-title a");
            liveShowName = showTitleEl ? showTitleEl.textContent.trim() : null;
 
            const djNameEl = doc.querySelector("p.dj-name a");
            liveDjName = djNameEl ? djNameEl.textContent.trim() : null;
 
          } catch (e) {
            console.error("[KLOU] Failed to parse live show info HTML:", e);
            liveShowName = null;
            liveDjName = null;
          } finally {
            resolve();
          }
        },
        onerror: function (e) {
          console.error("[KLOU] GM_xmlhttpRequest failed for live show info:", e);
          liveShowName = null;
          liveDjName = null;
          resolve();
        }
      });
    });
  }
 
  async function updateAllInfo() {
    await Promise.all([fetchNowPlaying(), fetchLiveShowInfo()]);
  }
  await updateAllInfo();
  setInterval(updateAllInfo, 30000);
 
  const container = await IRF.vdom.container;
  const originalUpdateData = container.methods.updateData;
 
  container.state.updateData = new Proxy(originalUpdateData, {
    apply: (target, thisArg, args) => {
      const currentStation = args[0].station?.name;
      const alreadySet = currentStation === "KLOU 103.3 FM";
 
      if (!alreadySet) {
        args[0].station = {
          name: "KLOU 103.3 FM",
          url: "https://tunein.com/radio/1033-KLOU-s33827/",
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
 
  const radioBody = document.querySelector(".radio-body[data-v-30357640]");
  if (!radioBody) return;
  radioBody.style.position = "relative";
 
  const infoButton = document.createElement("button");
  infoButton.textContent = "i";
  infoButton.setAttribute("aria-label", "Show KLOU Info");
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
  let liveShowText = "No live shows currently";
 
  // doesnt show live show info if dj is "commodore 64"
  if (
    liveDjName &&
    !/klou'?s commodore\s*64/i.test(liveDjName.trim())
  ) {
    liveShowText = `Live Show: ${liveShowName}${liveDjName ? ` with ${liveDjName}` : ""}`;
  }
 
  infoPopup.innerHTML = `
    <div><strong>Now Playing:</strong> ${nowPlayingText}</div>
    <div style="margin-top: 8px;"><strong>${liveShowText}</strong></div>
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
    //vibe-coded like crazy