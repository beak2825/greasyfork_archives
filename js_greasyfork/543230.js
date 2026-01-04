// ==UserScript==
// @name         BvS Zombjas Unified Skills Table (2025)
// @namespace    bvs
// @version      2.2.0
// @description  Unified skills table w/ radio buttons, maxed indicators, sorting, hidden inputs preserved, and action buttons on **BvS Zombjas Skills** page.
// @author       itsnyxtho
// @icon         https://github.com/itsnyxtho/bvs/blob/main/other/images/anime_cubed-icon.png?raw=true
// @include      http*://*animecubed*/billy/bvs/zombjaskills.html
// @grant        none
// @license      MIT
// @disclaimer   These scripts are provided 'as is' and without warranty of any kind. Use of these scripts is at your own risk and discretion.
// @downloadURL https://update.greasyfork.org/scripts/543230/BvS%20Zombjas%20Unified%20Skills%20Table%20%282025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543230/BvS%20Zombjas%20Unified%20Skills%20Table%20%282025%29.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement("style");
  style.textContent = `
    table[width="400"] {
      width: 550px !important;
    }
    td[width="400"] {
      width: unset !important;
    }
    .bvs-skill-table {
      background-color: #000;
      color: #fff;
      border-collapse: collapse;
      width: 100%;
      font-family: 'Fira Code', monospace;
      font-size: 10px;
      margin-top: 10px;
    }
    .bvs-skill-table th, .bvs-skill-table td {
      border: 1px solid #444;
      padding: 6px;
      vertical-align: middle;
    }
    .bvs-skill-table th {
      background-color: #111;
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
    }
    .bvs-skill-table td.name   { text-align: right; font-weight: 500; white-space: nowrap; }
    .bvs-skill-table td.level  { text-align: center; }
    .bvs-skill-table td.desc   { text-align: left; }
    .bvs-skill-table td.cost   { text-align: right; }
    .bvs-skill-table td.select { text-align: center; }

    .bvs-skill-lvl-1 { color: LimeGreen; }
    .bvs-skill-lvl-2 { color: DarkTurquoise; }
    .bvs-skill-lvl-3 { color: DeepSkyBlue; }
    .bvs-skill-lvl-4 { color: MediumOrchid; }
    .bvs-skill-lvl-5 { color: MediumVioletRed; }

    .bvs-upgradable { background-color: rgba(255,255,255,0.05); }
    .bvs-disabled   { opacity: 0.5; }

    .bvs-sort-asc::after  { content: " ▲"; }
    .bvs-sort-desc::after { content: " ▼"; }

    form[name="bskills"] > button {
      height: 28px;
      padding: 4px 12px;
      margin-top: 6px;
      color: white;
      font-family: 'Fira Code', monospace;
      font-weight: 500;
      font-size: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      justify-items: center;
    }

    #bvs-buy-skill-btn {
      float: right;
      background-color: #a00;
      border: 1px solid #900;
    }

    #bvs-zrewards-btn {
      background-color: #075;
      border: 1px solid #064;
      margin: 6px auto 0 auto;
    }

    #bvs-return-btn {
      float: left;
      background-color: #05a;
      border: 1px solid #049;
    }
  `;
  document.head.appendChild(style);

  const firaCodeFont = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css">`;
  document.head.innerHTML += firaCodeFont;

  const td = [...document.querySelectorAll("font")].find((f) => f?.textContent?.trim() === "Your Skills:")?.closest("td");
  const form = document.querySelector('form[name="bskills"]');
  if (!td || !form) return;

  const skillLevels = {};
  td.innerHTML.replace(/<b><i>([^<]+)<\/i>: <font[^>]+>(\d+)<\/font><\/b>/g, (_, name, level) => {
    skillLevels[name] = parseInt(level);
    return "";
  });

  const skillListFont = [...td.querySelectorAll("font")].find((f) => f?.textContent?.includes("Skill List:"));
  const descriptions = {};
  let node = skillListFont?.nextSibling;
  while (node) {
    if (node.nodeType === 1 && node.tagName === "B") {
      const name = node?.textContent?.trim();
      const desc = node?.nextSibling?.nodeType === 3 ? node?.nextSibling?.textContent?.replace(/^:\s*/, "").trim() : "";
      if (desc && name) descriptions[name] = desc;
    }
    const next = node?.nextSibling;
    node?.remove();
    node = next;
  }

  // === Build Skill Rows from Buy Skills
  const skillRows = [];
  const radios = [...form.querySelectorAll('input[type="radio"]')];
  const hiddenInputs = [...form.querySelectorAll('input[type="hidden"]')];
  const radioParent = radios[0]?.parentElement;
  const radioLines = radioParent?.innerHTML.split(/<br\s*\/?>|\n/i).filter((x) => x.includes('type="radio"'));
  radioParent.innerHTML = "";

  radioLines.forEach((line) => {
    const match = line.match(/<input[^>]+>(?:\s*)<b>([^<]+):<\/b> Current Level (\d+) \(Cost to Upgrade: ([^<]+)\)/);
    if (!match) return;
    const [, name, levelStr, costText] = match;
    const level = parseInt(levelStr);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = line;
    const input = wrapper.querySelector("input");

    const isMax = level > 4;
    const cost = isMax ? "Maxed!" : costText;
    const selectContent = isMax ? "✔✔" : "";
    skillRows.push({
      name,
      level,
      cost,
      input,
      selectContent,
      desc: descriptions[name] || "",
      class: input.disabled ? "bvs-disabled" : !isMax ? "bvs-upgradable" : "",
    });
  });

  const allNames = new Set([...Object.keys(skillLevels), ...Object.keys(descriptions)]);
  for (const name of allNames) {
    const isMax = skillLevels[name] > 4;
    const cost = isMax ? "Maxed!" : "-";
    const className = isMax ? "bvs-skill-lvl-5" : "";
    const selectContent = isMax ? "✔✔" : "";
    if (!skillRows.some((r) => r.name === name)) {
      skillRows.push({
        name,
        level: skillLevels[name] || 0,
        cost: cost || "",
        input: null,
        selectContent: selectContent || "",
        desc: descriptions[name] || "",
        class: className || "",
      });
    }
  }

  // === Create Table
  const table = document.createElement("table");
  table.className = "bvs-skill-table";
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th data-sort="name">Skill</th>
      <th data-sort="level">Level</th>
      <th>Description</th>
      <th>Upgrade Cost</th>
      <th>Select</th>
    </tr>
  `;
  const tbody = document.createElement("tbody");
  table.append(thead, tbody);

  const renderRows = (rows) => {
    tbody.innerHTML = "";
    rows.forEach(({ name, level, cost, desc, input, selectContent, class: rowClass }) => {
      const tr = document.createElement("tr");
      tr.className = rowClass;
      tr.innerHTML = `
        <td class="name">${name}</td>
        <td class="level bvs-skill-lvl-${Math.min(level, 5)}">${level}</td>
        <td class="desc">${desc}</td>
        <td class="cost">${cost}</td>
        <td class="select">${selectContent}</td>
      `;
      if (input) {
        tr.querySelector(".select").appendChild(input);
        tr.addEventListener("click", () => input.click());
      }
      tbody.appendChild(tr);
    });
  };

  renderRows(skillRows);

  const returnBtn = document.createElement("button");
  returnBtn.id = "bvs-return-btn";
  returnBtn.textContent = "<|| Zombjas";
  returnBtn.type = "button";
  returnBtn.addEventListener("click", () => {
    form.action = "/billy/bvs/zombjas.html";
    form.submit();
  });

  const zRewardsBtn = document.createElement("button");
  zRewardsBtn.id = "bvs-zrewards-btn";
  zRewardsBtn.textContent = "Z Rewards";
  zRewardsBtn.type = "button";
  zRewardsBtn.addEventListener("click", () => {
    form.action = "/billy/bvs/zombjarewards.html";
    form.submit();
  });

  const buyBtn = document.createElement("button");
  buyBtn.id = "bvs-buy-skill-btn";
  buyBtn.textContent = "Buy Skill ||>";
  buyBtn.type = "submit";

  // === Clear form and rebuild with hidden fields + new layout
  form.innerHTML = "";
  hiddenInputs.forEach((input) => form.appendChild(input));
  form.appendChild(table);
  form.appendChild(buyBtn);
  form.appendChild(returnBtn);
  form.appendChild(zRewardsBtn);

  //  Delete "ref" form
  const refForm = document.querySelector('form[name="ref"]');
  if (refForm) {
    refForm.remove();
  }

  // Sort
  let currentSort = { key: "name", dir: "asc" };
  const sortTable = (key) => {
    const dir = currentSort.key === key && currentSort.dir === "asc" ? "desc" : "asc";
    currentSort = { key, dir };
    const rows = [...tbody.querySelectorAll("tr")];
    rows.sort((a, b) => {
      const aText = a.querySelector(`td.${key}`)?.textContent.trim().toLowerCase() || "";
      const bText = b.querySelector(`td.${key}`)?.textContent.trim().toLowerCase() || "";
      return key === "level" ? (dir === "asc" ? aText - bText : bText - aText) : dir === "asc" ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });
    rows.forEach((r) => tbody.appendChild(r));
    thead.querySelectorAll("th").forEach((th) => {
      th.classList.remove("bvs-sort-asc", "bvs-sort-desc");
      if (th.dataset.sort === key) th.classList.add(`bvs-sort-${dir}`);
    });
  };

  thead.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => sortTable(th.dataset.sort));
  });

  td.style.display = "none";
})();
