// ==UserScript==
// @name         TemTem MapGenie Tweaks
// @namespace    https://github.com/Silverfeelin/
// @version      0.5
// @description  Adds some info to the TemTem MapGenie site.
// @author       Silverfeelin
// @license      MIT
// @match        https://mapgenie.io/temtem/maps/*
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js

// @downloadURL https://update.greasyfork.org/scripts/451203/TemTem%20MapGenie%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/451203/TemTem%20MapGenie%20Tweaks.meta.js
// ==/UserScript==

// #region Constants

const pollInterval = 200;
const wikiUrl = 'https://temtem.wiki.gg/wiki';
const temtemList = [
  'Mimit', 'Oree', 'Zaobian', 'Chromeon', 'Halzhi',
  'Molgu', 'Platypet', 'Platox', 'Platimous', 'Swali',
  'Loali', 'Tateru', 'Gharunder', 'Mosu', 'Magmut',
  'Paharo', 'Paharac', 'Granpah', 'Ampling', 'Amphatyr',
  'Bunbun', 'Mudrid', 'Hidody', 'Taifu', 'Fomu',
  'Wiplump', 'Skail', 'Skunch', 'Goty', 'Mouflank',
  'Rhoulder', 'Houchic', 'Tental', 'Nagaise', 'Orphyll',
  'Nidrasil', 'Banapi', 'Capyre', 'Lapinite', 'Azuroc',
  'Zenoreth', 'Reval', 'Aohi', 'Bigu', 'Babawa',
  '0b1', '0b10', 'Kaku', 'Saku', 'Valash',
  'Towly', 'Owlhe', 'Barnshe', 'Gyalis', 'Occlura',
  'Myx', 'Raiber', 'Raize', 'Raican', 'Pewki',
  'Piraniant', 'Scarawatt', 'Scaravolt', 'Hoglip', 'Hedgine',
  'Osuchi', 'Osukan', 'Osukai', 'Saipat', 'Pycko',
  'Drakash', 'Crystle', 'Sherald', 'Tortenite', 'Innki',
  'Shaolite', 'Shaolant', 'Cycrox', 'Hocus', 'Pocus',
  'Smolzy', 'Sparzy', 'Golzy', 'Mushi', 'Mushook',
  'Magmis', 'Mastione', 'Umishi', 'Ukama', 'Galvanid',
  'Raignet', 'Smazee', 'Baboong', 'Seismunch', 'Zizare',
  'Gorong', 'Mitty', 'Sanbi', 'Momo', 'Kuri',
  'Kauren', 'Spriole', 'Deendre', 'Cerneaf', 'Toxolotl',
  'Noxolotl', 'Blooze', 'Goolder', 'Zephyruff', 'Volarend',
  'Grumvel', 'Grumper', 'Ganki', 'Gazuma', 'Oceara',
  'Yowlar', 'Droply', 'Garyo', 'Broccoblin', 'Broccorc',
  'Broccolem', 'Shuine', 'Nessla', 'Valiar', 'Pupoise',
  'Loatle', 'Kalazu', 'Kalabyss', 'Adoroboros', 'Tuwai',
  'Tukai', 'Tulcan', 'Tuvine', 'Turoc', 'Tuwire',
  'Tutsu', 'Kinu', 'Vulvir', 'Vulor', 'Vulcrane',
  'Pigepic', 'Akranox', 'Koish', 'Vulffy', 'Chubee',
  'Waspeen', 'Mawtle', 'Mawmense', 'Hazrat', 'Minttle',
  'Minox', 'Minothor', 'Maoala', 'Venx', 'Venmet',
  'Vental', 'Chimurian', 'Arachnyte', 'Thaiko', 'Monkko',
  'Anahir', 'Anatan', 'Tyranak', 'Volgon'
];
const typeList = [
  'Neutral', 'Wind', 'Earth', 'Water', 'Fire', 'Nature',
  'Electric', 'Mental', 'Digital', 'Melee', 'Crystal', 'Toxic'
];
const typeIndex = typeList.reduce((o, v, i) => { o[v]=i; return o; }, {});
const typeImages = [
  '1tKqW05', 'Oz6hbLD', 'CHetaWi',
  '27rFFjB', 'EUqkYeA', '4tkKMzG',
  '9jJOKYg', 'dgAKCYS', '35aZSQ8',
  'UklP6t2', 'x7GKRcP', 'wpv3hl5',
].map(i => `https://i.imgur.com/${i}.webp`);

