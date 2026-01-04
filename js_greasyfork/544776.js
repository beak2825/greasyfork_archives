// ==UserScript==
// @name         AH/QQ/SB/SV Mark threadmarks un·read
// @description  Manual "Mark threadmarks read" control. Click the "New"/"Old" indicators to shift the cutoff date. Add button "Mark New after" below each post.
// @author       C89sd
// @namespace    https://greasyfork.org/users/1376767
// @version      0.5
// @match        https://*.alternatehistory.com/*
// @match        https://*.questionablequesting.com/*
// @match        https://*.spacebattles.com/*
// @match        https://*.sufficientvelocity.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/544776/AHQQSBSV%20Mark%20threadmarks%20un%C2%B7read.user.js
// @updateURL https://update.greasyfork.org/scripts/544776/AHQQSBSV%20Mark%20threadmarks%20un%C2%B7read.meta.js
// ==/UserScript==

const RELOAD_AFTER_BUTTON_PRESS = false;

// remember the last timestamp after a fetch
let manualReadDate /* Number | null */ = null;

// --- thread page check --------------------------------------
const m = location.pathname.match(/^(.*?\/threads\/[^\/]+\.\d+)/);
if (!m) return;                   // not inside a thread
const basePath = m[1];

// --- style --------------------------------------------------
GM_addStyle(`
.mind { background: rgb(89, 126, 165); }
.message-newIndicator        { cursor:pointer; }
.message-newIndicator.oldInd { background:#888 !important; }
.mbutt { width: 100%; text-align: center; display: block; box-sizing: border-box; padding: 0 0 4px 2px; margin-top: 5px; filter: brightness(70%); }
`);

// ── templates ------------------------------------------------
const oldBadgeTpl = document
  .createRange()
  .createContextualFragment('<ul class="structItem-statuses"><li><span class="mind message-newIndicator oldInd">Old</span></li></ul>')
  .firstChild;

const newBadgeTpl = document
  .createRange()
  .createContextualFragment('<ul class="structItem-statuses"><li><span class="mind message-newIndicator">New</span></li></ul>')
  .firstChild;

// --- core worker ---------------------------------------------
function processThreadmark(node){
  if (!node.matches('.structItem--threadmark') ||
      node.matches('.structItem--threadmark-filler') ||
      node.__doneOld) return;

  node.__doneOld = true;                       // mark as processed

  if (!node.classList.contains('is-unread')) { // already read → add badge
    const cell = node.querySelector('.structItem-cell--main');
    cell && cell.insertBefore(oldBadgeTpl.cloneNode(true), cell.firstChild);
  }

  // if a date ovveride is active, bring node in sync
  if (manualReadDate !== null) adjustRowToManualDate(node);
}

// force one row to show Old/New per manualReadDate
function adjustRowToManualDate(node){
  const timeEl = node.querySelector('time[data-time]');
  if (!timeEl) return;

  const stamp = parseInt(timeEl.getAttribute('data-time'), 10);
  const cell  = node.querySelector('.structItem-cell--main');
  let   badge = node.querySelector('.message-newIndicator');

  // decide desired state
  const wantOld = stamp <= manualReadDate;

  // ensure structItem unread class
  node.classList.toggle('is-unread', !wantOld);

  // make badge exist & of correct flavour
  if (badge) {
    badge.textContent = wantOld ? 'Old' : 'New';
    badge.classList.toggle('oldInd', wantOld);
  } else if (cell) {
    cell.insertBefore(
      (wantOld ? oldBadgeTpl : newBadgeTpl).cloneNode(true),
      cell.firstChild
    );
  }
}

function refreshAllBadges(){
  if (manualReadDate === null) return;
  document
    .querySelectorAll('.structItem--threadmark:not(.structItem--threadmark-filler):has(time[data-time])')
    .forEach(adjustRowToManualDate);
}

function initialScan() {
  document.querySelectorAll('.structItem--threadmark:not(.structItem--threadmark-filler):has(time[data-time])')
          .forEach(processThreadmark);
}

// --- initial scan + article handling & debug logs --------------
document.addEventListener('DOMContentLoaded', () => {

  initialScan();

  // 3. add Mark "New" after buttons
  for (const article of document.querySelectorAll('article.message.hasThreadmark')) {
    const timeEl = article.querySelector('time[data-time]');

    const target = article.querySelector('.sv-rating-bar') || article.querySelector('.reactionsBar');
    if (!target) return;

    const btn = document.createElement('button');
    btn.type = "button"
    btn.className = 'threadmark-control tm-move-btn mbutt';
    btn.textContent = 'Mark "New" after';
    btn.dataset.stamp = timeEl.getAttribute('data-time');

    target.parentNode.insertBefore(btn, target);
  }
});

// --- watch dynamically added threadmarks -----------------------
new MutationObserver(muts=>{
  muts.forEach(m=>m.addedNodes.forEach(n=>{
    if (n.nodeType !== 1) return;
    if (n.matches('.structItem--threadmark')) {
      processThreadmark(n);
      if (manualReadDate !== null) adjustRowToManualDate(n);
    }
    n.querySelectorAll?.('.structItem--threadmark:has(time[data-time])')
      .forEach(z=>{
        processThreadmark(z);
        if (manualReadDate !== null) adjustRowToManualDate(z);
      });
  }));
}).observe(document.documentElement,{childList:true,subtree:true});

// --- helpers ---------------------------------------------------
function csrfToken(){
  return (window.XF && XF.config && XF.config.csrf) ||
         document.querySelector('input[name=_xfToken]')?.value;
}

function sendMark(date, c1 = null, c2 = () => {}){
  const csrf = csrfToken();
  if (!csrf) { alert('Missing CSRF token'); return; }

  const fd = new FormData();
  fd.append('_xfToken', csrf);

  // Default callback -> remember date & update UI
  if (c1 === null) {
    manualReadDate = date;
    c1 = refreshAllBadges;
  }

  fetch(`${basePath}/mark-threadmarks-read?date=${date}`, {
        method : 'POST',
        credentials : 'same-origin',
        headers : { 'X-Requested-With': 'XMLHttpRequest' },
        body : fd
  }).finally(() => c2 && c2())
    .finally(() => c1 && c1())
}

// --- delegated click handler ---------------------------------
document.addEventListener('click', ev=>{
  if (!ev.target || !ev.target.closest) return;

  // clicked on Old/New badge in threadmark list
  const badge = ev.target.closest('.message-newIndicator');
  if (badge && badge.closest('.structItem--threadmark')) {
    const row  = badge.closest('.structItem--threadmark');
    const time = row.querySelector('time[data-time]');
    if (!time) return;

    const stamp = parseInt(time.getAttribute('data-time'), 10);
    if (!stamp) { alert('Timestamp error'); return; }

    const date = badge.classList.contains('oldInd') ? stamp - 1 : stamp;
    if (RELOAD_AFTER_BUTTON_PRESS) {
      sendMark(date, () => location.reload());
    } else {
      sendMark(date);
    }
    return;
  }

  // clicked on the new "Mark" "New" after" button
  const moveBtn = ev.target.closest('.tm-move-btn');
  if (moveBtn) {
    const stamp = parseInt(moveBtn.dataset.stamp, 10);
    if (!stamp) { alert('Timestamp error'); return; }
    if (RELOAD_AFTER_BUTTON_PRESS) {
      sendMark(stamp, () => location.reload());
    } else {
      sendMark(stamp);
    }
  }
});