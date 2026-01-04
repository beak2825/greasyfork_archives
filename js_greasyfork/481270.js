// ==UserScript==
// @name        BeatMods Compare
// @namespace   forked_bytes
// @match       https://beatmods.com/*
// @grant       none
// @version     1.2.0
// @author      forked_bytes
// @license     0BSD
// @description Compare mods available for different Beat Saber versions
// @downloadURL https://update.greasyfork.org/scripts/481270/BeatMods%20Compare.user.js
// @updateURL https://update.greasyfork.org/scripts/481270/BeatMods%20Compare.meta.js
// ==/UserScript==

let versionSelect = null;
let versionContainer = null;
let compareSelect = null;
let compareContainer = null;
let sort = null;
let sortDir = null;
let cache = {};

const results = h('div', { className: 'compare-results' });
const showAll = h('input', { type: 'checkbox', checked: true, onchange: update });

document.head.appendChild(h('style', { textContent: `
  .compare-results {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    gap: 0 2em;
  }
  .compare-results label {
    margin-left: 1em;
    font-size: 0.875rem;
  }
  .compare-results h5 {
    margin: 0.2em 0;
  }
  .compare-results ul {
    margin: 0;
    list-style-type: none;
  }
  .compare-results a {
    color: inherit;
  }
  .compare-version {
    color: #999;
  }
  .compare-added {
    color: #082;
    list-style-type: "+ ";
  }
  .compare-removed {
    color: #b99;
    text-decoration: line-through;
    list-style-type: "− ";
  }
  .compare-removed .compare-version {
    display: none;
  }
` }));

function main() {
  if (compareContainer?.isConnected) return;
  // Find "Game Version" dropdown
  versionSelect = document.querySelector('select[name=gv-select]');
  versionContainer = versionSelect?.parentNode.parentNode;
  if (!versionContainer) return;

  // Create "Compare Version" dropdown
  if (!compareContainer) {
    compareContainer = versionContainer.cloneNode(true);
    compareContainer.querySelector('label').textContent = 'Compare Version';
    compareSelect = compareContainer.querySelector('select');
    compareSelect.name = 'c-select';
    compareSelect.firstChild.textContent = 'None';
    compareSelect.firstChild.value = '';
    compareSelect.onchange = update;
  }
  versionContainer.insertAdjacentElement('afterend', compareContainer);
  compareSelect.value = '';
  // Trigger update when version or sort changes
  sort = compareContainer.nextElementSibling.querySelector('select');
  sortDir = compareContainer.nextElementSibling.nextElementSibling.querySelector('select');
  for (let select of [versionSelect, sort, sortDir]) {
    select.addEventListener('change', update);
  }
}

function update() {
  const versionA = versionSelect.value;
  const versionB = compareSelect.value;
  if (!versionB || versionA === 'any') {
    results.replaceChildren(); // Invalid version, hide comparison
    return;
  }
  // Get mods for both versions
  Promise.all([getMods(versionA), getMods(versionB)]).then(([modsA, modsB]) => {
    console.log(versionA, modsA);
    console.log(versionB, modsB);
    render(versionA, versionB, modsA, modsB);
  });
}

function getMods(version) {
  const url = `https://beatmods.com/api/v1/mod?search=&status=approved&gameVersion=${version}&sort=${sort.value}&sortDirection=${sortDir.value}`;
  return cache[url] || (cache[url] = fetch(url).then(r => r.json()));
}

function getDiff(modsA, modsB) {
  // Compare mods by name
  const namesA = new Set(modsA.map(m => m.name));
  const namesB = new Set(modsB.map(m => m.name));
  return {
    onlyA: modsA.filter(m => !namesB.has(m.name)),
    onlyB: modsB.filter(m => !namesA.has(m.name)),
    bothA: modsA.filter(m => namesB.has(m.name)),
    bothB: modsB.filter(m => namesA.has(m.name)),
  };
}

function render(versionA, versionB, modsA, modsB) {
  const diff = getDiff(modsA, modsB);
  // Render headers
  results.replaceChildren(
    h('h2', { textContent: `${versionA} (${modsA.length} total, +${diff.onlyA.length})` }),
    h('h2', { textContent: `${versionB} (${modsB.length} total, +${diff.onlyB.length})` }, [
      h('label', { textContent: 'Show all ' }, [showAll])
    ])
  );
  // Render mods
  if (sort.value === 'category_lower') {
    // Group by category
    const categories = Array.from(new Set(modsA.concat(modsB).map(m => m.category)));
    for (const cat of categories.sort()) {
      const a = modsA.filter(m => m.category === cat).sort((a, b) => a.name.localeCompare(b.name));
      const b = modsB.filter(m => m.category === cat).sort((a, b) => a.name.localeCompare(b.name));
      results.append(
        h('h5', { textContent: cat }),
        h('h5', { textContent: cat }),
        ...renderDiff(getDiff(a, b))
      );
    }
  } else {
    results.append(...renderDiff(diff));
  }
  document.querySelector('.mods').insertAdjacentElement('beforebegin', results);
}

function renderDiff(diff) {
  if (showAll.checked) {
    return [
      h('ul', {}, diff.onlyA.map(m => renderMod(m, 'compare-added'))),
      h('ul', {}, diff.onlyA.map(m => renderMod(m, 'compare-removed'))),
      h('ul', {}, diff.onlyB.map(m => renderMod(m, 'compare-removed'))),
      h('ul', {}, diff.onlyB.map(m => renderMod(m, 'compare-added'))),
      h('ul', {}, diff.bothA.map(m => renderMod(m))),
      h('ul', {}, diff.bothB.map(m => renderMod(m))),
    ];
  } else {
    return [
      h('ul', {}, diff.onlyA.map(m => renderMod(m))),
      h('ul', {}, diff.onlyB.map(m => renderMod(m))),
    ];
  }
}

function renderMod(mod, className = '') {
  return h('li', { className }, [
    h('a', {
      textContent: mod.name + ' ',
      href: mod.link,
      target: '_blank',
    }),
    h('small', {
      textContent: mod.version,
      className: 'compare-version',
    })
  ]);
}

function h(tag, {style, ...props} = {}, children = []) {
  const el = Object.assign(document.createElement(tag), props);
  if (style) Object.assign(el.style, style);
  el.append(...children);
  return el;
}

setInterval(main, 500);