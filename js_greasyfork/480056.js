// ==UserScript==
// @name          RED Interactive Group Log
// @namespace     https://greasyfork.org/en/users/1051538
// @description   Improve group log functionality
// @match         https://redacted.sh/torrents.php*id=*
// @version       1.2.3
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/480056/RED%20Interactive%20Group%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/480056/RED%20Interactive%20Group%20Log.meta.js
// ==/UserScript==

'use strict';

/*
 * Utilities
 */
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];
const txt = elem => elem?.textContent.trim() || '';
const addStyle = css => document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

const addEventListeners = events => {
  for (const { targets, type = 'click', handler } of events) {
    targets.forEach(target => target?.addEventListener(type, handler));
  }
};

/*
 * Reading and writing to storage
 */
const storage = {
  get(key, def) {
    const val = window.localStorage?.getItem(key);
    return typeof val === 'string' ? JSON.parse(val) : def;
  },

  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  },
};

/*
 * Fetches the log page and extracts the table
 */
const fetchLog = async url => {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  let errorMessage = `HTTP ${response.status}`;
  if (response.ok) {
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    if (doc.title.startsWith('History for ')) {
      return Promise.resolve($('table', doc));
    }
    errorMessage = doc.title.startsWith('Login') ? 'Not logged in.' : 'Something went wrong.';
  }
  return Promise.reject(Error(errorMessage));
};

/*
 * Everything that happens once we have fetched the log table
 */
