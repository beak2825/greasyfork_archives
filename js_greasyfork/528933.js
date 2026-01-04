// ==UserScript==
// @name         KHX for "AO3: Kudosed and seen history" + Light/Dark skin toggle
// @description  Adds History Export/Import buttons, live updates (collapse on back-navigation, alt-tab...), redesigned Skipped/Seen combo button, enhanced title, mark-open that ignores external links. | Optional KH-replacement mode. | Standalone feature: Light/Dark site-skin toggle.
// @author       C89sd
// @version      2.13
// @match        https://archiveofourown.org/*
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/1376767
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/528933/KHX%20for%20%22AO3%3A%20Kudosed%20and%20seen%20history%22%20%2B%20LightDark%20skin%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/528933/KHX%20for%20%22AO3%3A%20Kudosed%20and%20seen%20history%22%20%2B%20LightDark%20skin%20toggle.meta.js
// ==/UserScript==
'use strict';

//---------------------------------------------------------------------------
//  Local Storage
//---------------------------------------------------------------------------

const khx_version = '2.03'; // Min: @version	2.3
// Patch for the fact that Min's script only stores version on !username,
// but out Import function restores the username, so it can be left unset.
// @TODO: Export the version, and when restoring set it to '2.03' if missing.
let stored_version = localStorage.getItem('kudoshistory_lastver');
if (!stored_version) {
  localStorage.setItem('kudoshistory_lastver', khx_version);
  stored_version = khx_version;
}

// Version mismatch safety.
let same_major_version = true;
if (khx_version[0] < stored_version[0]) {
  same_major_version = false;
  const message_key = 'khx_version_mismatch_'+khx_version+stored_version;
  const message_seen = localStorage.getItem(message_key) || "false";
  if (message_seen === "false") {
    alert(`[ExtendAO3KH][ERROR] 𝗠𝗮𝗷𝗼𝗿 𝘃𝗲𝗿𝘀𝗶𝗼𝗻 𝗺𝗶𝘀𝗺𝗮𝘁𝗰𝗵 with Min's "AO3: Kudosed and seen history".\n\nmin 's script version = ${stored_version}\nextend script version = ${khx_version}\n\n𝗪𝗿𝗶𝘁𝗶𝗻𝗴 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗱𝗶𝘀𝗮𝗯𝗹𝗲𝗱 to prevent accidental overwrite in case the data storage changed. The script will need to be reviewed and updated.\n\nThis message will not repeat.`)
    localStorage.setItem(message_key, "true");
  }
  console.log('[ExtendAO3KH] Writing disabled: version mismatch', khx_version, stored_version)
}

// Modified from @Min_ https://greasyfork.org/en/scripts/5835-ao3-kudosed-and-seen-history
class KHList {
  constructor(name) {
    this.name = name;
    this.list = undefined;
  }
  load() {
    this.list = localStorage.getItem('kudoshistory_' + this.name) || ','
    return this
  }
  save() {
    if (same_major_version) localStorage.setItem('kudoshistory_' + this.name, this.list)
    return this
  }
  hasId(work_id) {
    return this.list.indexOf(',' + work_id + ',') > -1
  }
  add(work_id) {
    this.list = ',' + work_id + this.list.replace(',' + work_id + ',', ',')
    return this
  }
  remove(work_id) {
    this.list = this.list.replace(',' + work_id + ',', ',')
    return this
  }
  toggleAndSave(work_id) {
    if (!(typeof work_id === "string" && /^\d+$/.test(work_id))) throw new Error("invalid work_id");
    this.load()
    if (this.hasId(work_id)) {
      this.remove(work_id).save()
      return false
    } else {
      this.add(work_id).save()
      return true
    }
  }
}

//---------------------------------------------------------------------------
//  Works
//---------------------------------------------------------------------------
let idRegex = /\/works\/(\d+)/
function getWorkId(str) { return idRegex.exec(str)?.[1] }

const seenList    = new KHList('seen');
const skippedList = new KHList('skipped');

let workId
let seen    = false;
let skipped = false;
let skipBtn, seenBtn;

