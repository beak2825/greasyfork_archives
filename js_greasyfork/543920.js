// ==UserScript==
// @name         WME Change Speed
// @version      1.3
// @namespace    https://greasyfork.org/users/1499279
// @author       DeKoerier
// @description  Verhoog of verlaag de snelheid van de geselecteerde segmenten. Gebruik 1 voor verlagen en 2 voor verhogen. Wissel tussen km/u en mph in het sidebar menu.
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @license      GNU GPLv3
// @connect      greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543920/WME%20Change%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/543920/WME%20Change%20Speed.meta.js
// ==/UserScript==

const SCRIPT_VERSION = "1.3";
const SCRIPT_NAME = "WME Change Speed";

const WHATS_NEW = {
    "1.3": "- Logica toegepast om 1 te gebruiken bij verlagen en 2 bij verhogen. Was voorheen andersom.",
    "1.2": "- Probleem opgelost waarin snelheid niet aangepast werd als segment maar één richting was",
    "1.1": "- MPH ondersteuning toegevoegd\n- Sidebar layout verbeterd",
    "1.0": "- Eerste werkende versie met km/u ondersteuning"
};

function versionCheck() {
    const storageKey = 'WMEChangeSpeed_Version';
    const previous = localStorage.getItem(storageKey);

    if (previous !== SCRIPT_VERSION) {
        const changes = Object.entries(WHATS_NEW)
        .filter(([ver]) => !previous || ver > previous)
        .map(([ver, msg]) => `${ver}:\n${msg}`)
        .join("\n\n");

        if (changes) {
            alert(`${SCRIPT_NAME} geüpdatet naar versie ${SCRIPT_VERSION}\n\n${changes}`);
        }

        localStorage.setItem(storageKey, SCRIPT_VERSION);
    }
}


