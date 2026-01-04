// ==UserScript==
// @name         Instantly join your private server
// @namespace    --
// @version      1.0
// @description  -0
// @author       Abara Cadabra
// @match        *://*.roblox.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540581/Instantly%20join%20your%20private%20server.user.js
// @updateURL https://update.greasyfork.org/scripts/540581/Instantly%20join%20your%20private%20server.meta.js
// ==/UserScript==


(function() {
  'use strict';

  function rqid(defaultVal = '') {
    let guess = prompt('Provide your roblox user id here', defaultVal);
    if (guess && guess.trim().match(/^\d+$/)) {
      localStorage.setItem('psTargetUserId', guess.trim());
      return guess.trim();
    }
    return null;
  }

  function glid() {
    const maybeLink = document.querySelector('a.text-link.dynamic-overflow-container[href*="/users/"][href*="/profile"]');
    if (!maybeLink) return null;
    const found = maybeLink.href.match(/\/users\/(\d+)\/profile/);
    return found ? found[1] : null;
  }

  async function gtid() {
    let stored = localStorage.getItem('psTargetUserId');
    if (stored) return stored;

    let detected = glid();
    if (detected) {
      const ok = confirm(`${detected}. Is this your user ID?`);
      if (ok) {
        localStorage.setItem('psTargetUserId', detected);
        return detected;
      }
    }
    return rqid(detected || '');
  }

  (async () => {
    const uid = await gtid();
    if (!uid) return;

    const target = `https://www.roblox.com/users/${uid}/profile`;
    const container = document.querySelector(".game-follow-button-container");
    if (!container || document.getElementById("ps-server-button")) return;

    container.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "tooltip-container";
    wrap.setAttribute("data-toggle", "tooltip");
    wrap.setAttribute("title", "");
    wrap.setAttribute("data-original-title", "Join private server");

    const btnWrapper = document.createElement("div");
    btnWrapper.className = "follow-button";

    const btn = document.createElement("a");
    btn.id = "ps-server-button";
    btn.setAttribute("role", "button");
    btn.style.cursor = "pointer";

    const icon = document.createElement("div");
    icon.className = "icon-friends";

    const label = document.createElement("div");
    label.className = "icon-label";
    label.textContent = "PS";

    btn.appendChild(icon);
    btn.appendChild(label);
    btnWrapper.appendChild(btn);
    wrap.appendChild(btnWrapper);
    container.appendChild(wrap);

    btn.addEventListener("click", async () => {
      label.textContent = "⏳";

      function clickTab() {
        const tab = document.querySelector('a.rbx-tab-heading[href="#game-instances"]');
        if (tab) tab.click();
      }

      function waitForServer(timeout = 10000) {
        return new Promise((resolve, reject) => {
          const start = Date.now();
          const interval = setInterval(() => {
            const servers = document.querySelectorAll('.card-item.card-item-private-server');
            for (const s of servers) {
              if (s.querySelector(`a[href="${target}"]`)) {
                clearInterval(interval);
                resolve(s);
                return;
              }
            }

            const elapsed = Date.now() - start;
            if (elapsed > 2500 && elapsed < timeout) {
              clickTab();
            }

            if (elapsed > timeout) {
              clearInterval(interval);
              reject("Cant find server in time");
            }
          }, 500);
        });
      }

      clickTab();

      try {
        const card = await waitForServer();
        const joinBtn = card.querySelector('button.rbx-private-game-server-join');
        if (joinBtn) {
          joinBtn.click();
          label.textContent = "✅";
        } else {
          alert("No join button found. If you don't have a private server, please create one and try again.");
          label.textContent = "❌";
        }
      } catch (error) {
        alert("No private servers found. Please create one for this to work.");
        label.textContent = "❌";
      }

      setTimeout(() => {
        label.textContent = "PS";
      }, 2000);
    });
  })();
})();
