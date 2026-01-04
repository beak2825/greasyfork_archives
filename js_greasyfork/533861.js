// ==UserScript==
// @name         Kurnik Dice – Monte Carlo Szanse
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Szacowanie szans z losową symulacją (Monte Carlo) i ręcznym wyborem kości
// @match        https://www.kurnik.pl/kosci*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533861/Kurnik%20Dice%20%E2%80%93%20Monte%20Carlo%20Szanse.user.js
// @updateURL https://update.greasyfork.org/scripts/533861/Kurnik%20Dice%20%E2%80%93%20Monte%20Carlo%20Szanse.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const categories = ['Generał', '4x', '3x', 'Full', 'Mały strit', 'Duży strit'];

  const countOccurrences = (arr) => {
    const counts = Array(6).fill(0);
    arr.forEach(d => counts[d - 1]++);
    return counts;
  };

  const checkCombo = (dice) => {
    const counts = countOccurrences(dice);
    const isGeneral = counts.includes(5);
    const is4x = counts.includes(4);
    const is3x = counts.includes(3);
    const pairs = counts.filter(c => c === 2).length;
    const isFull = is3x && pairs >= 1;
    const smallStrit =
      (counts[0] && counts[1] && counts[2] && counts[3]) ||
      (counts[1] && counts[2] && counts[3] && counts[4]) ||
      (counts[2] && counts[3] && counts[4] && counts[5]);
    const duzyStrit =
      counts.slice(0, 5).every(c => c === 1) ||
      counts.slice(1, 6).every(c => c === 1);

    return {
      'Generał': isGeneral,
      '4x': is4x || isGeneral,
      '3x': is3x || is4x || isGeneral,
      'Full': isFull || isGeneral,
      'Mały strit': smallStrit || duzyStrit,
      'Duży strit': duzyStrit
    };
  };

  const monteCarloSim = (heldDice, rollsLeft, iterations = 5000) => {
    const results = {};
    categories.forEach(c => results[c] = 0);
    const rerollCount = 5 - heldDice.length;

    for (let i = 0; i < iterations; i++) {
      let current = [...heldDice];
      for (let r = 0; r < rollsLeft; r++) {
        const fillCount = 5 - current.length;
        const rolled = Array.from({ length: fillCount }, () => Math.floor(Math.random() * 6) + 1);
        current = [...current, ...rolled].slice(0, 5);
      }

      const combo = checkCombo(current);
      categories.forEach(cat => {
        if (combo[cat]) results[cat]++;
      });
    }

    const percentages = {};
    categories.forEach(cat => {
      percentages[cat] = ((results[cat] / iterations) * 100).toFixed(1) + '%';
    });

    return percentages;
  };

  const createPanel = () => {
    const panel = document.createElement("div");
    panel.id = "monteCarloPanel";
    panel.style.position = "fixed";
    panel.style.top = "20px";
    panel.style.right = "20px";
    panel.style.background = "#fff";
    panel.style.border = "1px solid #ccc";
    panel.style.padding = "10px";
    panel.style.zIndex = "9999";
    panel.style.fontSize = "13px";
    panel.style.fontFamily = "Arial";
    panel.style.width = "240px";
    panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";

    panel.innerHTML = `
      <b>🎲 Szanse (Monte Carlo)</b><br><br>
      <label>Rzut (np. 12356):</label><br>
      <input type="text" id="diceInput" style="width:100%"><br><br>

      <div id="checkboxContainer"></div>

      <label>Pozostałe rzuty:</label><br>
      <select id="rerollsLeft" style="width:100%">
        <option value="1">1 (środkowy)</option>
        <option value="2">2 (pierwszy)</option>
      </select><br><br>

      <button id="calcBtn">📊 Oblicz szanse</button>
      <div id="results" style="margin-top:10px;"></div>
    `;

    document.body.appendChild(panel);

    const updateCheckboxes = () => {
      const val = document.getElementById("diceInput").value.trim();
      const cleaned = val.replace(/[^1-6]/g, "").split("").map(Number);
      const container = document.getElementById("checkboxContainer");
      container.innerHTML = "";

      if (cleaned.length !== 5) return;

      cleaned.forEach((d, i) => {
        const line = document.createElement("div");
        line.innerHTML = `🎲 ${d} <label><input type="checkbox" data-index="${i}"> zatrzymaj</label>`;
        container.appendChild(line);
      });
    };

    document.getElementById("diceInput").addEventListener("input", updateCheckboxes);

    document.getElementById("calcBtn").onclick = () => {
      const raw = document.getElementById("diceInput").value.trim();
      const cleaned = raw.replace(/[^1-6]/g, "").split("").map(Number);
      const checkboxes = document.querySelectorAll("#checkboxContainer input[type=checkbox]");
      const heldDice = [];
      checkboxes.forEach(cb => {
        if (cb.checked) {
          const i = parseInt(cb.dataset.index);
          heldDice.push(cleaned[i]);
        }
      });

      if (cleaned.length !== 5 || heldDice.length > 5) {
        alert("Upewnij się, że rzut zawiera 5 kości 1–6.");
        return;
      }

      const rollsLeft = parseInt(document.getElementById("rerollsLeft").value);
      const result = monteCarloSim(heldDice, rollsLeft, 5000);

      const resBox = document.getElementById("results");
      resBox.innerHTML = `<b>📈 Szanse:</b><br>` +
        Object.entries(result).map(([k, v]) => `${k}: ${v}`).join("<br>");
    };
  };

  window.addEventListener("load", () => {
    setTimeout(createPanel, 300);
  });
})();
