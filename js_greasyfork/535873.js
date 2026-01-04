// ==UserScript==
// @name         Quick‑Use Sidebar
// @author       Davrone
// @namespace    https://greasyfork.org/en/users/1469540-davrone
// @version      1.3
// @description  Adds collapsible quick‑use sections to the Torn sidebar with confirmation on boosters. Each category has its own restore‑hidden button. Silent item‑use.
// @match        https://www.torn.com/*
// @grant        GM.addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535873/Quick%E2%80%91Use%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/535873/Quick%E2%80%91Use%20Sidebar.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const LS_HIDDEN = 'qi-hidden-set';
  const LS_COLL = 'qi-collapsed';
  const hidden = new Set(JSON.parse(localStorage.getItem(LS_HIDDEN) || '[]'));
  const collapsed = JSON.parse(localStorage.getItem(LS_COLL) || '{}');
  const armedBooster = new Set();

  /* ───────────────────────────────── Healing ───────────────────────────────── */
  const HEAL = [
    { id:  66, label: 'Morphine', cls: 'heal' },
    { id:  67, label: 'First Aid Kit', cls: 'heal' },
    { id:  68, label: 'Small First Aid Kit', cls: 'heal' },
    { id: 732, label: 'Blood Bag A+', cls: 'heal' },
    { id: 733, label: 'Blood Bag A-', cls: 'heal' },
    { id: 734, label: 'Blood Bag B+', cls: 'heal' },
    { id: 735, label: 'Blood Bag B-', cls: 'heal' },
    { id: 736, label: 'Blood Bag AB+', cls: 'heal' },
    { id: 737, label: 'Blood Bag AB-', cls: 'heal' },
    { id: 738, label: 'Blood Bag O+', cls: 'heal' },
    { id: 739, label: 'Blood Bag O-', cls: 'heal' },
    { id: 361, label: 'Neumune Tablet', cls: 'heal' },
    { id: 731, label: 'Empty Blood Bag', cls: 'heal' }
  ];

  /* ───────────────────────────────── Suicide ──────────────────────────────── */
  const SUI = [
    { id: 1363, label: 'Use Ipecac',cls: 'sui' },
    { id: 1012, label: 'Blood Bag Irradiated', cls: 'sui' },
  ];

  /* ───────────────────────────────── Alcohol ──────────────────────────────── */
  const ALC = [
    { id: 180, label: 'Beer (1N)', cls: 'alc' },
    { id: 181, label: 'Champagne (1N)', cls: 'alc' },
    { id: 294, label: 'Saké (1N)', cls: 'alc' },
    { id: 426, label: 'Tequila (1N)', cls: 'alc' },
    { id: 816, label: 'Glass of Beer (2N)', cls: 'alc' },
    { id: 531, label: 'Pumpkin Brew (2N)', cls: 'alc' },
    { id: 550, label: 'Kandy Kane (2N)', cls: 'alc' },
    { id: 542, label: 'Wicked Witch (3N)', cls: 'alc' },
    { id: 551, label: 'Minty Mayhem (3N)', cls: 'alc' },
    { id: 638, label: 'Christmas Cocktail (3N)', cls: 'alc' },
    { id: 541, label: 'Stinky Swamp Punch (4N)', cls: 'alc' },
    { id: 552, label: 'Mistletoe Madness (4N)', cls: 'alc' },
    { id: 873, label: 'Green Stout (5N)', cls: 'alc' },
    { id: 924, label: 'Christmas Spirit (5N)', cls: 'alc' },
    { id: 984, label: 'Moonshine (5N)', cls: 'alc' },
];


  /* ───────────────────────────────── Candy ───────────────────────────────── */
  const CANDY = [
    { id:  35, label: 'Box of Choco Bars (25H)', cls: 'candy' },
    { id:  37, label: 'Bag of Bon Bons (25H)', cls: 'candy' },
    { id:  38, label: 'Box of Bon Bons (25H)', cls: 'candy' },
    { id:  39, label: 'Extra Strong Mints (25H)', cls: 'candy' },
    { id: 310, label: 'Lollipop (25H)', cls: 'candy' },
    { id: 210, label: 'Chocolate Kisses (25H)', cls: 'candy' },
    { id: 209, label: 'Sweet Hearts (25H)', cls: 'candy' },
    { id:  36, label: 'Big Box of Choco Bars (35H)', cls: 'candy' },
    { id: 527, label: 'Candy Kisses (50H)', cls: 'candy' },
    { id:1312, label: 'Chocolate Egg (50H)', cls: 'candy' },
    { id: 528, label: 'Tootsie Rolls (75H)', cls: 'candy' },
    { id: 634, label: 'Bloody Eyeballs (75H)', cls: 'candy' },
    { id: 529, label: 'Choco Truffles (100H)', cls: 'candy' },
    { id: 556, label: 'Reindeer Droppings (100H)', cls: 'candy' },
    { id:1039, label: 'Humbugs (150H)', cls: 'candy' },
    { id: 587, label: 'Sherbet (150H)', cls: 'candy' },
    { id: 586, label: 'Jawbreaker (150H)', cls: 'candy' },
    { id: 151, label: 'Pixie Sticks (150H)', cls: 'candy' },
    { id:1028, label: 'Birthday Cupcake (250H)', cls: 'candy' },
];



  /* ───────────────────────────────── Drugs ──────────────────────────────── */
  const DRUGS = [
    { id: 196, label: 'Cannabis', cls: 'drug' },
    { id: 197, label: 'Ecstasy', cls: 'drug' },
    { id: 198, label: 'Ketamine', cls: 'drug' },
    { id: 199, label: 'LSD', cls: 'drug' },
    { id: 200, label: 'Opium', cls: 'drug' },
    { id: 201, label: 'PCP', cls: 'drug' },
    { id: 203, label: 'Shrooms', cls: 'drug' },
    { id: 204, label: 'Speed', cls: 'drug' },
    { id: 205, label: 'Vicodin', cls: 'drug' },
    { id: 206, label: 'Xanax', cls: 'drug' },
    { id: 870, label: 'Love Juice', cls: 'drug' },
  ];

  /* ───────────────────────────────── Energy ─────────────────────────────── */
  const ENERGY = [
    { id: 985, label: 'Goose Juice (5E)', cls: 'energy' },
    { id: 986, label: 'Damp Valley (10E)', cls: 'energy' },
    { id: 987, label: 'Crocozade (15E)', cls: 'energy' },
    { id: 530, label: 'Munster (20E)', cls: 'energy' },
    { id: 553, label: 'Santa Shooters (20E)', cls: 'energy' },
    { id: 532, label: 'Red Cow (25E)', cls: 'energy' },
    { id: 554, label: 'Rockstar Rudolph (25E)', cls: 'energy' },
    { id: 533, label: 'Taurine Elite (30E)', cls: 'energy' },
    { id: 555, label: 'X‑MASS (30E)', cls: 'energy' },
];


  /* ───────────────────────────────── Boosters ───────────────────────────── */
  const BOOSTERS = [
    { id: 366, label: 'Erotic DVD', cls: 'booster' },
    { id: 330, label: 'Boxing Gloves', cls: 'booster' },
    { id: 331, label: 'Dumbbells', cls: 'booster' },
    { id: 106, label: 'Parachute', cls: 'booster' },
    { id: 561, label: 'Book of Carols', cls: 'booster' },
    { id: 563, label: 'Gift Card', cls: 'booster' },
    { id: 368, label: "Lawyer's Business Card", cls: 'booster' },
    { id: 367, label: 'Feathery Hotel Coupon', cls: 'booster' },
    { id: 477, label: 'Black Easter Egg', cls: 'booster' },
    { id: 472, label: 'Blue Easter Egg', cls: 'booster' },
    { id: 583, label: 'Brown Easter Egg', cls: 'booster' },
    { id: 478, label: 'Gold Easter Egg', cls: 'booster' },
    { id: 471, label: 'Green Easter Egg', cls: 'booster' },
    { id: 582, label: 'Orange Easter Egg',cls: 'booster' },
    { id: 585, label: 'Pink Easter Egg', cls: 'booster' },
    { id: 584, label: 'Purple Easter Egg', cls: 'booster' },
    { id: 474, label: 'Red Easter Egg', cls: 'booster' },
    { id: 476, label: 'White Easter Egg', cls: 'booster' },
    { id: 475, label: 'Yellow Easter Egg', cls: 'booster' },
    { id: 329, label: 'Skateboard', cls: 'booster' },
  ];

  /* ───────────────────────────────── Section Map ────────────────────────── */
  const SECTIONS = [
    ['heal', 'Healing', HEAL ],
    ['sui', 'Suicide', SUI ],
    ['alc', 'Alcohol', ALC ],
    ['candy','Candy', CANDY ],
    ['drug', 'Drugs', DRUGS ],
    ['energy', 'Cans', ENERGY ],
    ['booster','Boosters', BOOSTERS],
  ];

  /* ─────────────────────────────── Helpers ──────────────────────────────── */
  const saveHidden = () => localStorage.setItem(LS_HIDDEN, JSON.stringify([...hidden]));
  const saveCollapsed = () => localStorage.setItem(LS_COLL, JSON.stringify(collapsed));

  function useItem(id, label) {
    fetch('https://www.torn.com/item.php', {
      method:       'POST',
      credentials:  'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: `step=useItem&action=use&itemID=${id}`,
    })
      .then(res => res.json())
      .then(json => console.log(`[QuickUse] Used ${label}`, json))
      .catch(e => console.error(`[QuickUse] Error using ${label}`, e));
  }

  function makeRow(item) {
    const a = document.createElement('a');
    a.href = '#';
    a.innerHTML = `<span class="qi-name" title="${item.label}">${item.label}</span>`;

    a.addEventListener('click', e => {
      e.preventDefault();
      const key = `${item.cls}:${item.id}`;

      /* Double‑click confirmation for boosters */
      if (item.cls === 'booster') {
        if (!armedBooster.has(key)) {
          armedBooster.add(key);
          a.querySelector('.qi-name').textContent = 'Click again to confirm';
          setTimeout(() => {
            if (armedBooster.has(key)) {
              armedBooster.delete(key);
              a.querySelector('.qi-name').textContent = item.label;
            }
          }, 3000);
          return;
        }
        armedBooster.delete(key);
      }

      useItem(item.id, item.label);
    });

    /* Hide‑button */
    const x = document.createElement('span');
    x.className = 'qi-remove';
    x.textContent = '×';
    x.title = 'Hide';
    x.addEventListener('click', e => {
      e.preventDefault();
      hidden.add(`${item.cls}:${item.id}`);
      saveHidden();
      location.reload();
    });

    const d = document.createElement('div');
    d.className = `qi-link ${item.cls}`;
    d.append(a, x);
    return d;
  }

  function makeHeader(id, label) {
    const h = document.createElement('div');
    h.className = `qi-header ${id}` + (collapsed[id] ? '' : ' open');
    h.innerHTML = `<span class="qi-arrow">▶</span><span>${label}</span>`;
    h.addEventListener('click', () => {
      const cont = document.getElementById(`qi-cont-${id}`);
      const isCollapsed = cont.classList.toggle('collapsed');
      h.classList.toggle('open', !isCollapsed);
      collapsed[id] = isCollapsed;
      saveCollapsed();
    });
    return h;
  }

  function makeRestoreRow(sectionId, items) {
    const r = document.createElement('div');
    r.className = `qi-link qi-restore ${sectionId}`;
    r.innerHTML = '<a href="#"><span class="qi-name">Restore Hidden</span></a>';
    r.querySelector('a').addEventListener('click', e => {
      e.preventDefault();
      for (const it of items) hidden.delete(`${sectionId}:${it.id}`);
      saveHidden();
      location.reload();
    });
    return r;
  }

  function buildSection(id, label, items) {
    const header = makeHeader(id, label);
    const container = document.createElement('div');
    container.id = `qi-cont-${id}`;
    container.className = 'qi-container' + (collapsed[id] ? ' collapsed' : '');

    for (const it of items)
      if (!hidden.has(`${id}:${it.id}`))
        container.append(makeRow(it));

    if (items.some(it => hidden.has(`${id}:${it.id}`)))
      container.append(makeRestoreRow(id, items));

    return [header, container];
  }

  function insertAll() {
    if (document.getElementById('qi-cont-quickuse')) return;
    const anchor = document.querySelector('#sidebar > div:first-of-type');
    if (!anchor) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'qi-cont-quickuse';

    const topHeader = document.createElement('div');
    topHeader.className = 'sidebar-title open';
    topHeader.innerHTML = '<span class="toggle-arrow">&#9658;</span>Quick Use';

    const topContainer = document.createElement('div');
    topContainer.className = 'qi-container' + (collapsed['_quickuse'] ? ' collapsed' : '');

    topHeader.addEventListener('click', () => {
      const isCollapsed = topContainer.classList.toggle('collapsed');
      topHeader.classList.toggle('open', !isCollapsed);
      collapsed['_quickuse'] = isCollapsed;
      saveCollapsed();
    });

    for (const [id, lbl, list] of SECTIONS)
      topContainer.append(...buildSection(id, lbl, list));

    wrapper.append(topHeader, topContainer);
    anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
  }

  /* Mutation‑observer: wait for sidebar */
  new MutationObserver((_, o) => {
    if (document.querySelector('#sidebar > div:first-of-type')) {
      insertAll();
      o.disconnect();
    }
  }).observe(document, { childList: true, subtree: true });

  /* Hashchange (Ajax nav) */
  window.addEventListener('hashchange', () => {
    if (!document.getElementById('qi-cont-heal')) insertAll();
  });

  /* ───────────────────────────── CSS (GM_addStyle) ─────────────────────── */
  GM.addStyle(`
.sidebar-title{
  background:var(--default-bg-panel-color);
  height:23px;margin:2px 0;padding-left:6px;
  display:flex;align-items:center;cursor:pointer;
  font:700 13px/22px Arial,sans-serif;color:var(--default-color)
}
.sidebar-title .toggle-arrow{display:inline-block;width:10px;margin-right:6px;transition:transform .15s}
.sidebar-title.open .toggle-arrow{transform:rotate(90deg)}
.qi-container.collapsed{display:none!important}
.qi-header.top{
  background:var(--default-bg-panel-color);
  color:var(--user-status-green-color);
  border-top:1px solid var(--default-panel-divider-outer-side-color);
  border-bottom:1px solid var(--default-panel-divider-outer-side-color);
  margin-top:5px
}
.qi-header{background:var(--default-bg-panel-color);height:23px;margin:2px 0;
  display:flex;align-items:center;cursor:pointer;font:700 13px/22px Arial,sans-serif}
.qi-header span{margin-left:6px}
.qi-arrow{display:inline-block;width:10px;margin-left:6px;transition:transform .15s}
.qi-header.open .qi-arrow{transform:rotate(90deg)}
.qi-header.heal{color:var(--user-status-green-color)}
.qi-header.sui{color:var(--user-status-red-color)}
.qi-header.alc{color:#c49a6c}
.qi-header.candy{color:#ff66cc}
.qi-header.drug{color:#9932cc}
.qi-header.energy{color:#ff9900}
.qi-header.booster{color:#FFD700}
.qi-container{transition:max-height .2s ease-out;overflow:hidden}
.qi-container.collapsed{max-height:0!important}
.qi-link{
  background:var(--default-bg-panel-color);
  border-top-right-radius:5px;border-bottom-right-radius:5px;
  height:23px;margin:2px 0;overflow:hidden;
  display:flex;align-items:center;position:relative}
.qi-link:hover{background:var(--default-bg-panel-active-color)}
.qi-link a{
  color:var(--default-color);text-decoration:none;height:100%;
  display:flex;align-items:center;font:700 13px/22px Arial,sans-serif;width:100%}
.qi-link a .qi-name{
  flex:1 1 auto;min-width:0;padding-top:1px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.qi-link.heal     .qi-name{color:var(--user-status-green-color)!important}
.qi-link.sui      .qi-name{color:var(--user-status-red-color)!important}
.qi-link.alc      .qi-name{color:#c49a6c!important}
.qi-link.candy    .qi-name{color:#ff66cc!important}
.qi-link.drug     .qi-name{color:#9932cc!important}
.qi-link.energy   .qi-name{color:#ff9900!important}
.qi-link.booster  .qi-name{color:#FFD700!important}
.qi-remove{
  position:absolute;right:4px;top:2px;width:17px;height:17px;line-height:15px;
  font-size:14px;font-weight:700;text-align:center;border-radius:50%;
  background:var(--default-color);color:var(--default-bg-panel-color);
  cursor:pointer;opacity:0;transition:opacity .15s}
.qi-link:hover .qi-remove{opacity:1}
.qi-restore{justify-content:center;font-size:12px;font-weight:700}
.qi-restore.heal   .qi-name{color:var(--user-status-green-color)!important}
.qi-restore.sui    .qi-name{color:var(--user-status-red-color)!important}
.qi-restore.alc    .qi-name{color:#c49a6c!important}
.qi-restore.candy  .qi-name{color:#ff66cc!important}
.qi-restore.drug   .qi-name{color:#9932cc!important}
.qi-restore.energy .qi-name{color:#ff9900!important}
.qi-restore.booster.qi-name{color:#FFD700!important}
.qi-restore:hover .qi-name{color:var(--default-color)!important}
`);
})();
