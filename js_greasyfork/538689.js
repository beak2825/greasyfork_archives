// ==UserScript==
// @name         Internet Roadtrip Permanent Radio - CBC Radio One
// @description  Overrides Internet Roadtrip radio with CBC Radio One.
// @namespace    http://tampermonkey.net/
// @match        https://neal.fun/internet-roadtrip/
// @version      1.1
// @author       TotallyNotSamm
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @icon         https://cdn-profiles.tunein.com/s25304/images/logog.png?t=158336
// @downloadURL https://update.greasyfork.org/scripts/538689/Internet%20Roadtrip%20Permanent%20Radio%20-%20CBC%20Radio%20One.user.js
// @updateURL https://update.greasyfork.org/scripts/538689/Internet%20Roadtrip%20Permanent%20Radio%20-%20CBC%20Radio%20One.meta.js
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
  warningText.innerHTML = `This version of Internet Roadtrip CBC Radio One will no longer receive updates.<br><br>
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

  const container = await IRF.vdom.container;
  const originalUpdateData = container.methods.updateData;

  container.state.updateData = new Proxy(originalUpdateData, {
    apply: (target, thisArg, args) => {
      args[0].station = {
        name: "CBC Radio One",
        url: "https://cbcradiolive.akamaized.net/hls/live/2040990/ES_R1ASY/adaptive_192/chunklist_ao.m3u8",
        format: "hls",
      };

       IRF.vdom.radio.then(radio => {
        if (radio.state.isPoweredOn) {
          radio.state.stationInfo = "PLAYING";
        } else {
          radio.state.stationInfo = "TUNE IN";
        }
      });
      return Reflect.apply(target, thisArg, args);
    }
  });

})();