function doWork() {
  workId = getWorkId(window.location.pathname) ?? getWorkId(document.querySelector('.share a[href]').getAttribute('href'))
  if (!workId) throw new Error('!workId')

  GM_addStyle(
    '.kh-seen-button { display: none !important; }' + // hide KH seen button
    '.khx-green     { background-color: #33cc70 !important; }' +
    '.khx-darkgreen { background-color: #00a13a !important; }' +
    '.khx-red       { background-color: #ff6d50 !important; }' +
    (CONFIG.colorTitle ? (
      '.khx-title-base  { color: #ff6d50 !important; }' +
      '.khx-title-green { color: #33cc70 !important; }' +
      '.khx-title-skipped { text-decoration: line-through !important; text-decoration-color: rgb(238, 151, 40, 180) !important; text-decoration-thickness: 2.5px !important; }'
    ) : '')
  );

  // Color title
  if (CONFIG.colorTitle) {
    const title = document.querySelector('h2.title.heading');
    if (title) {
      workTitleLink = document.createElement('a');
      workTitleLink.href = window.location.origin + window.location.pathname + window.location.search; // Keep "?view_full_work=true", drop "#summary"
      while (title.firstChild) workTitleLink.appendChild(title.firstChild);
      title.appendChild(workTitleLink);
      workTitleLink.classList.add('khx-title-base');
      if (seen)    greenTitle()
      if (skipped) skippedTitle(true)
    }
  }

  // Skipped/Seen combo button
  const H = 0.24 // height
  const W = 0.5  // width
  const R = 0.25 // radius

  const DM = window.getComputedStyle(document.body).color.match(/\d+/g)[0] > 128
  if (DM) document.body.classList.add('khx-dark-mode')
  else document.body.classList.remove('khx-dark-mode')

  GM_addStyle(`
.khx-skip-btn { padding: ${H}em ${W}em !important; background-clip: padding-box !important; border-radius: ${R}em 0 0 ${R}em !important; border-right: 0px !important; }
.khx-seen-btn { padding: ${H}em ${W}em !important; background-clip: padding-box !important; border-radius: 0 ${R}em ${R}em 0 !important; width: 8ch !important; }
.khx-skipped  { padding: ${H}em ${W}em !important; background-color: rgb(238, 151, 40) !important; }
/*Light mode*/
.khx-skip-btn, .khx-seen-btn {
  linear-gradient(#aaa 0%,#b8b8b8 100%, #5a5a5a 100%) !important
  inset 0 -0.1px 0 0px rgb(0, 0, 0), inset 0 -5.5px 0.5px rgba(0, 0, 0, 0.025), inset 0 -3px 0px rgba(0, 0, 0, 0.03), inset 0 5.5px 0.5px rgba(255, 255, 255, 0.06), inset 0 3px 0px rgba(255, 255, 255, 0.07) !important;
  background-blend-mode: soft-light !important;
  background-image: linear-gradient(#eee 0%,#bbb 95%, #b8b8b8 100%) !important;
}
/*Dark mode*/
body.khx-dark-mode .khx-skip-btn, body.khx-dark-mode .khx-seen-btn {
  box-shadow: inset 0 -0.5px 0px rgba(0, 0, 0, 0.9), inset 0 -5.5px 0.5px rgba(0, 0, 0, 0.025), inset 0 -3px 0px rgba(0, 0, 0, 0.03), inset 0 5.5px 0.5px rgba(255, 255, 255, 0.06), inset 0 3px 0px rgba(255, 255, 255, 0.07) !important;
  background-blend-mode: multiply !important;
  background-image: linear-gradient(#eee 0%,#bbb 95%, #111 100%) !important;
}`)

  let container = document.createElement('div')
  container.style.display = 'inline-block'
  skipBtn = document.createElement('a')
  skipBtn.className = 'khx-skip-btn'
  skipBtn.addEventListener('click', doSkipBtn)
  seenBtn = document.createElement('a')
  seenBtn.className = 'khx-seen-btn'
  seenBtn.addEventListener('click', doSeenBtn)
  container.append(skipBtn, seenBtn)

  seen    = seenList   .load().hasId(workId)
  skipped = skippedList.load().hasId(workId)
  updateSkipSeenBtn(true)

  const nav = document.querySelector('.work.navigation.actions');
  const anchor =
    nav?.querySelector('.comments') ??
    nav?.querySelector('.style') ??
    nav?.querySelector('.share') ??
    nav?.querySelector('.download');
  if (anchor) anchor.insertAdjacentElement('afterend', container);
  else        nav.prepend(container);
}

let workTitleLink
function greenTitle() { if (CONFIG.colorTitle) workTitleLink.classList.add('khx-title-green') }
function redTitle()   { if (CONFIG.colorTitle) workTitleLink.classList.remove('khx-title-green') }
function skippedTitle(s) { if (CONFIG.colorTitle) {
    if (s) workTitleLink.classList.add('khx-title-skipped')
    else   workTitleLink.classList.remove('khx-title-skipped')
  }
}

