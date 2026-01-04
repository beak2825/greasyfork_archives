// ==UserScript==
// @name         YATA Target Call Copier (v1.6.26)
// @namespace    torn.yata.call.btn
// @version      1.6.26
// @description  Adds a Call button to the YATA Target List for easier callouts during Ranked Wars
// @match        https://yata.yt/target/*
// @match        https://yata.yt/target/
// @grant        none
// @license      MIT
// @run-at       document-end
// @homepageURL  https://greasyfork.org/scripts/545505
// @supportURL   https://greasyfork.org/scripts/545505/feedback
// @downloadURL https://update.greasyfork.org/scripts/545505/YATA%20Target%20Call%20Copier%20%28v1626%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545505/YATA%20Target%20Call%20Copier%20%28v1626%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Templates ----------
  // default & emoji:
  //   Left click:   no time
  //   Shift+Left:   include time (2nd line)
  //   Alt+Click :   include ID (after name, wrapped in [ ])
  //   Ctrl+Click:   UPPERCASE
  //
  // ASCII template ignores ALL modifiers and always copies:
  //   (leading newline)
  //   ╭══ … CALLING … ╮   ← top & bottom expand with extra "═" to roughly match middle width
  //        {name} [id]    ← roughly centered; ID wrapped in [ ]
  //   ╰═══ {time|Ready} ═══╯
  var TEMPLATES = {
    "default": "Calling: {name}{id}{time}",
    "emoji":   "🎯 Calling: {name}{id}{time}",
    "ascii":   "ASCII_BOX"
  };

  var CURRENT_TEMPLATE = localStorage.getItem('yata-template') || 'default';
  if (CURRENT_TEMPLATE === 'loud')  CURRENT_TEMPLATE = 'emoji';
  if (CURRENT_TEMPLATE === 'short') CURRENT_TEMPLATE = 'ascii';

  var TARGET_TABLE = null;
  var TBODY_OBSERVER = null;

  // ---------- Styles ----------
  (function injectStyles(){
    var css = ''
      /* Call column sizing & button */
      + '.call-col-th, .call-col-td{width:80px;min-width:80px;box-sizing:border-box;text-align:center;white-space:nowrap;}'
      + '.call-col-td{padding:0 10px;}'
      + '.yata-call-btn{display:inline-block;padding:2px 6px;font-size:12px;line-height:1.4;border:1px solid #6b7280;border-radius:4px;background:#f3f4f6;cursor:pointer;white-space:nowrap;transition:transform .05s ease,background .15s ease,border-color .15s ease;}'
      + '.yata-call-btn:hover{background:#e5e7eb;}'
      + '.yata-call-btn:active{transform:scale(0.98);}'
      + '.yata-call-btn--ok{background:#d1fae5!important;border-color:#10b981!important;}'
      + '.yata-call-btn--err{background:#fee2e2!important;border-color:#ef4444!important;}'

      /* Hidden helper for reliable Notes sorting */
      + '.yata-notes-sortkey{display:none !important;}'

      /* Header-integrated template picker */
      + '.yata-template-wrap{display:flex;align-items:center;gap:.35rem;}'
      + '.yata-template-label{font: inherit; color: inherit; letter-spacing: inherit;}'
      + '.yata-template-select{'
        + 'appearance:auto; -webkit-appearance:menulist; -moz-appearance:menulist;'
        + 'font: inherit; line-height: 1.2;'
        + 'padding:2px 6px; border:1px solid #c9c9c9; border-radius:4px;'
        + 'background:#fff !important; color:#4a4a4a !important;'
        + 'min-width:130px;'
      + '}'
      + '.yata-template-select option{background:#fff !important; color:#4a4a4a !important;}'
      + '.yata-template-select:focus{outline:none; box-shadow:0 0 0 2px rgba(68,126,155,0.25);}';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  })();

  // ---------- Small helpers ----------
  function round10(s){ s = Math.max(0, Math.floor((s+5)/10)*10); return s; }
  function fmtDur(sec){
    sec = round10(sec);
    var h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
    if (h) return h+'h '+m+'m '+s+'s';
    if (m) return m+'m '+s+'s';
    return s+'s';
  }
  function parseHospFromText(txt){
    if (!txt) return null;
    var m = txt.match(/H\s*for\s*(\d{1,2}:)?\d{1,2}:\d{2}/i);
    if (!m) return null;
    var parts = m[0].split(/\s*for\s*/i).pop().trim().split(':').map(function(n){ return parseInt(n,10); });
    if (parts.length === 2) return parts[0]*60 + parts[1];
    if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
    return null;
  }
  function hospLeft(tr){
    var statusCell = tr.querySelector('td.text-start.status');
    if (!statusCell) return 0;
    var isHosp = statusCell.classList.contains('player-status-red') || /H\s*for/i.test(statusCell.textContent||'');
    if (!isHosp) return 0;
    var dv = statusCell.getAttribute('data-val');
    if (dv && /^\d+$/.test(dv)){
      var t = parseInt(dv,10)*1000;
      return Math.ceil((t - Date.now())/1000);
    }
    var fromTxt = parseHospFromText(statusCell.textContent||'');
    return (fromTxt != null) ? fromTxt : 0;
  }
  function etaTooltip(tr){
    var statusCell = tr.querySelector('td.text-start.status');
    if (statusCell){
      var dv = statusCell.getAttribute('data-val');
      if (dv && /^\d+$/.test(dv)){
        var d = new Date(parseInt(dv,10)*1000);
        return 'Out at: '+d.toLocaleTimeString()+' ('+d.toLocaleDateString()+')';
      }
    }
    var s = hospLeft(tr);
    return s>0 ? 'ETA: '+fmtDur(s) : 'Ready';
  }
  function colorize(btn,tr){
    var s = tr.querySelector('td.text-start.status');
    btn.style.background = '#f3f4f6';
    btn.style.borderColor = '#6b7280';
    if (!s) return;
    if (s.classList.contains('player-status-green')){
      btn.style.background = '#e6ffed';
      btn.style.borderColor = '#10b981';
    } else if (s.classList.contains('player-status-red')){
      btn.style.background = '#ffe4e6';
      btn.style.borderColor = '#ef4444';
    } else {
      btn.style.background = '#f3f4f6';
      btn.style.borderColor = '#9ca3af';
    }
  }
  function copyText(t){
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t);
    return new Promise(function(resolve,reject){
      var ta = document.createElement('textarea');
      ta.value = t; ta.style.position='fixed'; ta.style.top='-9999px';
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }
  function flash(btn, kind){
    var cls = (kind==='ok') ? 'yata-call-btn--ok' : 'yata-call-btn--err';
    var prev = btn.textContent;
    btn.classList.add(cls);
    btn.textContent = (kind==='ok') ? 'Copied!' : 'Failed';
    setTimeout(function(){ btn.classList.remove(cls); btn.textContent = prev; }, 850);
  }

  // ---------- tablesorter nudge (minimal) ----------
  var tsTimer = null;
  function scheduleTablesorterUpdate(){
    if (tsTimer) return;
    tsTimer = setTimeout(function(){
      tsTimer = null;
      try {
        var $ = window.jQuery || window.$;
        var table = TARGET_TABLE || document.querySelector('table.tablesorter') || document.querySelector('table');
        if ($ && table) $(table).trigger('update');
      } catch(err){ /* ignore */ }
    }, 60);
  }

  // ---------- Header insertion ----------
  function insertCallHeader(){
    var headerRow = document.querySelector('thead tr.tablesorter-headerRow');
    if (!headerRow || headerRow.dataset.callColAdded) return false;

    TARGET_TABLE = headerRow.closest('table');

    var resultTh = headerRow.querySelector('th[data-column="1"]');
    if (!resultTh) return false;

    var th = document.createElement('th');
    th.className = 'a tablesorter-header tablesorter-headerUnSorted call-col-th sorter-false';
    th.setAttribute('title','Quick call');
    th.setAttribute('tabindex','0');
    th.setAttribute('scope','col');
    th.setAttribute('role','columnheader');
    th.setAttribute('aria-disabled','true'); // non-sortable
    th.setAttribute('data-sorter','false');
    th.setAttribute('unselectable','on');
    th.setAttribute('aria-sort','none');
    var ac = resultTh.getAttribute('aria-controls');
    if (ac) th.setAttribute('aria-controls', ac);
    th.style.userSelect = 'none';

    var inner = document.createElement('div');
    inner.className = 'tablesorter-header-inner';
    inner.textContent = 'Call';
    th.appendChild(inner);

    resultTh.insertAdjacentElement('afterend', th);
    headerRow.dataset.callColAdded = '1';

    scheduleTablesorterUpdate();
    return true;
  }

  // ---------- Row utilities ----------
  function cellEndingAtColumn(tr, targetEndCol){
    var col = 0, i, td, span;
    for (i=0; i<tr.children.length; i++){
      td = tr.children[i];
      span = parseInt(td.getAttribute('colspan')||'1',10) || 1;
      col += span;
      if (col === targetEndCol) return td;
    }
    return null;
  }

  // Ensure Call cell exists; returns {cell, created}
  function ensureCallCell(tr){
    var existing = tr.querySelector('td.call-col-td');
    if (existing) return { cell: existing, created: false };

    if (tr.children.length === 1){
      var only = tr.children[0];
      if (only.hasAttribute('colspan')){
        var cs = parseInt(only.getAttribute('colspan'),10);
        if (!isNaN(cs)) only.setAttribute('colspan', String(cs+1));
      }
      return { cell: null, created: false };
    }

    var endAt2 = cellEndingAtColumn(tr, 2);
    if (!endAt2) return { cell: null, created: false };

    var td = document.createElement('td');
    td.className = 'call-col-td';
    endAt2.insertAdjacentElement('afterend', td);
    return { cell: td, created: true };
  }

  function getNameVariants(tr){
    var link = tr.querySelector('a[href*="profiles.php?XID="]');
    if (!link) return {};
    var full = (link.textContent || '').trim();
    var nameOnly = full.replace(/\s*\[\d+\]\s*$/, '').trim();

    var idMatch = full.match(/\[(\d+)\]/);
    var id = idMatch ? idMatch[1] : null;
    if (!id && link.href){
      var m = link.href.match(/XID=(\d+)/i);
      if (m) id = m[1];
    }
    return { full: full, nameOnly: nameOnly, id: id };
  }

  function watchStatus(tr, btn, baseHint){
    var statusCell = tr.querySelector('td.text-start.status');
    if (!statusCell) return;
    var update = function(){
      btn.title = baseHint + '\n' + etaTooltip(tr);
      colorize(btn, tr);
    };
    var mo = new MutationObserver(update);
    mo.observe(statusCell, { characterData:true, subtree:true, attributes:true, attributeFilter:['data-val','class','title'] });
    update();
    tr._yataStatusWatch = mo;
  }

  // ---------- Notes: hidden sort key ----------
  function findNotesTd(tr){
    for (var i=0; i<tr.children.length; i++){
      var td = tr.children[i];
      if (td.querySelector && td.querySelector('input.target-list-note')) return td;
    }
    return null;
  }

  function ensureNotesSortKey(tr){
    var td = findNotesTd(tr);
    if (!td) return {updated:false};
    var input = td.querySelector('input.target-list-note');
    var val = '';
    if (input) val = (input.value || '').trim();

    var span = td.querySelector('.yata-notes-sortkey');
    if (!span){
      span = document.createElement('span');
      span.className = 'yata-notes-sortkey';
      td.insertBefore(span, td.firstChild);
    }
    var changed = (span.textContent !== val);
    if (changed) span.textContent = val;

    if (td.getAttribute('data-sort-value') !== val) {
      td.setAttribute('data-sort-value', val);
      changed = true;
    }
    return {updated: changed};
  }

  function watchNotes(tr){
    var td = findNotesTd(tr);
    if (!td) return;
    var input = td.querySelector('input.target-list-note');
    if (!input || input._yataNotesWatch) return;
    var handler = function(){
      var res = ensureNotesSortKey(tr);
      if (res.updated) scheduleTablesorterUpdate();
    };
    input.addEventListener('input', handler);
    input.addEventListener('change', handler);
    input._yataNotesWatch = true;
  }

  // ---------- Message builders ----------
  function buildAsciiMessage(opts){
    // Always include ID if present; always include time (or "Ready")
    var name = opts.nameOnly || '';
    var idPart = opts.id ? (' [' + opts.id + ']') : '';
    var timeTxt = (opts.timeSec > 0) ? fmtDur(opts.timeSec) : 'Ready';

    // Base building blocks
    var coreTop = ' 🎯 CALLING ';
    var leftCapTop = '╭', rightCapTop = '╮';
    var leftCapBot = '╰', rightCapBot = '╯';

    // Base counts of '='
    var topLeftEqBase = 1, topRightEqBase = 1;
    var botLeftEqBase = 3, botRightEqBase = 3;

    // Build minimal variants for measurement
    function topWithCounts(l, r){
      return leftCapTop + '═'.repeat(l) + coreTop + '═'.repeat(r) + rightCapTop;
    }
    function bottomWithCounts(l, r){
      return leftCapBot + '═'.repeat(l) + ' ' + timeTxt + ' ' + '═'.repeat(r) + rightCapBot;
    }

    var topMin = topWithCounts(topLeftEqBase, topRightEqBase);
    var bottomMin = bottomWithCounts(botLeftEqBase, botRightEqBase);

    var midCore = name + idPart;
    var midLen  = midCore.length;
    var topMinLen = topMin.length;
    var bottomMinLen = bottomMin.length;

    // Choose a target width: must accommodate the widest of (middle, topMin, bottomMin)
    var targetWidth = Math.max(midLen, topMinLen, bottomMinLen);

    // Expand TOP to target
    var addTop = Math.max(0, targetWidth - topMinLen);
    var addTopLeft  = Math.floor(addTop / 2);
    var addTopRight = addTop - addTopLeft;
    var top = topWithCounts(topLeftEqBase + addTopLeft, topRightEqBase + addTopRight);

    // Expand BOTTOM to target
    var addBot = Math.max(0, targetWidth - bottomMinLen);
    var addBotLeft  = Math.floor(addBot / 2);
    var addBotRight = addBot - addBotLeft;
    var bottom = bottomWithCounts(botLeftEqBase + addBotLeft, botRightEqBase + addBotRight);

    // Recompute final target (in case rounding produced off-by-one)
    var finalWidth = Math.max(top.length, bottom.length, targetWidth);

    // Re-balance if needed to match finalWidth exactly
    if (top.length < finalWidth){
      var diff = finalWidth - top.length;
      top = topWithCounts(topLeftEqBase + addTopLeft + Math.floor(diff/2),
                          topRightEqBase + addTopRight + Math.ceil(diff/2));
    }
    if (bottom.length < finalWidth){
      var diffB = finalWidth - bottom.length;
      bottom = bottomWithCounts(botLeftEqBase + addBotLeft + Math.floor(diffB/2),
                                botRightEqBase + addBotRight + Math.ceil(diffB/2));
    }

    // Middle line roughly centered under the final width
    var padLeft = Math.max(0, Math.floor((finalWidth - midLen) / 2));
    var middle = (padLeft ? ' '.repeat(padLeft) : '') + midCore;

    // Leading newline before the box (requested behavior)
    return '\n' + top + '\n' + middle + '\n' + bottom;
  }

  function buildMessage(opts){
    // opts: { nameOnly, id, includeId, includeTime, timeSec }
    if (CURRENT_TEMPLATE === 'ascii') {
      return buildAsciiMessage(opts); // ignores modifiers entirely
    }

    var includeId   = !!opts.includeId;
    var includeTime = !!opts.includeTime;

    var timeTxt = '';
    if (includeTime && opts.timeSec > 0) timeTxt = fmtDur(opts.timeSec);

    var tpl = TEMPLATES[CURRENT_TEMPLATE] || TEMPLATES["default"];
    var idPart = (includeId && opts.id) ? ' [' + opts.id + ']' : '';

    var timePart = '';
    if (timeTxt) {
      if (CURRENT_TEMPLATE === 'emoji') {
        timePart = '\n⏲️ ' + timeTxt;
      } else { // default
        timePart = '\n' + 'Hitting in ' + timeTxt;
      }
    }

    return tpl
      .replace('{name}', opts.nameOnly || '')
      .replace('{id}',   idPart)
      .replace('{time}', timePart);
  }

  // returns true if button was newly added
  function attachButtonInto(callCell, tr){
    if (!callCell) return false;
    if (callCell.querySelector('.yata-call-btn')) return false;

    var vars = getNameVariants(tr);
    if (!vars.full) return false;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'yata-call-btn';
    btn.textContent = 'Call';
    var baseHint = 'Click: copy (Shift=+time on new line, Alt=+ID, Ctrl=UPPER; ASCII ignores modifiers; Middle-click: CALL: <name>)';
    btn.title = baseHint;

    btn.addEventListener('click', function(ev){
      ev.stopPropagation();

      var tpl = CURRENT_TEMPLATE;

      var payload = buildMessage({
        nameOnly: vars.nameOnly,
        id: vars.id,
        includeId:   (tpl === 'ascii') ? true : !!ev.altKey,     // ASCII: always include ID if present
        includeTime: (tpl === 'ascii') ? true : !!ev.shiftKey,   // ASCII: always include time/Ready
        timeSec: hospLeft(tr)
      });

      if (ev.ctrlKey && tpl !== 'ascii') payload = payload.toUpperCase();

      copyText(payload).then(function(){ flash(btn,'ok'); }).catch(function(){
        flash(btn,'err'); window.prompt('Copy manually:', payload);
      });
    });

    btn.addEventListener('auxclick', function(ev){
      if (ev.button !== 1) return;
      ev.preventDefault();
      var quick = 'CALL: ' + vars.nameOnly; // quick middle-click format (no ID/time)
      copyText(quick).then(function(){ flash(btn,'ok'); }).catch(function(){ flash(btn,'err'); });
    });

    callCell.appendChild(btn);
    watchStatus(tr, btn, baseHint);
    return true;
  }

  function watchRow(tr){
    if (tr._yataRowWatch) return;
    var mo = new MutationObserver(function(){
      var res = ensureCallCell(tr);
      if (res.cell) attachButtonInto(res.cell, tr);

      var updated = ensureNotesSortKey(tr).updated;
      watchNotes(tr);
      if (res.created || updated) scheduleTablesorterUpdate();
    });
    mo.observe(tr, { childList:true, subtree:false });
    tr._yataRowWatch = mo;
  }

  function processRow(tr){
    insertCallHeader();
    var res = ensureCallCell(tr);
    if (res.cell) attachButtonInto(res.cell, tr);

    var updated = ensureNotesSortKey(tr).updated;
    watchNotes(tr);
    watchRow(tr);

    if (res.created || updated) scheduleTablesorterUpdate();
  }

  function scanExistingRows(){
    if (!TARGET_TABLE) {
      insertCallHeader();
      var headerRow = document.querySelector('thead tr.tablesorter-headerRow');
      if (headerRow) TARGET_TABLE = headerRow.closest('table');
    }
    var tbody = TARGET_TABLE ? TARGET_TABLE.tBodies[0] : document.querySelector('tbody');
    if (!tbody) return;

    var rows = tbody.querySelectorAll('tr[id^="target-list-refresh-"]');
    for (var i=0; i<rows.length; i++) processRow(rows[i]);

    if (!TBODY_OBSERVER){
      TBODY_OBSERVER = new MutationObserver(function(muts){
        for (var j=0; j<muts.length; j++){
          var m = muts[j];
          if (m.type === 'childList'){
            for (var k=0; k<m.addedNodes.length; k++){
              var node = m.addedNodes[k];
              if (node && node.nodeType === 1 && node.tagName === 'TR'){
                processRow(node);
              }
            }
          }
        }
      });
      TBODY_OBSERVER.observe(tbody, { childList:true, subtree:false });
    }
  }

  // ---------- Header template selector ----------
  function addTemplateControlInHeader(){
    var h2 = document.querySelector('h2.title .d-flex');
    if (!h2) return false;

    var refreshBlockElm = document.querySelector('#target-refresh');
    var refreshBlock = refreshBlockElm ? refreshBlockElm.closest('.px-2') : null;

    var host = document.createElement('div');
    host.className = 'px-2';

    var wrap = document.createElement('div');
    wrap.className = 'yata-template-wrap';
    var label = document.createElement('label');
    label.className = 'yata-template-label';
    label.setAttribute('for','yata-template-select');
    label.textContent = 'Call Style:';
    var sel = document.createElement('select');
    sel.id = 'yata-template-select';
    sel.className = 'yata-template-select';

    Object.keys(TEMPLATES).forEach(function(k){
      var opt = document.createElement('option');
      opt.value = k;
      var text = (k === 'emoji') ? 'emoji' : (k === 'ascii') ? 'ascii' : 'default';
      opt.textContent = text;
      sel.appendChild(opt);
    });
    sel.value = CURRENT_TEMPLATE;

    sel.addEventListener('change', function(e){
      CURRENT_TEMPLATE = e.target.value;
      localStorage.setItem('yata-template', CURRENT_TEMPLATE);
    });

    wrap.appendChild(label);
    wrap.appendChild(sel);
    host.appendChild(wrap);

    if (refreshBlock) {
      h2.insertBefore(host, refreshBlock);
    } else {
      h2.appendChild(host);
    }
    return true;
  }

  // ---------- Init ----------
  function init(){
    addTemplateControlInHeader();
    insertCallHeader();
    scanExistingRows();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
