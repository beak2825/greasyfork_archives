// ==UserScript==
// @name            Improvements to "Participants"
// @name:ca         Millores a "Participants"
// @name:en         Improvements to "Participants"
// @name:es         Mejoras en "Participantes"
// @version         1.0.2
// @author          Antonio Bueno <antonio.bueno@udg.edu>
// @description     Enhances Moodle participants pages with CSV/JSON export, a print-friendly view, and role-based highlighting.
// @description:ca  Millora les pàgines de participants de Moodle amb exportació CSV/JSON, una vista per imprimir i ressaltat segons el rol.
// @description:en  Enhances Moodle participants pages with CSV/JSON export, a print-friendly view, and role-based highlighting.
// @description:es  Mejora las páginas de participantes de Moodle con exportación CSV/JSON, una vista para imprimir, y resaltado según el rol.
// @license         MIT
// @namespace       https://github.com/buenoudg/Ajudant-UdGMoodle
// @supportURL      https://github.com/buenoudg/Ajudant-UdGMoodle/issues
// @match           https://moodle.udg.edu/user/*
// @match           https://moodle2.udg.edu/user/*
// @icon            https://raw.githubusercontent.com/buenoudg/Ajudant-UdGMoodle/master/udgmoodle_icon_38x38%402x.png
// @run-at          document-idle
// @noframes
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/453604/Improvements%20to%20%22Participants%22.user.js
// @updateURL https://update.greasyfork.org/scripts/453604/Improvements%20to%20%22Participants%22.meta.js
// ==/UserScript==

/*
----------------------------------------------------------------------
  Improvements to "Participants" (v1.0.0, 2025-10-08)
  Author: Antonio Bueno <antonio.bueno@udg.edu>

  Enhancements:
   - CSV/JSON export of participant list
   - Print-friendly, editable view
   - Role-based coloring (persistent)
   - Optional higher-quality photos (persistent)
   - Locale-aware UI (ca, es, en)
   - Resilient toolbar re-injection when Moodle updates the DOM

  Repository:  https://github.com/buenoudg/Ajudant-UdGMoodle
  Changelog:   https://github.com/buenoudg/Ajudant-UdGMoodle/releases

  v1.0.1 (2025-10-09) Compatible with Safari via the Userscripts extension (macOS, iPadOS, iOS).
  v1.0.2 (2025-11-25) Made downloadable file names simpler
----------------------------------------------------------------------
*/