function updateSkipSeenBtn(firstUpdate=false) {
  if (skipped) {
    skipBtn.textContent = 'skipped'
    skipBtn.classList.add('khx-skipped');
  } else {
    skipBtn.textContent = ''
    skipBtn.classList.remove('khx-skipped');
  }
  skippedTitle(skipped)

  seenBtn.classList.remove('khx-green', 'khx-darkgreen', 'khx-red')

  let newSeen = false;
  if (firstUpdate) {
    const isReload = performance.getEntriesByType("navigation")[0]?.type === 'reload'
    if (!seen && CONFIG.autoseen && !isReload && (document.referrer.includes('archiveofourown.org') || CONFIG.seeExternalLinks)) {
      seen = seenList.toggleAndSave(workId)
      newSeen = true
    } else if (seen) {
      let savedId = localStorage.getItem('khx_newid') || 0
      localStorage.setItem('khx_newid', 0)
      newSeen = (savedId === workId)
    }
  }

  if (seen) {
    if (newSeen)           { seenBtn.classList.add('khx-green');     seenBtn.innerHTML = 'Seen<em style="font-size: 0.85em;"> new</em>' }
    else if (!firstUpdate) { seenBtn.classList.add('khx-green');     seenBtn.innerHTML = 'Seen' }
    else                   { seenBtn.classList.add('khx-darkgreen'); seenBtn.innerHTML = 'Seen<em style="font-size: 0.85em;"> old</em>' }
    greenTitle()
  }
  else {
    seenBtn.classList.add('khx-red'); seenBtn.innerHTML = 'Unseen'
    redTitle()
  }
}

function doSkipBtn() {
  skipped = skippedList.toggleAndSave(workId)
  updateSkipSeenBtn()
}
function doSeenBtn() {
  seen = seenList.toggleAndSave(workId)
  updateSkipSeenBtn()
}

//---------------------------------------------------------------------------
//  Forum
//---------------------------------------------------------------------------
let last = 0;
function refreshSeenSkipped(forced = false) {
  // Debounce focus+visibility calls
  let now = Date.now();
  if (!forced && now - last < 500) return;
  last = now;

  if (isWork) {
    seen    = seenList   .load().hasId(workId)
    skipped = skippedList.load().hasId(workId)
    updateSkipSeenBtn()
  } else {
    seenList.load()
    skippedList.load()

    for (let article of document.getElementsByClassName('blurb')) { if (article.className.indexOf('work-') !== -1) {
      let titleLink = article.querySelector('h4.heading > a')
      if (titleLink) {
        let id = getWorkId(titleLink.getAttribute('href'))
        if (id) {
          let see = seenList.hasId(id)
          if (see  !== article.classList.contains('marked-seen'))  { blink(article); markSeen(article, see) }
          let skip = skippedList.hasId(id)
          if (skip !== article.classList.contains('skipped-work')) { blink(article); markSkipped(article, skip) }
        }
      }
    }}
  }
}