(function () {
  'use strict';

  let useMph = false;

  const waitSDK = setInterval(() => {
    if (window.SDK_INITIALIZED && typeof window.getWmeSdk === 'function') {
      clearInterval(waitSDK);
      window.SDK_INITIALIZED.then(initScript);
    }
  }, 200);

  function initScript() {
    const sdk = window.getWmeSdk({
      scriptId: "wme_change_speed_sdk",
      scriptName: "Change Speed"
    });

    sdk.Events.once({ eventName: "wme-ready" }).then(() => {
      console.log("✅ SDK en WME klaar");

      registerShortcuts(sdk);
      registerTab(sdk);
      registerSelectionLogger(sdk);

      console.log("✅ Script geladen en actief");
    });
  }

  function registerShortcuts(sdk) {
    sdk.Shortcuts.createShortcut({
      shortcutId: "speed_up",
      description: "Snelheid verhogen",
      shortcutKeys: "2",
      callback: () => adjustSpeed(sdk, getSpeedStep())
    });

    sdk.Shortcuts.createShortcut({
      shortcutId: "speed_down",
      description: "Snelheid verlagen",
      shortcutKeys: "1",
      callback: () => adjustSpeed(sdk, -getSpeedStep())
    });

    console.log("✅ Shortcuts actief: 1 = omlaag en 2 = omhoog");
  }

  function getSpeedStep() {
    return useMph ? 5 : 10;
  }

  function toDisplay(speedKmh) {
    return useMph ? Math.round(speedKmh / 1.609344) : speedKmh;
  }

  function toKmh(displaySpeed) {
    return useMph ? Math.round(displaySpeed * 1.609344) : displaySpeed;
  }

  function adjustSpeed(sdk, delta) {
    const selection = sdk.Editing.getSelection();
    if (!selection || selection.objectType !== 'segment') {
      console.warn("⚠️ Geen segmenten geselecteerd");
      return;
    }

    selection.ids.forEach(id => {
      const seg = sdk.DataModel.Segments.getById({ segmentId: id });
      if (!seg) return;

      const fwd = toDisplay(seg.fwdSpeedLimit || 0);
      const rev = toDisplay(seg.revSpeedLimit || 0);

      const newFwd = Math.max(0, toKmh(fwd + delta));
      const newRev = Math.max(0, toKmh(rev + delta));

      const updateData = {};

      if (seg.fwdSpeedLimit != null) {
          updateData.fwdSpeedLimit = newFwd;
      }
      if (seg.revSpeedLimit != null) {
          updateData.revSpeedLimit = newRev;
      }

      if (Object.keys(updateData).length > 0) {
          sdk.DataModel.Segments.updateSegment({
              segmentId: seg.id,
              ...updateData
      });

          console.log(`↕️ Segment ${seg.id}: A>B ${seg.fwdSpeedLimit} → ${updateData.fwdSpeedLimit ?? 'n.v.t.'}, B>A ${seg.revSpeedLimit} → ${updateData.revSpeedLimit ?? 'n.v.t.'}`);
      } else {
          console.warn(`⚠️ Segment ${seg.id} heeft geen richting om aan te passen`);
      }
    });
  }

  function registerSelectionLogger(sdk) {
    sdk.Events.on({
      eventName: "wme-selection-changed",
      eventHandler: () => {
        const sel = sdk.Editing.getSelection();
        if (sel?.objectType === 'segment') {
          console.log("🔍 Segmenten geselecteerd:", sel.ids);
        } else {
          console.log("⚠️ Geen segmentselectie actief");
        }
      }
    });
  }

  versionCheck();

  function registerTab(sdk) {
    sdk.Sidebar.registerScriptTab().then(({ tabLabel, tabPane }) => {
      tabLabel.innerText = "ChangeSpeed";
      tabLabel.title = "Snelheden bekijken";

      tabPane.id = "speedhelper-tab";
      tabPane.innerHTML = `
        <div style="padding: 10px;">
          <h2>Snelheden</h2>
          <p>Druk op 1 om snelheid te verlagen of 2 om te verhogen, of bekijk huidige waardes hier:</p>
          <label><input type="radio" name="unit" value="kmh" checked> km/u</label>
          <label style="margin-left: 10px;"><input type="radio" name="unit" value="mph"> mph</label>
          <pre id="segmentInfo" style="margin-top:10px; background:#f8f8f8; padding:8px;"></pre>
          <p style="margin-top:15px; font-size: 13px;">ℹ️ Bij <strong>km/u</strong> wordt de snelheid in stappen van <strong>10 km/u</strong> aangepast.</p>
          <p style="font-size: 13px;">ℹ️ Bij <strong>mph</strong> wordt de snelheid in stappen van <strong>5 mph</strong> aangepast.</p>
        </div>
        <div style="padding: 10px;">
        <small>${SCRIPT_NAME} v${SCRIPT_VERSION}</small>
        </div>
      `;

      document.querySelectorAll('input[name="unit"]').forEach(radio => {
        radio.addEventListener('change', e => {
          useMph = e.target.value === 'mph';
          updateSegmentInfo(sdk);
        });
      });

      new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) updateSegmentInfo(sdk);
        });
      }).observe(tabPane.parentElement);

      document.getElementById("btnSegmentInfo").onclick = () => updateSegmentInfo(sdk);
    });
  }

  function updateSegmentInfo(sdk) {
    const out = document.getElementById("segmentInfo");
    const selection = sdk.Editing.getSelection();

    if (!selection || selection.objectType !== 'segment') {
      out.innerText = "⚠️ Selecteer segmenten om informatie te tonen.";
      return;
    }

    const lines = selection.ids.map(id => {
      const seg = sdk.DataModel.Segments.getById({ segmentId: id });
      if (!seg) return `Segment ${id} → ⚠️ Niet gevonden`;

      const fwd = seg.fwdSpeedLimit != null ? `${toDisplay(seg.fwdSpeedLimit)} ${useMph ? 'mph' : 'km/u'}` : '–';
      const rev = seg.revSpeedLimit != null ? `${toDisplay(seg.revSpeedLimit)} ${useMph ? 'mph' : 'km/u'}` : '–';

      return `Geselecteerd segment ${id}\n  A>B: ${fwd}\n  B>A: ${rev}`;
    });

    out.innerText = lines.join('\n\n');
  }

})();
