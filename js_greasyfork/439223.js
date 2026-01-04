// ==UserScript==
// @name         Tampermonkey Clean tmclean
// @namespace    https://userscript.snomiao.com/
// @version      0.0.1
// @description  Delete all disabled and duplicated scripts.
// @author       snomiao@gmail.com
// @match        *://calendar.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439223/Tampermonkey%20Clean%20tmclean.user.js
// @updateURL https://update.greasyfork.org/scripts/439223/Tampermonkey%20Clean%20tmclean.meta.js
// ==/UserScript==

// chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#url=aHR0cHM6Ly93d3cuemhpaHUuY29tL2NyZWF0b3I=&nav=dashboard

// delete all disabled scripts
[...document.querySelectorAll('[title="Delete"]')]
  .filter((e) =>
    e.parentElement.parentElement.parentElement.innerHTML.match(
      /title="Disabled"/
    )
  )
  .map((e) => e.click());

// delete duplicated scripts (keep the first)
[...document.querySelectorAll("tr.scripttr")]
  .map((e) => ({
    id: e.querySelector(".script_name")?.textContent,
    e,
  }))
  .filter(({ id }) => id)
  .reduce(
    (dups, { id, e }, i, a) => [
      ...dups,
      a.slice(0, i).find((e) => e.id === id),
    ],
    []
  )
  .filter((e) => e)
  .map(({ id, e }) => {
    console.log("Delete " + id);
    e.querySelector('[title="Delete"]').click();
  });