function doForum() {
  if (CONFIG.KHXonly) {
    GM_addStyle(`
/* Make space on the left of collapsed works for the vertical gray "seen" bar */
.khx-collapsed {padding-left:37px!important;}
.marked-seen {background-image:linear-gradient(#ddd 0,#ddd 100%)!important;background-repeat:repeat-y!important;background-position:left!important;background-size:25px 100%!important;}

/* The tag-square has just been shifted to the right, pushing the title right too.
   Make the square smaller in order to align the title vertically with non-collapsed works.  */
.khx-collapsed .required-tags {transform:scale(0.44)!important;top:-3px!important;left:0!important;margin:0;padding:0;transform-origin:0 0;}
/* Remove the vertical gap below the header.  */
.khx-collapsed .header {min-height:10px!important;}
/* The title/heading is still right-shifted as if there was still a big tag-square. Shifted it left.  */
.marked-seen .heading, .skipped-work .heading                             {margin-left:65px!important;}
.marked-seen.khx-collapsed .heading, .skipped-work.khx-collapsed .heading {margin-left:calc(65px - 26.5px)!important;}

/* Hide this content when collapsed. */
.khx-collapsed > .tags,
.khx-collapsed > .landmark,
.khx-collapsed > .series,
.khx-collapsed > .status,          /* Hide "Private Bookmark" icon. */
.khx-collapsed > .userstuff,
.skipped-work.khx-collapsed > .own /* Hide bookmark fields of skipped works. */
/* .skipped-work.khx-collapsed > .stats */
{
  display:none!important;
}

/* Move bookmark to the left, with date under it */
.user.module.group>h5 { margin: 0 !important }
.user.module.group>.datetime { position: static !important; float: left !important; }

/* Seen/Skipped toggles have gray text, and white when clicked. */
.khx-toggle-seen,.khx-toggle-skipped {opacity:0.5!important;border:none!important;display:block!important;line-height:18px!important;text-decoration:none!important;}
.khx-toggle-dark                     {opacity:1.0!important;}
/* Skipped works are 60% opaque. */
.skipped-work>*:not(.khx-toggle)     {opacity:0.6!important;}
/* Also apply opacity to the vertical "seen" bar. */
.skipped-work.marked-seen {background-image:linear-gradient(#dddddd44 0,#dddddd44 100%)!important;}

/* Hovering collapsible works shows a (+) or (-) magnifying glass. */
.skipped-work:hover,.marked-seen:hover {cursor:zoom-out;}
.khx-collapsed:hover                   {cursor:zoom-in;}

/* Mobile-friendly Seen/Skipped placeholder text atop uncollapsed works.
   - it replaces the left "seen" bar and un-margins, maximizing reading width on mobile.
   - it adds a Seen/Skipped bar at the top, convenient space to click for collapsing.
*/
/* Add text only when uncollapsed
   TODO: Add placeholders even when collapsed. */
.skipped-work:not(.khx-collapsed)::before             {content:"Skipped"; font-size:14px!important;}
.marked-seen:not(.khx-collapsed)::before              {content:"Seen"; font-size:14px!important;}
.skipped-work.marked-seen:not(.khx-collapsed)::before {content:"Skipped / Seen";font-size:14px!important;}
/* Make top bar easier to click / taller on mobile.*/
@media (max-width:650px){
  .skipped-work:not(.khx-collapsed)::before,.marked-seen:not(.khx-collapsed)::before{line-height:30px!important;}
  .skipped-work:not(.khx-collapsed),.marked-seen:not(.khx-collapsed){background:linear-gradient(#dddddd55 0,#dddddd55 100%) top 11px left/100% 17px repeat-x!important;}
}
/* Gray strikethrough and right-shift if open .*/
.skipped-work:not(.khx-collapsed),.marked-seen:not(.khx-collapsed) {background:linear-gradient(#dddddd55 0,#dddddd55 100%) top 6px left/100% 17px repeat-x!important;}
.skipped-work:not(.khx-collapsed)::before,.marked-seen:not(.khx-collapsed)::before {padding-left:26.5px!important;}
`)

    let BORDER
    let toggle
    let first = true;
    for (let article of document.getElementsByClassName('blurb')) { if (article.className.indexOf('work-') !== -1) {
      if (first) {
        first = false

        BORDER = window.getComputedStyle(article).border;

        toggle = document.createElement('div');
        toggle.className = 'khx-toggle';
        toggle.style.cssText = 'position:absolute;top:-19px;right:0;font-size:12px;display:flex;';

        // "Skipped"
        const skipSpan = document.createElement('span');
        skipSpan.style.border = BORDER;
        skipSpan.style.borderBottom = 'none';
        skipSpan.style.borderRight = 'none';
        const skipLink = document.createElement('span');
        skipLink.className = 'khx-toggle-skipped';
        skipLink.textContent = 'skipped';
        skipLink.style.padding = '0 6px';
        skipLink.addEventListener('click', e => e.preventDefault());
        skipSpan.appendChild(skipLink);

        // "Seen"
        const seenSpan = document.createElement('span');
        seenSpan.style.border = BORDER;
        seenSpan.style.borderBottom = 'none';
        const seenLink = document.createElement('span');
        seenLink.className = 'khx-toggle-seen';
        seenLink.textContent = 'seen';
        seenLink.style.padding = '0 16px';
        seenLink.addEventListener('click', e => e.preventDefault());
        seenSpan.appendChild(seenLink);

        toggle.append(skipSpan, seenSpan);
      }
      article.style.position = 'relative';
      article.style.marginTop = '25px';
      article.prepend(toggle.cloneNode(true));
    }}
  }

  // Blink CSS
  GM_addStyle(`
@keyframes flash-glow { 0% { box-shadow: 0 0 4px currentColor; } 100% { box-shadow: 0 0 4px transparent; } }
@keyframes slide-left { 0% { transform: translateX(6px); } 100% { transform: translateX(0); } }
/* Slide down when opening */ li:not(.marked-seen).blink div.header.module { transition: all 0.3s ease-out; }
/* Blink border */ li.blink { animation: flash-glow 0.3s ease-in 1; }
`);
  attachSeenSkippedClick()
  attachBgToggleTitleClick()
}

let blinkTimeout;
function blink(article) {
  clearTimeout(blinkTimeout);
  article.classList.remove('blink');

  void article.offsetWidth; // reflow

  article.classList.add('blink');
  blinkTimeout = setTimeout(() => {
    article.classList.remove('blink');
  }, 300);
}

