// ==UserScript==
// @name          Gazelle Artist Navigation Card
// @namespace     https://greasyfork.org/en/users/1051538
// @description   Provide an overview with links on artist pages
// @match         https://redacted.sh/artist.php*id=*
// @match         https://orpheus.network/artist.php*id=*
// @version       1.0.4
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/497236/Gazelle%20Artist%20Navigation%20Card.user.js
// @updateURL https://update.greasyfork.org/scripts/497236/Gazelle%20Artist%20Navigation%20Card.meta.js
// ==/UserScript==

'use strict';

const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

const storage = {
  get(key, dflt) {
    const val = window.localStorage?.getItem(key);
    return typeof val === 'string' ? JSON.parse(val) : dflt;
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  },
};

const RED = location.hostname !== 'orpheus.network';
const threadId = RED ? 67436 : 21104;
const navBar = $('#discog_table:not(.anc_done) > .box');

const releaseTypes = {
  album: 1,
  soundtrack: 3,
  ep: 5,
  anthology: 6,
  compilation: 7,
  sampler: 8,
  single: 9,
  live_album: 11,
  split: 12,
  remix: 13,
  bootleg: 14,
  interview: 15,
  mixtape: 16,
  demo: RED ? 17 : 10,
  concert_recording: 18,
  dj_mix: RED ? 19 : 17,
  unknown: 21,
  arrangement: 1020,
  produced_by: 1021,
  composition: 1022,
  compositions: 1022,
  remixed_by: 1023,
  guest_appearance: 1024,
  guest_appearances: 1024,
  arranged_by: 1025,
};

const settings = {
  data: [
    {
      key: 'open',
      label: 'Stay open',
      tooltip: 'Disable auto-hide. Can also be toggled by double-clicking on the card.',
    },
    {
      key: 'smaller',
      label: 'Smaller font',
      tooltip: 'Make the text smaller',
    },
    {
      key: 'smooth',
      label: 'Smooth scrolling',
      tooltip: 'Uncheck to jump instantly between sections',
      dflt: true,
    },
    {
      key: 'collapse',
      label: 'Collapse other',
      tooltip: 'When jumping to a release type, expand it and collapse the rest',
    },
    {
      key: 'hideLinks',
      label: 'Remove links',
      tooltip: 'Remove the standard navigation links',
      dflt: true,
    },
  ],
  set(key, value) {
    this.get[key] = value;
    storage.set('anc_settings', this.get);
  },
  init() {
    this.get = {
      ...Object.fromEntries(this.data.map(({ key, dflt = false }) => [key, dflt])),
      ...storage.get('anc_settings'),
    };
    return this;
  },
}.init();

const css = `
  #anc_card {
      position: fixed;
      top: 25%;
      left: 0;
      font-size: 15px;
      padding: 18px 40px 18px 28px !important;
      margin: 0;
      width: auto;
      z-index: ${RED ? 9 : 11};
      transition: transform .2s;
      border-radius: 0 10% 10% 0 / 60%;
      border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
      border-left: none;
      box-shadow: 5px 5px 7px #0005;
      transform: translate(-8px, -20%);
      user-select: none;
  }
  #anc_card:not(.anc_open, .anc_settings, :hover) {
      transform: translate(calc(36px - 100%), -20%);
  }
  #anc_card.anc_hidden {
      transform: translate(-102%, -20%);
  }
  #anc_card:is(.anc_smaller, .anc_settings) {
      font-size: 14px;
  }
  .anc_group1 {
      font-size: calc(1em + 1px);
  }
  #anc_card span {
      font-size: .875em;
  }
  #anc_card > ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
  }
  #anc_card li {
      margin: 2px 0;
      padding: 0;
      line-height: 1.2;
  }
  :not(.anc_group1) + .anc_group1,
  :not(.anc_group2) + .anc_group2 {
      margin-top: .75em !important;
  }
  #anc_arrow {
      position: absolute;
      height: 38px;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      opacity: .2;
      padding: 4px;
  }
  :is(.anc_open, .anc_settings) > #anc_arrow {
      opacity: .6;
  }
  #anc_arrow > path {
      stroke: currentColor;
      stroke-width: 5px;
      fill: none;
  }
  .anc_removed,
  #anc_settings + ul {
      display: none !important;
  }
  #anc_settings > li:first-child {
      font-weight: bold;
      font-size: 1.12em;
      opacity: .8;
  }`;

