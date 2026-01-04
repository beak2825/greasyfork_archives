// ==UserScript==
// @name         InfiniteCraft: Autocraft + Recipe Search
// @namespace    http://tampermonkey.net/
// @version      6.2.1
// @description  Adds draggable combo log for better ad overlay, autocrafting, lineage tracing, and combo search for Infinite Craft
// @author       Gasclu
// @match        https://neal.fun/infinite-craft/
// @match        https://beta.neal.fun/infinite-craft/
// @grant        none
// @run-at       document-end
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/539335/InfiniteCraft%3A%20Autocraft%20%2B%20Recipe%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/539335/InfiniteCraft%3A%20Autocraft%20%2B%20Recipe%20Search.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const lineageKey = "autocrafter_lineages";

  const AT = {
    infinitecraft: null,
    isCrafting: false,

    getLineages() {
      return JSON.parse(localStorage.getItem(lineageKey) || "{}");
    },

    saveLineage(a, b, result) {
      const lineages = AT.getLineages();
      lineages[result] = [a, b];
      localStorage.setItem(lineageKey, JSON.stringify(lineages));
    },

    traceSteps(result) {
      const lineages = AT.getLineages();
      const steps = [];
      const visited = new Set();

      function walk(item) {
        if (visited.has(item)) return;
        visited.add(item);
        const inputs = lineages[item];
        if (!inputs) return;
        const [a, b] = inputs;
        walk(a);
        walk(b);
        steps.push({ a, b, result: item });
      }

      walk(result);
      return steps;
    },

    showLineagePanel(result) {
      const steps = AT.traceSteps(result);
      if (steps.length === 0) return AT.showToast(`No lineage for "${result}"`);

      const container = document.createElement("div");
      container.id = "lineage-panel";
      container.style = `
        position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
        background: #1e1e1e; color: white; padding: 20px; border-radius: 10px;
        max-width: 500px; max-height: 70%; overflow-y: auto; z-index: 99999;
        box-shadow: 0 0 15px #000;
      `;

      const lineageHTML = steps.map(({ a, b, result }) => `
        <li class="lineage-step" data-result="${result}">
          <span class="clickable-element" data-name="${a}">${a}</span> +
          <span class="clickable-element" data-name="${b}">${b}</span> →
          <strong class="clickable-element" data-name="${result}">${result}</strong>
        </li>
      `).join("");

      container.innerHTML = `
        <h2 style="margin-top: 0;">📘 How to craft <span style="color:#0f0">${result}</span></h2>
        <ol style="line-height: 1.6;" id="lineage-steps">
          ${lineageHTML}
        </ol>
        <button style="margin-top:10px;" onclick="this.parentElement.remove()">Close</button>
      `;
      document.body.appendChild(container);

      const allSteps = Array.from(container.querySelectorAll(".lineage-step"));

      function highlightLineage(target) {
        const relatedResults = new Set(AT.traceSteps(target).map(s => s.result));
        allSteps.forEach(step => {
          const r = step.dataset.result;
          const isRelevant = relatedResults.has(r);
          step.style.background = isRelevant ? "#003300" : "transparent";
          step.style.color = isRelevant ? "lime" : "white";

          step.querySelectorAll(".clickable-element").forEach(el => {
            el.style.color = (isRelevant && el.textContent === target) ? "lime" : (isRelevant ? "#0f0" : "white");
          });
        });
      }

      container.querySelectorAll('.clickable-element').forEach(el => {
        el.style.cursor = 'pointer';
        el.style.color = '#0f0';
        el.onclick = () => {
          highlightLineage(el.dataset.name);
        };
      });
    },

    showComboSearch() {
      const div = document.createElement("div");
      div.id = "combo-search";
      div.innerHTML = `
        <div style="
          position: fixed; top: 30%; left: 50%; transform: translateX(-50%);
          background: linear-gradient(to bottom right, #3c763d, #2e4d2e);
          color: white; padding: 20px; border-radius: 10px; text-align: center;
          box-shadow: 0 0 20px #000; z-index: 99999; width: 320px;
        ">
          <h3>🔍 Combo Search</h3>
          <input id="combo-input" type="text" placeholder="Enter element..." style="
            width: 90%; padding: 8px; border-radius: 5px; border: none; margin-bottom: 10px;
            background: #f0fff0; color: black; text-align: center;
          " />
          <div id="combo-results" style="text-align:left; max-height:150px; overflow-y:auto; background:#f0fff0; color:black; padding:5px; border-radius:5px;"></div>
          <button onclick="document.getElementById('combo-search').remove()">Close</button>
        </div>
      `;
      document.body.appendChild(div);

      const input = div.querySelector("#combo-input");
      const results = div.querySelector("#combo-results");

      input.addEventListener("input", () => {
        const q = input.value.toLowerCase();
        results.innerHTML = "";

        const matches = [];
        const lineage = AT.getLineages();
        for (let [result, [a, b]] of Object.entries(lineage)) {
          if (a.toLowerCase().includes(q) || b.toLowerCase().includes(q)) {
            matches.push(`${a} + ${b} → <strong>${result}</strong>`);
          }
        }

        results.innerHTML = matches.length === 0
          ? "<i>No matches found</i>"
          : "<ul style='padding-left:20px'>" + matches.map(m => `<li>${m}</li>`).join("") + "</ul>";
      });
    },

    showSearchModal() {
      if (document.getElementById("earth-modal")) return;

      const div = document.createElement("div");
      div.id = "earth-modal";
      div.innerHTML = `
        <div style="
          position: fixed; top: 30%; left: 50%; transform: translateX(-50%);
          background: linear-gradient(to bottom right, #3c763d, #2e4d2e);
          color: white; padding: 20px; border-radius: 10px; text-align: center;
          box-shadow: 0 0 20px #000; z-index: 99999; width: 300px;
        ">
          <h3>🌍 Lineage Search</h3>
          <input id="lineage-input" type="text" autocomplete="off" placeholder="Enter element..." style="
            width: 90%; padding: 8px; border-radius: 5px; border: none; margin-bottom: 10px;
            background: #f0fff0; color: black; text-align: center;
          " />
          <ul id="autocomplete-list" style="
            list-style: none; padding: 0; margin: 0 auto 10px; max-height: 100px;
            overflow-y: auto; background: #f0fff0; color: black; border-radius: 5px;
            width: 90%; text-align: left; font-size: 14px;
          "></ul>
          <button id="lineage-show">Show</button>
          <button onclick="document.getElementById('earth-modal').remove()">Cancel</button>
        </div>
      `;
      document.body.appendChild(div);

      const input = document.getElementById("lineage-input");
      const list = document.getElementById("autocomplete-list");

      input.addEventListener("input", () => {
        const val = input.value.toLowerCase();
        list.innerHTML = "";
        if (!val) return;

        const matches = AT.infinitecraft.items
          .map(i => i.text)
          .filter(name => name.toLowerCase().includes(val))
          .sort((a, b) => a.toLowerCase().indexOf(val) - b.toLowerCase().indexOf(val))
          .slice(0, 8);

        for (let name of matches) {
          const li = document.createElement("li");
          li.textContent = name;
          li.style.padding = "5px 10px";
          li.style.cursor = "pointer";
          li.onclick = () => {
            input.value = name;
            list.innerHTML = "";
          };
          list.appendChild(li);
        }
      });

      document.getElementById("lineage-show").onclick = () => {
        const name = input.value.trim();
        if (name) AT.showLineagePanel(name);
        div.remove();
      };
    },

    initComboLog() {
      let log = document.getElementById("combo-log");
      if (!log) {
        log = document.createElement("div");
        log.id = "combo-log";
        log.style = `
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.95);
          color: white;
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
          font-family: monospace;
          font-size: 13px;
          border-radius: 8px 8px 0 0;
          z-index: 99999;
          width: 336px;
          cursor: move;
        `;
        log.innerHTML = `<div id="combo-log-content" style="max-height: 180px; overflow-y: auto;"></div>`;
        document.body.appendChild(log);

        // Draggable support
        let isDragging = false, startX = 0, startLeft = 0;
        log.addEventListener("mousedown", e => {
          isDragging = true;
          startX = e.clientX;
          startLeft = log.offsetLeft;
          e.preventDefault();
        });
        document.addEventListener("mousemove", e => {
          if (isDragging) {
            const deltaX = e.clientX - startX;
            log.style.left = `${startLeft + deltaX}px`;
            log.style.transform = "translateX(0)";
          }
        });
        document.addEventListener("mouseup", () => {
          isDragging = false;
        });
      }
    },

    logCombo(a, b, result, success) {
      AT.initComboLog();
      const div = document.createElement("div");
      div.innerHTML = `${a} + ${b} → <strong>${result || "Nothing"}</strong>`;
      div.style.color = success ? "lime" : "red";
      document.getElementById("combo-log-content").appendChild(div);
      const log = document.getElementById("combo-log-content");
      log.scrollTop = log.scrollHeight;
    },

    showToast(msg) {
      const div = document.createElement("div");
      div.textContent = msg;
      Object.assign(div.style, {
        position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
        background: "#444", color: "white", padding: "10px 20px", borderRadius: "6px",
        zIndex: 10000, opacity: 0, transition: "opacity 0.3s ease"
      });
      document.body.appendChild(div);
      setTimeout(() => div.style.opacity = 1, 10);
      setTimeout(() => {
        div.style.opacity = 0;
        setTimeout(() => div.remove(), 300);
      }, 2500);
    },

    monitorCrafts() {
      const orig = AT.infinitecraft.craft;
      AT.infinitecraft.craft = async (a, b) => {
        const result = await orig.call(AT.infinitecraft, a, b);
        const last = AT.infinitecraft.items.at(-1);
        if (last && last.text) {
          AT.saveLineage(a.text, b.text, last.text);
        }
        return result;
      };
    },

    startAutoCraft() {
      const loop = async () => {
        while (AT.isCrafting) {
          const items = AT.infinitecraft.items;
          const a = items[Math.floor(Math.random() * items.length)].text;
          const b = items[Math.floor(Math.random() * items.length)].text;
          const before = items.length;
          await AT.infinitecraft.craft({ text: a }, { text: b });
          const after = AT.infinitecraft.items.length;
          const result = AT.infinitecraft.items.at(-1);
          const success = after > before;
          if (success && result?.text) {
            AT.saveLineage(a, b, result.text);
          }
          AT.logCombo(a, b, success ? result?.text : null, success);
          AT.infinitecraft.instances = [];
          await new Promise(r => setTimeout(r, 200));
        }
      };
      loop();
    },

    addButtons() {
      const controls = document.querySelector(".side-controls");
      if (!controls) return setTimeout(AT.addButtons, 200);

      const addBtn = (text, action) => {
        const btn = document.createElement("div");
        btn.textContent = text;
        btn.className = "tool-icon";
        btn.style.cssText = `
          font-size: 13px;
          padding: 6px 10px;
          background: #3a5f3a;
          color: white;
          border-radius: 6px;
          margin-top: 8px;
          text-align: center;
          cursor: pointer;
        `;
        btn.onclick = action;
        controls.appendChild(btn);
      };

      const icon = document.createElement("img");
      icon.src = "https://i.imgur.com/WlkWOkU.png";
      icon.classList.add("tool-icon");
      icon.style.width = "32px";
      icon.style.height = "32px";
      icon.style.filter = "brightness(1)";
      icon.title = "Auto-Crafter";
      icon.onclick = () => {
        AT.isCrafting = !AT.isCrafting;
        icon.style.filter = AT.isCrafting
          ? "drop-shadow(0 0 5px lime) brightness(1.5)"
          : "brightness(1)";
        if (AT.isCrafting) AT.startAutoCraft();
      };
      controls.appendChild(icon);

      addBtn("🌍 Lineage Search", AT.showSearchModal);
      addBtn("🔍 Combo Search", AT.showComboSearch);
    },

    start() {
      const vue = document.querySelector(".container")?.__vue__;
      if (!vue) return setTimeout(AT.start, 200);
      AT.infinitecraft = vue;
      AT.addButtons();
      AT.monitorCrafts();
      console.log("✅ InfiniteCraft v5.9 Loaded with draggable combo log!");
    }
  };

  window.AT = AT;
  AT.start();
})();
;