function attachSeenSkippedClick() {
  if (CONFIG.KHXonly) return;
  // KH calls event.stopPropagation() so document.addEventListener('click') wouldn't work
  function attachListeners() {
    // 100ms delay after load to ensure .kh-toggle elements are created
    setTimeout(() => {
      document.querySelectorAll('.kh-toggle').forEach(el => {
        if (!el.__khxAttached) {
          el.addEventListener('click', onToggleClick, true);
          el.__khxAttached = true;
        }
      });
    }, 100);
  }
  // 'load' delay to let the .kh-toggle be created
  if (document.readyState === 'loading') {
    document.addEventListener('load', attachListeners);
  } else {
    attachListeners();
  }
}

function onToggleClick(e) {
  const article = e?.target?.closest('li[role="article"]');
  const titleLink = e?.target?.closest('h4.heading > a');
  let id = getWorkId(titleLink.getAttribute('href'))

  if (e.target.textContent === 'skipped') {
    blink(article);
    markSkipped(article, skippedList.toggleAndSave(id))
  }
  else if (e.target.textContent === 'seen') {
    blink(article);
    markSeen(article, seenList.toggleAndSave(id))
  }
  e.stopPropagation()
}

function attachBgToggleTitleClick() {
  document.addEventListener('click', function(e) {
    const article = e?.target?.closest('li[role="article"]');
    const titleLink = e?.target?.closest('h4.heading > a');

    if (article && titleLink) {
      if (CONFIG.autoseen && !article.classList.contains('marked-seen')) {
        let id = getWorkId(titleLink.getAttribute('href'))
        seen = seenList.toggleAndSave(id)
        localStorage.setItem('khx_newid', id)
        markSeen(article, true)
      }
      blink(article);
    }
    else if (article)
    {
      if (CONFIG.KHXonly) {
        let id = getWorkId(article.querySelector('h4.heading > a').getAttribute('href'))
        if (e.target.closest('.khx-toggle-skipped')) {
          blink(article);
          markSkipped(article, skippedList.toggleAndSave(id))
        }
        if (e.target.closest('.khx-toggle-seen')) {
          blink(article);
          markSeen(article, seenList.toggleAndSave(id))
        }
      }

      if (e.target.closest('a, p, span')) return; // Uncollapse when clicking the bg
      if (article.classList.contains('marked-seen') || article.classList.contains('skipped-work')) article.classList.toggle('khx-collapsed')
    }
  });
}

function markSeen(article, s) {
  if (!s) {
    if (CONFIG.KHXonly) article.querySelector('.khx-toggle-seen').classList.remove('khx-toggle-dark')
    article.classList.remove('marked-seen')
    if (!article.classList.contains('skipped-work')) article.classList.remove('khx-collapsed')
  } else {
    if (CONFIG.KHXonly) article.querySelector('.khx-toggle-seen').classList.add('khx-toggle-dark')
    article.classList.add('marked-seen')
    article.classList.add('khx-collapsed')
  }
}

function markSkipped(article, s) {
  if (!s) {
    if (CONFIG.KHXonly) article.querySelector('.khx-toggle-skipped').classList.remove('khx-toggle-dark')
    article.classList.remove('skipped-work')
    if (!article.classList.contains('marked-seen')) article.classList.remove('khx-collapsed')
  } else {
    if (CONFIG.KHXonly) article.querySelector('.khx-toggle-skipped').classList.add('khx-toggle-dark')
    article.classList.add('skipped-work')
    article.classList.add('khx-collapsed')
  }
}

// -----------------------------------------------------------------------
//  Light / Dark Skin Toggle
// -----------------------------------------------------------------------

let SITE_SKINS