const categoryIds = {
  temtem: 190,
  items: 191,
  other: 193
};
const markerImage = 'https://i.imgur.com/D9vSeka.png';

// #endregion

const temtems = {};
// locationId: { id*, completed*, pos*, marker };
let trackedMarkers = {};

// Entry
(async () => {
  GM.addStyle(`
    :root {
      --search-height: 34px;
    }

    .p-rel { position: relative !important; }
    .p-abs { position: absolute !important; }

    .stt-t img { width: 20px; }

    .stt-t {
      display: grid;
      grid-template-columns: repeat(12, auto);
    }

    .stt-t div {
      min-width: 25px;
    }

    .stt-t-h, .stt-t-c {
      color: #000;
      font-size: 14px;      
      text-align: center;
    }

    .stt-t-c {
      padding: 2px 3px;
    }
    
    .stt-t-h { background: #2f3b47; }
    .stt-t-h.active { background: green; }
    .stt-t-h.option { background: #ddd; cursor: pointer; }
    .stt-t .eq { background: #ffff6e !important; }
    .stt-t .pos { background: #55ff6e !important; }
    .stt-t .neg { background: #ff6e6e !important; }

    .marker-buttons { border-top: 1px solid rgba(253,243,207,0.2); }

    .marker-buttons div { display: inline-block !important; }
    .marker-buttons .marker-button-fancy { border: none !important; }

    .stt-found { margin-left: 20px; }
    .stt-green { background: #114c11 !important; }

    .stt-marker { padding-bottom: 44px; }

    .stt-widget-toggle {
      z-index: 999;
      right: 60px; bottom: 10px;
      width: 20px; height: 20px;
      background: #fff;
      border-radius: 1px;
    }

    .stt-widget {
      z-index: 900;
      right: 60px; bottom: 10px;
      width: 316px; height: 371px;
      background: #20262c;
      border-radius: 2px;
      box-shadow: 0px 0px 2px black;
      overflow: hidden;
    }
    .stt-widget.hidden { display: none; }

    .stt-w-search {
      width: 100%;
      height: var(--search-height);
      padding: 0 8px;
      background: #2f3b47;
      border: 0;
      color: White;
      font-size: 16px;
    }
    .stt-w-results {
      top: var(--search-height);
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-content: stretch;
      align-items: stretch;
    }

    .stt-w-result {
      position: relative;
      padding: 8px;
      text-transform: capitalize;
    }
    .stt-w-result.sel {
      /*background: green;*/
    }
    .stt-w-result a {
      color: #fff;
    }

    .stt-w-result-types {
      position: absolute;
      top: 4px; right: 7px;
    }
    .stt-w-result-types img { width: 20px; }
  `);

  // Load data from greasy storage.
  // await clearStoredData();
  await loadStoredData();
  initializeMarkers();
  addWidget();

  // Poll visible marker to inject info.
  setInterval(async () => {
    const marker = document.querySelector('#marker-info:not(.stt)');
    if (!marker) return;
    marker.classList.add('stt');

    const title = marker.querySelector('h3')?.innerText?.trim() || '';
    const category = marker.querySelector('.category')?.innerText?.trim();

    const markerProps = marker[Object.keys(marker).filter(k => k.startsWith('__reactProps'))[0] || ''];
    const ownerProps = markerProps?.children?.filter(f => f?.type === 'h3')[0]?._owner?.memoizedProps;
    const categoryId = ownerProps.category?.group_id;

    removeThatAnnoyingProReminder(marker);
    hijackThatFoundCheckbox(marker);

    // Add contextual information.
    if (categoryId === categoryIds.other && (category === 'Tamer' || category === 'Dojo')) {
      populateTamer(marker);
    } else if (categoryId == categoryIds.temtem) {
      await populateTemtemAsync(marker);
    }
  }, pollInterval);
})();

// #region Storage