(() => {
  'use strict';

  // --------------------------------
  // GM_* polyfills for Safari
  // --------------------------------

  if (typeof GM_getValue === 'undefined') {
    window.GM_getValue = function (name, defaultValue) {
      const raw = localStorage.getItem(name);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    };
    console.log("GM_getValue() polyfilled");
  }

  if (typeof GM_setValue === 'undefined') {
    window.GM_setValue = function (name, value) {
      localStorage.setItem(name, JSON.stringify(value));
    };
    console.log("GM_setValue() polyfilled");
  }

  if (typeof GM_addStyle === 'undefined') {
    window.GM_addStyle = function (css) {
      const el = document.createElement('style');
      el.type = 'text/css';
      el.appendChild(document.createTextNode(css));
      (document.head || document.documentElement).appendChild(el);
      return el;
    };
    console.log("GM_addStyle() polyfilled");
  }

  // --------------------------------
  //  LOCALE DETECTION
  // --------------------------------
  const langAttr = (document.documentElement.getAttribute('lang') || '').toLowerCase();
  const locale = /^ca\b/.test(langAttr) ? 'ca' : /^es\b/.test(langAttr) ? 'es' : 'en';

  // --------------------------------
  // CSS (via GM_addStyle)
  // --------------------------------

  const ROLE_COLOR_CSS = `
    /* Roles-based background colors (scoped to .roles-colored) */
    .roles-colored tr.professor,
    .roles-colored tr.professor-no-editor { background-color: #EDC !important; }

    .roles-colored tr.coordinador,
    .roles-colored tr.sotsdirector { background-color: #CDE !important; }

    .roles-colored tr.inactive { background-color: #F99 !important; }
    .roles-colored tr.inactive .bg-warning { background-color: #FE0 !important; }
  `;

  GM_addStyle(`
    /* Toolbar layout */
    .participants-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
      margin: 0 0 0.5rem 0;
    }
    .participants-toolbar label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      margin-left: 0.5rem;
      user-select: none;
    }

    ${ROLE_COLOR_CSS}

    /* Placeholder for the improved photos styles */
    #participants [srcset] {
      background-color: gray;
      color: white;
      font-weight: bold;
      width: 50px;
      height: 50px;
      border-radius: 10%;
    }
  `);

  // --------------------------------
  // FIELD KEYS (for JSON/CSV output)
  // --------------------------------

  const FIELD_KEYS = {
    photo:  'photo_url',
    name:   ['surname', 'name'],
    id:     'univ_id',
    email:  'email',
    roles:  'roles',
    groups: 'groups',
    active: 'active',
  };

  // --------------------------------
  // I18N
  // --------------------------------

  const I18N = {
    en: {
      csv: 'Download CSV',
      json: 'Download JSON',
      colorByRoles: 'Color by roles',
      print: 'Print view',
      improvePhotos: 'Improve photos'
    },
    es: {
      csv: 'Descargar CSV',
      json: 'Descargar JSON',
      colorByRoles: 'Colorear por roles',
      print: 'Vista para imprimir',
      improvePhotos: 'Mejorar fotos'
    },
    ca: {
      csv: 'Descarrega CSV',
      json: 'Descarrega JSON',
      colorByRoles: 'Coloreja per rols',
      print: 'Vista per imprimir',
      improvePhotos: 'Millora fotos'
    }
  }[locale];

  // --------------------------------
  // MICRO HELPERS
  // --------------------------------

  const normalizeWhitespace = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const normalizeLabelKey   = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  const csvEscape = (s, delimiter = ';') => {
    const t = (s ?? '').toString();
    const mustQuote = t.includes('"') || t.includes('\n') || t.includes(delimiter);
    return mustQuote ? `"${t.replace(/"/g, '""')}"` : t;
  };
  const getCellText = (td) => normalizeWhitespace(td?.textContent || '');
  const splitComma = (s) => s ? s.split(',').map(v => normalizeWhitespace(v)).filter(Boolean) : [];

  function simplifyText(s) {
    if (!s) return "";

    // Catalan "l·l" → "l.l"
    s = s.replace(/l·l/gi, "l.l");

    // Strip diacritics using NFD
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Transliterate characters NFD does not fix
    const hard = { "ñ": "n", "Ñ": "N", "ç": "c", "Ç": "C" };
    s = s.replace(/[ñÑçÇ]/g, ch => hard[ch]);

    // Replace any remaining non-ASCII with a hyphen
    s = s.replace(/[^\x00-\x7F]/g, "-");

    // Collapse multiple hyphens into a single one
    s = s.replace(/-+/g, "-");

    return normalizeWhitespace(s);
  }

  function makeFilenameSafe(s) {
    // Replace forbidden Windows/macOS characters
    s = s.replace(/[\\/:*?"<>|-]+/g, "-");

    // Collapse multiple hyphens into a single one
    s = s.replace(/-+/g, "-");

    // Trim trailing dots/spaces (Windows rejects them)
    s = s.replace(/[. ]+$/, "");

    // Avoid names becoming empty
    if (s === "") s = "file";

    return s.trim();
  }

  // Safe filename from <h1> and filters
  function safeFilename(extension) {
    // Get and sanitize course title
    const courseTitle = simplifyText(document.querySelector('h1')?.textContent);

    // Collect active filters
    const filters = [...document.querySelectorAll('div[data-filterregion="value"] span.badge')]
      .map(s => simplifyText(s.textContent))
      .filter(Boolean);

    // Build filter text (if any)
    const filterText = filters.length ? filters.join(', ') : 'participants';

    // Add date suffix (yyyy-MM-dd)
    const dateSuffix = new Date().toISOString().split('T')[0];

    // Assemble the final filename
    return makeFilenameSafe(`${courseTitle} ${filterText} (${dateSuffix}).${extension}`);
  }

  // Blob download helper
  function saveTextFile(filename, text, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const createButton = (id, text) => {
    const t = document.createElement('template');
    t.innerHTML = `<button id="${id}" type="button" class="btn btn-primary">${text}</button>`;
    return t.content.firstChild;
  };

  function upgradePhotos(table) {
    table.querySelectorAll('img.userpicture, span.userinitials').forEach(elem => {
      elem.setAttribute('srcset', elem.src?elem.src.replace('/f2', '/f1'):'');
    });
  }

  function downgradePhotos(table) {
    table.querySelectorAll("img.userpicture, span.userinitials").forEach(elem => {
      elem.removeAttribute("srcset");
    });
  }

  // --------------------------------
  // NAME / PHOTO UTILITIES
  // --------------------------------

  /**
   * Extract human-friendly full name from the "fullname" cell.
   * Prefers aria/tooltip on .userinitials; strips badges/images.
   * @param {HTMLElement} cell
   * @returns {string}
   */
  function getFullNameTextFromCell(cell) {
    const anchor = cell?.querySelector('a');
    if (anchor) {
      const initials = anchor.querySelector('.userinitials');
      const labeled = initials && initials.getAttribute('title');
      if (labeled) return normalizeWhitespace(labeled);

      const cleaned = anchor.cloneNode(true);
      cleaned.querySelectorAll('.userinitials, img').forEach((n) => n.remove());
      return normalizeWhitespace(cleaned.textContent || '');
    }
    return normalizeWhitespace(cell?.innerText || '');
  }

  /**
   * Split "Surname, Name" into [surname, name].
   * If no comma is present, returns [s, ''].
   * @param {string} s
   * @returns {[string,string]}
   */
  function splitSurnameAndName(s) {
    const i = s.indexOf(',');
    if (i === -1) return [s, ''];
    return [normalizeWhitespace(s.slice(0, i)), normalizeWhitespace(s.slice(i + 1))];
  }

  /**
   * Collect comma-separated text from chips/links/list items; fallback to cell text.
   * @param {HTMLElement} cell
   * @returns {string}
   */
  function getMultiItemText(cell) {
    if (!cell) return '';
    const items = [...cell.querySelectorAll('a, .badge, .chip, li')]
      .map((n) => normalizeWhitespace(n.textContent || ''))
      .filter(Boolean);
    const fallback = normalizeWhitespace(cell.innerText || '');
    return items.length ? items.join(', ') : fallback;
  }

  // Identify empty data rows
  function isRowEmpty(row, cells) {
    if (row.classList.contains('emptyrow')) return true;
    if (row.closest('thead')) return false;
    return cells.slice(1).every((c) => normalizeWhitespace(c.innerText || '') === '');
  }

  // --------------------------------
  // COLUMN DETECTION & VISIBILITY
  // --------------------------------

  /**
   * Detect column indexes using <th> “Hide” controls first, then sort links as fallback.
   * @param {HTMLTableElement} table
   * @returns {{nameCol:number,idCol:number,emailCol:number,rolesCol:number,groupsCol:number,statusCol:number,headCells:HTMLElement[]}}
   */
  function getColumnIndexMap(table) {
    const headRow = table.querySelector('thead tr');
    const headCells = headRow ? [...headRow.children] : [];
    const indexOfTh = (th) => (th ? headCells.indexOf(th) : -1);

    const byHideControl = (key) =>
      headRow?.querySelector(`th .commands a[data-action="hide"][data-column="${key}"]`)?.closest('th') || null;

    const bySortLink = (key) =>
      headRow?.querySelector(`th a[data-sortby="${key}"]`)?.closest('th') || null;

    const thFullname = byHideControl('fullname') || bySortLink('lastname') || bySortLink('firstname');
    const thId     = byHideControl('idnumber') || bySortLink('idnumber');
    const thEmail  = byHideControl('email')    || bySortLink('email');
    const thRoles  = byHideControl('roles');
    const thGroups = byHideControl('groups');
    const thStatus = byHideControl('status');

    return {
      nameCol:   indexOfTh(thFullname),
      idCol:     indexOfTh(thId),
      emailCol:  indexOfTh(thEmail),
      rolesCol:  indexOfTh(thRoles),
      groupsCol: indexOfTh(thGroups),
      statusCol: indexOfTh(thStatus),
      headCells,
    };
  }

  function isThVisible(th) {
    if (!th) return false;
    return !!th.querySelector('.commands a[data-action="hide"][data-column]');
  }

  /**
   * Visibility snapshot.
   * A column is considered visible when its <th> shows a “Hide” control.
   * @param {HTMLTableElement} table
   * @param {ReturnType<typeof getColumnIndexMap>} idx
   * @returns {{name:boolean,id:boolean,email:boolean,roles:boolean,groups:boolean,status:boolean}}
   */
  function getVisibleColumns(table, idx) {
    const at = (i) => idx.headCells?.[i] || null;
    return {
      name:   idx.nameCol   >= 0 && isThVisible(at(idx.nameCol)),
      id:     idx.idCol     >= 0 && isThVisible(at(idx.idCol)),
      email:  idx.emailCol  >= 0 && isThVisible(at(idx.emailCol)),
      roles:  idx.rolesCol  >= 0 && isThVisible(at(idx.rolesCol)),
      groups: idx.groupsCol >= 0 && isThVisible(at(idx.groupsCol)),
      status: idx.statusCol >= 0 && isThVisible(at(idx.statusCol)),
    };
  }

  // --------------------------------
  // LOOKUPS FROM <select> FILTERS
  // --------------------------------

  /**
   * Build lookups from a Moodle filter <select>.
   * - labelsMap: normalized label -> {value,label}
   * - valueMap: value -> label
   * - emptyKey: normalized label for sentinel “none” (e.g., "Sin grupo")
   * - positiveLabelKeys: Set of normalized labels that have numeric value > 0
   *
   * @param {'roles'|'groups'|'status'} fieldName
   * @returns {{labelsMap:Map<string,{value:string,label:string}>,valueMap:Map<string,string>,emptyKey:string|null,positiveLabelKeys:Set<string>}}
   */
  function buildSelectLookup(fieldName) {
    const select = document.querySelector(`select[data-field-name="${fieldName}"]`);
    const labelsMap = new Map();            // normalized label -> { value, label }
    const valueMap  = new Map();            // value -> label
    const positiveLabelKeys = new Set();    // normalized labels with value > 0
    let emptyKey = null;

    if (!select) return { labelsMap, valueMap, emptyKey, positiveLabelKeys };

    for (const opt of select.querySelectorAll('option')) {
      const value = opt.value;
      const label = normalizeWhitespace(opt.textContent || '');
      const key = normalizeLabelKey(label);

      labelsMap.set(key, { value, label });
      valueMap.set(value, label);

      if (value === '-1') emptyKey = key;
      // Track labels that correspond to real (positive) group IDs.
      if (/^\d+$/.test(value) && Number(value) > 0) positiveLabelKeys.add(key);
    }
    return { labelsMap, valueMap, emptyKey, positiveLabelKeys };
  }

  // --------------------------------
  // PARSE → SERIALIZE
  // --------------------------------

  /**
   * Parse the visible participants rows into structured objects.
   *
   * Outputs:
   *  - photo_url: string|null
   *  - surname: string
   *  - name: string
   *  - univ_id: string
   *  - email: string
   *  - roles: string[]                 // localized labels; sentinel “none” removed
   *  - groups: string[]                // if single label is unknown or sentinel ⇒ []
   *  - active: boolean                 // true when status label matches “Active”
   *
   * Special rules:
   *  - Groups: if a cell shows exactly one label and it’s not in the groups <select>
   *    as a positive-ID option (or equals the select’s “none” label), export [].
   *
   * @param {HTMLTableElement} table
   * @returns {Array<Object>}
   */
  function parseVisibleRows(table) {
    const idx = getColumnIndexMap(table);
    const vis = getVisibleColumns(table, idx);

    // Lookups for mapping
    const { emptyKey: rolesNoneKey }  = buildSelectLookup('roles');
    // Groups: we need sentinel “none” and the set of known positive-ID labels.
    // If a cell shows a single label that is not one of these known labels (e.g., “No hay grupos”),
    // we’ll treat it as “no groups” even if the wording differs from the select option.
    const { emptyKey: groupsNoneKey, positiveLabelKeys: knownGroupLabelKeys } = buildSelectLookup('groups');
    const { valueMap: statusByValue } = buildSelectLookup('status');
    const activeLabel = statusByValue?.get('0') || 'Active';

    const rows = [];

    for (const tr of table.querySelectorAll('tbody tr')) {
      const cells = [...tr.querySelectorAll('th,td')];
      if (!cells.length) continue;
      if (isRowEmpty(tr, cells)) continue;

      const row = {};

      // Name → {photo_url, surname, name} from the "fullname" cell
      if (vis.name) {
        const nameCell = cells[idx.nameCol];
        const img = nameCell?.querySelector('img');
        const photoUrl = img ? img.src : null;
        const [surname, name] = splitSurnameAndName(getFullNameTextFromCell(nameCell));
        row[FIELD_KEYS.photo]   = photoUrl;
        row[FIELD_KEYS.name[0]] = surname;
        row[FIELD_KEYS.name[1]] = name;
      }

      // University ID
      if (vis.id) row[FIELD_KEYS.id] = getCellText(cells[idx.idCol]);

      // Email
      if (vis.email) row[FIELD_KEYS.email] = getCellText(cells[idx.emailCol]);

      // Roles → array of localized labels (drop sentinel “none”)
      if (vis.roles) {
        const labels = splitComma(getMultiItemText(cells[idx.rolesCol]));
        row[FIELD_KEYS.roles] = rolesNoneKey
          ? labels.filter(l => normalizeLabelKey(l) !== rolesNoneKey)
          : labels;
      }

      // Groups → labels[]; single “unknown/none” label ⇒ []
      // (If exactly one label: [] when it equals the select’s “none” label,
      //  or when it’s not among known positive-ID labels from the groups <select>.)
      if (vis.groups) {
        const labels = splitComma(getCellText(cells[idx.groupsCol]));
        if (labels.length === 1) {
          const k = normalizeLabelKey(labels[0]);
          const matchesNone = groupsNoneKey && k === groupsNoneKey;
          const hasLookup = knownGroupLabelKeys && knownGroupLabelKeys.size > 0;
          const matchesKnownPositive = hasLookup && knownGroupLabelKeys.has(k);
          row[FIELD_KEYS.groups] = (matchesNone || (hasLookup && !matchesKnownPositive)) ? [] : labels;
        } else {
          row[FIELD_KEYS.groups] = labels;
        }
      }

      // Status → active:boolean (compare with “Active” label)
      if (vis.status) {
        const statusCell = cells[idx.statusCol];
        const label = (statusCell?.querySelector('div')?.getAttribute('data-status') || statusCell?.innerText || '').trim();
        row[FIELD_KEYS.active] = !!(label && normalizeLabelKey(label) === normalizeLabelKey(activeLabel));
      }

      if (Object.keys(row).length) rows.push(row);
    }

    return rows;
  }

  /**
   * Serialize parsed rows as pretty JSON.
   * @param {HTMLTableElement} table
   * @returns {string} JSON string
   */
  const exportVisibleRowsAsJson = (table) => JSON.stringify(parseVisibleRows(table), null, 2);

  /**
   * Serialize parsed rows as CSV.
   * Header is derived from fields present in any row.
   * Cells are escaped with RFC4180-compatible quoting.
   *
   * @param {HTMLTableElement} table
   * @param {string} [delimiter=';']   // Moodle-friendly default
   * @returns {string} CSV text
   */
  function exportVisibleRowsAsCsv(table, delimiter = ';') {
    const rows = parseVisibleRows(table);

    const has = (k) => rows.some(o => Object.prototype.hasOwnProperty.call(o, k));

    const header = [];
    const includeName = has('surname') || has('name') || has('photo_url');
    if (includeName)    header.push('photo_url', 'surname', 'name');
    if (has('univ_id')) header.push('univ_id');
    if (has('email'))   header.push('email');
    if (has('roles'))   header.push('roles');
    if (has('groups'))  header.push('groups');
    if (has('active'))  header.push('active');

    const lines = [header.join(delimiter)];

    for (const o of rows) {
      const fields = [];
      if (includeName)    fields.push(csvEscape(o.photo_url ?? '', delimiter), csvEscape(o.surname || '', delimiter), csvEscape(o.name || '', delimiter));
      if (has('univ_id')) fields.push(csvEscape(o.univ_id || '', delimiter));
      if (has('email'))   fields.push(csvEscape(o.email || '', delimiter));
      if (has('roles'))   fields.push(csvEscape((o.roles || []).join(', '), delimiter));
      if (has('groups'))  fields.push(csvEscape((o.groups || []).join(', '), delimiter));
      if (has('active'))  fields.push(csvEscape(String(!!o.active), delimiter));
      lines.push(fields.join(delimiter));
    }

    return lines.join('\r\n');
  }

  // --------------------------------
  // UI (Toolbar)
  // --------------------------------

  /**
   * Ensure the toolbar exists and is wired (idempotent).
   * - Clones paging links.
   * - Adds CSV/JSON buttons.
   * - Adds printable button.
   * - Adds "color by roles" toggle.
   * - Adds "improve photos" toggle.
   * - Applies role-based row classes using detected roles column.
   * @param {HTMLTableElement} table
   */
  function ensureToolbar(table) {
    if (document.getElementById('participants-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'participants-toolbar';
    toolbar.classList.add('participants-toolbar');

    // Clone Moodle paging links (e.g., "Show all")
    document.querySelectorAll('a[data-action="showcount"]').forEach(link => {
      const show = link.cloneNode(true);
      show.classList.add('btn', 'btn-primary');
      toolbar.appendChild(show);
    });

    // Action buttons
    const btnCsv = createButton('participants-csv-btn', I18N.csv);
    const btnJson = createButton('participants-json-btn', I18N.json);
    const btnPrint = createButton('participants-print-btn', I18N.print);

    // Wire up actions
    btnCsv.addEventListener('click', () => {
      saveTextFile(
        safeFilename('csv'),
        '\uFEFF' + exportVisibleRowsAsCsv(table, locale === 'en' ? ',' : ';'),
        'text/csv;charset=utf-8'
      );
    });

    btnJson.addEventListener('click', () => {
      saveTextFile(safeFilename('json'), exportVisibleRowsAsJson(table), 'application/json;charset=utf-8');
    });

    btnPrint.addEventListener('click', () => {
      const rows = parseVisibleRows(table);
      if (!rows.length) return;

      const allRoles = new Set(rows.flatMap(r => r.roles || []));
      const roleLabel = allRoles.size === 1 ? Array.from(allRoles)[0] : 'Participant';

      const filename = safeFilename('csv').replace(/\.[^.]+$/, ''); // drop extension
      const showId = rows.some(r => 'univ_id' in r);
      const showEmail = rows.some(r => 'email' in r);
      const showGroups = rows.some(r => r.groups && r.groups.length);

      // Build HTML table rows
      const htmlRows = rows.map(r => {
        const roleClasses = (r.roles || [])
          .map(role => normalizeLabelKey(role).replace(/[^a-z0-9-]+/g, '-'))
          .join(' ');
        const activeClass = r.active ? '' : 'inactive';
        const photo = (r.photo_url || '').replace('/f2', '/f3');
        const detailsLine = [showId && r.univ_id, showEmail && r.email]
          .filter(Boolean)
          .join(', ');
        const detailsHtml = detailsLine ? `<div class="details">${detailsLine}</div>` : '';
        const groupsLine = showGroups && r.groups?.length ? `<div class="groups">${r.groups.join(', ')}</div>` : '';
        return `
          <tr class="${[roleClasses, activeClass].filter(Boolean).join(' ')}">
            <td>
              <div class="entry">
                <img src="${photo}">
                <div class="info">
                  <div class="fullname">${r.surname}, ${r.name}</div>
                  ${detailsHtml}
                  ${groupsLine}
                </div>
              </div>
            </td>
            <td></td>
          </tr>`;
      }).join('');

      // Write clean document
      document.open();
      document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${filename}</title>
          <style>
            body { font-family: sans-serif; margin: 2em; }
            h1 { border: 1px dashed #999; font-size: 1.75rem; margin-bottom: 0.75rem; padding: 0.2rem 0.4rem; position: relative; }
            h1::after { content: "EDITABLE"; color: white; background-color: gray; font-size: 1rem; padding: 0 0.2rem; position: absolute; top: -1px; right: -1px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; vertical-align: top; border-bottom: 1px solid #999; padding: 0.5rem; }
            td:first-child { white-space: nowrap; width: 1%; }
            .entry { display: flex; align-items: flex-start; gap: 0.5rem; }
            img { width: 4rem; height: 4rem; border-radius: 10%; }
            img[src=""] { visibility: hidden; }
            .info div { line-height: 1.3; }
            .fullname { font-weight: bold; }
            .details { font-style: italic; }
            ${ROLE_COLOR_CSS}
            @media print {
              body { margin: 0; }
              h1 { border: none; }
              h1::after { display: none; }
              tr { page-break-inside: avoid; }
              th, td { border-bottom: 0.25pt solid #999; }
            }
          </style>
        </head>
        <body>
          <h1 contenteditable="true">${filename}</h1>
          <table class="${GM_getValue('colorRoles', true) ? 'roles-colored' : ''}">
            <thead>
              <tr><th>${roleLabel}</th><th>Notes</th></tr>
            </thead>
            <tbody>
              ${htmlRows}
            </tbody>
          </table>
        </body>
        </html>
      `);
      document.close();
    });

    // Roles-based coloring
    const { rolesCol } = getColumnIndexMap(table);
    if (rolesCol >= 0) {
      for (const tr of table.querySelectorAll('tbody tr')) {
        const td = tr.children[rolesCol];
        if (!td) continue;
        (td.textContent || '')
          .toLowerCase()
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
          .map(role => normalizeLabelKey(role).replace(/[^a-z0-9-]+/g, '-'))
          .forEach(cls => tr.classList.add(cls));
      }
    }

    // Status-based "inactive" marker
    const { statusCol } = getColumnIndexMap(table);
    if (statusCol >= 0) {
      // Figure out the localized "Active" label (value "0" in the status <select>)
      const { valueMap: statusByValue } = buildSelectLookup('status');
      const activeLabel = statusByValue?.get('0') || 'Active';

      for (const tr of table.querySelectorAll('tbody tr')) {
        const cells = [...tr.querySelectorAll('th,td')];
        const statusCell = cells[statusCol];
        const raw = (statusCell?.querySelector('div')?.getAttribute('data-status') || statusCell?.innerText || '').trim();
        const isActive = !!(raw && normalizeLabelKey(raw) === normalizeLabelKey(activeLabel));
        if (!isActive) tr.classList.add('inactive');
      }
    }

    // Role coloring toggle (persistent)
    const chkColors = document.createElement('input');
    chkColors.type = 'checkbox';
    chkColors.checked = GM_getValue('colorRoles', true);

    const wrapColors = document.createElement('label');
    wrapColors.appendChild(chkColors);
    wrapColors.append(I18N.colorByRoles);

    // Apply + persist
    table.classList.toggle('roles-colored', chkColors.checked);
    chkColors.addEventListener('change', () => {
      table.classList.toggle('roles-colored', chkColors.checked);
      GM_setValue('colorRoles', chkColors.checked);
    });

    // Photo improvement toggle (persistent)
    const chkPhotos = document.createElement('input');
    chkPhotos.type = 'checkbox';
    chkPhotos.checked = GM_getValue('improvePhotos', false);

    const wrapPhotos = document.createElement('label');
    wrapPhotos.appendChild(chkPhotos);
    wrapPhotos.append(I18N.improvePhotos);

    // Apply + persist
    if (chkPhotos.checked) upgradePhotos(table);
    chkPhotos.addEventListener('change', () => {
      if (chkPhotos.checked) upgradePhotos(table);
      else downgradePhotos(table);
      GM_setValue('improvePhotos', chkPhotos.checked);
    });

    // Compose toolbar
    toolbar.appendChild(btnCsv);
    toolbar.appendChild(btnJson);
    toolbar.appendChild(btnPrint);
    toolbar.appendChild(wrapColors);
    toolbar.appendChild(wrapPhotos);

    // Insert before table
    table.parentNode.insertBefore(toolbar, table);
  }

  // --------------------------------
  // BOOTSTRAP & RESILIENCE
  // --------------------------------

  /**
   * Initializes the script safely; does nothing if participants table is missing.
   */
  function init() {
    const table = document.getElementById('participants');
    if (table) ensureToolbar(table);
  }

  // Run once when the DOM is ready (document-idle ensures it, but just in case)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Moodle dynamically re-renders the participants table via AJAX, so the toolbar may disappear.
  // Watch the DOM and re-run init() when needed.
  const uiObserver = new MutationObserver(init);

  uiObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Disconnect the observer when navigating away to avoid leaks.
  window.addEventListener('beforeunload', () => {
    uiObserver.disconnect();
  });

})();