const initLog = logTable => {

  /*
   * Turning timestamps into human-readable strings
   */
  const time = {
    units: { year: 31556926000, month: 2629744000, week: 604800000, day: 86400000, hour: 3600000, min: 60000 },
    now: Date.now(),

    exact(timestamp) {
      return new Date(timestamp).toLocaleString('en-US', {
        timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
      }).replace(',', '');
    },

    relative(time1, time2 = this.now) {
      const periods = [];
      let diff = Math.abs(time2 - time1);
      for (const [unit, len] of Object.entries(this.units)) {
        const num = Math.floor(diff / len);
        if (num >= 1) periods.push(`${num} ${unit}${num !== 1 ? 's' : ''}`);
        if (periods.length > 1) break;
        diff %= len;
      }
      const words = arguments.length > 1 ? ['earlier', 'later', 'Within seconds'] : ['ago', '', 'Just now'];
      return periods.length ? `${periods.join(', ')} ${time1 > time2 ? words[1] : words[0]}` : words[2];
    },
  };

  /*
   * Adjusts table for stylesheets with alternating row colours
   */
  const updateRowClasses = () => {
    const classes = ['rowa', 'rowb'];
    $$('tr:not(.colhead, .igl_hidden)', logTable)
        .forEach((row, i) => row.classList.replace(classes[i % 2], classes[(i + 1) % 2]));
  };

  /*
   * Changes the sorting column
   */
  const updateSorting = (column = 0) => {
    const rows = [...logTable.rows].slice(1);
    let sorted = false;

    const sortBy = col => {
      const prop = `igl${['Timestamp', 'TorrentId', 'UserName', 'LogType'][col]}`;
      rows.sort(col !== 2
        ? (row1, row2) => (+row2.dataset[prop] || 0) - (+row1.dataset[prop] || 0)
        : (row1, row2) => row1.dataset[prop].localeCompare(row2.dataset[prop]));
      sorted = true;
    };

    const currentHeader = $('.igl_sorted');
    if (currentHeader?.cellIndex > 0) sortBy(0);
    if (column > 0) sortBy(column);
    if (sorted) logTable.firstElementChild.append(...rows);

    updateRowClasses();
    currentHeader?.classList.remove('igl_sorted');
    logTable.rows[0].cells[column]?.classList.add('igl_sorted');
  };

  /*
   * Filters out any rows unrelated to the given torrent ID, or removes filter if empty
   */
  const filter = id => {
    [...logTable.rows].slice(1).forEach(row => {
      const show = !id || row.dataset.iglTorrentId === id || $(`a[data-igl-torrent-id="${id}"]`, row);
      row.classList.toggle('igl_hidden', !show);
    });
    updateRowClasses();
    highlightsManager.update(id, 800);
    $('#igl_removeFilter').classList.toggle('igl_hidden', !id);
  };

  /*
   * Handles the short descriptive names for torrent links, e.g. "FLAC/16bit/WEB"
   * These are normally based on the text in the second column of the log table.
   */
  const getLinkText = (() => {

    // Handling links to torrents that don't have any entries in the log
    const getUnknown = id => {
      cache[id] = 'Unknown torrent';
      const elem = $(`#torrent${id} > td > a`);
      if (elem) {
        // Found it in the torrent table, now construct a name
        const fragments = txt(elem.firstChild).split('/').slice(0, 2);
        const num = /\bedition_(\d+)\b/.exec(elem.closest('tr').className)?.[1] || 1;
        fragments.push(txt($$('.edition strong')[num - 1]).split(' ').pop());
        cache[id] = modified(fragments.map(str => str.trim()).join('/'));
      }
      return cache[id];
    };

    const cache = {};
    const modified = str => str
        .replace('/Lossless', '/16bit')
        .replace(/\s(?:Lossless|\(VBR\))/, '')
        .replace('Deleted', 'Deleted torrent');

    return (id, fromString) => {
      if (typeof fromString === 'string') {
        cache[id] = cache[id] || modified(fromString) || 'Torrent';
      }
      return cache[id] || getUnknown(id);
    };
  })();

  const setStyleFromSettings = (() => {
    const style = document.head.appendChild(document.createElement('style'));
    return () => (style.textContent = (Object.values(themes)[settings.theme] ?? []).reduce(
      (css, colour, i) => `${css} #log_table .${logClasses[i]} { color: ${colour}; }`,
      `:root { --igl-highlight: ${settings.highlight}40; }`,
    ));
  })();

  const themes = {
    Monochromatic: [],
    Standard: [],
    Lighter: [, 'hsl(120 100% 33%)', 'hsl(240 100% 70%)', 'hsl(0 100% 67%)'],
    Darker: [, 'hsl(120 100% 21%)', 'hsl(240 100% 38%)', 'hsl(0 100% 38%)'],
    Unobtrusive: [, 'color-mix(in srgb, green 38%, currentColor)', 'color-mix(in srgb, blue 30%, currentColor)', 'color-mix(in srgb, red 30%, currentColor)'],
  };

  const logClasses = ['normal', 'log_upload', 'log_edited', 'log_deleted'];

  const settings = {
    ...{ highlight: '#4070ec', theme: 1, sorting: 0, statsBox: 3 },
    ...storage.get('igl_settings'),
  };

  setStyleFromSettings();
  addStyle(`
    .igl_gone {
        display: none;
    }
    .igl_hidden {
        visibility: collapse;
        border-color: transparent;
    }
    #log_table {
        margin-bottom: 12px;
    }
    #log_table .colhead > td {
        font-weight: normal !important;
    }
    .igl_header,
    #log_table .time {
        cursor: pointer;
    }
    .igl_sorted > .igl_header {
        cursor: default;
    }
    .igl_header::after {
        content: "▼";
        font-size: 0.8em;
        opacity: 0.7;
        margin-left: 1em;
    }
    :not(.igl_sorted) > .igl_header::after {
        visibility: hidden;
    }
    #log_table td:first-child {
        width: 11.8em;
    }
    #log_table td:nth-child(-n+3),
    #log_table a[data-igl-torrent-id] {
        white-space: nowrap;
    }
    .igl_selectedTime {
        font-weight: bold;
    }
    #log_table :is(td:nth-child(4), td:nth-child(4) > span)::first-letter {
        text-transform: uppercase;
    }
    .igl_highlighted > td,
    a.igl_highlighted {
        background-color: var(--igl-highlight) !important;
    }
    a[data-igl-torrent-id] {
        padding: 2px 5px;
        border-radius: 5px;
    }
    .igl_floater {
        float: right;
        margin-left: 1em;
        font-weight: normal !important;
    }
    .igl_tinyLink {
        font-size: 0.8em;
    }
    .igl_tinyLink::before {
        content: "[";
    }
    .igl_tinyLink::after {
        content: "]";
    }
    #igl_statsBox {
        min-width: 320px;
        white-space: nowrap;
        margin: 0;
        z-index: 10000001;
        box-shadow: 5px 5px 7px #0008;
    }
    #igl_statsBox span:empty::before {
        content: "\\200B";
    }

    #log_table :is(tr, td),
    #log_table:not(.igl_gone) ~ .main_column [data-igl-torrent-id] > td {
        transition-duration: 0s !important;
    }
    #log_table a, a[data-igl-torrent-id] {
        transition-property: color;
    }
    #log_table tr:not(.colhead) {
        color: inherit !important;
        display: table-row !important;
        position: static !important;
    }
    #log_table tr:not(.colhead)::before {
        content: none;
    }
    #igl_container .head {
        width: auto;
    }
  `);

  // Attach torrent IDs to elements in the torrent table
  for (const row of $$('.torrent_row')) {
    const id = row.id.slice(7);
    row.dataset.iglTorrentId = id;
    row.nextElementSibling.dataset.iglTorrentId = id;
  }

  for (const link of $$('.torrentdetails a[href^="/"][href*="torrentid="]')) {
    link.dataset.iglTorrentId = /torrentid=(\d+)/.exec(link.href)?.[1];
  }

  // Modify the contents of the log table
  {
    const cellTexts = [];
    let prevData = null;
    const tagRegex = /^Tag\s+(?<name>".+")\s+(?<action>added|removed)/;
    const artistRegex = /^(?<action>add|remov|Edit)ed\s+artist\s+(?<name>.+)(?<role>\s+(?:as|\(|from).+)/i;
    const leechRegex = /^marked\s+as\s+(?:freeleech\s+)?type/i;

    [...logTable.rows].slice(1).forEach(row => {

      // Date cell
      const timestamp = Date.parse(`${txt(row.cells[0]).replace(' ', 'T')}Z`);
      row.dataset.iglTimestamp = timestamp;
      row.cells[0].innerHTML = `<span class="time tooltip" title="${time.exact(timestamp)}">${time.relative(timestamp)}</span>`;

      // Torrent cell
      const torrentId = txt(row.cells[1].firstElementChild);
      if (torrentId) {
        row.dataset.iglTorrentId = torrentId;
        const link = row.cells[1].firstElementChild;
        link.textContent = getLinkText(torrentId, txt(link.nextSibling).slice(1, -1)).replace(' torrent', '');
        link.nextSibling?.remove();
      }

      // User cell
      const user = txt(row.cells[2]);
      row.dataset.iglUserName = user;

      // Info cell
      let cellText = row.cells[3].innerHTML.trim() || 'edited torrent';
      const [word] = cellText.split(' ');
      let logType = torrentId ? word === 'uploaded' ? 1 : word === 'deleted' ? 3 : 2 : 0;
      row.dataset.iglLogType = logType;

      // Merge consecutive tag/artist/leech actions less than three minutes apart
      const tagOrArtistMatch = logType === 0 && (tagRegex.exec(cellText) || artistRegex.exec(cellText));
      if (tagOrArtistMatch || logType === 2 && leechRegex.test(cellText)) {
        const { action = cellText, name, role = '' } = tagOrArtistMatch?.groups ?? {};
        if (
          action.toLowerCase() === prevData?.action.toLowerCase()
          && user === prevData?.user
          && timestamp + 180000 > prevData?.timestamp
        ) {
          row.remove();
          cellText = cellTexts.pop();
          if (tagOrArtistMatch) {
            cellText = cellText.replace(/(Tag|artist)s?/, `$1s ${name}${role},`);
          } else if (!cellText.includes(`torrent ${torrentId} `)) {
            cellText = cellText
              .replace(/marked\s+(torrent \d+)(.*)/i,
                  `marked 1 torrents$2 <a class="igl_unhider igl_tinyLink" href="#">Show</a><span class="igl_gone">( $1 )</span>`)
              .replace(/(\d+) torrents/, (m, num) => `${++num} torrents`)
              .replace('(', `( torrent ${torrentId} |`);
          }
        } else if (!tagOrArtistMatch) {
          row.dataset.iglLogType = logType = 0;
          delete row.dataset.iglTorrentId;
          cellText = cellText.replace(' as ', ` torrent ${torrentId} as `);
          row.cells[1].replaceChildren();
        }
        prevData = { action, user, timestamp };
      } else {
        prevData = null;
      }

      cellTexts.push(cellText);
    });

    const torrentLink = (m, id) => `\u200b<a href="torrents.php?torrentid=${id}" data-igl-torrent-id="${id}">${getLinkText(id)}</a>\u200b`;
    const replacements = [
      [ // Log type 0: normal
        [ // Cover image
          /cover\s+"(.*?)\s+-\s+(http.+)"/,
          (m, name, url) => `cover "<a href="${url}">${name || '(unnamed)'}</a>"`,
        ],
        [ // Artist
          /(?<=\bartists?|,)\s+(.+?)\s+(?:as|\(|from)\s*((?:Main|Guest|Composer|Conductor|DJ\/Compiler|Remixer|Producer|Arranger)[^),]*)\)?/g,
          (m, name, role) => ` <a href="artist.php?artistname=${
            encodeURIComponent(name.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>')).replaceAll('%20', '+')
          }" dir="ltr">${name}</a> (${role.toLowerCase().replace(' to ', ' → ')})`,
        ],
        [ // Tags
          /(?<=^Tags?\b.*)"(.+?)"/g,
          '"<a href="torrents.php?taglist=$1">$1</a>"',
        ],
        [ // "moved torrent 123 to 456"
          /^moved.*to(?=\s+\d+$)/,
          '$& group',
        ],
        [ // Group
          /\bgroup\s+(\d+)/i,
          '<a href="torrents.php?id=$1">group $1</a>',
        ],
        [ // Torrent
          /\s*torrent\s+(\d+)\s*/ig,
          torrentLink,
        ],
      ],
      [],
      [ // Log type 2: edited
        [ // Arrows
          /'\s+[-=]&gt;\s+'/g,
          `' → '`,
        ],
        [ // Multiple edits
          /,\s+(Media|Format|Encoding|Remaster(?:ed|Year|Title|RecordLabel|CatalogueNumber)|Scene|Trumpable\s+tag\s+(?:add|remov)ed):/g,
          '<br>$1:',
        ],
      ],
      [ // Log type 3: deleted
        [ // Torrent hash
          /\b[A-Z0-9]{40}\b/,
          '<a class="igl_unhider igl_tinyLink" href="#">hash</a><span class="igl_gone">$&</span>',
        ],
        [ // Rule
          /(?:https?:\/\/(?:redacted\.[cs]h|passtheheadphones\.me)\/rules\.php\?p=upload#r|rule\s+|\u2191_\s+)([\d.]*\d)/ig,
          '<a href="rules.php?p=upload#r$1">Rule $1</a>',
        ],
        [ // Torrent
          /\s*(?:https?:\/\/(?:redacted\.[cs]h|passtheheadphones\.me)\/torrents\.php\?(?:id=\d+&amp;)?torrentid=|torrent\s+)(\d+)(?:#\w*)?\s*/ig,
          torrentLink,
        ],
        [ // Internal URL
          /https?:\/\/(?:redacted\.[cs]h|passtheheadphones\.me)\/([^\s\u200b]*[\w#])/ig,
          '<a href="$1">$1</a>',
        ],
      ],
    ];

    [...logTable.rows].slice(1).forEach((row, i) => {
      const logType = +row.dataset.iglLogType;
      for (const [pattern, replacement] of replacements[logType]) {
        cellTexts[i] = cellTexts[i].replace(pattern, replacement);
      }
      const logClass = settings.theme ? logClasses[logType] : '';
      if (logClass) row.classList.add(logClass); // RED Dark, RED Light
      row.cells[3].innerHTML = `<span class="${logClass}">${cellTexts[i]}</span>`;
    });
  }

  addEventListeners([{
    targets: [logTable],
    handler: e => {

      // "Settings" / "Remove filter"
      if (['igl_openSettings', 'igl_removeFilter'].includes(e.target.id)) {
        e.preventDefault();
        e.target.id === 'igl_openSettings' ? openSettings() : filter('');

      // Time
      } else if (e.target.classList.contains('time')) {
        const selectedTime = e.target.classList.toggle('igl_selectedTime') ? +e.target.closest('tr').dataset.iglTimestamp : 0;
        for (const elt of $$('.igl_selectedTime', logTable)) {
          if (elt !== e.target) elt.classList.remove('igl_selectedTime');
        }
        for (const elt of $$('.time', logTable)) {
          const thisTime = +elt.closest('tr').dataset.iglTimestamp;
          elt.textContent = selectedTime && elt !== e.target
            ? time.relative(thisTime, selectedTime)
            : time.relative(thisTime);
        }

      // Header
      } else if (e.target.matches(':not(.igl_sorted) > .igl_header')) {
        updateSorting(e.target.parentNode.cellIndex);

      // Torrent link
      } else if (e.target.matches('a[href^="torrents.php?torrentid="]')) {
        const [id] = /\d+/.exec(e.target.href);
        const elem = $(`#torrent${id}`);
        if (elem && !e.ctrlKey && !e.shiftKey) {
          // Clicked a link to an existing torrent: open the torrent details and scroll down
          e.preventDefault();
          if (elem.classList.contains('hidden')) {
            const edNum = /\bedition_(\d+)\b/.exec(elem.className)?.[1];
            $(`.edition a[onclick*=" ${edNum}, this,"]`)?.click();
          }
          elem.nextElementSibling.classList.remove('hidden');
          highlightsManager.update(id, 1200);
          history.pushState(null, '', `#torrent${id}`);
          elem.scrollIntoView({ behavior: 'smooth' });
        }

      // Unhider
      } else if (e.target.classList.contains('igl_unhider')) {
        e.preventDefault();
        e.target.nextElementSibling?.classList.remove('igl_gone');
        e.target.remove();
      }
    },
  }]);

  logTable.id = 'log_table';
  logTable.classList.add('log_table', 'border');
  logTable.rows[0].cells[0].textContent = 'Time';
  for (const cell of logTable.rows[0].cells) {
    cell.innerHTML = `<strong class="igl_header">${txt(cell)}</strong>`;
  }
  logTable.rows[0].cells[3].insertAdjacentHTML('beforeend', `
    <a id="igl_openSettings" class="igl_floater brackets" href="#">Settings</a>
    <a id="igl_removeFilter" class="igl_hidden igl_floater brackets" href="#">Remove filter</a>
  `);

  updateSorting(settings.sorting);
  $('.header').after(logTable);

  // Handle some stylesheet quirks
  {
    const sheet = $('link[rel="stylesheet"][title]')?.href.match(/static\/styles\/(.+)\/style\.css/)?.[1] || 'external';
    const test = (sheets, extTest) => sheets.includes(sheet) || sheet === 'external' && extTest?.();
    const getStyle = (elem, pseudoElem) => elem && getComputedStyle(elem, pseudoElem);

    let style = '#log_table :not(.colhead, .igl_highlighted) > td { background-color: transparent !important; }';

    // Background colours for rows are set on the cells
    if (test(['minimal', 'proton'], () => getStyle($('#log_table .rowb'))?.backgroundColor === 'rgba(0, 0, 0, 0)')) {
      style += ['#log_table .rowa', '#log_table .rowb', '.torrent_row', '.torrentdetails'].reduce((css, sel) => {
        const col = getStyle($(`${sel} > td`))?.backgroundColor;
        return col && col !== 'rgba(0, 0, 0, 0)' ? `${css} ${sel} { background-color: ${col}; }` : css;
      }, '');
    }

    // Boxes use the default colour, but it is not set on the body
    if (test(['proton'], () => getStyle(document.body).color === 'rgb(0, 0, 0)')) {
      style += `#igl_container { color: ${getStyle($('#content')).color}; }`;
    }

    // Boxes are translucent
    if (test([], () => getStyle($('.sidebar .box'))?.backgroundColor.startsWith('rgba'))) {
      style += `#igl_container .box { background-color: ${getStyle(document.body).backgroundColor}; }`;
    }

    addStyle(style);
  }

  // Initialise styled tooltips, if enabled
  document.head.append(Object.assign(document.createElement('script'), { textContent: `
    if (window.jQuery?.fn.tooltipster) {
      jQuery('#log_table .tooltip').tooltipster({ delay: 500, updateAnimation: false, maxWidth: 400 });
    }
  ` }));

  // Make the link simply toggle the log
  onClickViewLog = link => {
    const hidden = logTable.classList.toggle('igl_gone');
    link.textContent = `${hidden ? 'View' : 'Hide'} log`;
    if (hidden) highlightsManager.update();
  };

  /*
   * Handling the highlighting and stats box
   */
  const highlightsManager = (() => {

    // Update highlights from the given torrent ID, or remove if empty
    const highlight = id => {
      if (id !== highlightedId) {
        highlightedId = id;
        $$('.igl_highlighted').forEach(elt => elt.classList.remove('igl_highlighted'));
        if (id) $$(`[data-igl-torrent-id="${id}"]`).forEach(elt => elt.classList.add('igl_highlighted'));
      }
    };

    // Show the stats box near the given element, or hide if null
    const toggleStatsBox = elem => {
      statsBox.box.classList.toggle('igl_gone', settings.statsBox < 1 || !elem);

      let row = settings.statsBox > 4 && elem?.closest(':is(#log_table, #torrent_details) > tbody > tr');
      if (row) {
        if (row.classList.contains('igl_highlighted')) {
          while (row.nextElementSibling?.matches('.igl_highlighted:not(.hidden), .igl_hidden')) {
            row = row.nextElementSibling;
          }
        }
        const rect = row.getBoundingClientRect();
        const limitX = window.scrollX + document.documentElement.clientWidth - statsBox.box.clientWidth - 20;
        const limitY = window.scrollY + document.documentElement.clientHeight - statsBox.box.clientHeight - 20;
        const posX = Math.round(Math.min(limitX, window.scrollX + rect.right - 270));
        const posY = Math.round(Math.min(limitY, window.scrollY + rect.bottom + 10));
        statsBox.box.style.left = `${posX}px`;
        statsBox.box.style.top = `${posY}px`;
      }
    };

    // Update the contents of the stats box from the given torrent ID
    const updateStatsBox = (() => {
      const cache = {};
      const getNum = (id, tag = '') => $$(`${tag}[data-igl-torrent-id="${id}"]`, logTable).length;

      const get = id => {
        if (!Object.hasOwn(cache, id)) {
          const numSec = getNum(id, 'a');
          cache[id] = [`ID: ${id}`, '', '', `Number of log entries: ${getNum(id, 'tr')}${numSec ? ` + ${numSec}` : ''}`];
        }
        return cache[id];
      };

      // Cache uploaded and deleted torrents in the log table
      $$('[data-igl-log-type="1"], [data-igl-log-type="3"]').forEach(row => {
        const id = row.dataset.iglTorrentId;
        const del = row.dataset.iglLogType === '3';
        get(id)[del + 1] = `${del ? 'Delet' : 'Upload'}ed by ${txt(row.cells[2])} ${txt(row.cells[0])}`;
      });

      // Look for torrents that have been moved here from another group
      $$('.torrent_row').forEach(row => {
        const id = row.dataset.iglTorrentId;
        if (!Object.hasOwn(cache, id)) {
          get(id)[1] = `Uploaded by ${$$(`#release_${id} :is([href^="user"], .time)`).map(elt => txt(elt)).join(' ')}`;
        }
      });

      return id => {
        if (settings.statsBox > 0 && id) {
          statsBox.head.textContent = getLinkText(id);
          statsBox.fields.forEach((elt, i) => (elt.textContent = get(id)[i]));
        }
      };
    })();

    // Initialise from settings
    const init = () => {
      highlight('');
      statsBox.box.style = settings.statsBox < 5
        ? `position: fixed; ${settings.statsBox < 3 ? 'top' : 'bottom'}: 40px; ${settings.statsBox % 2 ? 'left' : 'right'}: 20px;`
        : 'position: absolute;';
      observer[`${settings.statsBox < 5 ? 'un' : ''}observe`](torrentTable);
    };

    document.body.insertAdjacentHTML('beforeend',`
      <div id="igl_container" class="sidebar">
          <div id="igl_statsBox" class="box igl_gone">
              <div class="head"><strong></strong></div>
              <ul class="stats nobullet">
                  <li><span></span></li>
                  <li><span></span></li>
                  <li><span></span></li>
                  <li><span></span><a id="igl_filter" class="igl_floater brackets" href="#">Filter</a></li>
              </ul>
          </div>
      </div>`);

    const statsBox = { box: $('#igl_statsBox'), filter: $('#igl_filter') };
    [statsBox.head, ...statsBox.fields] = $$('strong, span', statsBox.box);
    const torrentTable = $('#torrent_details');
    let highlightedId = '';

    let paused = false;
    let pauseTimer;
    const pause = (ms = 100) => {
      paused = true;
      clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => (paused = false), ms);
    };

    addEventListeners([
      {
        targets: [logTable, torrentTable],
        type: 'mouseover',
        handler: e => {
          if (e.shiftKey) pause();
          if (!paused && !logTable.classList.contains('igl_gone')) {
            const id = e.target.closest('[data-igl-torrent-id]')?.dataset.iglTorrentId || '';
            highlight(id);
            updateStatsBox(id);
            toggleStatsBox(id ? e.target : null);
          }
        },
      },
      {
        targets: [logTable, torrentTable, statsBox.box],
        type: 'mouseleave',
        handler: e => {
          if (e.shiftKey) pause();
          if (!paused && !statsBox.box.contains(e.relatedTarget)) {
            highlight('');
            toggleStatsBox(null);
          }
        },
      },
      {
        targets: [statsBox.filter],
        handler: e => {
          e.preventDefault();
          filter(highlightedId);
          $('.header').scrollIntoView();
        },
      },
    ]);

    // Reposition the stats box when torrent details are resized
    const observer = new ResizeObserver(() => {
      if (!paused && !logTable.classList.contains('igl_gone')) {
        toggleStatsBox($(`#torrent${highlightedId}:not(.hidden)`));
      }
    });

    init();

    return {
      init,
      update(id = '', delay = 400) {
        pause(delay);
        highlight(id);
        toggleStatsBox(null);
      },
    };
  })();

  /*
   * Displays the script settings
   */
  let openSettings = () => {
    addStyle(`
      #igl_screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #0009;
          z-index: 10000002;
      }
      #igl_settingsBox {
          position: fixed;
          width: 450px;
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10000003;
          box-shadow: 8px 8px 10px #0007;
          padding-bottom: 0 !important;
      }
      #igl_settingsBox :is(ul, li:first-child) {
          margin-top: 0;
      }
      #igl_settingsBox :is(.head, ul, li:last-child),
      #igl_save {
          margin-bottom: 0;
      }
      #igl_settingsBox > ul {
          padding-top: 1.5em;
          padding-bottom: 15px;
      }
      #igl_settingsBox label > :first-child {
          display: inline-block;
          width: 10em;
      }
      #igl_tips {
          height: 4em;
          overflow: auto;
      }
      #igl_settingsBox label > :last-child {
          margin: 1px 0;
          vertical-align: middle;
      }
      #igl_colour {
          display: inline-block;
          width: 40px;
          height: 18px;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, currentColor 50%, transparent);
          border-radius: 5px;
      }
      label:hover:not(:active) > #igl_colour {
          border-color: color-mix(in srgb, currentColor 70%, transparent);
      }
      #igl_colour > input {
          padding: 0;
          width: calc(100% + 12px);
          height: calc(100% + 12px);
          margin: -6px;
      }
      #igl_settingsBox li:last-child {
          text-align: right;
      }
    `);

    const getTip = (() => {
      const tips = [
        'Holding Shift pauses the live highlighting. This lets you leave the log table while keeping the current entries marked.',
        'Click on a column header to group the log by torrent, user, or log type.',
        'Torrent links within release descriptions are interactive too.',
        'If a log is too long, you can filter out unrelated entries via the link in the stats box.',
        'Click on a torrent in the log to view it in the torrent table.',
        'You can check the interval between two log entries by clicking on a time in the first column.',
      ];
      let index = Math.floor(Math.random() * tips.length);
      return () => tips[++index % tips.length];
    })();

    const listItem = (label, content) => `<li><label><span>${label}:</span> ${content}</label></li>`;
    const dropdown = (setting, label, options) => listItem(label, `
      <select data-igl-setting="${setting}">
          ${options.reduce((html, text) => `${html}<option>${text}</option>`, '')}
      </select>`);

    $('#igl_container').insertAdjacentHTML('beforeend',`
      <div id="igl_settingsBox" class="box igl_gone">
          <div class="head"><strong>${GM_info.script.name} v${GM_info.script.version}</strong></div>
          <ul class="stats nobullet">
              <li><a href="forums.php?action=viewthread&threadid=64161">View forum thread</a></li>
              <li id="igl_tips">Tip: <span></span> <a class="igl_tinyLink" href="#">Next</a></li>
              ${listItem('Highlight colour', '<span id="igl_colour"><input type="color" data-igl-setting="highlight"></span>')}
              ${dropdown('theme', 'Colour scheme', Object.keys(themes))}
              ${dropdown('sorting', 'Default sorting', ['Time', 'Torrent', 'User', 'Log type'])}
              ${dropdown('statsBox', 'Show stats', ['Off', 'Top left', 'Top right', 'Bottom left', 'Bottom right', 'Follow mouse'])}
              <li><input id="igl_save" type="button" value="Save settings"</li>
          </ul>
      </div>
      <div id="igl_screen"></div>`);

    const toggleSettings = on => {
      highlightsManager.update();
      $$('#igl_settingsBox, #igl_screen').forEach(elt => elt.classList.toggle('igl_gone', !on));
    };

    addEventListeners([
      {
        targets: [document],
        type: 'keydown',
        handler: e => {
          if (e.key === 'Escape' && $('#igl_settingsBox:not(.igl_gone)')) {
            toggleSettings(false);
          }
        },
      },
      {
        targets: [$('#igl_screen')],
        handler: () => toggleSettings(false),
      },
      {
        targets: [$('#igl_tips > a')],
        handler: e => {
          e.preventDefault();
          e.currentTarget.previousElementSibling.textContent = getTip();
        },
      },
      {
        targets: [$('#igl_save')],
        handler: e => {
          for (const elt of $$('[data-igl-setting]')) {
            const value = elt[elt.tagName === 'SELECT' ? 'selectedIndex' : 'value'];
            if (value !== -1) settings[elt.dataset.iglSetting] = value;
          }
          storage.set('igl_settings', settings);
          setStyleFromSettings();
          highlightsManager.init();
          for (const row of $$('[data-igl-log-type]')) {
            const logClass = logClasses[+row.dataset.iglLogType];
            [row, row.cells[3].firstElementChild].forEach(elt => elt.classList.toggle(logClass, settings.theme));
          }
          toggleSettings(false);
        },
      },
    ]);

    openSettings = () => {
      for (const elt of $$('[data-igl-setting]')) {
        elt[elt.tagName === 'SELECT' ? 'selectedIndex' : 'value'] = settings[elt.dataset.iglSetting];
      }
      $('#igl_tips > span').textContent = getTip();
      toggleSettings(true);
    };

    openSettings();
  };
};

/*
 * Main
 */
addStyle(`
  .igl_disabled {
      opacity: 0.5;
      pointer-events: none;
  }
  #igl_loadError {
      padding: 12px;
      font-weight: bold;
      text-align: center;
  }
`);

let onClickViewLog = link => {
  if (link.classList.contains('igl_disabled')) return;
  link.classList.add('igl_disabled');
  $('#igl_loadError')?.remove();
  fetchLog(link.href)
      .then(table => {
        initLog(table);
        link.textContent = 'Hide log';
        link.classList.remove('igl_disabled');
      })
      .catch(err => {
        $('.header').insertAdjacentHTML('afterend', `<div id="igl_loadError">Problem loading the log: ${err.message}</div>`);
        setTimeout(() => link.classList.remove('igl_disabled'), 5000);
      });
};

addEventListeners([{
  targets: [$('.linkbox > [href*="action=grouplog"]')],
  handler: e => {
    if (!e.ctrlKey && !e.shiftKey) {
      e.stopImmediatePropagation(); // Cancel any duplicate listeners (GM browser history issue)
      e.preventDefault();
      onClickViewLog(e.target);
    }
  },
}]);