const storageColumns = ['id', 'completed', 'pos'];
async function loadStoredData() {
  const storageData = JSON.parse(await GM.getValue('stt', '{}'));
  console.log('STT', storageData);

  // Initialize data
  const markers = storageData.markers || {};
  if (!markers.items?.length) { return; }
  markers.items.forEach(m => {
    const obj = {};
    markers.columns.forEach((c, i) => obj[c] = m[i]);
    trackedMarkers[obj.id] = obj;
  });
}

async function storeLoadedData() {
  const data = {
    markers: {
      columns: storageColumns,
      items: Object.keys(trackedMarkers).map(id => {
        const m = trackedMarkers[id];
        return storageColumns.map(s => m[s]);
      })
    }
  };
  await GM.setValue('stt', JSON.stringify(data));
}

async function clearStoredData() {
  await GM.setValue('stt', '{}');
}

// #endregion

function addWidget() {
  const divWidget = document.createElement('div');
  const divToggle = document.createElement('div');
  const inpSearch = document.createElement('input');
  const divResults = document.createElement('div');
  
  divWidget.className = 'stt-widget p-abs hidden';
  divToggle.className = 'stt-widget-toggle p-abs';
  inpSearch.className = 'stt-w-search';
  divResults.className = 'stt-w-results p-abs';

  // Refocus input after every click.
  divResults.addEventListener('click', e => {
    inpSearch.focus();
  });

  // Toggle visibility
  divToggle.addEventListener('click', () => {
    if (!divWidget.classList.toggle('hidden')) {
      inpSearch.value = '';
      inpSearch.focus();
    }
  });

  // Shows up to 4 results.
  let si = 0;
  let count = 0;
  let lastCall;
  const showResults = res => {
    const call = Math.random();
    lastCall = call;
    res = res.slice(0, 4);
    count = res.length;
    si = 0;
    res.slice(0, 4).forEach(async (r, i) => {
      await fetchTypesAsync(r);
      if (lastCall !== call) return;

      const div = document.querySelector(`div[data-i="${i}"].stt-w-result`);
      if (!div) return;
      
      const typeDiv = document.createElement('div');
      typeDiv.className= 'stt-w-result-types';
      div.appendChild(typeDiv);

      temtems[r].types?.forEach(type => {
        typeDiv.insertAdjacentHTML('beforeend', `<img src="${typeImages[typeIndex[type]]}">`);
      });

      appendTypeTable(r, div);
    });
    divResults.innerHTML = res.map((t, i) => {
      return `<div class="stt-w-result" data-i="${i}">
        <a href="${wikiUrl}/${t}" target="_blank">${t}</a>
      </div>`;
    }).join('');
    updateSelection();
  };

  // Change selected row.
  const updateSelection = (di) => {
    si += di || 0;
    si = si < 0 ? 0 : si > count - 1 ? count - 1 : si;
    document.querySelectorAll(`.stt-w-result`).forEach(e => e.classList.remove('sel'))
    document.querySelector(`.stt-w-result[data-i="${si}"]`)?.classList.add('sel');
  }

  // Prepare search
  const temtemFuse = new Fuse(temtemList, { /* options */ });
  inpSearch.addEventListener('input', () => {
    const search = inpSearch.value || '';
    const results = temtemFuse.search(search).map(r => r.item);
    showResults(results);
  });

  inpSearch.addEventListener('keydown', e => {
    switch (e.key) {
      case 'Escape':
        inpSearch.value = '';
        inpSearch.dispatchEvent(new Event('input'));
        break;
      case 'ArrowUp': updateSelection(-1); break;
      case 'ArrowDown': updateSelection(1); break;
    }
  });

  document.body.appendChild(divWidget);
  document.body.appendChild(divToggle);
  divWidget.appendChild(inpSearch);
  divWidget.appendChild(divResults);
}

function removeThatAnnoyingProReminder(marker) {
  marker.querySelector('.free-user-locations-info')?.remove();
}

