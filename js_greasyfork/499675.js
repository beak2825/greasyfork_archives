// ==UserScript==
// @name         MAL - Unretard Related Entries
// @description  Reverts retarded changes from 2024-05-24 to related entries back to the sane list.
// @version      1.0.3
// @author       tariel36
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace    https://github.com/tariel36/MAL-Unretard-Related-Entries
// @match        https://myanimelist.net/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499675/MAL%20-%20Unretard%20Related%20Entries.user.js
// @updateURL https://update.greasyfork.org/scripts/499675/MAL%20-%20Unretard%20Related%20Entries.meta.js
// ==/UserScript==

const first = () => true;

function unfold() {
  Array.from(document.getElementsByClassName("hide-entry")).forEach((el) => {
    el.removeAttribute("style");
    el.classList.remove("hide-entry");
  });
}

function getGroupedEntries() {
  return Array.from(document.getElementsByClassName("entry"))
    .map((entry) => ({
      entry,
      key: entry
        .querySelector(".content")
        ?.querySelector(".relation")
        ?.innerText?.trim()
        ?.split("(")
        .find(first)
        ?.trim(),
    }))
    .filter((x) => !!x.key)
    .reduce((prev, curr) => {
      if (!prev[curr.key]) {
        prev[curr.key] = [];
      }
      prev[curr.key].push(curr.entry);
      return prev;
    }, {});
}

function getTableParent() {
  const foo = document.querySelector(".related-entries");

  return foo;
}

function getOrCreateEntriesTable(relatedEntriesContainer) {
  return (
    [...relatedEntriesContainer.getElementsByClassName("entries-table")]
      .find(first)
      ?.querySelector("tbody") ??
    (() => {
      const table = document.createElement("table");
      table.className = "entries-table";

      const tbody = document.createElement("tbody");

      // Append the tbody to the table
      table.appendChild(tbody);
      relatedEntriesContainer.appendChild(table);

      return tbody;
    })()
  );
}

function extractSectionsHeaders() {
  return [
    ...([...document.getElementsByClassName("entries-table")]
      .find(first)
      ?.querySelector("tbody")
      ?.querySelectorAll("td") ?? []),
  ].filter((x) => !!x && x.classList.contains("ar"));
}

function addEntriesToTable(table, retardedEntries, existingSections) {
  Object.keys(retardedEntries).forEach((y) => {
    const entriesCollection = retardedEntries[y];
    const key = y;

    const section =
      existingSections.find((z) =>
        (z.innerText ?? "").toUpperCase().includes(key.toUpperCase())
      ) ??
      (() => {
        const row = document.createElement("tr");

        const cell1 = document.createElement("td");
        cell1.textContent = ` ${key}: `;
        cell1.setAttribute("valign", "top");
        cell1.className = "ar fw-n borderClass nowrap";

        const cell2 = document.createElement("td");
        cell2.setAttribute("width", "100%");
        cell2.className = "borderClass";

        const ul = document.createElement("ul");
        ul.className = "entries";
        cell2.appendChild(ul);

        row.appendChild(cell1);
        row.appendChild(cell2);
        table.appendChild(row);

        return cell1;
      })();

    entriesCollection.forEach((z) => {
      const relationTypeRaw = (
        (z.querySelector(".relation").innerText.split("(") ?? []).at(-1) ?? ""
      ).trim();
      const actualRelationType = relationTypeRaw ? ` (${relationTypeRaw}` : "";

      const list = section.nextElementSibling.querySelector("ul");

      const li = document.createElement("li");
      const a = z.querySelector(".title").querySelector("a");
      a.innerText = (a.innerText ?? "").trim();

      li.appendChild(a);
      li.appendChild(document.createTextNode(` ${actualRelationType}`));

      list.appendChild(li);
    });
  });
}

function removeRetardedNodes(autoUnfold) {
  document.querySelector(".entries-tile")?.remove();

  if (autoUnfold) {
    document.querySelector(".related-entries > div:first-of-type")?.remove();
  }
}

function sortEntries(orderingArray) {
  const result = [
    ...([...document.getElementsByClassName("entries-table")]
      .find(first)
      ?.querySelector("tbody")
      ?.querySelectorAll("td") ?? []),
  ]
    .filter((x) => !!x && x.classList.contains("ar"))
    .map((x) => ({
      child: x,
      parent: x.parentNode,
      key: x.innerText.trim().slice(0, -1),
    }))
    .sort(
      (a, b) => orderingArray.indexOf(a.key) - orderingArray.indexOf(b.key)
    );

  return result;
}

function removeOldEntries(table) {
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

function addNewEntries(table, sortedArray) {
  sortedArray.forEach((x) => {
    table.appendChild(x.parent);
  });
}

function setSetting(key, value) {
  GM_setValue(key, value);
}

function registerOptions() {
  GM_registerMenuCommand("Set ordering list", () => {
    const color = prompt("Enter ordering list, separated by commas:");

    if (color) {
      setSetting("orderingArray", color);
    }
  });

  GM_registerMenuCommand("Set auto-unfold", () => {
    const text = prompt(
      "Provide value (true = auto-unfold, any other value is false):"
    );

    if (text) {
      setSetting("autoUnfold", text);
    }
  });
}

function getOptions() {
  const defaultOrdering =
    "Adaptation, Prequel, Sequel, Summary, Parent Story, Side Story, Alternative Version, Alternative Setting, Spin-Off, Other, Character";
  const orderingArray = (
    GM_getValue("orderingArray", defaultOrdering) ?? defaultOrdering
  )
    .split(",")
    .map((x) => (x ?? "").trim())
    .filter((x) => x.length > 0);

  const autoUnfold =
    (GM_getValue("autoUnfold", "true") ?? "true").toLowerCase() === "true";

  return { orderingArray, autoUnfold };
}

function unretard() {
  // Variables etc.
  registerOptions();
  const options = getOptions();

  // Unfold
  if (options.autoUnfold) {
    unfold();
  }

  // Get aggregated entries from retarded area
  const retardedEntries = getGroupedEntries();

  // Get table's parent
  const relatedEntriesContainer = getTableParent();

  // On FireFox, for some reason the script is run multiple times
  // and every time after the first one, container is not found,
  // so we just escape early.
  if (!relatedEntriesContainer) {
    return;
  }

  // Get table
  const table = getOrCreateEntriesTable(relatedEntriesContainer);

  // Get all sections headers
  const existingSections = extractSectionsHeaders();

  // Add entries
  addEntriesToTable(table, retardedEntries, existingSections);

  // Remove useless nodes
  removeRetardedNodes(options.autoUnfold);

  // Sort related entries in sane order
  const sortedArray = sortEntries(options.orderingArray);

  removeOldEntries(table);

  addNewEntries(table, sortedArray);
}

unretard();