if (navBar) {
  const jumpTo = id => {
    if (RED && id === 'collages') {
      $$('.collage_rows.hidden').forEach(row => row.classList.remove('hidden'));
    }
    const behavior = settings.get.smooth ? 'smooth' : 'instant';
    id ? document.getElementById(id).scrollIntoView({ behavior }) : scrollTo({ top: 0, behavior });
  };

  const isolate = id => {
    // NOTE: Keep collapsed state of individual groups!
    if (id.startsWith('torrents_')) {
      const selector = $$('.colhead_dark + .group:not(.hidden)')
          .reduce((sel, row) => `${sel},tr.${/releases_\d+/.exec(row.className)[0]}`, '').slice(1);
      if (selector) $$(selector).forEach(row => (row.className += ' hidden'));
      $$(`tr.releases_${releaseTypes[id.slice(9)]}`).forEach(row => {
        row.className = row.className.replace(/ *\bhidden\b/, '');
      });
    }
  };

  const onClickLinks = e => {
    const id = !e.shiftKey && !e.ctrlKey && e.target.hash?.slice(1);
    if (typeof id === 'string') {
      e.preventDefault();
      if (settings.get.collapse) isolate(id);
      jumpTo(id);
    }
  };

  const onClickCard = e => {
    if (!['A', 'INPUT', 'LABEL'].includes(e.target.tagName) && !card.classList.contains('anc_hidden')) {
      if (e.shiftKey) {
        settingsCard.toggle();
      } else if (e.detail === 2 && !card.classList.contains('anc_settings')) {
        settings.set('open', card.classList.toggle('anc_open'));
      }
    }
  };

  const applySettings = () => {
    [navBar, ...$$('.linkbox > :is([href$="#info"], [href$="#artistcomments"])')]
        .forEach(elt => elt.classList.toggle('anc_removed', settings.get.hideLinks));
    ['open', 'smaller'].forEach(key => card.classList.toggle(`anc_${key}`, settings.get[key]));
  };

  const handleTranslucence = () => {
    const cardCol = getComputedStyle(card).backgroundColor;
    if (cardCol.startsWith('rgba')) {
      const values = cardCol.match(/[0-9.]+/g);
      const pct = values.pop() * 100;
      const bodyCol = getComputedStyle(document.body).backgroundColor;
      card.style.background = `color-mix(in srgb, rgb(${values.join()}) ${pct}%, ${bodyCol})`;
    }
  };

  const liHtml = ({
    name = '',
    id = name.toLowerCase(),
    num = 0,
    suffix = `(${num})`,
    group = 1,
  }) => num ? `<li class="anc_group${group}"><a href="#${id}">${name}</a> <span>${suffix}</span></li>` : '';

  const sections = [
    {
      name: 'Collages',
      num: $$('#collages tr:not(:first-child)').length,
    },
    {
      name: 'Requests',
      id: RED ? 'requests' : 'request_table',
      num: $$('.request_table tr:not(:first-child)').length,
    },
    {
      name: 'Similar',
      id: 'similar_artist_map',
      num: $$('.box_artists a:not(.brackets)').length,
    },
    {
      name: 'Artist info',
      id: 'info',
      num: +!!$('#body:not(:empty)'),
      suffix: '',
    },
    {
      name: 'Comments',
      id: 'artistcomments',
      num: +/\d+(?=\D*$)/.exec($('#artistcomments > .linkbox')?.textContent)
          || $$('#artistcomments > .forum_post').length,
      get suffix() {
        return `(${this.num < 90 ? this.num : '90+'})`;
      },
    },
  ];

  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
  $('.sidebar').insertAdjacentHTML('beforeend', `
    <div id="anc_card" class="box anc_hidden">
      <ul>
        <li><a href="#">Top</a></li>
        ${[...navBar.children]
            .filter(elt => elt.hash.startsWith('#torrents_'))
            .reduce((html, { textContent, hash }) => `${html}${liHtml({
              name: textContent.trim()
                  .replace(/ [A-Z]/, m => m.toLowerCase())
                  .replace(/earances|ordings/, '.'),
              id: hash.slice(1),
              num: $$(`.releases_${releaseTypes[hash.slice(10)]}.group`).length,
            })}`, '')}
        ${sections.reduce((html, sect) => `${html}${liHtml({ ...sect, group: 2 })}`, '')}
      </ul>
      <svg id="anc_arrow" viewBox="0 0 25 100">
        <path d="M2,2 22,50 2,98" />
      </svg>
    </div>`);

  const card = document.getElementById('anc_card');
  applySettings();
  handleTranslucence();
  setTimeout(() => card.classList.remove('anc_hidden'), 10);
  card.firstElementChild.addEventListener('click', onClickLinks);
  card.addEventListener('click', onClickCard);
  navBar.parentNode.classList.add('anc_done'); // Handle issue w/ Greasemonkey and browser history

  const settingsCard = {
    show() {
      card.insertAdjacentHTML('afterbegin', `
        <ul id="anc_settings">
          <li title="Shift-click to switch back to the navigation card">Settings</li>
          ${settings.data.reduce((html, { key, label, tooltip }) => `${html}
            <li class="anc_group1">
              <label title="${tooltip}">
                <input type="checkbox" name="${key}" ${settings.get[key] ? 'checked' : ''}>
                ${label}
              </label>
            </li>`, '')}
          <li class="anc_group2${threadId ? '' : ' anc_removed'}">
            <a href="forums.php?action=viewthread&threadid=${threadId}">View forum thread</a>
          </li>
        </ul>`);
      $('#anc_settings').addEventListener('change', e => {
        settings.set(e.target.name, e.target.checked);
        applySettings();
      });
    },
    hide() {
      $('#anc_settings')?.remove();
    },
    toggle() {
      card.classList.add('anc_hidden');
      setTimeout(() => {
        this[card.classList.toggle('anc_settings') ? 'show' : 'hide']();
        card.classList.remove('anc_hidden');
      }, 300);
    },
  };
}