function hijackThatFoundCheckbox(marker) {
  const buttons = marker.querySelector('.marker-buttons');
  if (buttons) {
    // Find location the hacky way because I don't know React :) 
    const markerProps = marker[Object.keys(marker).filter(k => k.startsWith('__reactProps'))[0] || ''];
    const ownerProps = markerProps?.children?.filter(f => f?.type === 'h3')[0]?._owner?.memoizedProps;
    const location = ownerProps?.location;
    const locationId = location?.id;
    if (!locationId) { throw new Error("Oops. Couldn't find location ID."); }

    // Create entry if untracked.
    trackedMarkers[locationId] ??= {
      id: locationId, completed: false, pos: [location.longitude, location.latitude]
    };

    // Create found checkbox
    const container = document.createElement('div');
    const input = document.createElement('input');
    const label = document.createElement('label');
    container.appendChild(input);
    container.appendChild(label);
    buttons.appendChild(container);

    container.setAttribute('class', 'stt-found custom-control custom-checkbox marker-button-fancy');
    label.setAttribute('class', 'custom-control-label');
    label.setAttribute('for', 'stt-found');
    label.style.pointerEvents = 'all';
    label.innerText = '"Found"';
    input.setAttribute('id', 'stt-found');
    input.checked = trackedMarkers[locationId]?.completed || false;
    input.setAttribute('type', 'checkbox');
    input.setAttribute('class', 'custom-control-input');

    // Add marker
    if (!trackedMarkers[locationId].marker) {
      addMapMarker(trackedMarkers[locationId]);
    }

    // Set checked
    const updateVisuals = () => {
      buttons.classList.toggle('stt-green', input.checked);
      trackedMarkers[locationId].marker._element.style.display = input.checked ? 'block' : 'none';
    };
    updateVisuals();

    input.addEventListener('change', evt => {
      updateVisuals();
      setLocationCompleted(locationId, input.checked);
      storeLoadedData(); // fire n forget
    });
  }
}

// #region Markers

function initializeMarkers() {
  Object.keys(trackedMarkers).forEach(id => {
    const m = trackedMarkers[id];
    if (m.marker || !m.pos) return;
    addMapMarker(m);
  });
}

function addMapMarker(marker) {
  const div = document.createElement('div');
  div.insertAdjacentHTML('beforeend', `<img src="${markerImage}">`);
  div.className = 'stt-marker';
  div.style.pointerEvents = 'none';

  const mapMarker = new mapboxgl.Marker(div);
  mapMarker.setLngLat(marker.pos).addTo(map);
  trackedMarkers[marker.id].marker = mapMarker;
  div.style.display = marker.completed ? 'block' : 'none';
}

function setLocationCompleted(locationId, completed) {
  trackedMarkers[locationId].completed = completed;
}

async function populateTemtemAsync(marker) {
  const category = marker.querySelector('.category');
  const temtem = category?.innerText?.trim();
  if (!temtem) return;

  // Add wiki link
  const url = `${wikiUrl}/${temtem}`;
  category.innerHTML = `<i><a href="${url}" target="_blank">${temtem}</a></i>`;

  const node = document.createElement('div');
  marker.querySelector('.marker-content')?.insertAdjacentElement('afterbegin', node);

  // Add matchup type data
  await fetchTypesAsync(temtem);
  appendTypeTable(temtem, node);
}

function populateTamer(marker) {
  marker.querySelectorAll('.marker-content .description ul li').forEach(async li => {
    // Find Temtem name
    const temtem = li.innerText.match(/[a-zA-Z0-9]*/g)?.[0];
    if (!temtem) return;

    // Add wiki link
    const url = `${wikiUrl}/${temtem}`;
    li.innerHTML = `<a href="${url}" target="_blank">${li.innerHTML}</a><br/>`;

    // Add matchup type data
    await fetchTypesAsync(temtem, li);
    appendTypeTable(temtem, li);
  });
}

// #endregion

// #region Types