async function toggleLightDark(e) {
  e.target.disabled = true;
  e.target.style.filter = 'brightness(30%)';

  // Get the username
  const greetingEl = document.querySelector('#greeting a');
  if (!greetingEl) {
    alert('[ExtendAO3KH][ERROR][light/dark toggle] username not found in top right corner "Hi, $user!"');
    return;
  }
  const user = greetingEl.href.split('/').pop();

  // ---------- GET preferences

  let html = await fetch(`https://archiveofourown.org/users/${user}/preferences`, {
    credentials: 'include'
  }).then(response => {
    if (response.ok) return response.text();
    alert('[ExtendAO3KH][ERROR][light/dark toggle] preferences !ok Error: ' + response.status);
    return null;
  }).catch(err => {
    alert('[ExtendAO3KH][ERROR][light/dark toggle] preferences Network Error: ' + err.message);
    return null;
  });
  if (!html) return;

  // ---------- Find nextSkinId

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const form = doc.querySelector('.edit_preference');
  if (!form) { alert(`[ExtendAO3KH][ERROR][light/dark] form not found`); throw new Error("form not found"); }

  const form_url = form.getAttribute('action');
  if (!form_url) { alert(`[ExtendAO3KH][ERROR][light/dark] form_url not found`); throw new Error("form_url not found"); }
  // const form_url2 = 'https://archiveofourown.org' + form_url;

  const skin_list = form.querySelector('#preference_skin_id');
  if (!skin_list) { alert(`[ExtendAO3KH][ERROR][light/dark] skin_list not found`); throw new Error("skin_list not found"); }

  const options = Array.from(skin_list.options);
  // options.forEach(opt => { console.log(`Skin: ${opt.text}, Value: ${opt.value}, Selected: ${opt.selected}`); });
  const currentSkinName = options.find(opt => opt.selected)?.text.toLowerCase() || null;

  const Site_Skins = SITE_SKINS.map(skin => skin.toLowerCase());

  let nextSkinName;
  if (!currentSkinName) {
    nextSkinName = Site_Skins[0];
    alert(`[ExtendAO3KH][INFO][light/dark] no skin selected, applying first skin "${nextSkinName}"`)
  } else {
    const currentIndex = Site_Skins.indexOf(currentSkinName);
    if (currentIndex === -1) {
      nextSkinName = Site_Skins[0];
      alert(`[ExtendAO3KH][INFO][light/dark] "${currentSkinName}" is not part of the cycle, applying first skin "${nextSkinName}"`)
    } else {
      nextSkinName = Site_Skins[(currentIndex + 1) % Site_Skins.length];
    }
  }

  const nextSkinOption = options.find(opt => opt.text.toLowerCase() === nextSkinName);
  if (!nextSkinOption) {
    alert(`[ExtendAO3KH][ERROR][light/dark] next skin "${nextSkinName}" has an invalid name, it does not exist in the preferences list`);
    return;
  }
  const nextSkinId = nextSkinOption.value;

  // ---------- POST form

  // Note: the form's token doesn't work, this one does.
  const authenticity_token2 = document.querySelector('meta[name="csrf-token"]')?.content;
  if (!authenticity_token2) { alert(`[ExtendAO3KH][ERROR][light/dark] authenticity_token2 not found.`); throw new Error("Authenticity token 2 not found."); }

  // Emulate the form data at https://archiveofourown.org/users/$user/skins
  const formData = new URLSearchParams();
  formData.append('_method', 'put');
  formData.append('authenticity_token', authenticity_token2);
  formData.append('preference[skin_id]', nextSkinId);
  formData.append('commit', 'Use'); // skin 'Use' VS pref 'Update'?

  let reload = false;
  await fetch(form_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
    credentials: 'include',
    redirect: 'manual'
  }).then(response => {
    // For some reason does a redirect !ok, so we kill the redirect and treat it as ok.
    if (response.type === 'opaqueredirect' || response.ok) {
      reload = true;
      return;
    }
    else alert('[ExtendAO3KH][ERROR][light/dark toggle] skins !ok Error: ' + response.status);
  }).catch(err => {
    alert('[ExtendAO3KH][ERROR][light/dark toggle] skins Network Error: ' + err.message);
  });

  e.target.disabled = false;
  e.target.style.filter = '';
  if (reload) window.location.reload();
}

// -----------------------------------------------------------------------
// Export / Import
// -----------------------------------------------------------------------

const strip = /^\[?,?|,?\]?$/g;