const ftRequests = {};
function fetchTypesAsync(temtem) {
  // Use stored data.
  if (temtems[temtem]) {
    return new Promise(r => r(temtems[temtem]));
  }
  
  // Await busy request.
  const send = !ftRequests[temtem];
  ftRequests[temtem] = [];
  const promise = new Promise((resolve, reject) => {
    ftRequests[temtem].push([resolve, reject]);
  });
  if (!send) return promise;

  // Start request
  const url = `${wikiUrl}/${temtem}`;
  // eslint-disable-next-line no-undef
  GM.xmlHttpRequest({
    method: 'GET', url,
    onload: function (response) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.responseText, 'text/html');
      const matchupsTable = doc.querySelector('#content .type-table');
      if (!matchupsTable) return;

      // Get base Temtem types.
      const typesRow = [...doc.querySelectorAll('.infobox-row-name')].filter(n => n.innerText.match(/Types?(\n)?/g))[0]?.nextElementSibling;
      const types = [...typesRow.querySelectorAll('a')].map(a => getTypeFromHref(a.href));
      const matchups = {};  

      // Get matchups
      const getMatchupValues = tbl => {
        let values = [...tbl.querySelectorAll('tr:nth-child(2) td')].map(td => td.innerText?.trim() || '-');
        return values.slice(-12);
      };

      // Get all type tables.
      const typesParent = matchupsTable.parentElement;
      const hasMatchupTypes = typesParent.tagName === 'ARTICLE';
      const matchupTables = hasMatchupTypes
        ? [...typesParent.parentElement.querySelectorAll('article')]
        : [typesParent];

      // Store type tables.
      matchupTables.forEach(a => {
        let type = a.tagName === 'ARTICLE' ? a.getAttribute('title') : types[0]
        if (type.startsWith('+')) type = type.substring(1);

        const values = getMatchupValues(a.querySelector('.type-table'));
        matchups[type] = values;
      });

      temtems[temtem] = {
        name: temtem, types, matchups
      };
      ftRequests[temtem].forEach(([r]) => r(temtems[temtem]));      
    },
    onerror: (err) => ftRequests[temtem].forEach(([,r]) => r(err))
  });

  return promise;
}

/** Create matchup table for Temtem using wiki data. */
function createTypeTable(temtem) {
  const div = document.createElement('div');
  const matchups = temtems[temtem].matchups;
  typeList.forEach(type => {
    const typeValues = matchups[type];
    if (!typeValues) return;

    const typeDiv = document.createElement('div');
    typeDiv.className = 'stt-t';
    typeDiv.style.display = type === (temtems[temtem].types[0] || 'Neutral') ? '' : 'none';
    typeDiv.dataset['type'] = type;
    div.appendChild(typeDiv);

    const [hs,cs]=[[], []];
    typeImages.forEach((img, i) => {
      const val = typeValues[i].split('/');
      const bg = val[0] === '-' ? 'eq' : !val[1] || +val[0] > +val[1] ? 'pos' : 'neg';
      const s = i === typeList.indexOf(type) ? 'active' : matchups[typeList[i]] ? 'option' : '';
      
      // Header
      const h = document.createElement('div');
      h.className = `stt-t-h stt-t-h-${i} ${s}`;
      h.innerHTML = `<img src="${img}"></img>`;
      if (s) {
        h.addEventListener('click', () => {
          [...div.children].forEach(d => d.style.display = d.dataset.type === typeList[i] ? '' : 'none');
        });
      }
      // Value
      const c = document.createElement('div');
      c.className = `stt-t-c stt-t-c-${i} ${bg}`;
      c.innerHTML = typeValues[i];
      hs.push(h);
      cs.push(c);
    });
    hs.forEach(h => typeDiv.appendChild(h));
    cs.forEach(c => typeDiv.appendChild(c));
  });
  
  return div;
}

/** Append matchup table for Temtem to element. */
function appendTypeTable(temtem, el) {
  if (el.dataset['stt-t']) { return; }
  el.setAttribute('data-stt-t', '1');
  const tbl = createTypeTable(temtem);
  if (!tbl) return;
  el.appendChild(tbl);
}

function getTypeFromHref(href) {
  return href.match(/\/([A-Z][a-z]+)_/)?.[1];
}

// #endregion

// #region Util

// source: https://www.tutorialspoint.com/levenshtein-distance-in-javascript
function levenshtein(l,e){let t=Array(e.length+1).fill().map(()=>Array(l.length+1).fill());for(let _=0;_<=l.length;_++)t[0][_]=_;for(let n=0;n<=e.length;n++)t[n][0]=n;for(let h=1;h<=e.length;h++)for(let g=1;g<=l.length;g++){let f=l[g-1]===e[h-1]?0:1;t[h][g]=Math.min(t[h][g-1]+1,t[h-1][g]+1,t[h-1][g-1]+f)}return t[e.length][l.length]}

// #endregion