function exportToJson() {
  const cleanupChecked = JSON.parse(localStorage.getItem('kudoshistory_settings') || '{}').background_check !== 'yes';
  const maybeChecked = cleanupChecked ? [] : ['checked'];

  const export_lists = {
    username:   localStorage.getItem('kudoshistory_username'),
    settings:   localStorage.getItem('kudoshistory_settings'),
    kudosed:    localStorage.getItem('kudoshistory_kudosed')    || ',',
    bookmarked: localStorage.getItem('kudoshistory_bookmarked') || ',',
    skipped:    localStorage.getItem('kudoshistory_skipped')    || ',',
    seen:       localStorage.getItem('kudoshistory_seen')       || ',',
    checked:    localStorage.getItem('kudoshistory_checked') || ','
  };
  if (cleanupChecked) delete export_lists.checked;

  const pad = (num) => String(num).padStart(2, '0');
  const now = new Date();
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const totalSeconds = now.getMinutes() * 60 + now.getSeconds();
  const minSecCode = `${String(now.getMinutes()).padStart(2,'0')}${Math.floor(now.getSeconds()  / 6)}`
  const user = export_lists.username||'none';

  var size = ['seen', 'skipped', 'bookmarked', 'kudosed',...maybeChecked]
             .map(key => (String(export_lists[key]) || '').replace(strip, '').split(',').length - 1);

  var textToSave = JSON.stringify(export_lists, null, 2);
  var blob = new Blob([textToSave], {
      type: "text/plain"
  });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `AO3_history_${year}.${month}.${day}.${minSecCode} ${user}+${size}${cleanupChecked?',X':''}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importFromJson(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = ({ target }) => {
    try {
      const imported  = JSON.parse(target.result);
      const settings  = JSON.parse(localStorage.getItem('kudoshistory_settings') || '{}');
      const cleanupChecked = settings.background_check !== 'yes';

      const csvLen   = csv => csv.replace(strip, '').split(',').filter(Boolean).length;
      const deltaStr = (o, n) => { const d = n - o; return '(' + (d > 0 ? '+' : '') + d + ')'; };
      const notes = [];
      [
        ['seen',       'kudoshistory_seen'      ],
        ['skipped',    'kudoshistory_skipped'   ],
        ['bookmarked', 'kudoshistory_bookmarked'],
        ['kudosed',    'kudoshistory_kudosed'   ],
        ['checked',    'kudoshistory_checked'   ]
      ].forEach(([name, key]) => {
        const oldVal = String(localStorage.getItem(key) || ',');
        let   newVal = imported[name] !== undefined ? imported[name] : oldVal;
        if (name === 'checked' && cleanupChecked) newVal = ',';
        if (newVal !== oldVal) localStorage.setItem(key, newVal);
        const oldCnt = csvLen(oldVal);
        const newCnt = csvLen(newVal);
        if (name === 'checked' && cleanupChecked) {
          notes.push(`- checked: ${oldCnt} entries cleaned`);
        } else {
          notes.push(`- ${name}: ${newCnt} ${deltaStr(oldCnt, newCnt)}${oldCnt === newCnt ? '' : ' <---- change'}`);
        }
      });
      // username
      if (imported.username && imported.username !== localStorage.getItem('kudoshistory_username')) {
        localStorage.setItem('kudoshistory_username', imported.username);
        notes.push(`- username: set to "${imported.username}"`);
      } else {
        notes.push('- username: no change');
      }
      // settings
      if (imported.settings && imported.settings !== localStorage.getItem('kudoshistory_settings')) {
        const oldObj = JSON.parse(localStorage.getItem('kudoshistory_settings') || '{}');
        const newObj = JSON.parse(imported.settings);
        const added   = {};
        const removed = {};
        Object.keys(newObj).forEach(k => { if (!(k in oldObj) || oldObj[k] !== newObj[k]) added[k] = newObj[k]; });
        Object.keys(oldObj).forEach(k => { if (!(k in newObj)) removed[k] = oldObj[k]; });

        localStorage.setItem('kudoshistory_settings', imported.settings);
        const lines = ['- settings:'];
        if (Object.keys(added).length)   lines.push('    _added   ' + JSON.stringify(added));
        if (Object.keys(removed).length) lines.push('    _removed ' + JSON.stringify(removed));
        notes.push(...lines);
      } else {
        notes.push('- settings: no change');
      }

      alert('[ExtendAO3KH] Success\n' + notes.join('\n'));
    } catch {
      alert('[ExtendAO3KH] Error\nInvalid file format or missing data.');
    }
  };

  reader.readAsText(file);
}

//---------------------------------------------------------------------------
//  Main
//---------------------------------------------------------------------------

let CONFIG
function loadConfig() {
  let DEFAULT = {
    colorTitle: true,
    autoseen: true,
    seeExternalLinks: false,
    siteSkins: 'Default, Reversi',
    KHXonly: false,
  }
  let saved = JSON.parse(localStorage.getItem('khx_config')) || DEFAULT
  const config = { ...DEFAULT, ...saved } // merge new keys

  // Disable Mark as seen always (override)
  let settings = JSON.parse(localStorage.getItem('kudoshistory_settings')) || {};
  if (settings.autoseen === 'yes') {
    settings.autoseen = 'no'
    localStorage.setItem('kudoshistory_settings', JSON.stringify(settings));
  }
  return config
}
function saveConfig() { localStorage.setItem('khx_config', JSON.stringify(CONFIG)); }
function skinArrayFromStr(str) { return str.split(',').map(s => s.trim()).filter(Boolean); }

function showConfigPanel() {
  // Close if already open
  const existing = document.getElementById('config-panel');
  if (existing) { existing.remove(); return; }

  const gear = document.getElementById('gear-btn');

  const panel = document.createElement('div');
  panel.id = 'config-panel';
  panel.innerHTML = `
    <label style="display:flex; align-items:center; gap:4px; white-space:nowrap;"><input type="checkbox" id="toggle-khxonly" ${CONFIG.KHXonly ? 'checked' : ''} ><span title="Fully replace Kudos History.">KHX only</span></label>
    <hr style="margin: 0; border: none; border-top: 1px solid currentColor;">
    <label style="display:flex; align-items:center; gap:4px; white-space:nowrap;"><input type="checkbox" id="toggle-autoseen" ${CONFIG.autoseen ? 'checked' : ''}>Mark as seen on open</label>
    <label style="display:flex; align-items:center; gap:4px; white-space:nowrap;"><input type="checkbox" id="toggle-external" ${CONFIG.seeExternalLinks ? 'checked' : ''}>From external links</label>
    <label>Skins: <input type="text" id="site-skins-input" value="${CONFIG.siteSkins || ''}" style="min-width:160px; width:160px;"  autocapitalize="off"></label>
    <label style="display:flex; align-items:center; gap:4px; white-space:nowrap;"><input type="checkbox" id="toggle-titlecol" ${CONFIG.colorTitle ? 'checked' : ''}>Color title</label>
    `;

  panel.querySelector('#toggle-titlecol').onchange = (e) => { CONFIG.colorTitle       = e.target.checked; saveConfig() }
  panel.querySelector('#toggle-autoseen').onchange = (e) => { CONFIG.autoseen         = e.target.checked; saveConfig() }
  panel.querySelector('#toggle-external').onchange = (e) => { CONFIG.seeExternalLinks = e.target.checked; saveConfig() };
  panel.querySelector('#toggle-khxonly').onchange  = (e) => { CONFIG.KHXonly          = e.target.checked; saveConfig() };
  panel.querySelector('#site-skins-input').onblur = () => {
    CONFIG.siteSkins = panel.querySelector('#site-skins-input').value.trim();
    SITE_SKINS = skinArrayFromStr(CONFIG.siteSkins);
    saveConfig();
  };

  panel.style.cssText = `
    position:fixed; background:#222; color:white; padding:8px;
    display:flex; flex-direction:column; gap:6px; z-index:9999; border-radius:6px;
    border:1px solid #555; min-width:180px;
  `;

  document.body.appendChild(panel);

  function updatePosition() {
    const rect = gear.getBoundingClientRect();
    panel.style.left = rect.left + 'px';
    panel.style.top = (rect.top - panel.offsetHeight - 5) + 'px';
  }

  updatePosition();

  // Update position on scroll
  const scrollHandler = () => updatePosition();
  window.addEventListener('scroll', scrollHandler);

  // Close when clicking outside
  document.addEventListener('click', function closePanel(e) {
    if (!panel.contains(e.target) && e.target !== gear) {
      panel.remove();
      window.removeEventListener('scroll', scrollHandler);
      document.removeEventListener('click', closePanel);
    }
  });
}

function doFooterAndCSS() {
  const footer = document.createElement('div');
  Object.assign(footer.style, {
    width:'100%', padding:'5px 0',
    display:'flex', justifyContent:'center', gap:'10px', alignItems:'center'
  });

  // ⚙ settings
  footer.appendChild(Object.assign(document.createElement('button'), {
    id: 'gear-btn', textContent:'⚙', title:'Settings', onclick: (e) => { e.stopPropagation(); showConfigPanel(); }
  }));

  // Light/Dark toggle
  footer.appendChild(Object.assign(document.createElement('button'), {
    textContent:'Light/Dark',
    onclick: (e) => {
      SITE_SKINS = skinArrayFromStr(CONFIG.siteSkins)
      toggleLightDark(e)
    }
  }));

  // Export / Import (unchanged)
  footer.appendChild(Object.assign(document.createElement('button'), { textContent:'Export', onclick:exportToJson }));
  footer.appendChild(Object.assign(document.createElement('button'), {
    textContent:'Import',
    onclick: () => {
      const fi = Object.assign(document.createElement('input'), { type:'file', accept:'.txt,.json', style:'display:none' });
      fi.addEventListener('change', importFromJson);
      footer.appendChild(fi); fi.click();
    }
  }));

  document.getElementById('footer').before(footer);
}

// --------------- Main

let isWork
addEventListener("DOMContentLoaded", (event) => {
  CONFIG = loadConfig()

  isWork = Boolean(document.getElementById('workskin'))
  doFooterAndCSS()
  if (isWork) doWork()
  else {
    doForum()
    refreshSeenSkipped(true)
  }

  // Apply styles when navigating back
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) refreshSeenSkipped(true);
  });

  // Apply styles on tab change.
  document.addEventListener('focus', () => {
    refreshSeenSkipped();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshSeenSkipped();
  });
})

